
<h1 style="text-align: center;">NestJs Architecture Demo Project</h1>


This project shows a suggested structure and architecture for a medium sized project that should be able to grow easily. Includes some examples of configuration services and consumption of Azure services and Sentry, requested by students.

## Introduction

Whenever I teach introductory courses in any programming language or framework, the same question arises:

**How should I structure the project?**

And it is certainly a question that can be easy or difficult to answer depending on the situation.

In an ideal world, we should thoroughly understand the business requirements, growth expectations, quality attributes, and many other important aspects of software design, and based on that, define an architecture or a set of appropriate intermediate architectures, have a clear roadmap, and so on.

This is not always the case when we talk about small and medium customers, and today it is very common to find many new startups entering the world of software.

Yes, some programming languages include templates that give us a decent starting point, some others are so basic that they're barely useful, and others, like NodeJs, don't include any, leaving a newbie feeling lost.

Here we will see a simple proposal using NestJs, which came up as a way to answer this question in one of my recent training courses, it is a very flexible base and easy to adapt to any need.

## About the project

This project is a highly scalable backend application built in the Nodejs ecosystem, it has been built in [NestJs](https://github.com/nestjs/nest) in order to provide a high level of abstraction, mature design patterns, adaptability, flexibility and a combination of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming) in a single development tool.

The application is built with and fully supports [TypeScript](https://www.typescriptlang.org/), a high-level programming language which takes [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) to the next level by adding static types and class-based objects, as well as other powerful features.

The [MS SqlServer](https://www.microsoft.com/es-co/sql-server/sql-server-downloads) database engine is used,  the database model is relational,
and we use [TypeOrm](https://typeorm.io/) as a data access mechanism.

The software architecture has been designed on the fundamentals of [Multitier architecture](https://en.wikipedia.org/wiki/Multitier_architecture) in order to provide broad characteristics, and capacities for growth and adaptation to changes that may occur in the future.

The layered architecture style is one of the most common architectural styles. The idea behind Multitier or Layered Architecture is that modules or components with similar functionalities are organized into horizontal layers. As a result, each layer performs a specific role within the application.


## Structure

Next, we will explore the sections that make up the project, the functionality of each section, and explain how it works with examples where possible.
<br>
<br>

### Config Section

Let’s begin with the initialization of our environment variables. I am using the package [@nestjs/config](https://docs.nestjs.com/techniques/configuration) and [joi](https://joi.dev/) in this case.

The **config/** folder consists of different sections of variable types to be loaded into our environment.

```
src/config
    ├── app  
    │   ├── config.module.ts 
    │   ├── config.service.ts  
    │   └── configuration.ts
    ├── cache
    │   └── [...]
    ├── database
    │   ├── mssqlserver
    │   │   ├── config.module.ts
    │   │   ├── config.service.ts
    │   │   └── configuration.ts
    │   ├── mongo
    │   │   ├── [...]
    │   ├── mariadb
    │   │   └── [...]
    │   └── postgres
    │       └── [...]
    ├── health
    │   └── [...]
    ├── logger
    │   └── sentryio
    │       └── [...]
    ├── openapi
    │   └── swagger
    │       └── [...]
    ├── queue
    │   └── [...]
    ├── secrets
    │   └── keyvault
    │       └── [...]
    ├── session
    │   └── [...]
    └── storage
        └── azure
            └── [...]
```

Note: Here [...] means same as other config folders.

Getting values from an environment file isn’t as simple as creating a .env file, but NestJS is one of the few Node frameworks that makes creating config variables very easy. It provides with a very object-oriented, modular and structured way to deal with this.

- **Environment variables**

I am going to take config/app as an example, but you can
follow a similar approach for creating other configs. Let’s take the following
as part of your environment variable file (.env).

```
# Application Configuration
APP_ENV=development
APP_NAME="My App"
APP_URL=http://localhost:9000
APP_PORT=9000
```
<br>
<br>

- **configuration.ts file**
  
This is just going to be a function initializing your variables with a name.

```
import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
}));
```

**The name 'app' needs to be unique for each configuration.**
<br>
<br>
- **configuration.service.ts file**

This is just a simple class with getter based class functions.

```
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get name(): string {
    return this.configService.get<string>('app.name', { infer: true }) ?? '';
  }
  get env(): string {
    return this.configService.get<string>('app.env', { infer: true }) ?? '';
  }
  get url(): string {
    return this.configService.get<string>('app.url', { infer: true }) ?? '';
  }
  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }
}
```
The idea is that they are exclusively configuration services, and that if the solution grows, we can even separate them as an independent module or as microservices that can be consumed by other modules of the solution.
<br>
<br>

- **configuration.module.ts file**

Here we basically import NestJS’s main ConfigModule and add your validationSchema. You can read more about it [here](https://docs.nestjs.com/techniques/configuration#schema-validation)

```
import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        APP_NAME: Joi.string(),
        APP_ENV: Joi.string()
          .valid('development', 'production', 'testing', 'staging')
          .default('development'),
        APP_URL: Joi.string(),
        APP_PORT: Joi.number().default(9000),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
```
<br>
<br>

### Providers Section

Providers are basically going to be the core modules that initiate a connection between the app and the provider engine (for eg. database). The main idea of a provider is that it can be injected as a dependency.

```
src/providers
├── cache
│   └── redis
│       └── [...]
├── database
│   ├── mssqlserver
│   │   └── provider.module.ts
│   ├── mongo
│   │   └── [...]
│   ├── mariadb
│   │   └── [...]
│   └── postgres
│       └── [...]
├── mail
│   └── smtp
│       └── [...]
├── queue
│    └── redis
│       └── [...]
└── storage
   └── [...]
```
Note: Here [...] means same as other config folders.

The provider.module.ts for each file would look something like this:

```
import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DBConfigModule } from 'src/config/database/mssqlserver/config.module';
import { DBConfigService } from 'src/config/database/mssqlserver/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DBConfigModule],
      useFactory: async (
        dbConfigService: DBConfigService,
      ) => ({
        type: 'mssql' as DatabaseType,
        host: dbConfigService.hos),
        port: dbConfigService.port,
        username: dbConfigService.use),
        password: dbConfigService.password,
        database: dbConfigService.database,
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [DBConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class MSSqlServerDatabaseProviderModule {}
```
<br>
<br>

### Api Section

**src/api** folder will simply be the parent folder that contains all model related data. 

By default, NestJs is designed with a 3-tier architecture as a base, so when we use the templates through the CLI, we easily see that 3 key elements will be created:

1. Controllers: A controller’s sole purpose is to receive requests for the application and deal with routes.

2. Services: This part of the block should only include business logic. For example, all the CRUD operations and methods to determine how data can be created, stored and updated. Those are the service files.

3. Data Access Layer: This layer takes care and provides logic to access data stored in persistent storage of some kind. Those are the entity and dto files.

```
src/models
├── health
│   └── health.controller.ts
└── users
    ├── dto
    │   └── create-user.dto.ts
    │   └── update-user.dto.ts
    ├── entities
    │   └── user.entity.ts
    ├── interfaces
    │   └── user.interface.ts
    ├── serializers
    │   └── user.serializer.ts
    ├── users.controller.ts
    ├── users.module.ts
    ├── users.repository.ts
    └── users.service.ts
```
Note: In this project, the health controller returns a status of 200 so that the Azure balancer works without problems.
<br>
<br>

### Common Files Section

**src/common** folder has the most number of directories here. I use this common folder to literally fill it in with any extra classes/files that might commonly be used by other modules in your app.

There is not much to explain here, except the fact that we are using NestJs core fundamentals elements like [guards](https://docs.nestjs.com/guards), [pipes](https://docs.nestjs.com/pipes), [decorators](https://docs.nestjs.com/custom-decorators), etc, in this folder, and some other common constants, interfaces and helpers.

```
src/common
├── constants
├── decorators
├── environments
├── exceptions
├── guards
├── helpers
├── interceptors
├── interfaces
├── middleware
├── pipes
└── serializers
```

As I always say in class, be careful with the things that are put in this section, respect good practices, document properly and be aware of the use of this section, review very well before adding more things, it is very easy for it to become the project's garbage repository.
<br>
<br>

## Azure 

As part of the training, some [Azure services](https://azure.microsoft.com/en-us) were taken into account, the use of secrets in [Azure KeyVault](https://azure.microsoft.com/en-us/products/key-vault), the [SQLServer database](https://azure.microsoft.com/en-us/products/azure-sql/managed-instance) and [Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs) were added.

Therefore, the sensitive information usually found in the environment variables was moved to the KeyVault, and the name of the secret is stored in the environment variables, support for reading the KeyVault and recovering the information contained in it was added.

Regarding the storage, a mechanism has been created to allow access to the vault to store or read the files stored there.

Since a balancer was used in Azure, the health service was added, given the time limitations of training, only a status of 200 is returned to indicate to the balancer that the instance is up, but ideally it should be complemented by indicating the real health status of the solution. If you want to add to this point, I recommend reading the [documentation](https://docs.nestjs.com/recipes/terminus).
<br>
<br>

## Others

[OpenAPI](https://www.openapis.org/) support has been added through [Swagger](https://docs.nestjs.com/openapi/introduction), but its use is limited to the development environment.

[Helmet](https://docs.nestjs.com/security/helmet) support has been added for security reasons.

[Sentry.io](https://sentry.io/welcome/) support has been added as a log manager, an interceptor has been created that is used in the controllers.

Good practices were an important part of the training; to reinforce them, the project was configured with [eslint](https://eslint.org/) in [strict mode](https://typescript-eslint.io/linting/configs/), the necessary configurations were added to the [compiler options](https://www.typescriptlang.org/tsconfig), and the [Prettier](https://prettier.io/) plugins were added.
<br>
<br>

## Development environment

A development environment based on NodeJs is required.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# local default url and port
localhost:9000

# default API route (prefix)
localhost:9000/api/

# Swagger web interface (development environment only)
localhost:9000/api-docs
```

## Test

```bash
# unit tests
$ npm run test

# watch mode
$ npm run test:watch

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Please note that this project is not a template as such, and given the great speed with which some components and projects in the JavaScript ecosystem evolve or die, it is possible that this project as it stands today will be completely useless at some point, especially that dedicated to the consumption of Azure services, for this reason my recommendation is to take into account the directory structure, and the configuration services, and be especially careful when it comes to Azure.

On the other hand, it was built based on the Azure services that the client provided me, and since I do not have an Azure account, I doubt that I can update the project with each change in the Microsoft libraries for Nodejs.


## Stay in touch

I speak Spanish in my daily life and English at a professional level, so you can expect spelling or grammatical errors, please inform me if you see any and if possible explain why, this will make it easier for me to continue learning and one day master English to perfection! 

[Fabian A. Becerra M.](https://github.com/fabecerram)

## License

Code and documentation copyright 2019-2023 the authors. Code released under the MIT License.
