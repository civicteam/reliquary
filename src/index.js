const program = require('commander');
const fs = require('fs');

const { fetch } = require('./fetcher');
const { update } = require('./updater');
const { listVersions } = require('./listVersions');
const { rollback } = require('./rollback');
const { transportsDefinition, logger } = require('./logger');

program
  .option('-f, --fetch-secrets', 'Operation to fetch the secrets')
  .option('-u, --update-secrets', 'Operation to update the secrets')
  .option('-l, --list-secrets', 'Operation to get the list of possible secrets versions')
  .option('-b, --rollback-secrets', 'Operation to replace an secret with an previous version')
  .option('-r, --region [value]', 'AWS Region, make sure to have the AWS CLI configured with the proper tokens')
  .option('-n, --secret-name [value]', 'The secret name on Secrets Manager')
  .option('-p, --secret-path [value]', 'The secret file path containing the value of the secrets')
  .option('-i, --secret-version-id [value]', 'The secret version id, use list to show possible values')
  .option('-v, --verbose', 'Output the log in debug mode')
  .parse(process.argv);

// two here means it is only the node command and the index.js file, without parameters
if (!program.rawArgs.length || program.rawArgs.length === 2) {
  program.help();
  process.exit();
}

if (!program.fetchSecrets && !program.updateSecrets && !program.listSecrets
  && !program.rollbackSecrets) {
  logger.error('An operation is required: fetch, list, update or rollback');
  process.exit();
}

if (!program.secretName) {
  logger.error('Secret Name is necessary, pass it on with -n command parameter');
  process.exit();
}

if (program.verbose) {
  transportsDefinition.console.level = 'debug';
}

if (program.fetchSecrets) {
  fetch(program.secretName, program.region);
} else if (program.updateSecrets) {
  if (!program.secretPath) {
    logger.error('The path to the secret file is necessary');
    process.exit();
  }
  const secretContent = fs.readFileSync(program.secretPath, 'utf-8');

  update(program.secretName, secretContent, program.region);
} else if (program.listSecrets) {
  listVersions(program.secretName, program.region);
} else if (program.rollbackSecrets) {
  rollback(program.secretName, program.secretVersionId, program.region);
}
