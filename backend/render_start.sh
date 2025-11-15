#!/bin/bash
# Render runs the service on port 10000 by default
uvicorn app.main:app --host 0.0.0.0 --port 10000
