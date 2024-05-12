#!/bin/bash

# Function to delete existing screen session
delete_existing_session() {
    local existing_sessions=$(screen -ls | grep "robot-arm-movement" | awk '{print $1}')
    if [ -n "$existing_sessions" ]; then
        screen -S $existing_sessions -X quit
    fi
}

# Function to handle interruptions
cleanup() {
    delete_existing_session
    exit 1
}

# Trap interrupts and errors
trap cleanup SIGINT ERR

# Delete existing screen sessions
delete_existing_session

# Install npm dependencies for client and server
echo "Installing npm dependencies..."
yarn --prefix client
yarn --prefix server

# Start a new screen session with a meaningful name
screen -S robot-arm-movement -d -m -t "robot-arm-movement"

# Split the screen horizontally
screen -S robot-arm-movement -p 0 -X split

# Start client application on the left side
screen -S robot-arm-movement -p 0 -X focus
screen -S robot-arm-movement -p 0 -X stuff "npm start --prefix client$(printf \\r)"

# Start server application on the right side
screen -S robot-arm-movement -X focus
screen -S robot-arm-movement -X screen
screen -S robot-arm-movement -p 1 -X stuff "npm start --prefix server$(printf \\r)"

# Attach to the screen session to view the output
screen -r robot-arm-movement
