const AWS = require('aws-sdk-mock');
const fs = require('fs');
const { fetch } = require('../src/fetcher');

jest.mock('fs');

describe('Tests for the fetching methods', () => {
  beforeAll(() => {
    AWS.mock('SecretsManager', 'getSecretValue', (params, callback) => {
      callback(null, {
        SecretString: '{"dev": {"secret1": "d1","secret2": "d2","secret3": "d3"}}',
      });
    });
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.REGION;
  });

  afterAll(() => {
    AWS.restore('SecretsManager');
  });

  it('Should fetch an secret and write it on the current.json', () => {
    fetch('test');

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});
