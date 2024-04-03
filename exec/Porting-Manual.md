# Libro 포팅 매뉴얼: Spring Boot, React (TypeScript), Next.js, Docker, Nginx, Jenkins, MySQL

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [포팅 전 준비사항](#포팅-전-준비사항)
- [시스템 요구 사항](#시스템-요구-사항)
  - [원본 시스템(Linux)](#원본-시스템linux)
  - [타겟 시스템(Linux)](#타겟-시스템linux)
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
- [백엔드 포팅 절차 (Spring Boot)](#백엔드-포팅-절차-spring-boot)
  - [단계 1: Docker 이미지 생성](#단계-1-docker-이미지-생성)
  - [단계 2: 데이터베이스 연결 및 마이그레이션](#단계-2-데이터베이스-연결-및-마이그레이션)
- [프론트엔드 포팅 절차 (React, Next.js)](#프론트엔드-포팅-절차-react-nextjs)
  - [단계 1: Docker 이미지 생성](#단계-1-docker-이미지-생성-1)
  - [단계 2: Docker 및 Nginx를 이용한 배포](#단계-2-docker-및-nginx를-이용한-배포)
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

---

### 단계 4: Nginx 설정

<div align="right">

[[맨 위로](#)]

</div>

## Stable Diffusion 포팅 절차

### 단계 1: Github Pull

### 단계 2: Models 파일 설정

### 단계 3: Conda 환경 구성

### 단계 4: Command Line Arguments 설정

<div align="right">

[[맨 위로](#)]

</div>

## 백엔드 포팅 절차 (Spring Boot)

### 단계 1: Docker 이미지 생성

### 단계 2: 데이터베이스 연결 및 마이그레이션

<div align="right">

[[맨 위로](#)]

</div>

## 프론트엔드 포팅 절차 (React, Next.js)

### 단계 1: Docker 이미지 생성

### 단계 2: Docker 및 Nginx를 이용한 배포

<div align="right">

[[맨 위로](#)]

</div>

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

## 참고 자료

- [Ubuntu 공식 문서](https://ubuntu.com/)
- [Docker 공식 문서](https://docs.docker.com/)
- [Jenkins 공식 문서](https://www.jenkins.io/doc/)
- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [MySQL 공식 문서](https://dev.mysql.com/doc/)

<div align="right">

[[맨 위로](#)]

</div>

## FAQ

**Q: Docker 이미지 빌드 시 'no space left on device' 오류가 발생하는 이유는?**
A: Docker가 사용하는 디스크 공간이 부족할 때 발생합니다. Docker 이미지와 컨테이너를 정리하여 공간을 확보해야 합니다.

<div align="right">

[[맨 위로](#)]

</div>
