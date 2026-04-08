package database

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username    string `json:"username" gorm:"unique;not null"`
	Password    string `json:"-" gorm:"not null"`
	Email       string `json:"email" gorm:"unique;not null"`
	IsVerified  bool   `json:"is_verified" gorm:"default:false"`
	VerifyToken string `json:"-"`

	ResetToken    *string    `json:"-" gorm:"column:reset_token"`
	ResetTokenExp *time.Time `json:"-" gorm:"column:reset_token_exp"`

	AvatarURL     string       `json:"avatar_url" gorm:"default:'/images/default-avatar.png'"`
	LoginAttempts int          `json:"login_attempts" gorm:"default:0"`
	LockUntil     *time.Time   `json:"lock_until"`
	TestResults   []TestResult `json:"test_results" gorm:"foreignKey:UserID"`
}

type Test struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Title        string         `json:"title"`
	Description  string         `json:"description"`
	Category     string         `json:"category"`
	Questions    datatypes.JSON `json:"questions" gorm:"type:jsonb"`
	ScoringRules datatypes.JSON `json:"scoring_rules" gorm:"type:jsonb"`
	TimeLimit    int            `json:"time_limit"`
	IsActive     bool           `json:"is_active" gorm:"default:true"`
	CreatedAt    time.Time      `json:"created_at" gorm:"default:now()"`
	UpdatedAt    time.Time      `json:"updated_at" gorm:"default:now()"`
	Slug         string         `json:"slug" gorm:"unique;not null"`
}

type TestResult struct {
	gorm.Model
	UserID      uint           `json:"user_id"`
	TestID      uint           `json:"test_id"`
	TestName    string         `json:"test_name"`
	Score       int            `json:"score"`
	ResultText  string         `json:"result_text"`
	Answers     datatypes.JSON `json:"answers" gorm:"type:jsonb"`
	CompletedAt time.Time      `json:"completed_at"`
	Category    string         `json:"category"`
}

func (u *User) HashPassword() error {
	if len(u.Password) == 0 {
		return errors.New("password cannot be empty")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

func (u *User) CheckPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}
