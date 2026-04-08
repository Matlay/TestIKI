# 📋 TetstIKI — Платформа для прохождения тестов

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Go](https://img.shields.io/badge/Go-1.24+-00ADD8?logo=go&logoColor=white)](https://go.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

> **TetstIKI** — это полнофункциональное веб-приложение для создания, прохождения и анализа результатов тестирования. Проект реализован по архитектуре клиент-сервер с разделением на фронтенд (React) и бэкенд (Go).

---

## 📑 Содержание

- [🚀 Особенности](#-особенности)
- [🏗️ Архитектура проекта](#️-архитектура-проекта)
- [🛠️ Технологический стек](#️-технологический-стек)
- [📁 Структура репозитория](#-структура-репозитория)
- [⚙️ Установка и запуск](#️-установка-и-запуск)
- [🔐 Переменные окружения](#-переменные-окружения)
- [🌐 API Endpoints](#-api-endpoints)
- [🤝 Вклад в проект](#-вклад-в-проект)

---

## 🚀 Особенности

### 👤 Аутентификация и авторизация
- Регистрация и вход с использованием JWT-токенов
- Подтверждение электронной почты
- Восстановление пароля через токен
- Хранение токена в httpOnly cookies для безопасности
- Защита маршрутов через middleware

### 📊 Функционал тестирования
- Просмотр доступных тестов с фильтрацией
- Прохождение тестов с сохранением результатов
- История результатов тестов в личном кабинете
- Визуализация статистики (Recharts)

### 👤 Профиль пользователя
- Загрузка и обновление аватара через Cloudinary
- Редактирование профиля
- Просмотр персональной статистики

### 🔒 Безопасность
- Rate limiting (10 запросов/минуту на защищённые эндпоинты)
- CORS с белым списком доменов
- Валидация входных данных
- Логирование запросов с использованием Zap

### 🎨 Пользовательский интерфейс
- Адаптивный дизайн с использованием TailwindCSS v4
- Анимации через Framer Motion
- Модальные окна для авторизации
- Компонентная архитектура React

---

## 🏗️ Архитектура проекта

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Backend       │     │   Database      │
│   (React 19)    │────▶│   (Go 1.24 +    │────▶│   PostgreSQL    │
│   • TailwindCSS │ HTTP│   Gin Framework)│ GORM│   • Users       │
│   • React Router│     │   • JWT Auth    │     │   • Tests       │
│   • Axios       │     │   • Rate Limit  │     │   • Results     │
└─────────────────┘     │   • Cloudinary  │     │   • Avatars     │
                        └─────────────────┘     └─────────────────┘
                                   │
                                   ▼
                        ┌─────────────────┐
                        │   Cloudinary    │
                        │   (Media Storage)│
                        └─────────────────┘
```

---

## 🛠️ Технологический стек

### 🔙 Бэкенд (Go)
| Технология | Назначение |
|------------|-----------|
| **Gin** | HTTP-фреймворк с высокой производительностью |
| **GORM** | ORM для работы с PostgreSQL |
| **JWT (golang-jwt)** | Аутентификация и авторизация |
| **Zap** | Структурированное логирование |
| **Cloudinary Go SDK** | Загрузка и управление медиафайлами |
| **ulule/limiter** | Rate limiting middleware |
| **godotenv** | Управление переменными окружения |
| **PostgreSQL** | Реляционная база данных |

### 🔜 Фронтенд (React)
| Технология | Назначение |
|------------|-----------|
| **React 19** | UI-библиотека |
| **TailwindCSS v4** | Утилитарный CSS-фреймворк |
| **React Router v7** | Навигация и роутинг |
| **Axios** | HTTP-клиент для API-запросов |
| **Framer Motion** | Анимации интерфейса |
| **Recharts** | Визуализация данных и графиков |
| **React Toastify** | Уведомления и тосты |
| **Heroicons / React Icons** | Иконки для интерфейса |

---

## 📁 Структура репозитория

```
TetstIKI/
├── Back/                          # Бэкенд на Go
│   ├── auth/                      # Логика аутентификации (JWT)
│   ├── cloudinary/                # Интеграция с Cloudinary
│   ├── database/                  # Конфигурация БД и модели
│   ├── handlers/                  # HTTP-обработчики запросов
│   ├── services/                  # Бизнес-логика
│   ├── go.mod                     # Зависимости Go
│   ├── go.sum                     # Хеш-суммы зависимостей
│   ├── main.go                    # Точка входа приложения
│   └── myproject.exe              # Скомпилированный бинарник (Windows)
│
├── Front/                         # Фронтенд на React
│   ├── public/                    # Статические файлы
│   ├── src/
│   │   ├── components/            # Переиспользуемые компоненты
│   │   ├── styles/                # Глобальные стили
│   │   ├── assets/                # Изображения, шрифты
│   │   ├── api.js                 # Настройка Axios instance
│   │   ├── App.js                 # Корневой компонент
│   │   ├── Header.js              # Шапка сайта
│   │   ├── Footer.js              # Подвал сайта
│   │   ├── Sidebar.js             # Боковая навигация
│   │   ├── AuthModal.js           # Модальное окно авторизации
│   │   ├── HomePage.js            # Главная страница
│   │   ├── TestsPage.js           # Страница каталога тестов
│   │   ├── ProfilePage.js         # Личный кабинет пользователя
│   │   ├── ResetPasswordPage.js   # Страница сброса пароля
│   │   ├── EmailVerificationPage.js # Страница подтверждения email
│   │   └── ...
│   ├── package.json               # Зависимости и скрипты npm
│   ├── tailwind.config.js         # Конфигурация TailwindCSS
│   └── postcss.config.js          # Конфигурация PostCSS
│
├── README.md                      # Документация проекта
└── .gitignore                     # Исключения для Git
```

---

## ⚙️ Установка и запуск

### 🔙 Запуск бэкенда (Go)

1. **Перейдите в директорию бэкенда:**
```bash
cd Back
```

2. **Установите зависимости:**
```bash
go mod tidy
```

3. **Создайте файл `.env` на основе шаблона:**
```bash
cp .env.example .env  # или создайте вручную
```

4. **Запустите сервер в режиме разработки:**
```bash
go run main.go
```

5. **Или соберите бинарный файл:**
```bash
go build -o myproject main.go
./myproject  # Linux/macOS
# или
myproject.exe  # Windows
```

> Сервер будет доступен по адресу: `http://localhost:8080`

### 🔜 Запуск фронтенда (React)

1. **Перейдите в директорию фронтенда:**
```bash
cd Front
```

2. **Установите зависимости:**
```bash
npm install
# или
yarn install
```

3. **Запустите сервер разработки:**
```bash
npm start
# или
yarn start
```

4. **Соберите проект для продакшена:**
```bash
npm run build
# или
yarn build
```

> Приложение будет доступно по адресу: `http://localhost:3000`

---

## 🔐 Переменные окружения

### Бэкенд (`Back/.env`)

```env
# 🔧 СЕРВЕР
PORT=8080
APP_ENV=development
FRONTEND_URL=http://localhost:3000

# 🗄️ БАЗА ДАННЫХ 
DATABASE_URL=host=localhost user=postgres password=localpass dbname=tetstiki_dev port=5432 sslmode=disable

# 🔐 JWT
JWT_SECRET=dev_secret_key_change_this_in_production_12345
JWT_EXPIRY=24h

# ☁️ CLOUDINARY 
CLOUDINARY_CLOUD_NAME=example_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_key

# 🤖 reCAPTCHA
RECAPTCHA_SECRET_KEY=6LfEXAMPLE_000000000000000000000000000000
RECAPTCHA_MIN_SCORE=0.5

# 📧 SMTP 
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=test@gmail.com
SMTP_PASSWORD=xxxx_xxxx_xxxx_xxxx
FROM_EMAIL=test@gmail.com
FROM_NAME=TetstIKI Dev
```

### Фронтенд (`Front/.env.local`)

```env
CLOUDINARY_CLOUD_NAME=example_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_key
```

---

## 🌐 API Endpoints

### 🔓 Публичные маршруты

| Метод | Эндпоинт | Описание | Тело запроса |
|-------|----------|----------|--------------|
| `POST` | `/register` | Регистрация нового пользователя | `{username, email, password}` |
| `POST` | `/login` | Аутентификация пользователя | `{email/username, password}` |
| `POST` | `/logout` | Выход из системы | — |
| `POST` | `/auth/forgot-password` | Запрос сброса пароля | `{email}` |
| `POST` | `/auth/reset-password` | Установка нового пароля | `{token, new_password}` |
| `POST` | `/auth/verify-email` | Подтверждение email | `{token}` |
| `POST` | `/auth/resend-verification` | Повторная отправка подтверждения | `{email}` |

### 🔐 Защищённые маршруты (требуется JWT)

| Метод | Эндпоинт | Описание | Ответ |
|-------|----------|----------|-------|
| `GET` | `/me` | Получение данных текущего пользователя | `{id, username, email, avatar, ...}` |
| `PATCH` | `/update-profile` | Обновление профиля | `{message, user}` |
| `POST` | `/upload-avatar` | Загрузка аватара | `{avatar_url}` |
| `POST` | `/update-avatar` | Обновление аватара | `{avatar_url}` |
| `DELETE` | `/avatar` | Удаление аватара | `{message}` |
| `GET` | `/user/test-results` | История результатов тестов | `[{test_id, score, date, ...}]` |
| `POST` | `/test-result` | Сохранение результата теста | `{message, result_id}` |
| `GET` | `/tests` | Получение списка тестов | `[{slug, title, description, ...}]` |
| `GET` | `/tests/:slug` | Получение конкретного теста | `{questions, options, ...}` |

### 📡 Формат ответа API

```json
// Успешный ответ
{
  "success": true,
  "data": { ... },
  "message": "Операция выполнена успешно"
}

// Ошибка
{
  "success": false,
  "error": "Описание ошибки",
  "code": 400
}
```

---

## 🤝 Вклад в проект

### ✅ Реализованный функционал

**🔙 Бэкенд (Go + Gin)**
- [x] REST API с JWT-аутентификацией и httpOnly cookies
- [x] Подключение PostgreSQL (Supabase) через GORM
- [x] Загрузка аватаров через Cloudinary
- [x] Отправка email (SMTP): подтверждение, сброс пароля
- [x] Защита: rate limiting, CORS, валидация, reCAPTCHA v3
- [x] Структурное логирование через Zap

**🔜 Фронтенд (React 19 + TailwindCSS v4)**
- [x] Адаптивный UI с анимациями (Framer Motion)
- [x] Роутинг с защитой приватных маршрутов (React Router v7)
- [x] Интеграция с API через Axios (токены, ошибки)
- [x] Визуализация статистики (Recharts)
- [x] Система уведомлений (React Toastify)

**🗄️ База данных**
- [x] Схема: `users`, `tests`, `questions`, `results`, `avatars`
- [x] Миграции через GORM AutoMigrate
- [x] Индексы и внешние ключи

**⚙️ Инфраструктура**
- [x] Вынос секретов в `.env`
- [x] Настроен `.gitignore` для безопасности
- [x] Подробный `README.md` с инструкциями

---

## 📬 Контакты

**Автор**: Matlay  
**Репозиторий**: [https://github.com/Matlay/TetstIKI](https://github.com/Matlay/TetstIKI)

> 💡 **Примечание**: Проект находится в активной разработке. Некоторые функции могут быть неполными или изменяться в будущих версиях.

---

<div align="center">
  <sub>Сделано с ❤️ для сообщества разработчиков</sub>
</div>
