package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/tarunsunny3/go-url-shortener/controllers"
)

type UrlRouteController struct {
	userController controllers.UrlController
}

func NewUrlRouteController(userController controllers.UrlController) UrlRouteController {
	return UrlRouteController{userController}
}

func (uc *UrlRouteController) UrlRoute(rg *gin.RouterGroup) {

	router := rg.Group("/")
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hey Go URL Shortener!",
		})
	})

	router.POST("/short-urls", func(c *gin.Context) {
		uc.userController.CreateShortUrl(c)
	})

	router.GET("/:shortUrl", func(c *gin.Context) {
		uc.userController.HandleShortUrlRedirect(c)
	})
}
