# Setting up dev environment

NOTE: See `Running the app frontend` section below if you only wish to work on the frontend.

## Installation
- ### [Bun](https://bun.sh) (JavaScript Runtime)
- ### [Node.js](https://nodejs.org/en/download/package-manager) (Required for other internal tools)


- ### [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux)

- ### [Meilisearch](https://github.com/meilisearch/meilisearch/releases/latest)
    NOTE: If you download the file from github and just place in `bin` folder, don't forget to give it executable permission.

- ### [Postgresql](https://www.postgresql.org/download)
    Use your package manager to install it if your package manager has the `postgresql-server` package is available in your distro's repo.


## Setup

You don't need any setup for `Redis` and `Meilisearch`.

### Postgres
After you've installed the `postgresql-server` you'll need to initialize the database. Run the following command to initialize the postgres db cluster:
```bash
sudo postgresql-setup --initdb
```

Change the `/var/lib/pgsql/data/pg_hba.conf` file to allow direct local connections:

```diff

  # TYPE  DATABASE        USER            ADDRESS                 METHOD
  
  # "local" is for Unix domain socket connections only
  local   all             all                                     peer
  # IPv4 local connections:
- host    all             all             127.0.0.1/32            ident
+ host    all             all             127.0.0.1/32            trust
  # IPv6 local connections:
  host    all             all             ::1/128                 ident
```

Now start the postgres server:
```
sudo systemctl start postgresql
```
To restart already running server use `restart` instead of `start`.

### Creating a database ROLE and USER
Log into psql console using:
```
sudo -u postgres psql
```

Add a user:
```
CREATE USER prisma WITH CREATEDB LOGIN PASSWORD 'YourPassword';
```
You can see all the users using `\du`.

Now create a database:
```
CREATE DATABASE crmm_dev WITH OWNER prisma;
```

Add the database extensions:
```
CREATE EXTENSION tsm_system_rows;
```
You might need to install the `postgresql-contrib` package if it's not available.
Restart the postgresql server after adding the extension.

Your database setup is complete now.
Keep in mind that you'll need to start the database again after a reboot.


## Project Backend Setup
- Clone the repo in your folder of choice.
- `cd` into the project root and run `bun install` to install all deps.
- Now go into `/apps/backend` and run `bunx prisma generate` and `bunx prisma db push` to synchronise the database with the schema.
- `env` file
    ```ini
    FRONTEND_URL="http://localhost:3000"
    CORS_ALLOWED_URLS="http://localhost:3000"
    OAUTH_REDIRECT_URI="http://localhost:3000/auth/callback"
    CDN_SERVER_URL="http://localhost:5500"
    CACHE_CDN_URL="http://localhost:5500"
    COOKIE_DOMAIN="localhost"

    PG_DATABASE_URL="postgresql://prisma:PASSWORD@localhost:5432/crmm_dev?schema=public"
    CDN_SECRET="ANY_RANDOM_STRING"
    FRONTEND_SECRET="a-secret-between-frontend-and-backend"
    NODE_ENV="development"

    # Auth Secrets
    HASH_SECRET_KEY="HASH_SECRET"

    GITHUB_ID="GITHB_OAUTH_ID"
    GITHUB_SECRET="GITHUB_OAUTH_SECRET"

    DISCORD_ID="DISCORD_OAUTH_ID"
    DISCORD_SECRET="DISCORD_OAUTH_SECRET"

    GOOGLE_ID="GOOGLE_OAUTH_APP_ID"
    GOOGLE_SECRET="GOOGLE_OAUTH_APP_SECRET"

    GITLAB_ID="GITLAB_OAUTH_APP_ID"
    GITLAB_SECRET="GITLAB_OAUTH_APP_SECRET"

    MEILISEARCH_MASTER_KEY="MEILISEARCH_MASTERY_KEY"

    # Email transport credentials
    BREVO_USER="82374982@smtp-brevo.com"

    SUPPORT_EMAIL="support@crmm.tech"
    SUPPORT_EMAIL_PASSWORD=""

    NOREPLY_EMAIL="no-reply@crmm.tech"
    NOREPLY_EMAIL_PASSWORD=""

    ADMIN_EMAIL="admin@crmm.tech"
    ADMIN_EMAIL_PASSWORD=""

    # Deployment Config (Not required)
    SSH_USER=""
    SSH_HOST=""
    # Path to ssh key
    SSH_KEY=""
    ```
    Your database url will look something like this
    `postgresql://DB_USER:PASSWORD@localhost:5432/DB_NAME?schema=public`

    Paste this env in a `.env` file in `/apps/backend`.


## Running the app backend
- Start the postgres server if not running
- `cd` into `/apps/backend`
- Start the redis server: `redis-server --port 5501`
- Start the meilisearch server: `meilisearch --master-key MEILISEARCH_MASTER_KEY` \
    Must be same as specified in the env
- Start the main app backend: `bun run dev`
- The backend server will start on [localhost:5500](http://localhost:5500)

<br>

<details>
<summary>If you'd like to start all these with one command, you can make use of the pm2 config.</summary>

- Install [pm2](https://pm2.keymetrics.io/docs/usage/quick-start).
- Adjust the executable paths and and project path in [pm2 config](/apps/backend/pm2.config.cjs). (Use absolute paths)
- `cd` into `/apps/backend`
- Create `redis` and `meilisearch` folders.
- Run `pm2 start pm2.config.cjs`. It will start all three processes. You can manage them using pm2 cli. \

*You'll still have to start the database server manually.

</details>


## Running the app frontend
- `cd` into `/apps/frontend`
- Run `bun run dev`
- The frontend server will start on [localhost:3000](http://localhost:3000)

If you wish to only work on the frontend, you can totally skip the backend setup and just proxy the requests to the hosted backend. \
Set `proxy: true` in [`app/utils/config.ts`](/apps/frontend/app/utils/config.ts#L15) and change `BACKEND_URL` and `BACKEND_URL_LOCAL` to `https://api.crmm.tech`; and now all the api requests will be made to the prod backend.
