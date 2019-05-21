const AWS = require('aws-sdk');
const fs = require('fs');
const { logger } = require('./logger');

/**
 * Retrieves the secret from AWS and write it down on .secrets folder
 * @param secretName
 * @param region
 * @returns secretValue
 */
const fetch = async (secretName, region = 'us-east-1') => {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region,
  });

  const secretValue = await client.getSecretValue({ SecretId: secretName }).promise();

  // Decrypts secret using the associated KMS CMK.
  // Depending on whether the secret is a string or binary, one of these fields will
  // be populated.
  const secretsContent = secretValue.SecretString;

  const secretsDir = '.secrets';
  if (!fs.existsSync(secretsDir)) {
    fs.mkdirSync(secretsDir);
  }

  const oldVersionExists = fs.existsSync(`.secrets/${secretValue.VersionId}.json`);

  // making it readable for developers
  const formattedContent = JSON.stringify(JSON.parse(secretsContent), null, 2);

  // this will only write once, since the version changes at every update
  if (!oldVersionExists) {
    fs.writeFileSync(`.secrets/${secretValue.VersionId}.json`, formattedContent);
    logger.info(`Local backup created at ./secrets/${secretValue.VersionId}`);
  }

  // the developer should always point to the current.json for the latest secrets
  fs.writeFileSync('.secrets/current.json', formattedContent, { encoding: 'utf8', flag: 'w' });

  // update gitignore
  const gitIgnoreContent = fs.readFileSync('.gitignore', 'utf8');
  if (!gitIgnoreContent.includes('.secrets')) {
    fs.appendFileSync('.gitignore', '.secrets');
  }

  logger.debug(secretValue);
  logger.info('Current version created at ./secrets/current');

  return secretValue;
};

module.exports = { fetch };
