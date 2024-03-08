package main

import (
	"fmt"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/tarunsunny3/go-url-shortener/controllers"
	"github.com/tarunsunny3/go-url-shortener/initializers"
	"github.com/tarunsunny3/go-url-shortener/myconfig"
	"github.com/tarunsunny3/go-url-shortener/routes"
	"github.com/tarunsunny3/go-url-shortener/store"
)

/*added comment*/
var (
	server *gin.Engine

	AuthController      controllers.AuthController
	AuthRouteController routes.AuthRouteController

	UrlController      controllers.UrlController
	UrlRouteController routes.UrlRouteController

	UserController      controllers.UserController
	UserRouteController routes.UserRouteController

	ClickAnalyticsController      controllers.ClickAnalyticsController
	ClickAnalyticsRouteController routes.ClickAnalyticsRouteController
)

func init() {
	config, err := initializers.LoadConfig(".")
	log.Print("Config is ", config)

	if err != nil {
		log.Fatal("? Could not load environment variables", err)
	}

	// initializers.ConnectDB(&config)

	// initializers.DB.AutoMigrate(&models.User{}, &models.URL{}, &models.ClickAnalytics{})

	// log.Println("Database Migration Done!!!")
	AuthController = controllers.NewAuthController(initializers.DB)
	AuthRouteController = routes.NewAuthRouteController(AuthController)

	UrlController = controllers.NewUrlController(initializers.DB)
	UrlRouteController = routes.NewUrlRouteController(UrlController)

	UserController = controllers.NewUserController(initializers.DB)
	UserRouteController = routes.NewUserRouteController(UserController)

	ClickAnalyticsController = controllers.NewClickAnalyticsController(initializers.DB)
	ClickAnalyticsRouteController = routes.NewAnalyticsRouteController(ClickAnalyticsController)

	server = gin.Default()
}

func main() {

	store.InitializeStore()
	// router.RegisterRoutes(server)
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:8081", "https://url-shortener-gamma-lilac.vercel.app"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowCredentials = true
	corsConfig.AllowHeaders = []string{"Content-Type", "Authorization"}

	server.Use(cors.New(corsConfig))

	AuthRouteController.AuthRoute(&server.RouterGroup)
	UrlRouteController.UrlRoute(&server.RouterGroup)
	UserRouteController.UserRoute(&server.RouterGroup)
	ClickAnalyticsRouteController.ClickAnalyticsRoute(&server.RouterGroup)

	port := myconfig.GetPort()
	fmt.Printf("Running on port %v\n", port)
	err := server.Run("0.0.0.0:" + port)
	if err != nil {
		panic(fmt.Sprintf("Failed to start the web server - Error: %v", err))
	}
}
