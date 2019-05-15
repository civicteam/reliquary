# Reliquary

## Summary

This is an auxiliary tool to manage secrets in AWS Secrets Manager

It allows to fetch secrets, the current one and store it locally for edition

It allows to update the secrets through the tool and validate the JSON with any tool available to edit JSON

Do not update the secrets by AWS Console it is prone to errors!

This tool automatically adds to the .gitignore an .secrets to avoid pushing the folder to GIT

## Setup
```sh
npm install
```

## CLI Options

-f, --fetch-secrets

Operation to fetch the secrets

It creates on .secrets/current.json the AWSCURRENT version


-u, --update-secrets

Operation to update the secrets

It creates on .secrets/secret-version-id.json an local backup

It updates on AWS the secrets than it writes to current.json

-r, --region [value]

AWS Region, make sure to have the AWS CLI configured with the proper tokens

-n, --secret-name [value]

The secret name on Secrets Manager

-s, --secret-string [value]

The secret string on Secrets Manager

-p, --secret-path [value]

The secret file path containing the value of the secrets

-v --verbose

The log is output in debug mode, with more information

-i --secret-version-id [value]

The secret version id, use list to show possible values

## Usage

Fetching secrets

```sh
node src/index.js --fetch-secrets -n reliquary-test
```

Fetching secrets with different region

```sh
node src/index.js --fetch-secrets -n reliquary-test -r us-east-2
```

Updating secrets by reading an local file

```sh
node src/index.js --update-secrets -n reliquary-test -p .secrets/current.json
```


Listing versions of stored secrets, exhibits by default the last 10 records

```sh
node src/index.js --list-secrets
```
