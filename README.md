# Open Video Stream

An open source api, with built-in interface, for sharing videos

## Description

This is an open source api for delivering video content for users, where the platform user can send it's own videos, and manage them.

## License

Open Video Stream is released under the terms of the MIT license. See [LICENSE](LICENSE) for more information or see [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT).

## Installation

You can install the application by running:

```bash
$ npm install
```

We want to make docker configurations for using the service inside a container, and consuming other containers (database, redis, and so on)

## Running the app

You can run the app as developer by running:

```bash
$ npm run start
```

Or, if you want a watch mode, with automatic reloading of the changes:

```bash
$ npm run start:dev
```

On a production server, you can run:

```bash
$ npm run start:prod
```

## Tests

The application must be covered completelly with unit tests, so, every change must be tested inside some unit test file (`.spec` files). You can run all tests with:

```bash
$ npm run test
```

You can also see the coverage of the tests with:

```bash
$ npm run test:cov
```

Or run only a specific test, or tests inside a specific folder by running:

```bash
$ npm run test -t [path]
```

## Support

As a open-source software, you can help improve it not only by sugesting things, but also, using it as part of bigger projects. New contributors are very welcome and needed.

### Contributor workflow

To contribute to the project you can do the following:

1. Fork repository (only for the first time)
2. Create a branch for the issue
3. Commit changes
4. Create a [pull request](https://github.com/rainanDeveloper/open-video-stream/pulls) on the project
  
If you're not a developer, but also wants to contribute to the project, you can suggest changes by opening a [issue](https://github.com/rainanDeveloper/open-video-stream/issues)

## Stay in touch

- Author - [Rainan Miranda de Jesus](mailto:rainan.jesus@pm.me)
