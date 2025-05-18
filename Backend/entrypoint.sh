#!/bin/sh
PORT=${PORT:-8080}
symfony server:start --no-tls --port=$PORT --allow-http --allow-cors --ansi
