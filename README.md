# MAX Bridge

Веб-клиент для личной переписки в MAX через HTTP API сервиса [GREEN-API](https://green-api.com/). Приложение позволяет подключить инстанс GREEN-API, создать диалог по номеру телефона, отправлять сообщения и получать текстовые ответы без перезагрузки страницы.

## Возможности

- вход по `idInstance` и `apiTokenInstance`;
- создание личного чата по российскому номеру телефона;
- отправка текстовых сообщений;
- автоматическое получение входящих текстовых сообщений;
- отображение состояния отправки и повторная отправка при ошибке;
- индикация состояния соединения с GREEN-API;
- адаптивный интерфейс для компьютеров и мобильных устройств.

Учетные данные сохраняются только в `sessionStorage` текущей вкладки и удаляются при выходе. История сообщений не загружается с сервера и не сохраняется после закрытия вкладки. Входящие сообщения отображаются только для активного диалога.

## Технологии

- React 19;
- TypeScript;
- Vite;
- TanStack Query;
- SCSS.

## Требования

- Node.js 20.19+ или 22.12+;
- npm;
- настроенный инстанс GREEN-API для MAX;
- `idInstance` и `apiTokenInstance` из личного кабинета GREEN-API.

Для получения входящих сообщений в настройках инстанса GREEN-API необходимо:

1. Оставить `webhookUrl` пустым.
2. Включить `incomingWebhook`.
3. Сохранить настройки и дождаться их применения.

Подробнее: [получение уведомлений через HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/).

## Локальный запуск

1. Установите зависимости:

   ```bash
   npm install
   ```

2. При необходимости создайте файл `.env` на основе `.env.example` и укажите адрес API:

   ```env
   VITE_GREEN_API_URL=https://api.green-api.com
   ```

   Этот шаг можно пропустить: по умолчанию используется `https://api.green-api.com`.

3. Запустите сервер разработки:

   ```bash
   npm run dev
   ```

4. Откройте адрес, который Vite выведет в терминале, обычно `http://localhost:5173`.

5. Введите `idInstance` и `apiTokenInstance`, затем создайте чат по номеру получателя.

## Другие команды

Проверка типов:

```bash
npm run typecheck
```

Production-сборка:

```bash
npm run build
```

Локальный просмотр production-сборки:

```bash
npm run preview
```

Готовые файлы после сборки находятся в каталоге `dist`.

## Деплой на GitHub Pages

В проекте настроен workflow `.github/workflows/deploy.yml`. При каждом push в ветку `main` GitHub Actions собирает приложение и публикует каталог `dist` на GitHub Pages.

1. Создайте репозиторий на GitHub и отправьте в него проект:

   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

2. Откройте репозиторий на GitHub и перейдите в `Settings` → `Pages`.
3. В разделе `Build and deployment` выберите источник `GitHub Actions`.
4. Откройте вкладку `Actions` и дождитесь завершения workflow `Deploy to GitHub Pages`.

После первого успешного деплоя ссылка на сайт появится в настройках Pages и в выполненном workflow. Обычно она имеет вид `https://<имя-пользователя>.github.io/<имя-репозитория>/`.

Workflow также можно запустить вручную через `Actions` → `Deploy to GitHub Pages` → `Run workflow`.
