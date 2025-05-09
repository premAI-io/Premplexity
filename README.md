<img
src="https://static.premai.io/premplexity/White.png"
alt="Overview"/>

## Open-source, Fast, Private

##### Quench your thirst for discovery while boosting curiosity.

Premplexity is a completely open-source AI-powered utility belt for gathering information fast and privately. Answering questions is a trivial task you can do with any traditional search engine. With Premplexity you can retain full control over your searches and have ownership over the information you gather.

# What should I use Premplexity for?

- Privately explore the web for new topics, and summarize anything without the creepy trackers 🧟‍♂️👣

- Answering questions: Go from a question to an answer as fast as possible. It doesn't matter if its a simple or complex question. Find the best answers from the most up to date sources. Generate code, summarize anything in one open environment.

- Exploring topics in depth: Learn new things on the fly and access the main sources of information.

- Choose the right AI models for your use case: Choose from a variety of AI models and pick the one that best fits your use case.

- Fork and run locally: Run Premplexity locally on your own machine. Make it your OWN!

## Examples

[💻 What are some upcoming tech trends for 2024?](https://premplexity.premai.io/thread/110)

[🔍 What are the benefits of cloud computing for startups?](https://premplexity.premai.io/thread/111)

[📱 How can businesses adapt to digital transformation?](https://premplexity.premai.io/thread/114)

[🚀 How can AI revolutionize customer service?](https://premplexity.premai.io/thread/115)

## Want to run Premplexity on your own machine?

## Requirements

- [nvm](https://nodejs.org/en/download/package-manager)
- [docker](https://docs.docker.com/get-started/get-docker)

## Contributing

1. Use the correct node version

```bash
nvm use
```

2. Copy the `.env.example` file to `.env`

```bash
cp .env.example .env
```

3. Run the db with Docker

```bash
docker-compose up -d postgres
```

4. Install dependencies

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

## Run the migrations

To apply the migrations, run:

```bash
npm run migrate
```

## Run the application

Make sure you have docker running and no other services are running on the ports `5432` and `3000` (or in the ports that you have set on `.env` file). Start the local infrastructure:

```bash
npm run dev
```

You can now access the application at [http://localhost:3000](http://localhost:3000).

### Drizzle Studio

If you want to use Drizzle Studio to manage the database, you can run the following command:

```bash
npm run studio
```

## Database management

### Migrations

To create a new migration, modify the Drizzle models and then run:

```bash
npm run makemigrations
```

### Resetting the DB

Run the following command to reset the database (drop all tables, apply all migrations and seed the database):

```bash
npm run db:reset
```

If you want to hard clean the database, you can stop the postgres container and remove the volume:

```bash
docker-compose down -v
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

## Self Host Premplexity

Simply run: 

```bash
docker-compose up -d
```

And you will have the application running at [http://localhost:3000](http://localhost:3000).

## Troubleshooting

### Error: Missing required environment variable

This error occurs when the application is missing a required environment variable. To resolve this issue, ensure that the required environment variables are set in the `.env` file.
