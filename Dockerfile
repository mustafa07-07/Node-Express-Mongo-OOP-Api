FROM node AS source
FROM mongo as mongo
WORKDIR /V1/src
RUN apt-get install nodejs -y
CMD ["node","app.js"];

