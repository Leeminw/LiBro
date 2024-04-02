# Libro 포팅 매뉴얼: Spring Boot, React (TypeScript), Next.js, Docker, Nginx, Jenkins, MySQL

## 목차

- [Libro 포팅 매뉴얼: Spring Boot, React (TypeScript), Next.js, Docker, Nginx, Jenkins, MySQL](#libro-포팅-매뉴얼-spring-boot-react-typescript-nextjs-docker-nginx-jenkins-mysql)
  - [목차](#목차)
  - [프로젝트 개요](#프로젝트-개요)
  - [포팅 전 준비사항](#포팅-전-준비사항)
  - [시스템 요구 사항](#시스템-요구-사항)
    - [원본 시스템(Linux)](#원본-시스템linux)
    - [타겟 시스템(Linux)](#타겟-시스템linux)
  - [인프라 포팅 절차](#인프라-포팅-절차)
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



## 포팅 전 준비사항

- Linux 환경에 대한 기본 지식
- IntelliJ IDEA, VS Code와 같은 IDE 설치
- Docker, Nginx, Jenkins, MySQL 설치 및 구성 경험



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












## 인프라 포팅 절차

### 단계 1: Docker 환경 구성

### 단계 2: Jenkins 설정

### 단계 3: MySQL 설정

### 단계 4: Nginx 설정




## Stable Diffusion 포팅 절차

### 단계 1: Github Pull

### 단계 2: Models 파일 설정

### 단계 3: Conda 환경 구성

### 단계 4: Command Line Arguments 설정




## 백엔드 포팅 절차 (Spring Boot)

### 단계 1: Docker 이미지 생성

### 단계 2: 데이터베이스 연결 및 마이그레이션




## 프론트엔드 포팅 절차 (React, Next.js)

### 단계 1: Docker 이미지 생성

### 단계 2: Docker 및 Nginx를 이용한 배포











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






























## 문제 해결 가이드

- **문제:** Jenkins에서 Docker 명령어 실행 시 권한 문제 발생
  - **해결책:** Jenkins 사용자를 Docker 그룹에 추가하고, 시스템을 재부팅하여 변경사항을 적용합니다.

- **문제:** Linux에서 Spring Boot 애플리케이션이 데이터베이스에 연결되지 않음
  - **해결책:** `application.properties` 파일에서 데이터베이스 URL, 사용자 이름, 비밀번호가 올바르게 설정되었는지 확인합니다. MySQL 서비스가 실행 중인지도 확인합니다.

- **문제:** Next.js 애플리케이션이 Linux에서 빌드 실패
  - **해결책:** 모든 의존성이 최신 버전인지 확인하고, `node_modules` 폴더와 `yarn.lock` 또는 `package-lock.json` 파일을 삭제한 후 다시 설치합니다.

- **문제:** MySQL 컨테이너 접속 오류
  - **해결책:** Docker 컨테이너 네트워크 설정을 검토하고, MySQL 컨테이너의 로그를 확인하여 구체적인 오류 메시지를 분석합니다. `application.properties`의 데이터베이스 연결 설정이 올바른지 확인합니다.



## 참고 자료

- [Ubuntu 공식 문서](https://ubuntu.com/)
- [Docker 공식 문서](https://docs.docker.com/)
- [Jenkins 공식 문서](https://www.jenkins.io/doc/)
- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [MySQL 공식 문서](https://dev.mysql.com/doc/)



## FAQ

**Q: Docker 이미지 빌드 시 'no space left on device' 오류가 발생하는 이유는?**
A: Docker가 사용하는 디스크 공간이 부족할 때 발생합니다. Docker 이미지와 컨테이너를 정리하여 공간을 확보해야 합니다.
