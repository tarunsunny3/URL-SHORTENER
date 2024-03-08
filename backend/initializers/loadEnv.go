package initializers

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	PostgreSQLConnString string        `mapstructure:"POSTGRES_CONNECTION_STRING"`
	RedisConnAddr        string        `mapstructure:"REDIS_CONNECTION_ADDR"`
	RedisConnPassword    string        `mapstructure:"REDIS_CONNECTION_PASSWORD"`
	ClientOrigin         string        `mapstructure:"CLIENT_ORIGIN"`
	Example              string        `mapstructure:"EXAMPLE"`
	TokenSecret          string        `mapstructure:"TOKEN_SECRET"`
	TokenExpiresIn       time.Duration `mapstructure:"TOKEN_EXPIRED_IN"`
	TokenMaxAge          int           `mapstructure:"TOKEN_MAXAGE"`
}

func LoadConfig(path string) (config Config, err error) {

	// viper.BindEnv("PostgreSQLConnString", "POSTGRES_CONNECTION_STRING")
	// viper.BindEnv("RedisConnAddr", "REDIS_CONNECTION_ADDR")
	// viper.BindEnv("RedisConnPassword", "REDIS_CONNECTION_PASSWORD")
	// viper.BindEnv("TokenSecret", "TOKEN_SECRET")
	// viper.BindEnv("TokenExpiresIn", "TOKEN_EXPIRED_IN")
	// viper.BindEnv("TokenMaxAge", "TOKEN_MAXAGE")
	// viper.BindEnv("ClientOrigin", "CLIENT_ORIGIN")

	// Set default values (these will be overridden if environment variables are present)
	viper.SetDefault("POSTGRES_CONNECTION_STRING", "")
	viper.SetDefault("REDIS_CONNECTION_ADDR", "")
	viper.SetDefault("REDIS_CONNECTION_PASSWORD", "")
	viper.SetDefault("CLIENT_ORIGIN", "")
	viper.SetDefault("TOKEN_SECRET", "")
	viper.SetDefault("TOKEN_EXPIRED_IN", 0)
	viper.SetDefault("TOKEN_MAXAGE", 0)

	// viper.AddConfigPath(path)
	// viper.SetConfigType("env")
	// viper.SetConfigName("app.env")

	viper.AutomaticEnv()
	// err = viper.ReadInConfig()
	// if err != nil {
	// 	return
	// }
	// fmt.Println("Environment Variables:")
	// for _, key := range viper.AllKeys() {
	// 	fmt.Printf("%s: %s\n", key, viper.Get(key))
	// }

	// Unmarshal configuration into struct
	err = viper.Unmarshal(&config)
	if err != nil {
		fmt.Println("Error unmarshalling config:", err)
	}
	return
}
