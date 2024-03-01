# Use a minimal base image for Go applications
FROM golang:alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Go application source code into the container
COPY . .

# Build the Go application
RUN go build -o main .

# Expose the port your application is listening ons
EXPOSE 9808

# Run your Go application
CMD ["./main"]

# docker buildx build --platform linux/amd64 -t url-shortener-amd64 --load .
# docker tag url-shortener-amd64:latest us-west2-docker.pkg.dev/onyx-codex-415020/url-shortener/url-shortener-amd64:latest
# docker push us-west2-docker.pkg.dev/onyx-codex-415020/url-shortener/url-shortener-amd64:latest
# go and change url-shortener-deployment.yaml file to reflect the newly pushed dockerimage name
# kubectl apply -f url-shortener-deployment.yaml
# gcloud container clusters create url-shortener --num-nodes=3 --zone=us-west2
#Expose
#kubectl expose deployment url-shortener-deployment --type=LoadBalancer --name=url-shortener-service
