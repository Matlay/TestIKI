package services

import (
	"fmt"
	"net/smtp"
	"os"
)

type EmailService struct {
	SMTPHost     string
	SMTPPort     string
	SMTPUsername string
	SMTPPassword string
	FromEmail    string
}

func NewEmailService() *EmailService {
	return &EmailService{
		SMTPHost:     os.Getenv("SMTP_HOST"),
		SMTPPort:     os.Getenv("SMTP_PORT"),
		SMTPUsername: os.Getenv("SMTP_USERNAME"),
		SMTPPassword: os.Getenv("SMTP_PASSWORD"),
		FromEmail:    os.Getenv("FROM_EMAIL"),
	}
}

func (e *EmailService) SendVerificationEmail(toEmail, token string) error {
	subject := "Подтверждение email адреса - TestIKI"
	verifyURL := fmt.Sprintf("%s/verify-email?token=%s", os.Getenv("FRONTEND_URL"), token)

	body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Подтверждение email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Подтверждение email адреса</h2>
        <p>Добро пожаловать в TestIKI!</p>
        <p>Для подтверждения вашего email адреса перейдите по ссылке ниже:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="%s" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Подтвердить email</a>
        </div>
        <p style="color: #666; font-size: 14px;">Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:</p>
        <p style="color: #666; font-size: 14px; word-break: break-all;">%s</p>
        <p style="color: #666; font-size: 14px;">Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">С уважением, команда TestIKI</p>
    </div>
</body>
</html>
    `, verifyURL, verifyURL)

	return e.sendEmail(toEmail, subject, body)
}

func (e *EmailService) SendPasswordResetEmail(toEmail, token string) error {
	subject := "Восстановление пароля - TestIKI"
	resetURL := fmt.Sprintf("%s/reset-password?token=%s", os.Getenv("FRONTEND_URL"), token)

	body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Восстановление пароля</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">Восстановление пароля</h2>
        <p>Вы запросили сброс пароля для вашего аккаунта в TestIKI.</p>
        <p>Для создания нового пароля перейдите по ссылке ниже:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="%s" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Сбросить пароль</a>
        </div>
        <p style="color: #666; font-size: 14px;">Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:</p>
        <p style="color: #666; font-size: 14px; word-break: break-all;">%s</p>
        <p style="color: #dc2626; font-size: 14px;"><strong>Ссылка действительна в течение 1 часа.</strong></p>
        <p style="color: #666; font-size: 14px;">Если вы не запрашивали сброс пароля, проигнорируйте это письмо. Ваш пароль останется без изменений.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">С уважением, команда TestIKI</p>
    </div>
</body>
</html>
    `, resetURL, resetURL)

	return e.sendEmail(toEmail, subject, body)
}

func (e *EmailService) sendEmail(to, subject, body string) error {
	if e.SMTPHost == "" || e.SMTPPort == "" || e.SMTPUsername == "" || e.SMTPPassword == "" {
		return fmt.Errorf("missing SMTP configuration")
	}

	auth := smtp.PlainAuth("", e.SMTPUsername, e.SMTPPassword, e.SMTPHost)

	msg := fmt.Sprintf("To: %s\r\nSubject: %s\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n%s", to, subject, body)

	return smtp.SendMail(
		e.SMTPHost+":"+e.SMTPPort,
		auth,
		e.FromEmail,
		[]string{to},
		[]byte(msg),
	)
}
