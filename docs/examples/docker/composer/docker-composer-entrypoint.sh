#!/bin/sh

if [ -z $SSH_AUTH_SOCK ]; then
    eval $(ssh-agent) > /dev/null
    ssh-add > /dev/null
fi

exec "$@"
