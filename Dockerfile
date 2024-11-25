# Client Dockerfile
# Node.js 기반 이미지 선택
FROM node:20-alpine AS build

# 앱 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Nginx 이미지 기반으로 배포 설정
FROM nginx:alpine
COPY --from=build /usr/src/app/.next  /usr/share/nginx/html

# Nginx 포트 설정
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]