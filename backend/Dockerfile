FROM python:3.9

WORKDIR /usr/src/app
ENV FLASK_APP=app

COPY /backend/app/requirements.txt ./

# opencvを使用するために libgl1-mesa-dev が必要
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y libgl1-mesa-dev

RUN pip install --upgrade pip
RUN pip install -r requirements.txt