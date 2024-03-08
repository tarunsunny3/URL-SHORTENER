package initializers

import (
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	PostgreSQLConnString string `mapstructure:"POSTGRES_CONNECTION_STRING"`
	RedisConnAddr        string `mapstructure:"REDIS_CONNECTION_ADDR"`
	RedisConnPassword    string `mapstructure:"REDIS_CONNECTION_PASSWORD"`
	ClientOrigin         string `mapstructure:"CLIENT_ORIGIN"`

	TokenSecret    string        `mapstructure:"TOKEN_SECRET"`
	TokenExpiresIn time.Duration `mapstructure:"TOKEN_EXPIRED_IN"`
	TokenMaxAge    int           `mapstructure:"TOKEN_MAXAGE"`
}

func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigType("env")
	viper.SetConfigName("app.env")

	viper.AutomaticEnv()
	viper.SetEnvPrefix("HEROKU")

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return
}
