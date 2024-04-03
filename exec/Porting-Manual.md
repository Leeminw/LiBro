# Libro 포팅 매뉴얼: Spring Boot, React (TypeScript), Next.js, Docker, Nginx, Jenkins, MySQL

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [포팅 전 준비사항](#포팅-전-준비사항)
- [시스템 요구 사항](#시스템-요구-사항)
  - [원본 시스템(Linux)](#원본-시스템linux)
  - [타겟 시스템(Linux)](#타겟-시스템linux)
- [프론트엔드 포팅 절차 (React, Next.js)](#프론트엔드-포팅-절차-react-nextjs)
  - [단계 1: Dockerfile 작성](#단계-1-dockerfile-작성)
  - [단계 2: Shell Script 작성](#단계-2-shell-script-작성)
- [백엔드 포팅 절차 (Spring Boot)](#백엔드-포팅-절차-spring-boot)
  - [단계 1: Dockerfile 작성](#eb8ba8eab384-1-dockerfile-ec9e91ec84b1-1)
  - [단계 2: Shell Script 작성](#eb8ba8eab384-2-shell-script-ec9e91ec84b1-1)
  - [단계 3: application.properties 작성](#단계-3-applicationproperties-작성)
- [인프라 포팅 절차](#인프라-포팅-절차)
  - [단계 0: 서버 환경 설정](#단계-0-서버-환경-설정)
  - [단계 1: Docker 환경 구성](#단계-1-docker-환경-구성)
  - [단계 2: Jenkins 설정](#단계-2-jenkins-설정)
  - [단계 3: MySQL 설정](#단계-3-mysql-설정)
  - [단계 4: Nginx 설정](#단계-4-nginx-설정)
- [Stable Diffusion 포팅 절차](#stable-diffusion-포팅-절차)
  - [단계 1: Github Pull](#단계-1-github-pull)
  - [단계 2: Models 파일 설정](#단계-2-models-파일-설정)
  - [단계 3: Conda 환경 구성](#단계-3-conda-환경-구성)
  - [단계 4: Command Line Arguments 설정](#단계-4-command-line-arguments-설정)
  - [단계 5: Stable Diffusion 실행](#단계-5-stable-diffusion-실행)
- [CI/CD 파이프라인 설정 (Jenkins)](#cicd-파이프라인-설정-jenkins)
- [문제 해결 가이드](#문제-해결-가이드)
- [참고 자료](#참고-자료)
- [FAQ](#faq)

## 프로젝트 개요

Libro는 생성형 AI Stable Diffusion을 활용하여 도서 줄거리를 기반으로 이미지를 생성하고, 생성된 이미지를 기반으로 쇼츠를 생성하여, CF (Collaborative Filtering) 기반 추천 알고리즘을 통해 사용자에게 쇼츠 기반 도서 추천 기능 및 커뮤니티 기능을 제공하는 모바일 웹 애플리케이션입니다.

본 매뉴얼은 애플리케이션을 Linux 환경에서 Linux 환경으로 포팅하는 과정을 안내합니다.  
이 과정에는 Spring Boot, React (TypeScript), Next.js, Docker, Nginx, Jenkins, MySQL이 포함됩니다.

<div align="right">

[[맨 위로](#)]

</div>

## 포팅 전 준비사항

- Linux 환경에 대한 기본 지식
- IntelliJ IDEA, VS Code와 같은 IDE 설치
- Docker, Nginx, Jenkins, MySQL 설치 및 구성 경험
- Naver Open API Client ID, Secret Key
- Naver OAuth Client ID, Secret Key
- Kakao OAuth Client ID, Secret Key
- Google OAuth Client ID, Secret Key

<div align="right">

[[맨 위로](#)]

</div>

## 시스템 요구 사항

### 원본 시스템(Linux)

- OS: Ubuntu 20.04 LTS
- Java: OpenJDK 17
- Node.js: v20.11.1
- MySQL: v8.0.36-0ubuntu0.20.04.1
- Nginx: 최신 버전
- Docker: 최신 버전
- Jenkins: 최신 버전

### 타겟 시스템(Linux)

- OS: Ubuntu 20.04 LTS
- Java: OpenJDK 17
- Node.js: v20.11.1
- MySQL: 최신버전
- Nginx: 최신 버전
- Docker: 최신 버전
- Jenkins: 최신 버전

<div align="right">

[[맨 위로](#)]

</div>

## 프론트엔드 포팅 절차 (React, Next.js)

### 단계 1: Dockerfile 작성

`Dockerfile`

```shell
# Node.js 공식 이미지 사용. 버전 20.11.1, 경량화된 Alpine Linux 기반
FROM node:20.11.1-alpine as build-stage

# 작업 디렉토리 설정. 컨테이너 내 앱의 기본 경로
WORKDIR /home/app

# 현재 디렉토리의 package.json과 package-lock.json 파일이 존재한다면
# 컨테이너의 작업 디렉토리로 package.json과 package-lock.json 복사
COPY package*.json ./

# package.json에 명시된 애플리케이션 의존성 설치
# package-lock.json이 있을 경우 더 빠르게 설치 가능
RUN npm install --force

# 현재 디렉토리의 모든 파일을 컨테이너의 작업 디렉토리로 복사
COPY . .

# React 애플리케이션 빌드
RUN npm run build

# .next 폴더와 그 안의 모든 파일에 대한 권한 설정
RUN chmod -R 755 /home/app/.next

# React 애플리케이션 실행
CMD ["npm", "start"]
```

<div align="right">

[[맨 위로](#)]

</div>

---

### 단계 2: Shell Script 작성

`build-frontend.sh`

```shell
#!/bin/bash

IMAGE_NAME="server/frontend"
IMAGE_ID=$(docker images -q $IMAGE_NAME)

CONTAINER_NAME="server-frontend"
CONTAINER_ID=$(docker ps -aqf "name=$CONTAINER_NAME")


echo -e "\n<<<<<<<<<< Frontend Build Process Start >>>>>>>>>>\n"


echo ">>> CURRENT DOCKER INFORMATION:"
echo ">>> DOCKER IMAGE NAME: $IMAGE_NAME"
echo ">>> DOCKER IMAGE ID: $IMAGE_ID"
echo ""


# Stop & Remove Existing Container
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 여부 검사 시작..."
if [ ! -z "$CONTAINER_ID" ]; then
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 확인."
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 시작..."
    docker stop $CONTAINER_ID || {
        echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 실패."
        exit 1
    }
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 완료."


    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 시작..."
    docker rm -f $CONTAINER_ID || {
        echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 실패."
        exit 1
    }
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 완료."
fi
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 여부 검사 완료."
echo ""


# Remove Existing Docker Image
echo ">>> DOCKER IMAGE $IMAGE_NAME 존재 여부 검사 시작..."
if [ ! -z "$IMAGE_ID" ]; then
    echo ">>> DOCKER IMAGE $IMAGE_NAME 존재 확인."
    echo ">>> DOCKER IMAGE $IMAGE_NAME 삭제 시작..."
    docker rmi -f $IMAGE_ID || {
        echo ">>> DOCKER IMAGE $IMAGE_NAME 삭제 실패."
        exit 1
    }
    echo ">>> DOCKER IMAGE $IMAGE_NAME 삭제 완료."
fi
echo ">>> DOCKER IMAGE $IMAGE_NAME 존재 여부 검사 완료."
echo ""


## Build Docker Image
echo ">>> DOCKER IMAGE $IMAGE_NAME 빌드 시작..."
docker build -t $IMAGE_NAME . || {
    echo ">>> DOCKER IMAGE $IMAGE_NAME 빌드 실패."
    exit 1
}
echo ">>> DOCKER IMAGE $IMAGE_NAME 빌드 완료."
echo ""


echo -e "\n<<<<<<<<<< Frontend Build Complete Successfully >>>>>>>>>>\n"
```

`deploy-frontend.sh`

```shell
#!/bin/bash

IMAGE_NAME="server/frontend"
CONTAINER_NAME="server-frontend"
CONTAINER_ID=$(docker ps -aqf "name=$CONTAINER_NAME")


echo -e "\n<<<<<<<<<< Frontend Deploy Process Start >>>>>>>>>>\n"


echo ">>> CURRENT DOCKER INFORMATION:"
echo ">>> DOCKER CONTAINER NAME: $CONTAINER_NAME"
echo ">>> DOCKER CONTAINER ID: $CONTAINER_ID"
echo ""


# Stop & Remove Existing Container
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 여부 검사 시작..."
if [ ! -z "$CONTAINER_ID" ]; then
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 확인."
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 시작..."
    docker stop $CONTAINER_ID || {
        echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 실패."
        exit 1
    }
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 완료."


    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 시작..."
    docker rm -f $CONTAINER_ID || {
        echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 실패."
        exit 1
    }
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 완료."
fi
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 여부 검사 완료."
echo ""


## Run Docker Container
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 실행 시작..."
docker run -d \
    -p 3000:3000 -v ./:/home/app \
    --name $CONTAINER_NAME $IMAGE_NAME || {
        echo ">>> DOCKER IMAGE $IMAGE_NAME 실행 실패."
        exit 1
}
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 실행 완료."
echo ""


echo -e "\n<<<<<<<<<< Frontend Deploy Complete Successfully >>>>>>>>>>\n"
```

<div align="right">

[[맨 위로](#)]

</div>

---

## 백엔드 포팅 절차 (Spring Boot)

### 단계 1: Dockerfile 작성

`Dockerfile`

```shell
# OpenJDK 17을 포함하는 경량화된 Alpine Linux 베이스 이미지 사용
FROM openjdk:17-jdk-buster

# 컨테이너 내부의 작업 디렉토리를 /home/app로 설정
WORKDIR /home/app

# 호스트 시스템의 SpringBoot 애플리케이션 JAR 파일을 컨테이너 내부 작업 디렉토리로 복사
COPY build/libs/*.jar app.jar

RUN apt-get update && \
    apt-get install -y fonts-noto-cjk && \
    apt-get install -y fonts-nanum-extra && \
    rm -rf /var/lib/apt/lists/* && \
    fc-cache -fv

# 컨테이너가 시작될 때 실행될 명령어 정의, 작업 디렉토리 /home/app/app.jar 파일 실행
ENTRYPOINT ["java", "-Dfile.encoding=UTF-8", "-jar", "./app.jar"]

# 컨테이너의 8080 포트를 외부로 노출
EXPOSE 8080
```

<div align="right">

[[맨 위로](#)]

</div>

---

### 단계 2: Shell Script 작성

`build-backend.sh`

```shell
#!/bin/bash

IMAGE_NAME="server/backend"
IMAGE_ID=$(docker images -q $IMAGE_NAME)

CONTAINER_NAME="server-backend"
CONTAINER_ID=$(docker ps -aqf "name=$CONTAINER_NAME")


echo -e "\n<<<<<<<<<< Backend Build Start >>>>>>>>>>\n"


echo ">>> CURRENT DOCKER INFORMATION:"
echo ">>> DOCKER IMAGE NAME: $IMAGE_NAME"
echo ">>> DOCKER IMAGE ID: $IMAGE_ID"
echo ""


# Stop & Remove Existing Container
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 여부 검사 시작..."
if [ ! -z "$CONTAINER_ID" ]; then
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 확인."
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 시작..."
    docker stop $CONTAINER_ID || {
        echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 실패."
        exit 1
    }
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 완료."


    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 시작..."
    docker rm -f $CONTAINER_ID || {
        echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 실패."
        exit 1
    }
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 완료."
fi
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 여부 검사 완료."
echo ""


# Remove Existing Docker Image
echo ">>> DOCKER IMAGE $IMAGE_NAME 존재 여부 검사 시작..."
if [ ! -z "$IMAGE_ID" ]; then
    echo ">>> DOCKER IMAGE $IMAGE_NAME 존재 확인."
    echo ">>> DOCKER IMAGE $IMAGE_NAME 삭제 시작..."
    docker rmi -f $IMAGE_ID || {
        echo ">>> DOCKER IMAGE $IMAGE_NAME 삭제 실패."
        exit 1
    }
    echo ">>> DOCKER IMAGE $IMAGE_NAME 삭제 완료."
fi
echo ">>> DOCKER IMAGE $IMAGE_NAME 존재 여부 검사 완료."
echo ""


## Build Docker Image
echo ">>> DOCKER IMAGE $IMAGE_NAME 빌드 시작..."
docker build -t $IMAGE_NAME . || {
    echo ">>> DOCKER IMAGE $IMAGE_NAME 빌드 실패."
    exit 1
}
echo ">>> DOCKER IMAGE $IMAGE_NAME 빌드 완료."
echo ""


echo -e "\n<<<<<<<<<< Backend Build Complete Successfully >>>>>>>>>>\n"
```

`deploy-backend.sh`

```shell
#!/bin/bash

IMAGE_NAME="server/backend"
CONTAINER_NAME="server-backend"
CONTAINER_ID=$(docker ps -aqf "name=$CONTAINER_NAME")


echo -e "\n<<<<<<<<<< Backend Deploy Process Start >>>>>>>>>>\n"


echo ">>> CURRENT DOCKER INFORMATION:"
echo ">>> DOCKER CONTAINER NAME: $CONTAINER_NAME"
echo ">>> DOCKER CONTAINER ID: $CONTAINER_ID"
echo ""


# Stop & Remove Existing Container
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 여부 검사 시작..."
if [ ! -z "$CONTAINER_ID" ]; then
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 확인."
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 시작..."
    docker stop $CONTAINER_ID || {
        echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 실패."
        exit 1
    }
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 중지 완료."


    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 시작..."
    docker rm -f $CONTAINER_ID || {
        echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 실패."
        exit 1
    }
    echo ">>> DOCKER CONTAINER $CONTAINER_NAME 삭제 완료."
fi
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 존재 여부 검사 완료."
echo ""


## Run Docker Container
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 실행 시작..."
docker run -d -p 8080:8080 \
    --name $CONTAINER_NAME $IMAGE_NAME || {
        echo ">>> DOCKER IMAGE $IMAGE_NAME 실행 실패."
        exit 1
}
echo ">>> DOCKER CONTAINER $CONTAINER_NAME 실행 완료."
echo ""


echo -e "\n<<<<<<<<<< Backend Deploy Complete Successfully >>>>>>>>>>\n"
```

<div align="right">

[[맨 위로](#)]

</div>

---

### 단계 3: application.properties 작성

`application.properties`

```shell
# Server Settings
server.port=8080
server.servlet.context-path=/
server.servlet.encoding.force=true
server.servlet.encoding.enabled=true
server.servlet.encoding.charset=UTF-8


# MySQL Server Settings
spring.datasource.url=jdbc:mysql://your-server-domain:3306/libro?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8&useUnicode=true
spring.datasource.username=your-username
spring.datasource.password=your-password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver


# MySQL Develop Settings
# spring.datasource.url=jdbc:mysql://localhost:3306/libro?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8&useUnicode=true&allowPublicKeyRetrieval=true
# spring.datasource.username=your-username
# spring.datasource.password=your-password
# spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver


### JPA/Hibernate Settings
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true
spring.jpa.properties.hibernate.jdbc.time_zone=Asia/Seoul
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect


# Slf4j Logging Debug Settings
logging.level.org.hibernate.type.descriptor.sql=trace
logging.level.com.ssafy.libro.domain=debug


# JWT Settings
#jwt.secret=ao_yongjae_shichi_ao_yongjae_shichi
jwt.secret=your-jwt-secret
jwt.accessExpTime=1800000
jwt.refreshExpTime=7200000


# OAuth2 Settings google (YJW)
spring.security.oauth2.client.registration.google.client-id=your-client-id
spring.security.oauth2.client.registration.google.client-secret=your-client-secret
spring.security.oauth2.client.registration.google.scope=email,profile


# OAuth2 Settings naver (YJW)
spring.security.oauth2.client.registration.naver.client-id=your-client-id
spring.security.oauth2.client.registration.naver.client-secret=your-client-secret
spring.security.oauth2.client.registration.naver.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.naver.redirect-uri=http://your-domain:8080/login/oauth2/code/naver
spring.security.oauth2.client.registration.naver.scope=email,nickname,profile_image,name
spring.security.oauth2.client.registration.naver.client-name=Naver
spring.security.oauth2.client.provider.naver.authorization-uri=https://nid.naver.com/oauth2.0/authorize
spring.security.oauth2.client.provider.naver.token-uri=https://nid.naver.com/oauth2.0/token
spring.security.oauth2.client.provider.naver.user-info-uri=https://openapi.naver.com/v1/nid/me
spring.security.oauth2.client.provider.naver.user-name-attribute=response


# OAuth2 Settings kakao (YJW)
spring.security.oauth2.client.registration.kakao.client-id=your-client-id
spring.security.oauth2.client.registration.kakao.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.kakao.redirect-uri=http://your-domain:8080/login/oauth2/code/kakao
spring.security.oauth2.client.registration.kakao.scope=profile_nickname, profile_image, account_email
spring.security.oauth2.client.provider.kakao.authorization-uri=https://kauth.kakao.com/oauth/authorize
spring.security.oauth2.client.provider.kakao.token-uri=https://kauth.kakao.com/oauth/token
spring.security.oauth2.client.provider.kakao.user-info-uri=https://kapi.kakao.com/v2/user/me
spring.security.oauth2.client.provider.kakao.user-name-attribute=id


# Redis Settings
spring.data.redis.port=6379
spring.data.redis.host=your-domain


# S3 Credential Settings
cloud.aws.credentials.access-key=your-access-key
cloud.aws.credentials.secret-key=your-secret-key
cloud.aws.region.static=your-regieon-name
cloud.aws.bucket-name=your-bucket-name


# File Upload Size Settings
spring.servlet.multipart.maxFileSize=10MB
spring.servlet.multipart.maxRequestSize=50MB


# Naver Open API Settings
naver.developers.openapi.client-id=your-client-id
naver.developers.openapi.client-secret=your-client-secret
```

<div align="right">

[[맨 위로](#)]

</div>

---

## 인프라 포팅 절차

### 단계 0: 서버 환경 설정

#### 서버 시간 변경

```shell
$ sudo timedatectl set-timezone Asia/Seoul
$ timedatectl
$ date
```

#### 미러 서버 변경

```shell
# 문자열 변경 명령어
:%s/원본 문장/변경 문장
```

```shell
# 카이스트 미러서버 변경 (타겟 서버 리전에 맞게 사용)
$ sudo vi /etc/apt/sources.list
:%s/kr.archive.ubuntu.com/ftp.kaist.ac.kr/
:%s/ap-southeast-2.ec2.archive.ubuntu.com/ftp.kaist.ac.kr/
:%s/ap-northeast-2.ec2.archive.ubuntu.com/ftp.kaist.ac.kr/
```

```shell
# 카카오 미러서버 변경 (타겟 서버 리전에 맞게 사용)
$ sudo vi /etc/apt/sources.list
$ :%s/kr.archive.ubuntu.com/mirror.kakao.com/
$ :%s/ap-southeast-2.ec2.archive.ubuntu.com/mirror.kakao.com/
$ :%s/ap-northeast-2.ec2.archive.ubuntu.com/mirror.kakao.com/
```

#### 패키지 업데이트

```shell
$ sudo apt update
$ sudo apt upgrade
$ sudo add-apt-repository --remove ppa:certbot/certbot
```

#### 가상 메모리 할당

```shell
$ free -h                         # 메모리 크기를 사람이 읽기 쉬운 단위로 출력
$ sudo swapoff -v /swapfile       # swap 비활성

$ sudo fallocate -l 8G /swapfile  # Swap 메모리 할당 8GB
$ sudo chmod 600 /swapfile        # 권한 수정
$ sudo mkswap /swapfile           # swapfile 생성
$ sudo swapon /swapfile           # swapfile 활성화
$ sudo nano /etc/fstab            # 파일 편집
/swapfile none swap sw 0 0        # 내용 추가 (권장)
/swapfile swap swap defaults 0 0  # 내용 추가 (옵션)

$ free -h                         # 메모리 크기를 사람이 읽기 쉬운 단위로 출력
```

```bash
# [파일시스템장치] [마운트포인트] [파일시스템 종류] [옵션] [dump설정] [파일점검옵션]
    /swapfile        swap          swap     defaults    0          0
    /swapfile        none          swap        sw       0          0
```

<div align="right">

[[맨 위로](#)]

</div>

---

### 단계 1: Docker 환경 구성

#### Docker apt repository 설정

```shell
# Add Docker's official GPG key:
$ sudo apt-get update
$ sudo apt-get install ca-certificates curl
$ sudo install -m 0755 -d /etc/apt/keyrings
$ sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
$ sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
$ sudo apt-get update
```

#### Docker 패키지 설치

```shell
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### Docker 설치 확인

```shell
$ sudo docker run hello-world
```

<div align="right">

[[맨 위로](#)]

</div>

---

### 단계 2: Jenkins 설정

#### Dockerfile 작성

`Dockerfile`

```shell
# 기본 이미지 설정
FROM jenkins/jenkins:lts-jdk17

# 사용자 root로 변경
USER root

# Docker 공식 GPG 키 추가 및 Docker 저장소 설정
RUN apt-get update && \
    apt-get install -y ca-certificates curl && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://down>    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.lis>

# Docker CLI 설치
RUN apt-get update && \
    apt-get install -y docker-ce docker-ce-cli containerd.io
```

#### Shell Script 작성

`install-jenkins.sh`

```shell
#!/bin/bash

IMAGE_NAME="server/jenkins"
CONTAINER_NAME="server-jenkins"

IMAGE_ID=$(sudo docker images -q $IMAGE_NAME)
CONTAINER_ID=$(sudo docker ps -aqf "name=$CONTAINER_NAME")

echo ">>> CURRENT DOCKER INFORMATION:"
echo "$IMAGE_NAME IMAGE_ID: $IMAGE_ID"
echo -e "$CONTAINER_NAME CONTAINER_ID: $CONTAINER_ID\n"


# Stop & Remove Existing Container
echo ">>> $CONTAINER_NAME 컨테이너 실행 여부 검사 시작..."
if [ ! -z "$CONTAINER_ID" ]; then
    echo -e ">>> 실행중인 $CONTAINER_NAME 컨테이너 중지 및 삭제 시작...\n"

    echo ">>> 실행중인 $CONTAINER_NAME 컨테이너 중지 시작..."
    sudo docker stop $CONTAINER_ID || {
        echo ">>> $CONTAINER_NAME 컨테이너 중지 실패."
        exit 1
    }
    echo -e ">>> 실행중인 $CONTAINER_NAME 컨테이너 중지 완료.\n"

    echo ">>> 중지상태인 $CONTAINER_NAME 컨테이너 삭제 시작..."
    sudo docker rm $CONTAINER_ID || {
        echo ">>> $CONTAINER_NAME 컨테이너 삭제 실패."
        exit 1
    }
    echo -e ">>> 중지상태인 $CONTAINER_NAME 컨테이너 삭제 완료.\n"

    echo ">>> 실행중인 $CONTAINER_NAME 컨테이너 중지 및 삭제 완료."
fi
echo -e ">>> $CONTAINER_NAME 컨테이너 실행 여부 검사 완료.\n"


# Remove Existing Docker Image
echo ">>> $IMAGE_NAME 이미지 존재 여부 검사 시작..."
if [ ! -z "$IMAGE_ID" ]; then
    echo ">>> 기존 $IMAGE_NAME 이미지 삭제 시작..."
    sudo docker rmi $IMAGE_ID || {
        echo ">>> 기존 $IMAGE_NAME 이미지 삭제 실패."
        exit 1
    }
    echo ">>> 기존 $IMAGE_NAME 이미지 삭제 완료."
fi
echo -e ">>> $IMAGE_NAME 이미지 존재 여부 검사 완료.\n"


# Build Docker Image

# 현재 사용자의 UID 추출
USER_UID=$(id -u $USER)
DOCKER_GID=$(getent group docker | cut -d: -f3)

# Docker 이미지를 빌드하면서 사용자 UID와 그룹 GID를 인자로 전달
echo ">>> $IMAGE_NAME 이미지 빌드 시작..."
sudo docker build -t $IMAGE_NAME . \
    --build-arg USER_UID=$USER_UID \
    --build-arg DOCKER_GID=$DOCKER_GID || {
        echo ">>> $IMAGE_NAME 이미지 빌드 실패."
        exit 1
    }
echo -e ">>> $IMAGE_NAME 이미지 빌드 완료.\n"


# Run Docker Container (USER jenkins)
echo ">>> $CONTAINER_NAME 컨테이너 실행 시작..."
sudo chown -R 1000:1000 /var/jenkins_home
sudo docker run -d \
    -p 8081:8080 -p 50000:50000 \
    -v /var/jenkins_home:/var/jenkins_home \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --name $CONTAINER_NAME $IMAGE_NAME || {
        echo ">>> $CONTAINER_NAME 컨테이너 실행 실패."
        exit 1
    }
echo ">>> $CONTAINER_NAME 컨테이너 실행 완료."
```

#### Docker Jenkins 설치

```shell
$ sudo chmod +x ./install-jenkins.sh
$ ./install-jenkins.sh
```

<div align="right">

[[맨 위로](#)]

</div>

---

### 단계 3: MySQL 설정

#### Shell Script 작성

`install-mysql.sh`

```shell
#!/bin/bash

# 변수명 설정
ROOT_PASSWORD='your_root_password'
NEW_USERNAME='your_account_username'
NEW_PASSWORD='your_account_password'

# 방화벽 설정
if sudo ufw status | grep -qw inactive; then
    echo "방화벽이 비활성화되어 있습니다. 방화벽을 활성화합니다."
    sudo ufw enable
fi
sudo ufw allow 3306

# MySQL 설치
echo "MySQL 설치를 시작합니다..."
sudo apt-get update
sudo apt-get install -y mysql-server

# MySQL 서비스 시작
sudo systemctl start mysql
sudo systemctl enable mysql

# 루트 비밀번호 설정 및 보안 설치 실행
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${ROOT_PASSWORD}';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 사용자 추가 스크립트
sudo mysql -e "CREATE USER '${NEW_USERNAME}'@'%' IDENTIFIED BY '${NEW_PASSWORD}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON *.* TO '${NEW_USERNAME}'@'%' WITH GRANT OPTION;"
sudo mysql -e "FLUSH PRIVILEGES;"

# MySQL 설정 파일에서 bind-address 값을 0.0.0.0으로 변경하여 어느 주소에서든 접근 가능하도록 설정
sudo sed -i '/bind-address/s/^#//g' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mysql.conf.d/mysqld.cnf

# MySQL 서비스 재시작
sudo systemctl restart mysql

echo "MySQL 설치 및 사용자 추가가 완료되었습니다."
```

`uninstall-mysql.sh`

```shell
#!/bin/bash

# 사용자에게 MySQL 삭제 확인 메시지 표시
echo "MySQL 클린 삭제를 시작합니다. 모든 MySQL 데이터가 제거됩니다."
read -rp "정말로 MySQL을 클린 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다. (y/n): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo "MySQL 클린 삭제를 시작합니다..."

    # MySQL 서비스 중지
    sudo systemctl stop mysql

    # MySQL 패키지 및 관련 패키지 제거
    sudo apt-get remove --purge -y mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-*
    sudo apt-get autoremove -y
    sudo apt-get autoclean -y

    # MySQL 설정 파일 및 데이터베이스 디렉토리 삭제
    sudo rm -rf /etc/mysql /var/lib/mysql

    # MySQL 로그 파일 삭제
    sudo rm -rf /var/log/mysql

    # MySQL 사용자 및 그룹 삭제 (선택적)
    sudo deluser mysql
    sudo delgroup mysql

    echo "MySQL이 시스템에서 완전히 제거되었습니다."
else
    echo "MySQL 클린 삭제가 취소되었습니다."
fi
```

#### MySQL 설치

```shell
$ sudo chmod +x ./install-mysql.sh
$ sudo chmod +x ./uninstall-mysql.sh
$ ./install-mysql.sh
```

<div align="right">

[[맨 위로](#)]

</div>

---

### 단계 4: Nginx 설정

#### 방화벽 설정

```bash
$ sudo ufw enable
$ sudo ufw allow 80
$ sudo ufw allow 443
```

#### NginX 설치

```bash
$ sudo apt update
$ sudo apt install nginx -y
$ sudo vi /etc/nginx/sites-available/default
```
```bash
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name example.com www.example.com;

    location / {
        root /home/ubuntu/puzzlepop/deploy/dist;
        index index.html index.htm index.nginx-debian.html;
        try_files $uri $uri/ /index.html =404;
    }
}
```
```bash
$ sudo systemctl start nginx
```

#### letsencrypt & Certbot 설치
```bash
$ sudo apt-get install letsencrypt
$ sudo apt-get install certbot python3-certbot-nginx
```

#### Certbot NginX 연결
```bash
$ sudo certbot --nginx -d 도메인 이름 -d www.도메인 이름
$ sudo certbot --nginx
$ 이메일 입력
$ 약관 동의 - Y
$ 이메일 수신동의
$ 도메인 입력 - i10{팀코드}.p.ssafy.io
$ http 입력시 리다이렉트 여부 - 2
```


#### NginX 설정

```shell
$ sudo vi /etc/nginx/sites-available/default
```

```shell
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;

        server_name _;

        location / {
                proxy_pass http://localhost:3000;
                proxy_redirect off;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;

                # try_files $uri $uri/ /index.html =404;
                location /_next/static/ {
                        alias /var/jenkins_home/workspace/Libro-Pipeline-Master/frontend/.next/static>                        expires 1y;
                        access_log off;
                        add_header Cache-Control "public";
                }

                location /public/ {
                        alias /var/jenkins_home/workspace/Libro-Pipeline-Master/frontend/public/;
                        expires 1y;
                        access_log off;
                        add_header Cache-Control "public";
                }
        }

        location /api {
                proxy_pass http://localhost:8080;
                proxy_redirect default;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/v1/shorts {
                proxy_pass http://localhost:8080;
                proxy_read_timeout 600s;
                proxy_connect_timeout 600s;
        }

        location /stable-diffusion-webui/ {
                proxy_pass http://localhost:7860/;
                proxy_redirect default;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /info {
                proxy_pass http://localhost:7860;
                proxy_redirect default;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /theme.css {
                proxy_pass http://localhost:7860;
                proxy_redirect default;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /run {
                proxy_pass http://localhost:7860;
                proxy_redirect default;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }

}

server {
        # Managed by Certbot
        listen 443 ssl;
        listen [::]:443 ssl ipv6only=on;

        ssl_certificate /etc/letsencrypt/live/j10a301.p.ssafy.io/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/j10a301.p.ssafy.io/privkey.pem;

        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;

        server_name j10a301.p.ssafy.io;
        client_max_body_size 100M;

        location / {
                proxy_pass http://localhost:3000;
                proxy_redirect off;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;

                # try_files $uri $uri/ /index.html =404;
                location /_next/static/ {
                        alias /var/jenkins_home/workspace/Libro-Pipeline-Master/frontend/.next/static>                        expires 1y;
                        access_log off;
                        add_header Cache-Control "public";
                }

                location /public/ {
                        alias /var/jenkins_home/workspace/Libro-Pipeline-Master/frontend/public/;
                        expires 1y;
                        access_log off;
                        add_header Cache-Control "public";
                }
        }

        location /api {
                proxy_pass http://localhost:8080;
                proxy_redirect default;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/v1/shorts {
                proxy_pass http://localhost:8080;
                proxy_read_timeout 600s;
                proxy_connect_timeout 600s;
        }
        location /stable-diffusion-webui/ {
                proxy_pass http://localhost:7860/;
                proxy_redirect default;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /info {
                proxy_pass http://localhost:7860;
                proxy_redirect default;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /theme.css {
                proxy_pass http://localhost:7860;
                proxy_redirect default;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /run {
                proxy_pass http://localhost:7860;
                proxy_redirect default;
                charset utf-8;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }
}

server {
        if ($host = j10a301.p.ssafy.io) {
                return 301 https://$host$request_uri;
        } # managed by Certbot


        listen 80 ;
        listen [::]:80 ;

        server_name j10a301.p.ssafy.io;
        return 404; # managed by Certbot
}
```

<div align="right">

[[맨 위로](#)]

</div>

---

## Stable Diffusion 포팅 절차

### 단계 1: Github Pull

```shell
$ sudo apt install wget git python3 python3-venv libgl1 libglib2.0-0
$ git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
$ wget -q https://raw.githubusercontent.com/AUTOMATIC1111/stable-diffusion-webui/master/webui.sh
```

<div align="right">

[[맨 위로](#)]

</div>

---

### 단계 2: Models 파일 설정

```shell
# Download CheckPoint
$ sudo mkdir -p ./models/Lora && sudo wget -O ./models/Stable-diffusion/animePastelDream_softBakedVae.safetensors "https://civitai.com/api/download/models/28100"
$ sudo mkdir -p ./models/Lora && sudo wget -O ./models/Stable-diffusion/xxmix9realistic_v40.safetensors "https://civitai.com/api/download/models/102222"

# Download LoRa
$ sudo mkdir -p ./models/Lora && sudo wget -O ./models/Lora/more_details.safetensors "https://civitai.com/api/download/models/87153?type=Model&format=SafeTensor"

# Download VAE
$ sudo mkdir -p ./models/VAE && sudo wget -O ./models/VAE/vaeFtMse840000Ema_v100.pt "https://huggingface.co/casque/vaeFtMse840000Ema_v100/resolve/main/vaeFtMse840000Ema_v100.pt?download=true"
```

<div align="right">

[[맨 위로](#)]

</div>

---

### 단계 3: Conda 환경 구성

```shell
$ conda create -n venv python=3.10.6
$ conda activate venv
```

<div align="right">

[[맨 위로](#)]

</div>

---

### 단계 4: Command Line Arguments 설정

`webui-user.sh`

```shell
#!/bin/bash
#########################################################
# Uncomment and change the variables below to your need:#
#########################################################

# Install directory without trailing slash
#install_dir="/home/$(whoami)"

# Name of the subdirectory
#clone_dir="stable-diffusion-webui"

# Commandline arguments for webui.py, for example: export COMMANDLINE_ARGS="--medvram --opt-split-attention"
#export COMMANDLINE_ARGS=""
#export COMMANDLINE_ARGS="--listen --share --precision full --xformers --no-half --no-half-vae --api --skip-torch-cuda-test"
export COMMANDLINE_ARGS="--listen --share --port 7860 --nowebui --device-id 8 --medvram --skip-torch-cuda-test --precision full --no-half --no-half-vae --api"
export PYTORCH_CUDA_ALLOC_CONF=garbage_collection_threshold:0.6,max_split_size_mb:512

# python3 executable
#python_cmd="python3"

# git executable
#export GIT="git"

# python3 venv without trailing slash (defaults to ${install_dir}/${clone_dir}/venv)
#venv_dir="venv"

# script to launch to start the app
#export LAUNCH_SCRIPT="launch.py"

# install command for torch
#export TORCH_COMMAND="pip install torch==1.12.1+cu113 --extra-index-url https://download.pytorch.org/whl/cu113"
export TORCH_COMMAND="pip install torch==2.0.1+cu117 --extra-index-url https://download.pytorch.org/whl/cu117"

# Requirements file to use for stable-diffusion-webui
#export REQS_FILE="requirements_versions.txt"

# Fixed git repos
#export K_DIFFUSION_PACKAGE=""
#export GFPGAN_PACKAGE=""

# Fixed git commits
#export STABLE_DIFFUSION_COMMIT_HASH=""
#export CODEFORMER_COMMIT_HASH=""
#export BLIP_COMMIT_HASH=""

# Uncomment to enable accelerated launch
#export ACCELERATE="True"

# Uncomment to disable TCMalloc
#export NO_TCMALLOC="True"

###########################################
```

<div align="right">

[[맨 위로](#)]

</div>

---

### 단계 5: Stable Diffusion 실행

```shell
$ ./webui.sh
```

<div align="right">

[[맨 위로](#)]

</div>

<div align="right">

[[맨 위로](#)]

</div>

---

## CI/CD 파이프라인 설정 (Jenkins)

```shell
// 공통 함수 정의
def sendMattermostNotification(String stage, String status) {
    script {
        def AUTHOR_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
        def AUTHOR_NAME = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()

        def color = (status == 'Success') ? 'good' : 'danger'
        def message = "${stage} ${status}: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${AUTHOR_ID}(${AUTHOR_NAME})\n(<${env.BUILD_URL}|Details>)"
        def endpoint = 'https://<matter-most-server-domain>/hooks/<your-incoming-webhook-endpoint>'
        def channel = 'your-matter-most-channel'

        mattermostSend (
            color: color,
            message: message,
            endpoint: endpoint,
            channel: channel,
        )
    }
}

pipeline {
    agent any

    tools {
        nodejs 'nodejs-20.11.1'
    }

    // 필요한 변수 설정
    environment {
        PROJECT_DIR = 'your_project_directory_name'
        DOCKER_REGISTRY = 'your_docker_registry_url'

        BACKEND_IMAGE_NAME = 'server/backend'
        FRONTEND_IMAGE_NAME = 'server/frontend'
        BACKEND_CONTAINER_NAME = 'server-backend'
        FRONTEND_CONTAINER_NAME = 'server-frontend'
    }


    stages {
        stage('Checkout') {
            steps {
                echo 'Starting Repository Checkout'

                git branch: 'master',
                credentialsId: 'YOUR_CREDENTIAL',
                url: 'https://<your-gitlab-domain>/<your-repository-endpoint>'

                echo 'Repository Checkout Completed'
            }
        }

        stage('Build Recommend') {
            steps {
                dir('recommend') {
                    sh 'chmod +x ./build-recommend.sh'
                    sh './build-recommend.sh'
                }
            }
            post {
                success {
                    script {
                        sendMattermostNotification('Build Recommend', 'Success')
                    }
                }
                failure {
                    script {
                        sendMattermostNotification('Build Recommend', 'Failed')
                    }
                }
            }
        }

        stage('Deploy Recommend') {
            steps {
                dir('recommend') {
                    sh 'chmod +x ./deploy-recommend.sh'
                    sh './deploy-recommend.sh'
                }
            }
            post {
                success {
                    script {
                        sendMattermostNotification('Deploy Recommend', 'Success')
                    }
                }
                failure {
                    script {
                        sendMattermostNotification('Deploy Recommend', 'Failed')
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build'

                    sh 'chmod +x ./build-backend.sh'
                    sh './build-backend.sh'
                }
            }
            post {
                success {
                    script {
                        sendMattermostNotification('Build Backend', 'Success')
                    }
                }
                failure {
                    script {
                        sendMattermostNotification('Build Backend', 'Failed')
                    }
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    echo '<<< Backend Tests Start >>>'
                    sh './gradlew test'
                    echo '<<< Backend Tests Complete Successfully >>>'
                }
            }
            post {
                success {
                    script {
                        sendMattermostNotification('Test Backend', 'Success')
                    }
                }
                failure {
                    script {
                        sendMattermostNotification('Test Backend', 'Failed')
                    }
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                dir('backend') {
                    sh 'chmod +x ./deploy-backend.sh'
                    sh './deploy-backend.sh'
                }
            }
            post {
                success {
                    script {
                        sendMattermostNotification('Deploy Backend', 'Success')
                    }
                }
                failure {
                    script {
                        sendMattermostNotification('Deploy Backend', 'Failed')
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'chmod +x ./build-frontend.sh'
                    sh './build-frontend.sh'
                }
            }
            post {
                success {
                    script {
                        sendMattermostNotification('Build Frontend', 'Success')
                    }
                }
                failure {
                    script {
                        sendMattermostNotification('Build Frontend', 'Failed')
                    }
                }
            }
        }

        // stage('Test Frontend') {
        //     steps {
        //         dir('frontend') {
        //             echo '<<< Frontend Tests Start >>>'
        //             sh 'npm test'
        //             echo '<<< Frontend Tests Complete Successfully >>>'
        //         }
        //     }
        //     post {
        //         success {
        //             script {
        //                 sendMattermostNotification('Test Frontend', 'Success')
        //             }
        //         }
        //         failure {
        //             script {
        //                 sendMattermostNotification('Test Frontend', 'Failed')
        //             }
        //         }
        //     }
        // }

        stage('Deploy Frontend') {
            steps {
                dir('frontend') {
                    sh "npm install"
                    sh "npm run build"

                    sh 'chmod +x ./deploy-frontend.sh'
                    sh './deploy-frontend.sh'
                }
            }
            post {
                success {
                    script {
                        sendMattermostNotification('Deploy Frontend', 'Success')
                    }
                }
                failure {
                    script {
                        sendMattermostNotification('Deploy Frontend', 'Failed')
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker system prune -af'
            echo 'Pipeline Execution Complete.'
        }
        success {
            echo 'Pipeline Execution Success.'
            script {
                sendMattermostNotification('빌드/배포', 'Success')
            }
        }
        failure {
            echo 'Pipeline Execution Failed.'
            script {
                sendMattermostNotification('빌드/배포', 'Failed')
            }
        }
    }
}
```

<div align="right">

[[맨 위로](#)]

</div>

---

## 문제 해결 가이드

- **문제:** Jenkins에서 Docker 명령어 실행 시 권한 문제 발생

  - **해결책:** Jenkins 사용자를 Docker 그룹에 추가하고, 시스템을 재부팅하여 변경사항을 적용합니다.

- **문제:** Linux에서 Spring Boot 애플리케이션이 데이터베이스에 연결되지 않음

  - **해결책:** `application.properties` 파일에서 데이터베이스 URL, 사용자 이름, 비밀번호가 올바르게 설정되었는지 확인합니다. MySQL 서비스가 실행 중인지도 확인합니다.

- **문제:** Next.js 애플리케이션이 Linux에서 빌드 실패

  - **해결책:** 모든 의존성이 최신 버전인지 확인하고, `node_modules` 폴더와 `yarn.lock` 또는 `package-lock.json` 파일을 삭제한 후 다시 설치합니다.

- **문제:** MySQL 컨테이너 접속 오류
  - **해결책:** Docker 컨테이너 네트워크 설정을 검토하고, MySQL 컨테이너의 로그를 확인하여 구체적인 오류 메시지를 분석합니다. `application.properties`의 데이터베이스 연결 설정이 올바른지 확인합니다.

<div align="right">

[[맨 위로](#)]

</div>

---

## 참고 자료

- [Ubuntu 공식 문서](https://ubuntu.com/)
- [Docker 공식 문서](https://docs.docker.com/)
- [Jenkins 공식 문서](https://www.jenkins.io/doc/)
- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [MySQL 공식 문서](https://dev.mysql.com/doc/)

<div align="right">

[[맨 위로](#)]

</div>

---

## FAQ

**Q: Docker 이미지 빌드 시 'no space left on device' 오류가 발생하는 이유는?**
A: Docker가 사용하는 디스크 공간이 부족할 때 발생합니다. Docker 이미지와 컨테이너를 정리하여 공간을 확보해야 합니다.

<div align="right">

[[맨 위로](#)]

</div>
