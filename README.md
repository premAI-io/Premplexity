# Webapp

## Requirements

- nvm
- docker
- tmux
- tmuxp

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

### API Filters

To implement dynamic filters in the API, you can use the automatic filter system. To create filters for a subset of fields in a model, you can use the `generateFiltersSchema` function from `$utils/filters` module.

This function requires the following parameters:

- `fields`: an array of fields that you want to filter (field of drizzle schema)
- `server`: the fastify server instance
- `id` (optional): the id used to save the schema in the openapi definition

The `server` and `id` parameters are required in order to generate a recursive schema that can be used in the openapi definition. The function will return a json schema that be used in a body request.

To transform the filters in the request body to a `where` object that can be used in the drizzle query, you can use the `filterToDrizzleWhere` function from `$utils/filters` module. This function requires the following parameters:

- `filters`: the filters object in the request body
- `acceptedFilters`: an array of fields that you want to filter (fields of drizzle schema, the same used in `generateFiltersSchema` function)

#### Accepted filters

In the following list will be shown the accepted operators for each field type:

- `string`: `=`, `!=`, `in`, `not in`, `like`, `not like`, `ilike`, `not ilike`
- `string (enum)`: `=`, `!=`, `in`, `not in`
- `number`: `=`, `!=`, `>`, `>=`, `<`, `<=`, `in`, `not in`
- `boolean`: `=`, `!=`
- `date`: `=`, `!=`, `>`, `>=`, `<`, `<=`, `in`, `not in`

#### API filters example

The following example shows how to create a filter schema for the `User` model:

```typescript
import { generateFiltersSchema, filterToDrizzleWhere } from "$utils/filters"
import { users } from "$db_models/users"

const acceptedFilters = [users.name, users.id]
const filtersSchemaId = generateFiltersSchema(acceptedFilters, server)

server.post("/users", {
  schema: {
    body: {
      type: "object",
      properties: {
        filters: {
          $ref: filtersSchemaId
        }
      }
    }
  }
}, async (request, reply) => {
  const { filters } = request.body

  const where = filterToDrizzleWhere(filters, acceptedFilters)
  const users = await req.services.users.list({ where })
  reply.send(users)
})
```

The filters accepted in the request body are shown below:

```typescript
const baseFilterSingle = {
  field: "name",
  operator: "=",
  value: "John"
}

const baseFilterMultiple = {
  field: "id",
  operator: "in",
  values: [1, 2, 3]
}

const acceptedFilter1 = baseFilterSingle
const acceptedFilter2 = baseFilterMultiple
const acceptedFilter3 = [baseFilterSingle, baseFilterMultiple] // and condition
const acceptedFilter4 = { connector: "and", filters: [baseFilterSingle, baseFilterMultiple] }
const acceptedFilter5 = { connector: "or", filters: [baseFilterSingle, baseFilterMultiple] }
```

Please note that:

- The `filters` property in logical filters is an array of filters with the same structure as the base filter
- If an array of filters is provided in the first level, the connector is assumed to be `and`
- Filters with `in` and `not in` operators require an array of values at the `values` property

### API Sorters

To implement dynamic sorting in the API, you can use the automatic sorting system. To create a sorting schema for a subset of fields in a model, you can use the `generateSortersSchema` function from `$utils/sorters` module.

This function requires the following parameters:

- `fields`: an array of fields that you want to sort (field of drizzle schema)
- `server`: the fastify server instance
- `id` (optional): the id used to save the schema in the openapi definition

The schema generated by this function can be used in the openapi definition to allow the client to sort the results by one or more fields specified in `fields` parameter.

#### API sorters example

The following example shows how to create a sorting schema for the `User` model:

```typescript
import { generateSortersSchema, sortersToDrizzleOrderBy } from "$utils/sorters"
import { users } from "$db_models/users"

const acceptedSorters = [users.name, users.id]
const sortersSchemaId = generateSortersSchema(acceptedSorters, server)

server.post("/users", {
  schema: {
    body: {
      type: "object",
      properties: {
        sorters: {
          $ref: sortersSchemaId
        }
      }
    }
  }
}, async (request, reply) => {
  const { sorters } = request.body

  const orderBy = sortersToDrizzleOrderBy(sorters, acceptedSorters)
  const users = await req.services.users.list({ orderBy })
  reply.send(users)
})
```

The sorters accepted in the request body are shown below:

```typescript
const acceptedSorter1 = "name"
const acceptedSorter2 = "-id"
const acceptedSorter3 = ["name", "-id"]
const acceptedSorter4 = { field: "id", order: "desc" }
const acceptedSorter5 = { field: "id", order: "asc" }
const acceptedSorter6 = { field: "id" } // default order is asc
const acceptedSorter7 = ["name", { field: "id", order: "desc" }]
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

