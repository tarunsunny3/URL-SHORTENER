package initializers

import (
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
	viper.BindEnv("PostgreSQLConnString", "POSTGRES_CONNECTION_STRING")
	viper.BindEnv("RedisConnAddr", "REDIS_CONNECTION_ADDR")
	viper.BindEnv("RedisConnPassword", "REDIS_CONNECTION_PASSWORD")
	viper.BindEnv("TokenSecret", "TOKEN_SECRET")
	viper.BindEnv("TokenExpiresIn", "TOKEN_EXPIRED_IN")
	viper.BindEnv("TokenMaxAge", "TOKEN_MAXAGE")

	viper.AddConfigPath(path)
	viper.SetConfigType("env")
	viper.SetConfigName("app.env")
	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return
}
