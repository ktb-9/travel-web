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

# PM2 설치
RUN npm install -g pm2

# 환경 설정
ENV NODE_ENV=production

# 포트 설정
EXPOSE 80

# PM2 실행
CMD ["pm2-runtime", "start", "npm", "--", "start"]