# Shopify Contact Form App --- React + Remix + PostgreSQL

A simple Shopify embedded app built using **Shopify CLI, Remix, Prisma,
PostgreSQL**, and exposed using **ngrok** or Cloudflare Tunnel.

## 📛 Badges

```{=html}
<p align="left">
```
`<img src="https://img.shields.io/badge/Node.js-20.x%20%7C%2022.x-339933?logo=node.js&logoColor=white" />`{=html}
`<img src="https://img.shields.io/badge/Remix-Framework-000000?logo=remix&logoColor=white" />`{=html}
`<img src="https://img.shields.io/badge/Shopify_App-Embedded-96bf48?logo=shopify&logoColor=white" />`{=html}
`<img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white" />`{=html}
`<img src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql&logoColor=white" />`{=html}
`<img src="https://img.shields.io/badge/License-MIT-green.svg" />`{=html}
```{=html}
</p>
```

------------------------------------------------------------------------

## 📌 Prerequisites

-   Node.js 20 or 22\
-   Shopify CLI\
-   PostgreSQL\
-   ngrok or Cloudflare Tunnel

------------------------------------------------------------------------

## 📥 Clone the Repository

``` bash
git clone https://github.com/Logeshwarank2002/Contact-Form.git
cd Contact-Form
```

------------------------------------------------------------------------

## ⚙️ Environment Setup

Create `.env`:

    DATABASE_URL="postgresql://postgres:Postgres123@localhost:5432/shopify_app?schema=public"
    NODE_ENV="development"

------------------------------------------------------------------------

## 🗄️ PostgreSQL Setup

``` sql
CREATE USER postgres WITH PASSWORD 'Postgres123';
CREATE DATABASE shopify_app;
```

Start PostgreSQL (Ubuntu):

``` bash
sudo service postgresql start
```

Windows: Start via **Services → PostgreSQL**.

------------------------------------------------------------------------

## 🔄 Prisma Setup

``` bash
npx prisma migrate dev --name init
npx prisma generate
```

------------------------------------------------------------------------

## 🧩 Shopify App Config

Update `shopify.app.toml`:

``` toml
client_id = "YOUR_CLIENT_ID"
app_url = "https://xxxx-xxx.ngrok-free.app"
```

------------------------------------------------------------------------

## 🔐 Login to Shopify

``` bash
shopify auth login
```

------------------------------------------------------------------------

## 🚀 Running the App

### Option A --- Default

``` bash
shopify app dev
```

### Option B --- Using Ngrok

``` bash
ngrok http 3000
shopify app dev --tunnel-url=https://xxxx.ngrok-free.app
```

------------------------------------------------------------------------

## 📤 Deploy (Optional)

``` bash
shopify app deploy
```

------------------------------------------------------------------------

# 11. Update Theme Extension Asset URL

After the app is running, update:

    extensions/theme-extension/assets/contact-form.js

Example:

``` js
const APP_URL = "https://your-final-app-url.com";
```

------------------------------------------------------------------------

# 12. Add App Block in Shopify Customizer

1.  Go to **Online Store → Themes → Customize**\
2.  Choose the page\
3.  Click **Add block / Add section**\
4.  Select: **Contact Form (App Block)**\
5.  Save

------------------------------------------------------------------------

## 🖼️ Screenshots

> Replace the URLs if needed --- these match your repository structure.

### 🟢 Ngrok Running

![Ngrok
Running](./screenshots/ngrok-start.png)

### 🟢 App Running (Terminal)

![App
Running](./screenshots/terminal-run.png)

### 🟢 App Running (More Logs)

![App
Running](./screenshots/terminal-run-2.png)

### 🟢 Admin UI

![Admin
Panel](./screenshots/admin.png)

### 🟢 Storefront

![Storefront](./screenshots/storefront.png)

------------------------------------------------------------------------

## 🎥 Screen Recording

![App Running record] (https://www.loom.com/share/8d7940525a264abebe8fa989f9cab4e9)

## Short demo video
[Form submission flow] (https://www.loom.com/share/d8e9d4e305e54630a525ee819cce1d98)