# Ships API

## 概要

船は漁船を想定する。船には各種センサーが載っており、そのデータを収集することを主目的とする。

## データ項目

**Ship**

| 項目名 | データ型 | 必須 | 説明｜                              |
| ------ | -------- | ---- | ----------------------------------- |
| id     | string   | ✓    | 本サービス内で一意となる ID（UUID） |
| name   | string   | ✓    | 船名                                |

**ShipRegistration**

| 項目名         | データ型 | 必須 | 説明｜                              |
| -------------- | -------- | ---- | ----------------------------------- |
| id             | string   | ✓    | 本サービス内で一意となる ID（UUID） |
| ship_id        | string   | ✓    | Ship の ID                          |
| csr            | string   | ✓    | 証明書を登録する際の CSR            |
| thing_id       | string   |      | AWS IoT でのモノの ID               |
| certificate_id | string   |      | 証明書の ID                         |
| attached       | boolean  | ✓    | モノに証明書を割り当てたかどうか    |

## API

### 船のリスト取得

#### 要求

`GET /api/ships`

#### 回答

**200 OK**

| 項目名 | データ型 | 必須 | 説明｜   |
| ------ | -------- | ---- | -------- |
| ships  | Ship[]   | ✓    | 船の一覧 |

### 船登録

#### 要求

`POST /api/ships/register`

**Request Body**

| 項目名 | データ型 | 必須 | 説明｜                             |
| ------ | -------- | ---- | ---------------------------------- |
| name   | string   | ✓    | 船名                               |
| csr    | string   | ✓    | AWS IoT に証明書を登録する際の CSR |

#### 回答

**201 Created**

| 項目名 | データ型 | 必須 | 説明｜  |
| ------ | -------- | ---- | ------- |
| id     | string   | ✓    | 船の ID |

### 船取得

#### 要求

`GET /api/ships/{shipId}`

**Request Parameter**

| 項目名 | データ型 | 必須 | 説明｜  |
| ------ | -------- | ---- | ------- |
| shipId | string   | ✓    | 船の ID |

#### 回答

**200 OK**

| 項目名 | データ型 | 必須 | 説明｜  |
| ------ | -------- | ---- | ------- |
| id     | string   | ✓    | 船の ID |
| name   | string   | ✓    | 船名    |

### 船の IoT 設定取得

#### 要求

`GET /api/ships/{shipId}/iot-config`

**Request Parameter**

| 項目名 | データ型 | 必須 | 説明｜  |
| ------ | -------- | ---- | ------- |
| shipId | string   | ✓    | 船の ID |

#### 回答

**200 OK**

| 項目名             | データ型 | 必須 | 説明｜                                  |
| ------------------ | -------- | ---- | --------------------------------------- |
| id                 | string   | ✓    | 船の ID                                 |
| csr                | string   | ✓    | 証明書を登録する際の CSR                |
| iot_endpoint       | string   | ✓    | AWS IoT Core のエンドポイント(ホスト名) |
| thing_id           | string   | ✓    | AWS IoT でのモノの ID                   |
| certificate_pem    | string   | ✓    | 証明書                                  |
| ca_certificate_pem | string   | ✓    | AWS IoT のルート CA 証明書              |

### 船の IoT 設定取得

#### 要求

`PUT /api/ships/{shipId}/iot-config`

**Request Parameter**

| 項目名 | データ型 | 必須 | 説明｜  |
| ------ | -------- | ---- | ------- |
| shipId | string   | ✓    | 船の ID |

**Request Body**

| 項目名 | データ型 | 必須 | 説明｜                             |
| ------ | -------- | ---- | ---------------------------------- |
| csr    | string   | ✓    | AWS IoT に証明書を登録する際の CSR |

#### 回答

**201 Created**

コンテンツなし

### 船の更新

#### 要求

`PUT /api/ships/{shipId}`

**Request Parameter**

| 項目名 | データ型 | 必須 | 説明｜  |
| ------ | -------- | ---- | ------- |
| shipId | string   | ✓    | 船の ID |

**Request Body**

| 項目名 | データ型 | 必須 | 説明｜ |
| ------ | -------- | ---- | ------ |
| name   | string   | ✓    | 船名   |

#### 回答

**204 No Content**

コンテンツなし
