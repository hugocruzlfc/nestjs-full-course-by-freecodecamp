<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Libraries

```bash
# Config
$ yarn add @nestjs/config

# prisma
$ yarn add -D prisma
$ yarn add  @prisma/client
$ npx prisma init
$ npx prisma migrate dev --name init
$ npx prisma generate

# Validators
$ yarn add  class-validator class-transformer

# Hash
$ yarn add argon2

# Authentication

$ yarn add @nestjs/passport passport
$ yarn add @nestjs/jwt passport-jwt
$ yarn add -D @types/passport-jwt

```
