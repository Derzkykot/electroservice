# ЭлектроСервис

React + Vite + TypeScript + CSS. Шесть секций главной страницы, четыре страницы-заглушки услуг и демонстрационная форма без отправки данных. Все изображения и Manrope с кириллицей хранятся локально.

## Локальная работа

Требуется Node.js 24 и npm. Основной lock-файл для GitHub Actions — `package-lock.json`.

```sh
npm ci
npm run dev
npm run build
npm run check:pages
```

Dev-сервер: http://127.0.0.1:5173/. Готовая сборка находится в `dist/`.
В текущем окружении Codex также доступен `./start-local.sh`.

## GitHub Pages: первая публикация

Подготовка выполнена только локально. Удалённый репозиторий не создан, публикация не запускалась.

1. Создайте в GitHub **публичный** репозиторий, например `electroservice`. Для бесплатного GitHub Pages используйте публичный репозиторий.
2. Загрузите исходный проект в основную ветку **main**, сохранив структуру папок, включая `.github/workflows/pages.yml`. Не загружайте `node_modules`, `dist` и `.pnpm-store` — они исключены через `.gitignore`.
3. Откройте **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Если первый workflow завершился ошибкой до включения Pages, откройте **Actions → Deploy ElectroService to GitHub Pages → Run workflow**, выберите `main`. Также можно повторить неудачный запуск через **Re-run all jobs**.
5. Дождитесь успешного завершения задач `build` и `deploy`. Адрес появится в **Settings → Pages** и в окружении `github-pages`:
   `https://USERNAME.github.io/REPOSITORY/`.
6. Перед отправкой заказчику откройте главную, ссылки услуг и обновите страницу услуги в браузере. Форма остаётся демонстрационной.

Каждый последующий push в `main` автоматически пересобирает и публикует сайт. Workflow также можно запустить вручную из Actions. Если основная ветка называется иначе, сначала измените `branches: [main]` и проверку `github.ref` в workflow.

Если проект ещё не под Git, после создания пустого удалённого репозитория можно выполнить в папке проекта:

```sh
git init -b main
git add .
git commit -m "Prepare ElectroService for GitHub Pages"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Эти команды не выполнялись автоматически. Замените USERNAME и REPOSITORY своими значениями. Настройки Pages можно включить после появления файлов в репозитории, затем повторить workflow.

## Базовый путь и ссылки

`vite.config.ts` берёт `PAGES_BASE_PATH` из окружения. В GitHub Actions он заполняется автоматически из `actions/configure-pages`: имя репозитория не нужно прописывать в исходниках. Для обычного локального запуска базовый путь равен `/`. Поддерживается и репозиторий `USERNAME.github.io` с корневым адресом.

CSS-фон обрабатывается Vite, а изображения и ссылки React используют `siteUrl()` с `import.meta.env.BASE_URL`. Шрифты, JavaScript и CSS получают тот же префикс. Дизайн, фотографии и содержание не меняются.

GitHub Pages не предоставляет SPA-перенаправления. Поэтому сборка создаёт настоящие файлы:

- `dist/services/crane-electrics/index.html`
- `dist/services/industrial-equipment/index.html`
- `dist/services/industrial-electrician/index.html`
- `dist/services/maintenance/index.html`

Прямая ссылка и обновление работают без трюков с `404.html`, hash-маршрутов или серверного fallback. На опубликованном сайте адрес без конечного `/` будет перенаправлен статическим хостингом на каталог с `/`.

## Проверка сборки для папки репозитория

На macOS/Linux:

```sh
PAGES_BASE_PATH=/electroservice/ npm run build
PAGES_BASE_PATH=/electroservice/ npm run check:pages
PAGES_BASE_PATH=/electroservice/ npm run preview
```

Откройте http://127.0.0.1:4173/electroservice/. В PowerShell перед командами задайте `$env:PAGES_BASE_PATH = '/electroservice/'`.

`check:pages` проверяет базовый путь HTML/CSS, наличие ресурсов, четыре статические страницы услуг и маршрутизацию с завершающим `/` и без него. Workflow публикует только `dist/`; папка макетов `references/` не входит в сайт.

## Контент

Данные услуг, неисправностей, проектов и цен — в `src/data.ts`, секции — в `src/components/`, оформление — в `src/style.css`. Проекты остаются демонстрационными, контакты и цены — неподтверждёнными заглушками. Форма не отправляет и не сохраняет данные. Неиспользуемые прежние SVG и фрагмент каски сохранены в ресурсах, но не подключены к странице.
