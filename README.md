# Premplexity

## Requirements

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

1. Get SerpApi key

      - Go to your [SerpAPI](https://serpapi.com/dashboard) account and create a new project.
      - Get your API key and paste it in the `.env` file.

  ```bash
  SERPAPI_KEY=your_api_key
  ```

## Development

Make sure you have docker running and no other services are running on the ports `5432` and `3000`. Start the local infrastructure:

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

## Local testing

To run the tests, ensure your local development environment is set up according to the instructions in the **Setup** and **Development** sections. All tests are located in the `/src/tests` folder.

Run all tests using the following command:

```bash
npm test
```

To execute a specific test, use the --name flag followed by the name of the test you wish to run:

```bash
npm test --name=test_name
```

Replace test_name with the actual name of the test you want to execute. This will run the test that matches the given name.

## Troubleshooting

### Error: Missing required environment variable

This error occurs when the application is missing a required environment variable. To resolve this issue, ensure that the required environment variables are set in the `.env` file.
