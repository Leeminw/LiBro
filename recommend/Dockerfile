# 기본 이미지로부터 시작합니다. Python 3.8을 사용합니다.
FROM python:3.8

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 호스트의 현재 디렉토리의 모든 파일을 컨테이너의 /app 디렉토리로 복사합니다.
COPY . /app

# pip를 업그레이드합니다.
RUN pip install --upgrade pip
RUN apt-get update

# opencv용 파일 설치
RUN apt-get -y install libgl1-mesa-glx
# pyzbar용 파일 설치
RUN apt-get -y install libzbar0
# 필요한 라이브러리를 설치합니다. requirements.txt 파일이 있어야 합니다.
RUN pip install --no-cache-dir -r requirements.txt

# 최초 1회 학습 실행
RUN python -m train
# Flask 애플리케이션을 실행합니다.
CMD ["python", "-m", "app"]