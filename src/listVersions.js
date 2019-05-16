const AWS = require('aws-sdk');
const { logger } = require('./logger');

/**
 * List the versions ids for the secret specified
 * @param secretName
 * @param maxResults
 * @param region
 */
const listVersions = async (secretName, maxResults = 10, region = 'us-east-1') => {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region,
  });

  const secretVersions = await client.listSecretVersionIds({
    SecretId: secretName,
    MaxResults: maxResults,
    IncludeDeprecated: true,
  }).promise();

  logger.info('%O', secretVersions);

  return secretVersions;
};

module.exports = { listVersions };
