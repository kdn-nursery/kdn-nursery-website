# Local setup (Windows PowerShell)

Requirements: Node.js 24 (this project was built with Node.js 24.19), npm, and Git.

```powershell
cd D:\KDN\kdn-nursery-website
git switch dev
git pull origin dev
git switch -c feature/your-task-name
Copy-Item .env.example .env
npm install
npm run dev
```

Open http://localhost:3000. The site redirects to `/en` or `/ta`.

`dev` is not on the remote yet. Until it exists, do not commit on `main`. See `docs/PROGRESS.md` for the current branch.

## Demo catalogue

The sample shop runs without PostgreSQL when `.env` contains:

```dotenv
CATALOGUE_DATA_SOURCE=demo
ALLOW_DEMO_CATALOGUE=true
```

`ALLOW_DEMO_CATALOGUE=true` is only for a local or non-public preview build. A production build refuses demo mode without that explicit flag, and database mode never falls back to sample data.

Prices, stock and Tamil copy in demo mode are development data.

## PostgreSQL

1. Create an empty **development** database.
2. Set `DATABASE_URL` and `CATALOGUE_DATA_SOURCE=database`.
3. Review `prisma/migrations/20261017123000_init_catalogue/migration.sql`.
4. Apply it only to that development database:

```powershell
npx prisma migrate dev
npx prisma db seed
```

Do not point `DATABASE_URL` at a database you do not own, and do not seed production.

## Checks

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run build` needs `CATALOGUE_DATA_SOURCE=demo` and `ALLOW_DEMO_CATALOGUE=true`, or a reachable development database.
