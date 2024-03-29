#!/bin/bash

IMAGE_NAME="server/frontend"
IMAGE_ID=$(sudo docker images -q $IMAGE_NAME)


echo "<<< Frontend Build Process Start >>>"


echo ">>> CURRENT DOCKER INFORMATION:"
echo ">>> DOCKER IMAGE NAME: $IMAGE_NAME"
echo ">>> DOCKER IMAGE ID: $IMAGE_ID"
echo -e "\n\n\n"


# Remove Existing Docker Image
echo ">>> DOCKER IMAGE $IMAGE_NAME 존재 여부 검사 시작..."
if [ ! -z "$IMAGE_ID" ]; then
    echo ">>> DOCKER IMAGE $IMAGE_NAME 존재 확인."
    echo ">>> DOCKER IMAGE $IMAGE_NAME 삭제 시작..."
    sudo docker rmi -f $IMAGE_ID || {
        echo ">>> DOCKER IMAGE $IMAGE_NAME 삭제 실패."
        exit 1
    }
    echo ">>> DOCKER IMAGE $IMAGE_NAME 삭제 완료."
fi
echo ">>> DOCKER IMAGE $IMAGE_NAME 존재 여부 검사 완료."
echo -e "\n\n\n"


## Build Docker Image
echo ">>> DOCKER IMAGE $IMAGE_NAME 빌드 시작..."
sudo docker build -t $IMAGE_NAME . || {
    echo ">>> DOCKER IMAGE $IMAGE_NAME 빌드 실패."
    exit 1
}
echo ">>> DOCKER IMAGE $IMAGE_NAME 빌드 완료."
echo -e "\n\n\n"


echo "<<< Frontend Build Complete Successfully >>>"
