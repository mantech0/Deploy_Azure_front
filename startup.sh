#!/bin/bash

# デバッグ情報の出力
set -x

# 環境変数の設定
export PORT=${PORT:-3000}

# アプリケーションの起動
cd /home/site/wwwroot
node .next/standalone/server.js 