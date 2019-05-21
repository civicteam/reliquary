const AWS = require('aws-sdk');
const { update } = require('./updater');
const { logger } = require('./logger');

/**
 * Rollback the version on the Secrets Manager with the specified one
 * @param secretName
 * @param versionId
 * @param region
 * @returns secretValue returns the secrets value
 */
const rollback = async (secretName, versionId, region = 'us-east-1') => {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region,
  });

  if (!versionId) {
    throw new Error('Version ID is necessary');
  }

  logger.debug(`Rollback to ${secretName} and version ${versionId} started`);

  const secretValue = await client.getSecretValue({
    SecretId: secretName,
    VersionId: versionId,
  }).promise();

  await update(secretName, secretValue.SecretString, region);

  return secretValue;
};

module.exports = { rollback };
