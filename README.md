# ComposerJS: Docker wrapper for Composer PHP Dependency Manager
ComposerJS is a wrapper script to provide some convenience for running Composer, the PHP Dependency Manager,
inside a docker container.

Interested in the why? Please read more on the [purpose](docs/purpose.md)

## Pre-requisites
You need to have the following software installed locally on your machine.
* NodeJS 12+
* npm 6.14+ (may run with older versions, but not tested)
* Docker 20.10+ (may run with older versions, but not tested)

## Installation
You can install the package globally wih
```sh
npm install -g @webcoast/composerjs
```
or locally in your project
```sh
npm install --save @webcoast/composerjs
```

## Usage
```sh
# Build the docker image
composerjs setup

# Run a shell inside the container
composerjs sh

# Install dependencies from `composer.lock`
composerjs install

# Mount the `app` directory into the container instead of the current directory.
composerjs --mount app update
```

## Configuration
You can configure the path to the docker file, the used shell and the mount point inside the container.
Please refer to the [configuration guide](docs/configuration.md).

# F.A.Q.
For in-depth questions and special use cases, please read the [F.A.Q.](docs/faq.md).
