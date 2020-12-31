## Installation

```bash
$ yarn install
```

## Running the app

```bash
# Migrations
$ yarn typeorm-run

# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

# if DB error: ER_ACCESS_DENIED_ERROR
$ run in mysql : 
$ ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'; 
$ flush privileges;
