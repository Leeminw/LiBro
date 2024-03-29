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
