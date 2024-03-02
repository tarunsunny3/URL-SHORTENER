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
)

func init() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("? Could not load environment variables", err)
	}

	initializers.ConnectDB(&config)

	// initializers.DB.AutoMigrate(&models.User{}, &models.URL{}, &models.ClickAnalytics{})

	// log.Println("Database Migration Done!!!")
	AuthController = controllers.NewAuthController(initializers.DB)
	AuthRouteController = routes.NewAuthRouteController(AuthController)

	UrlController = controllers.NewUrlController(initializers.DB)
	UrlRouteController = routes.NewRouteUserController(UrlController)

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

	port := myconfig.GetPort()
	fmt.Printf("Running on port %v\n", port)
	err := server.Run("0.0.0.0:" + port)
	if err != nil {
		panic(fmt.Sprintf("Failed to start the web server - Error: %v", err))
	}
}
