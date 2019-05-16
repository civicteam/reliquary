# Reliquary

## Summary

This is an auxiliary tool to manage secrets in AWS Secrets Manager

It allows to fetch secrets, the current one and store it locally for edition

The secrets can also be updated via the tool. The tool assumes the secrets are in JSON form, and performs validation before uploading. This avoids common errors when editing secrets directly in the AWS console.

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

This should return something like this:

```
{ Versions: 
   [ { VersionId: '1d7ea461-066d-4e78-9c97-ccbbf27ba660',
       LastAccessedDate: '2019 - 05 - 13 T00: 00: 00.000 Z',
       CreatedDate: '2019 - 05 - 13 T13: 36: 40.566 Z' } ],
  NextToken: 'AAGWzGu7c3fnjy994XFY80EKjACAkQA3jPXB5sokoh0+PEQgQ+UY7OiiU0yt2WIfHhNLenRUW7cy1X+okG6qkgsEBvqO3kxmm7tzq+awLyWUPVF4wbmXVYdxYHXyiMMzGlR884DfhX3uYJU35BAAAXTkB6pAu5c2U71zGAskNco34Ev1O7GBIPqV56qjBXpWp1n6AAIUDPxgdfz2CkzbN21ZPO48aHkA4OTAyZmriB26wTerot72pgLSS6ze+3RZzk0BdFU/jmXO54g3b/GQetQKBD2X2CCvUfu6zo92gaar',
  ARN: 'arn:aws:secretsmanager:us-east-1:249634870252:secret:reliquary-test-GRIQNJ',
  Name: 'reliquary-test' }
```

Check the CreatedDate and with the VersionId in hands, you can do the rollback with:

```bash
node src/index.js --rollback-secrets -n reliquary-test -i 5617687a-763b-4301-bb23-bda7dd49c3fe
```
