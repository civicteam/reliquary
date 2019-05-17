# Reliquary

## Summary

This is an auxiliary tool to manage secrets in AWS Secrets Manager

It fetches the latest version of a secret and stores it locally to be edited.

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

The "AWSCURRENT" version is downloaded and stored at ` .secrets/current.json`


-u, --update-secrets

Operation to update the secrets

A local backup is stored at `.secrets/<secret-version-id>.json`. The contents of `.secrets/current.json` are then uploaded to AWS.

It updates on AWS the secrets than it writes to current.json

-r, --region [value]

Parameter to set AWS Region, it is optional and defaults to us-east-1

-n, --secret-name [value]

The secret name on Secrets Manager

-p, --secret-path [value]

The secret file path containing the value of the secrets, this is required when using update

-v --verbose

The log is output in debug mode, with more information

-i --secret-version-id [value]

The secret version id, use list to show possible values, when using rollback this is required

## Usage

Fetching secrets

```sh
npm reliquary --fetch-secrets -n <secret-name>
```

Fetching secrets with different region

```sh
npm reliquary --fetch-secrets -n <secret-name> -r <region>
```

Updating secrets by reading an local file

```sh
npm reliquary --update-secrets -n <secret-name> -p <path>
```


Listing versions of stored secrets, exhibits by default the last 10 records

```sh
npm reliquary --list-secrets
```

This should return something like this:

```
{ Versions: 
   [ { VersionId: '1d7ea461-066d-4e78-9c97-ccbbf27ba660',
       LastAccessedDate: '2019 - 05 - 13 T00: 00: 00.000 Z',
       CreatedDate: '2019 - 05 - 13 T13: 36: 40.566 Z' } ],
  NextToken: 'AAGWzGu7c3fnjy994XFY80EKjACAkQA3jPXB5sokoh0+PEQgQ+UY7OiiU0yt2WIfHhNLenRUW7cy1X+okG6qkgsEBvqO3kxmm7tzq+awLyWUPVF4wbmXVYdxYHXyiMMzGlR884DfhX3uYJU35BAAAXTkB6pAu5c2U71zGAskNco34Ev1O7GBIPqV56qjBXpWp1n6AAIUDPxgdfz2CkzbN21ZPO48aHkA4OTAyZmriB26wTerot72pgLSS6ze+3RZzk0BdFU/jmXO54g3b/GQetQKBD2X2CCvUfu6zo92gaar',
  ARN: 'arn:aws:secretsmanager:us-east-1:999999999:secret:example',
  Name: 'example' }
```

Check the CreatedDate and with the VersionId in hands, you can do the rollback with:

```bash
npm reliquary --rollback-secrets -n <secret-name> -i 5617687a-763b-4301-bb23-bda7dd49c3fe
```
