package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/tarunsunny3/go-url-shortener/controllers"
	"github.com/tarunsunny3/go-url-shortener/middleware"
)

type ClickAnalyticsRouteController struct {
	clickAnalyticsController controllers.ClickAnalyticsController
}

func NewAnalyticsRouteController(clickAnalyticsController controllers.ClickAnalyticsController) ClickAnalyticsRouteController {
	return ClickAnalyticsRouteController{clickAnalyticsController}
}

func (carc *ClickAnalyticsRouteController) ClickAnalyticsRoute(rg *gin.RouterGroup) {

	router := rg.Group("/analytics")

	router.GET("/urls/:urlid", middleware.DeserializeUser(), func(c *gin.Context) {
		carc.clickAnalyticsController.GetAnalyticsForURL(c)
	})

}
