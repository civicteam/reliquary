const program = require('commander');
const fs = require('fs');

const { fetch } = require('./fetcher');
const { update } = require('./updater');

program
  .option('-f, --fetch-secrets', 'Operation to fetch the secrets')
  .option('-u, --update-secrets', 'Operation to update the secrets')
  .option('-r, --region [value]', 'AWS Region, make sure to have the AWS CLI configured with the proper tokens')
  .option('-n, --secret-name [value]', 'The secret name on Secrets Manager')
  .option('-s, --secret-string [value]', 'The secret string on Secrets Manager')
  .option('-p, --secret-path [value]', 'The secret file path containing the value of the secrets')
  .parse(process.argv);

if (!program.secretName) {
  throw new Error('Secret Name is necessary, pass it on with -sn command parameter');
}

if (program.fetchSecrets) {
  fetch(program.secretName, program.region);
}

if (program.updateSecrets) {
  let secretContent = program.secretString;
  if (program.secretPath) {
    secretContent = fs.readFileSync(program.secretPath, 'utf-8');
  }

  update(program.secretName, secretContent, program.region);
}
