# WebApp

Справочник клиентов и реестр сделок на Next.js, TypeScript, Tailwind CSS и PostgreSQL.

Нужен Node.js 22.13+.

## С Docker

Запустите Docker Desktop, затем выполните:

```bash
npm ci
cp .env.example .env
npm run db:setup
npm run dev
```

База: `npm run db:up` / `npm run db:down`. Данные сохраняются между запусками.

## Без Docker

Создайте пустую базу в своей PostgreSQL. Пользователь подключения должен иметь права на создание таблиц.

```bash
npm ci
cp .env.example .env
```

В `.env` укажите свои параметры подключения:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/webapp
```

Примените миграции, добавьте тестовые данные и запустите приложение:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Открыть http://localhost:3000.

Вход: `demo@example.com` / `Demo2026!`.

После обновления проекта примените новые миграции: `npm run db:migrate`.
