<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<h1 align="center">MedNote AI</h1>

<p align="center">
  <b>AI-ассистент для медицинской документации</b><br/>
  <i>Врачи тратят до 50% рабочего времени на документацию. MedNote AI сокращает это до секунд.</i>
</p>

---

## Проблема

Каждый день врачи вручную заполняют медицинские записи, тратя драгоценное время, которое могло бы быть уделено пациентам. Это приводит к выгоранию, ошибкам и снижению качества помощи.

## Решение

**MedNote AI** слушает разговор врача с пациентом и автоматически генерирует:

- Структурированную медицинскую запись в формате **SOAP**
- Предварительные **диагнозы**
- **Рекомендации** по лечению

Всё это — за секунды, прямо в браузере.

---

## Возможности

| Функция | Описание |
|---------|----------|
| Запись голоса | Запись разговора прямо в браузере через микрофон |
| Распознавание речи | Автоматическая транскрипция через OpenAI Whisper |
| AI-анализ | SOAP-заметка, диагнозы и рекомендации от GPT-4o |
| История сессий | Сохранение и поиск по прошлым записям |
| Профиль врача | Специализация, статистика использования |
| Уровень уверенности | Показатель точности AI-анализа |
| Экономия времени | Отслеживание сэкономленных минут |

---

## Технологии

```
React (Frontend)  ──  Vite + Tailwind CSS
        │
    /api proxy
        │
Express (Backend)  ──  JWT + bcrypt
        │
   OpenAI API
    ├── Whisper   →  голос в текст
    └── GPT-4o    →  текст в медицинскую запись
```

| Слой | Стек |
|------|------|
| Frontend | React 18, Vite, Tailwind CSS, Lucide Icons |
| Backend | Node.js, Express, Multer |
| AI | OpenAI Whisper + GPT-4o |
| Авторизация | JSON Web Token, bcryptjs |

---

## Быстрый старт

### Требования

- **Node.js** 18+
- **OpenAI API ключ** — [получить здесь](https://platform.openai.com/api-keys)

### 1. Установка зависимостей

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Настройка окружения

Отредактируй файл `backend/.env`:

```env
PORT=3001
JWT_SECRET=REDACTED
OPENAI_API_KEY=sk-your-key-here
```

### 3. Запуск

Открой два терминала:

```bash
# Терминал 1 — Backend (порт 3001)
cd backend
npm start

# Терминал 2 — Frontend (порт 5173)
cd frontend
npm run dev
```

Открой в браузере: **http://localhost:5173**

---

## Как пользоваться

```
  Регистрация          Запись голоса         AI-анализ           История
 ┌──────────┐       ┌──────────────┐     ┌─────────────┐    ┌──────────┐
 │  Имя     │       │              │     │ SOAP Note   │    │ Сессия 1 │
 │  Email   │  ──>  │  Говори в    │ ──> │ Диагнозы    │ ──>│ Сессия 2 │
 │  Спец-я  │       │  микрофон    │     │ Рекомендации│    │ Сессия 3 │
 └──────────┘       └──────────────┘     └─────────────┘    └──────────┘
```

1. **Регистрация** — укажи имя, email и медицинскую специализацию
2. **Dashboard** — нажми кнопку записи и говори (имитируй диалог врач-пациент)
3. **Результат** — AI сгенерирует:
   - **Subjective** — жалобы пациента
   - **Objective** — объективные данные
   - **Assessment** — оценка состояния
   - **Plan** — план лечения
   - **Диагнозы** — предварительные варианты
   - **Рекомендации** — план действий
4. **История** — все записи сохраняются и доступны для поиска

---

## API

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `POST` | `/api/auth/register` | Регистрация врача |
| `POST` | `/api/auth/login` | Авторизация |
| `GET` | `/api/auth/me` | Текущий пользователь |
| `POST` | `/api/transcribe` | Загрузка аудио → транскрипция |
| `POST` | `/api/analyze` | Транскрипция → AI-анализ |
| `GET` | `/api/history` | Список всех сессий |
| `POST` | `/api/history` | Сохранение сессии |
| `GET` | `/api/history/:id` | Одна сессия по ID |

---

## Структура проекта

```
mednote-ai/
│
├── backend/
│   ├── server.js              # Express-сервер
│   ├── .env                   # Переменные окружения
│   ├── middleware/
│   │   └── auth.js            # JWT-мидлвар
│   └── routes/
│       ├── auth.js            # Регистрация и вход
│       ├── ai.js              # Whisper + GPT
│       └── history.js         # История сессий
│
├── frontend/
│   ├── vite.config.js         # Конфиг Vite + прокси
│   └── src/
│       ├── main.jsx           # Точка входа
│       ├── App.jsx            # Роутинг
│       ├── index.css          # Tailwind + тема
│       ├── context/
│       │   └── AuthContext.jsx # Контекст авторизации
│       ├── components/
│       │   ├── Sidebar.jsx    # Боковое меню
│       │   └── ProtectedRoute.jsx
│       ├── hooks/
│       │   └── useRecorder.js # Хук записи аудио
│       └── pages/
│           ├── Login.jsx      # Вход
│           ├── Register.jsx   # Регистрация
│           ├── Dashboard.jsx  # Главный экран
│           ├── History.jsx    # История
│           ├── Profile.jsx    # Профиль
│           └── About.jsx      # О проекте
│
└── README.md
```

---

## Дизайн

- Тёмная тема с глубокими navy/purple тонами
- **Glassmorphism** — полупрозрачные карточки с размытием
- Неоновые акценты: **cyan** `#00f0ff` и **green** `#00ff88`
- Пульсирующая анимация кнопки записи
- Адаптивный layout для мобильных устройств

---

## Для презентации

> *"Doctors spend up to 50% of their time on documentation.*
> *Our AI assistant reduces that to seconds."*

1. Открой приложение
2. Зарегистрируйся как врач
3. Запиши голосовое сообщение
4. Покажи результат — SOAP-заметка за секунды

> *"This is not just a tool — it's the future of clinical workflow."*

---

## Дисклеймер

Данное приложение является прототипом для образовательных и демонстрационных целей. AI-сгенерированные медицинские записи и диагнозы **не являются заменой профессионального медицинского заключения**. Всегда консультируйтесь с квалифицированным врачом.

---

## Лицензия

MIT
