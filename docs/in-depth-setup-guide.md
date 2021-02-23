## Setup
In your project root, create a directory `docker/composer` containing a `Dockerfile`. The `Dockerfile`
need to include all software, that you want to use with composer like `git`, `svn`, `mercurial`, `openssh-client`
and of course `composer`.

I recommend installing everything except `composer` using the distribution's package manager (e.g. `apt`, `yum` or `apk`).
For installing `composer` you should take a look at https://getcomposer.org/doc/faqs/how-to-install-composer-programmatically.md
or use the following snippet in your `Dockerfile`

```Dockerfile
# Install composer
RUN EXPECTED_SIGNATURE=$(curl -s https://composer.github.io/installer.sig); \
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"; \
    ACTUAL_SIGNATURE=$(php -r "echo hash_file('SHA384', 'composer-setup.php');"); \
    if [ "$EXPECTED_SIGNATURE" != "$ACTUAL_SIGNATURE" ]; then \
        >&2 echo 'ERROR: Invalid installer signature'; \
        rm composer-setup.php; \
        exit 1; \
    fi; \
    \
    php composer-setup.php --quiet --install-dir=/usr/local/bin --filename=composer --version=2.0.9; \
    RESULT=$?; \
    rm composer-setup.php; \
    exit ${RESULT}
```
Remember to set the `composer` version you want to use. With this snippet `composer` is installed globally inside
the image. This is necessary for this script to work properly.

Alternatively you can use the official composer docker image from https://hub.docker.com/_/composer or use one of
the images from https://hub.docker.com/r/webcoastdk/composer as the base image.

### Using unprivileged user
The script runs the container with the same UID as the local user. This solves several permission issues, especially
on linux, where composer installs packages and writes the cache directory as root.

It is therefor necessary to include the current user's UID and username in the docker image. You can do this by adding
the following lines to your `Dockerfile` after the `FROM ...` line.

```Dockerfile
ARG USER_ID
ARG USER_NAME

# User for running composer with unpreviliged user
RUN adduser -S -u ${USER_ID} ${USER_NAME}
```

The `ComposerJS` script automatically passes the current user's UID and name as build arguments to docker.

## Examples
You can find an example `Dockerfile` and referred scripts in the [examples folder](examples/docker/composer).
Feel free to copy it as a base for your own `Dockerfile`.
