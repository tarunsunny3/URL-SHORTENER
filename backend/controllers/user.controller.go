package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tarunsunny3/go-url-shortener/initializers"
	"github.com/tarunsunny3/go-url-shortener/models"
	"github.com/tarunsunny3/go-url-shortener/myconfig"
	"gorm.io/gorm"
)

type UserController struct {
	DB *gorm.DB
}

func NewUserController(DB *gorm.DB) UserController {
	return UserController{DB}
}

func (uc *UserController) GetURLsForCurrentUser(ctx *gin.Context) {
	userId := ctx.Param("userid")

	var currentUser models.User
	currentUserInterface, exists := ctx.Get("currentUser")

	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	// Type assertion to convert the interface to models.User
	var ok bool
	currentUser, ok = currentUserInterface.(models.User)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user information"})
		return
	}
	// Convert currentUser.ID to string for comparison
	currentUserIdString := fmt.Sprintf("%d", currentUser.ID)
	log.Printf("CUrrUserID = %s, userId = %s, currUser = %v\n", currentUserIdString, userId, currentUser)
	if currentUser.Role != "admin" && currentUserIdString != userId {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Permitted to view this resource"})
		return
	}
	// Assuming each URL is associated with a user ID
	// userID := currentUser.ID

	// Retrieve URLs from the database based on the user ID
	var urls []models.URL
	if err := initializers.DB.Where("user_id = ?", userId).Find(&urls).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch URLs, " + err.Error()})
		return
	}
	host := myconfig.GetHostURL()
	ctx.JSON(http.StatusOK, gin.H{"urls": urls, "hostURL": host})
}
