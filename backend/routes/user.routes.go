package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/tarunsunny3/go-url-shortener/controllers"
	"github.com/tarunsunny3/go-url-shortener/middleware"
)

type UserRouteController struct {
	userController controllers.UserController
}

func NewUserRouteController(userController controllers.UserController) UserRouteController {
	return UserRouteController{userController}
}

func (uc *UserRouteController) UserRoute(rg *gin.RouterGroup) {

	router := rg.Group("/user")

	router.GET("/urls/:userid", middleware.DeserializeUser(), func(c *gin.Context) {
		uc.userController.GetURLsForCurrentUser(c)
	})

}
