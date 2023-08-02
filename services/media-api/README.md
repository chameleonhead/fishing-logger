<!--
title: CATCH
description: This example shows your how to create a TypeScript powered HTTP API with DynamoDB.
layout: Doc
framework: v1
platform: AWS
language: nodeJS
authorLink: 'https://github.com/QuantumInformation'
authorName: Nikos
authorAvatar: 'https://avatars0.githubusercontent.com/u/216566?v=4&s=140'
-->

# Introduction

TypeScript (ts) offers type safety which is helpful when working with the AWS SDK, which comes with ts definitions (d.ts)

# compiling

You can compile the ts files in this directory by 1st installing typescript via

`npm install -g typescript`

then

`npm i`

You can then run the compiler by running `tsc` in this directory. It will pull the settings from .tsconfig and extra @types
from package.json. The output create.js file is what will be uploaded by serverless.

For brevity, I have just demonstrated this to match with the catches/create.js, catches/list.js, catches/get.js and catches/update.js lambda function

## Usage

You can create, retrieve, update, or delete catches with the following commands:

### Create a catch

```bash
curl -X POST https://XXXXXXX.execute-api.us-east-1.amazonaws.com/catches --data '{ "text": "Learn Serverless" }'
```

Example Result:
```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","created_at":1479138570824,"checked":false,"updated_at":1479138570824}%
```

### List all Catches

```bash
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/catches
```

Example output:
```bash
[{"text":"Deploy my first service","id":"ac90feaa11e6-9ede-afdfa051af86","checked":true,"updated_at":1479139961304},{"text":"Learn Serverless","id":"206793aa11e6-9ede-afdfa051af86","created_at":1479139943241,"checked":false,"updated_at":1479139943241}]%
```

### Get one catch

```bash
# Replace the <id> part with a real id from your catches table
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/catches/<id>
```

Example Result:
```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","created_at":1479138570824,"checked":false,"updated_at":1479138570824}%
```

### Update a catch

```bash
# Replace the <id> part with a real id from your catches table
curl -X PUT https://XXXXXXX.execute-api.us-east-1.amazonaws.com/catches/<id> --data '{ "text": "Learn Serverless", "checked": true }'
```

Example Result:
```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","created_at":1479138570824,"checked":true,"updated_at":1479138570824}%
```
