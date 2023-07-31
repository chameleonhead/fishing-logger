FROM node:18-bookworm

# devcontainer上で操作するユーザーを指定
ARG username="node"

# AWS CLIのインストール
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -f awscliv2.zip

# serverlessをinstall
RUN npm i -g serverless

# lessのインストール
RUN apt update \
    && apt install -y less \
    && apt clean
