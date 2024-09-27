<img
src="https://static.premai.io/premplexity/White.png"
alt="Overview"/>

## Open-source, Fast, Private

##### Quench your thirst for discovery while boosting curiosity.

Premplexity is a completely open-source AI-powered utility belt for gathering information fast and privately. Answering questions is a trivial task you can do with any traditional search engine. With Premplexity you can retain full control over your searchs and have ownership over the information you gather.

# Why should I use Premplexity?

- Explore the web for new topics, and summarize anything without the creepy trackers 🧟‍♂️👣

- Answering questions

- Exploring topics in depth
  v
- Organizing your Library

## Examples

[💻 What are some upcoming tech trends for 2024?](https://premplexity.premai.io/thread/110)

[🔍 What are the benefits of cloud computing for startups?](https://premplexity.premai.io/thread/111)

[📱 How can businesses adapt to digital transformation?](https://premplexity.premai.io/thread/114)

[🚀 How can AI revolutionize customer service?](https://premplexity.premai.io/thread/115)

## Want to run Premplexity on your own machine?

### Here are some Requirements.

- [nvm](https://nodejs.org/en/download/package-manager)
- [docker](https://docs.docker.com/get-started/get-docker)
- [tmux](https://github.com/tmux/tmux/wiki/Installing)
- [tmuxp](https://github.com/tmux/tmux/wiki/Installing)

## Setup

1. Use the correct node version

   ```bash
   nvm use
   ```

2. Copy the `.env-sample` file to `.env`

   ```bash
   cp .env-sample .env
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Create Prem project

   - Go to your [Prem](https://app.premai.io/projects/) account and create a new project.
   - Copy the project ID and paste it in the `.env` file.
   - Create a new API key and paste it in the `.env` file.

```bash
PREM_PROJECT_ID=your_project_id
PREM_API_KEY=your_api_key
```

5. Get SerpApi key

   - Go to your [SerpAPI](https://serpapi.com/dashboard) account and create a new project.
   - Get your API key and paste it in the `.env` file.

```bash
SERPAPI_KEY=your_api_key
```

## Development

Make sure you have docker running and no other services are running on the ports `5432` and `3000` (or in the ports that you have set on `.env` file). Start the local infrastructure:

```bash
npm run dev
```

The script will start the following services:

- The postgres database running at port `5432`
- The webapp running at [http://localhost:3000](http://localhost:3000)
- A local postgres adminer running at [https://local.drizzle.studio/](https://local.drizzle.studio/)

## Migration

To create a new migration, modify the Drizzle models and then run:

```bash
npm run makemigrations
```

To apply the migrations, run:

```bash
npm run migrate
```

## Database workflow

Make sure you have the postgres container running. If not, start it with the local development infrastructure or run:

```bash
docker-compose up postgres
```

### Resetting the DB

Run the following command to reset the database (drop all tables, apply all migrations and seed the database):

```bash
npm run db:reset
```

If you want to hard clean the database, you can stop the postgres container and remove the volume:

```bash
docker-compose down
rm -rf postgres-data
```

### Cleaning the DB

Run the following command to clean the database (truncate all tables):

```bash
npm run db:truncate
```

### Seeding the DB

Run the following command to seed the database with initial data:

```bash
npm run db:seed
```

## Troubleshooting

### Error: Missing required environment variable

This error occurs when the application is missing a required environment variable. To resolve this issue, ensure that the required environment variables are set in the `.env` file.
