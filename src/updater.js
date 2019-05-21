// Load the AWS SDK
const AWS = require('aws-sdk');
const fs = require('fs');
const { logger } = require('./logger');

/**
 * Method responsible for updating the secrets
 * First it creates an local copy
 * Then it updates the secrets on AWS
 * Then it updates the current local version
 *
 * @param secretName
 * @param secretString the content of
 * @param region
 * @return secretValue
 */
const update = async (secretName, secretString, region = 'us-east-1') => {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region,
  });

  // validate that the secretString is an valid JSON
  try {
    JSON.parse(secretString);
  } catch (err) {
    throw new Error('The JSON to update the secret is invalid');
  }

  const secretValue = await client.updateSecret({
    SecretId: secretName,
    SecretString: secretString,
  }).promise();

  fs.writeFileSync(`.secrets/${secretValue.VersionId}.json`, secretString);

  logger.info(`Local backup created at ./secrets/${secretValue.VersionId}`);

  // the developer should always point to the current.json for the latest secrets
  fs.writeFileSync('.secrets/current.json', JSON.stringify(JSON.parse(secretString), null, 2),
    { encoding: 'utf8', flag: 'w' });

  logger.debug(secretValue);
  logger.info('Updated the current version with the newest one');

  return secretValue;
};

module.exports = { update };
