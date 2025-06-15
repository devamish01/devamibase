#!/bin/sh

# Start nginx in background
nginx &

# Start the backend server
cd /app/server
npm start
