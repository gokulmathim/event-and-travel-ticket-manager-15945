#!/bin/bash
cd /home/kavia/workspace/code-generation/event-and-travel-ticket-manager-15945/ticket_booking_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

