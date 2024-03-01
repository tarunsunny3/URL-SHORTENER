package store

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// Define the struct wrapper around raw Redis client
type StorageService struct {
	redisClient *redis.Client
}

// Top level declarations for the storeService and Redis context
var (
	storeService = &StorageService{}
	ctx          = context.Background()
)

// Note that in a real world usage, the cache duration shouldn't have
// an expiration time, an LRU policy config should be set where the
// values that are retrieved less often are purged automatically from
// the cache and stored back in RDBMS whenever the cache is full

const CacheDuration = 6 * time.Hour

// Initializing the store service and return a store pointer
func InitializeStore() *StorageService {
	redisClient := redis.NewClient(&redis.Options{
		Addr:     "redis-14633.c267.us-east-1-4.ec2.cloud.redislabs.com:14633",
		Password: "GOBbEkgFJZOgSUYhvjWBBVG48qJ6yQi9",
		DB:       0,
	})

	pong, err := redisClient.Ping(ctx).Result()
	if err != nil {
		panic(fmt.Sprintf("Error init Redis: %v", err))
	}

	fmt.Printf("\nRedis started successfully: pong message = {%s}", pong)
	storeService.redisClient = redisClient
	return storeService
}

/* We want to be able to save the mapping between the originalUrl
and the generated shortUrl url
*/

func SaveUrlMapping(shortUrl string, originalUrl string, userId string) {
	if storeService.redisClient == nil {
		panic("Redis client is nil")
	}
	err := storeService.redisClient.Set(ctx, shortUrl, originalUrl, CacheDuration).Err()
	if err != nil {
		panic(fmt.Sprintf("Failed saving key url | Error: %v - shortUrl: %s - originalUrl: %s\n", err, shortUrl, originalUrl))
	}

	fmt.Print("SaveURL MAPPING is done")
}

/*
We should be able to retrieve the initial long URL once the short
is provided. This is when users will be calling the shortlink in the
url, so what we need to do here is to retrieve the long url and
think about redirect.
*/

func RetrieveInitialUrl(shortUrl string) (string, error) {

	result, err := storeService.redisClient.Get(ctx, shortUrl).Result()
	if err != nil {
		// Check if the error is due to key not existing
		if err == redis.Nil {
			return "", nil // Key doesn't exist, return nil value and no error
		}

		// Handle other errors
		return "", fmt.Errorf("failed RetrieveInitialUrl url | Error: %v - shortUrl: %s", err, shortUrl)
	}
	return result, nil // Return the value and no error

}
