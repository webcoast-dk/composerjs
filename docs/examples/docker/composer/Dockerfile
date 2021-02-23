FROM php:7.4-cli-alpine3.10

ARG USER_ID
ARG USER_NAME

# User for running composer with unpreviliged user
RUN adduser -S -u ${USER_ID} ${USER_NAME}

# Install git
RUN apk add --no-cache \
        git \
        openssh-client \
        unzip \
        zip

# Create build directory
RUN mkdir /app

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

COPY docker-composer-entrypoint.sh /usr/local/bin/docker-composer-entrypoint
RUN chmod +x /usr/local/bin/docker-composer-entrypoint

WORKDIR /app

ENTRYPOINT ["docker-composer-entrypoint"]
