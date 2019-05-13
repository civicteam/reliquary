const AWS = require('aws-sdk');
const fs = require('fs');

const fetch = (secretName, region = 'us-east-1') => {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region,
  });

  client.getSecretValue({ SecretId: secretName }, (err, data) => {
    if (err) {
      throw err;
    } else {
      // Decrypts secret using the associated KMS CMK.
      // Depending on whether the secret is a string or binary, one of these fields will
      // be populated.
      const secretsContent = data.SecretString;

      const secretsDir = '.secrets';
      if (!fs.existsSync(secretsDir)) {
        fs.mkdirSync(secretsDir);
      }

      const oldVersionExists = fs.existsSync(`.secrets/${data.VersionId}.json`);

      // making it readable for developers
      const formattedContent = JSON.stringify(JSON.parse(secretsContent), null, 2);

      // this will only write once, since the version changes at every update
      if (!oldVersionExists) {
        fs.writeFile(`.secrets/${data.VersionId}.json`, formattedContent, (err2) => {
          if (err2) throw err2;
          console.log(`Local backup created at ./secrets/${data.VersionId}`);
        });
      }

      // the developer should always point to the current.json for the latest secrets
      fs.writeFileSync('.secrets/current.json', formattedContent, { encoding: 'utf8', flag: 'w' });

      // update gitignore
      const gitIgnoreContent = fs.readFileSync('.gitignore', 'utf8');
      if (!gitIgnoreContent.includes('.secrets')) {
        fs.appendFileSync('.gitignore', '.secrets');
      }

      console.log(data);
      console.log('Current version created at ./secrets/current');
    }
  });
};

module.exports = { fetch };
