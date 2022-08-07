# Lab Capture

## Start Demo

```bash
chmod +x demo.sh
./demo.sh
```

## Project Structure

- `client` - Frontend application
- `auth` - Authentication service
- `student-server` - Student Remote server to serve client, and connect to env container via ssh
- `student-env` - Student Working Container
- `instructor-server` - Backend for course staff dashboard, analytics
