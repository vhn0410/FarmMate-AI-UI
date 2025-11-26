docker rmi se48-iot/web-environment-monitoring
docker build -t se48-iot/web-environment-monitoring:latest .
docker run -d -p 3000:3000 --name web-environment-monitoring se48-iot/web-environment-monitoring:latest