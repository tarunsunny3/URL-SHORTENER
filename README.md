# URL Shortener

URL shortener app made using:

- **Frontend**: React, Typescript
- **Backend**: Go, Redis, PostgreSQL
- **Deployment**: Docker, Kubernetes, GCP, Heroku, Vercel

**Frontend React App is hosted on Vercel@** https://url-shortener-gamma-lilac.vercel.app/

**Backend Go App is hosted on Heroku@** https://url-shortener-137d2d729d3e.herokuapp.com/


## Table of Contents

1. [How To Run it Locally](#how-to-run-it-locally)
   
    1.1. [Setup PostgreSQL Cloud Service](#get-postgresql-cloud-service-connection-details)
   
    1.2. [Setup Redis Cloud Service](#get-redis-cloud-service-connection-details)
   
2. [Why couldn't I deploy my app using Docker + GCP Kubernetes?](#why-couldnti-deploy-my-app-using-docker--gcp-kubernetes-)

## How To Run it Locally

To run the project locally, follow these steps:

### Get PostgreSQL Cloud Service Connection Details

1. Sign up for a PostgreSQL cloud service such as Aiven, AWS RDS, or others.
2. I used [Aiven](https://aiven.io/postgresql?utm_source=google&utm_medium=cpc&utm_campaign=brandservice_apac-india_en_exact&utm_content=brandservice_aivenpostgresql_rsa&utm_prog=alw&utm_cmp=9qbdzw&creative=675398376370&keyword=aiven%20postgres&matchtype=e&network=g&device=c&gad_source=1) 

3. Obtain the connection string with SSL settings. Update the `POSTGRES_CONNECTION_STRING` in your `app.env` file which is shown below

### Get Redis Cloud Service Connection Details
1. Sign up for free "Redis as a Service" providers online.
2. I used [Redis Labs](https://redis.com/)
```
# app.env

# PostgreSQL Connection String
POSTGRES_CONNECTION_STRING=postgres://username:password@host:port/database?sslmode=verify-ca&sslrootcert=path/to/ca.pem

# Redis Connection Details
REDIS_CONNECTION_ADDR=redis-host:redis-port
REDIS_CONNECTION_PASSWORD=redis-password

# Client Origin for CORS
CLIENT_ORIGIN=http://localhost:8081

# Token Configuration
TOKEN_EXPIRED_IN=180m
TOKEN_MAXAGE=180
TOKEN_SECRET=my-ultra-secure-json-web-token-string
```

### Why couldn't I deploy my app using Docker + GCP Kubernetes?
GCP's GKE gave me an external IP exposing my backend service/APIs. But when I deployed my frontend app on Vercel which had a different

domain like ****vercel.com and my backend external IP address didn't match with the frontend Vercel's domain and hence even though I used CORS on my backend go code
Vercel blocked the API requests to my backend, and hence I had to deploy it on Heroku as a single app.

