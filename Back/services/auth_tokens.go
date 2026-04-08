package services

import (
	"crypto/rand"
	"encoding/hex"
	"time"
)

func GenerateRandomToken() (string, error) {
	bytes := make([]byte, 32) 
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func IsTokenExpired(expTime *time.Time) bool {
	if expTime == nil {
		return true
	}
	return time.Now().After(*expTime)
}

func CreateTokenExpiration() time.Time {
	return time.Now().Add(1 * time.Hour)
}

func CreateEmailVerificationExpiration() time.Time {
	return time.Now().Add(24 * time.Hour)
}
