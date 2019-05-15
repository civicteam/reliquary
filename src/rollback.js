const AWS = require('aws-sdk');
const { update } = require('./updater');
const { logger } = require('./logger');

const rollback = (secretName, versionId, region = 'us-east-1') => {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region,
  });

  if (!versionId) {
    throw new Error('Version ID is necessary');
  }

  logger.debug(`Rollback to ${secretName} and version ${versionId} started`);

  client.getSecretValue({ SecretId: secretName, VersionId: versionId }, (err, data) => {
    if (err) {
      throw err;
    } else {
      logger.debug(`Rollback: Secret fetched ${data}`);

      update(secretName, data.SecretString, region);
    }
  });
};

module.exports = { rollback };
