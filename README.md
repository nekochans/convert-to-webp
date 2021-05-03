# convert-to-webp
[![ci](https://github.com/nekochans/convert-to-webp/actions/workflows/ci.yml/badge.svg)](https://github.com/nekochans/convert-to-webp/actions/workflows/ci.yml)
[![cd-staging](https://github.com/nekochans/convert-to-webp/actions/workflows/cd-staging.yml/badge.svg)](https://github.com/nekochans/convert-to-webp/actions/workflows/cd-staging.yml)
[![cd-production](https://github.com/nekochans/convert-to-webp/actions/workflows/cd-production.yml/badge.svg)](https://github.com/nekochans/convert-to-webp/actions/workflows/cd-production.yml)

S3にアップロードされた画像をWebpに変換するLambda関数です。

## Getting Started

### 環境変数の設定

[direnv](https://github.com/direnv/direnv) 等を利用して環境変数を設定します。

```
export AWS_PROFILE=利用するAWSプロファイル名を指定
export DEPLOY_STAGE=デプロイステージを設定 .e.g. dev, stg, prod
export TRIGGER_BUCKET_NAME=Lambda関数実行のトリガーとなるS3バケット名を指定
export DESTINATION_BUCKET_NAME=変換済のWebp画像がアップロードされるS3バケット名を指定
```

### AWSクレデンシャルの設定

[名前付きプロファイル](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-configure-profiles.html) を利用しています。

`AWS_PROFILE` で指定した値を利用するようにして下さい。

### デプロイ

以下の手順です。

1. `docker-compose up --build -d` でコンテナを起動します
1. `docker-compose exec node bash` でコンテナに入る
1. `yarn install` で依存パッケージをインストール
1. `yarn run deploy` を実行する

必ずDockerコンテナ内でこれらの作業を行って下さい。

Webpフォーマットへの変換は [sharp](https://github.com/lovell/sharp) を利用しているので、予めビルドされたネイティブモジュール（バイナリ）がLambdaの実行環境と異なると正常に動作しません。

詳しくは [AWS Lambda(Node.js)にsharp(Native Module)をデプロイする方法](https://dev.classmethod.jp/articles/how-to-deploy-with-native-module/) をご覧下さい。

GitHubActionsを利用した自動デプロイでも上記の手順を用いてDocker内でデプロイを行っています。

## Lambda関数の仕様

`TRIGGER_BUCKET_NAME` で指定したS3バケットにアップロードされたファイルをWebpに変換し `DESTINATION_BUCKET_NAME` で指定したS3バケットに移動します。

対応している画像フォーマットは `.png` だけですが、簡単な拡張で他の画像フォーマットにも対応可能です。

## その他

ディレクトリ構成は以下の公式テンプレートを利用しています。

`sls create -t aws-nodejs-typescript -p [任意のディレクトリ名]` でプロジェクトの初期構成を作成して、そこから微調整しています。

https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates/aws-nodejs-typescript
