// Load the AWS SDK
const AWS = require('aws-sdk');
const fs = require('fs');

/**
 * Method responsible for updating the secrets
 * First it creates an local copy
 * Then it updates the secrets on AWS
 * Then it updates the current local version
 *
 * @param secretName
 * @param secretString the content of
 * @param region
 */
const update = (secretName, secretString, region = 'us-east-1') => {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region,
  });

  const secretStringProcessed = secretString.replace(/\\n/g, '');

  // validate that the secretString is an valid JSON
  try {
    JSON.parse(secretStringProcessed);
  } catch (err) {
    console.log(err.message);
    throw new Error('The JSON to update the secret is invalid');
  }

  client.updateSecret({ SecretId: secretName, SecretString: secretStringProcessed },
    (err, data) => {
      if (err) {
        throw err;
      } else {
        fs.writeFile(`.secrets/${data.VersionId}.json`, secretStringProcessed, (err2) => {
          if (err2) throw err2;
          console.log(`Local backup created at ./secrets/${data.VersionId}`);
        });

        // the developer should always point to the current.json for the latest secrets
        fs.writeFileSync('.secrets/current.json', secretStringProcessed, { encoding: 'utf8', flag: 'w' });

        console.log(data);
        console.log('Updated the current version with the newest one');
      }
    });
};

module.exports = { update };
