package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"myproject/auth"
	"myproject/database"
	"myproject/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
	"github.com/ulule/limiter/v3/drivers/store/memory"
	"go.uber.org/zap"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Токен не найден в куках"})
			return
		}
		log.Println("Received token:", tokenString[:10]+"...")
		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Недействительный токен"})
			return
		}

		var user database.User
		if err := database.DB.Where("username = ?", claims.Username).First(&user).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не найден"})
			return
		}

		c.Set("username", claims.Username)
		c.Set("userID", user.ID)
		c.Next()
	}
}

func main() {
	logger, err := zap.NewProduction()
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer logger.Sync()

	if err := godotenv.Load(); err != nil {
		logger.Info("Warning: .env file not found")
	}

	if os.Getenv("JWT_SECRET") == "" {
		logger.Fatal("JWT_SECRET environment variable is required")
	}

	database.Connect()
	database.AutoMigrate()

	router := gin.Default()

	gin.DisableConsoleColor()
	gin.DefaultWriter = zap.NewStdLog(logger).Writer()

	router.Use(func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery
		log.Printf("Request: %s %s, Origin: %s, Cookie: %s",
			c.Request.Method, c.Request.URL, c.Request.Header.Get("Origin"), c.Request.Header.Get("Cookie"))

		c.Next()

		logger.Info("Request",
			zap.Int("status", c.Writer.Status()),
			zap.String("method", c.Request.Method),
			zap.String("path", path),
			zap.String("query", query),
			zap.String("ip", c.ClientIP()),
			zap.String("user-agent", c.Request.UserAgent()),
			zap.Duration("latency", time.Since(start)),
		)
	})

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
			"https://test-iki.vercel.app",
			"https://*.vercel.app",
			"https://testiki-33ur.onrender.com",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "Cookie"},
		ExposeHeaders:    []string{"Content-Length", "Set-Cookie"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	rate, err := limiter.NewRateFromFormatted("10-M")
	if err != nil {
		log.Fatalf("Failed to parse rate: %v", err)
	}
	store := memory.NewStore()
	limiterInstance := limiter.New(store, rate)
	limiterMiddleware := mgin.NewMiddleware(limiterInstance, mgin.WithErrorHandler(func(c *gin.Context, err error) {
		logger.Info("Rate limit exceeded",
			zap.String("ip", c.ClientIP()),
			zap.String("path", c.Request.URL.Path),
		)
		c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
			"error": "Превышено количество запросов в минуту. Подождите минуту и попробуйте снова.",
		})
	}))

	// Публичные маршруты
	router.POST("/register", handlers.Register)
	router.POST("/login", limiterMiddleware, handlers.Login)
	router.POST("/logout", handlers.Logout)
	router.POST("/auth/forgot-password", handlers.ForgotPassword)
	router.POST("/auth/reset-password", handlers.ResetPassword)
	router.POST("/auth/verify-email", handlers.VerifyEmail)
	router.POST("/auth/resend-verification", handlers.ResendVerification)

	// Защищенные маршруты
	authGroup := router.Group("/")
	authGroup.Use(AuthMiddleware())
	{
		authGroup.GET("/me", handlers.GetCurrentUser)
		authGroup.POST("/test-result", handlers.SaveTestResult)
		authGroup.POST("/upload-avatar", handlers.UploadAvatar)
		authGroup.POST("/update-avatar", handlers.UpdateAvatar)
		authGroup.DELETE("/avatar", handlers.DeleteAvatar)
		authGroup.GET("/user/test-results", handlers.GetUserTestResults)
		authGroup.PATCH("/update-profile", handlers.UpdateProfile)

		// Защищенные маршруты тестов
		authGroup.GET("/tests/:slug", handlers.GetTest)
		authGroup.GET("/tests", handlers.GetTests)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	logger.Info("Starting server",
		zap.String("port", port),
	)

	if err := router.Run(":" + port); err != nil {
		logger.Fatal("Failed to start server",
			zap.Error(err),
		)
	}
}
