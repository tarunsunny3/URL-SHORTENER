package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/tarunsunny3/go-url-shortener/initializers"
	"github.com/tarunsunny3/go-url-shortener/models"
	"github.com/tarunsunny3/go-url-shortener/utils"
	"gorm.io/gorm"
)

type AuthController struct {
	DB *gorm.DB
}

func NewAuthController(DB *gorm.DB) AuthController {
	return AuthController{DB}
}

// SignUp User
func (ac *AuthController) SignUpUser(ctx *gin.Context) {
	var payload *models.SignUpInput

	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	hashedPassword, err := utils.HashPassword(payload.Password)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": err.Error()})
		return
	}

	newUser := models.User{
		Name:     payload.Name,
		Email:    strings.ToLower(payload.Email),
		Password: hashedPassword,
		Role:     "user",
	}

	result := ac.DB.Create(&newUser)

	if result.Error != nil && strings.Contains(result.Error.Error(), "duplicate key value violates unique") {
		ctx.JSON(http.StatusConflict, gin.H{"status": "fail", "message": "User with that email already exists"})
		return
	} else if result.Error != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Something bad happened"})
		return
	}

	ac.DB.Save(newUser)

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "message": "Successfully Registered"})
}

//SignIn

func (ac *AuthController) SignInUser(ctx *gin.Context) {
	var payload *models.SignInInput

	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	var user models.User
	result := ac.DB.First(&user, "email = ?", strings.ToLower(payload.Email))
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid email or Password"})
		return
	}

	if err := utils.VerifyPassword(user.Password, payload.Password); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid email or Password"})
		return
	}

	var domain string
	var secure bool

	// Check the environment
	if gin.Mode() == gin.ReleaseMode {
		// Production
		domain = "yourdomain.com" // Replace with your actual production domain
		secure = true
	} else {
		// Development
		domain = "url-shortener-gamma-lilac.vercel.app"
		secure = false
	}

	config, _ := initializers.LoadConfig(".")

	// Generate Token
	token, err := utils.GenerateToken(config.TokenExpiresIn, user.ID, config.TokenSecret)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.SetCookie("token", token, config.TokenMaxAge*60, "/", domain, secure, true)

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "token": token, "user": user})
}

// SignOut User
func (ac *AuthController) LogoutUser(ctx *gin.Context) {
	var domain string
	var secure bool

	// Check the environment
	if gin.Mode() == gin.ReleaseMode {
		// Production
		domain = "yourdomain.com" // Replace with your actual production domain
		secure = true
	} else {
		// Development
		domain = "localhost"
		secure = false
	}
	ctx.SetCookie("token", "", -1, "/", domain, secure, true)
	ctx.JSON(http.StatusOK, gin.H{"status": "successfully logged out"})
}
