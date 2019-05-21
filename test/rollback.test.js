const AWS = require('aws-sdk-mock');
const fs = require('fs');
const { rollback } = require('../src/rollback');

jest.mock('fs');

describe('Tests for the rollback methods', () => {
  beforeAll(() => {
    AWS.mock('SecretsManager', 'getSecretValue', (params, callback) => {
      callback(null, {
        SecretString: '{"dev": {"secret1": "d1","secret2": "d2","secret3": "d3"}}',
      });
    });

    AWS.mock('SecretsManager', 'updateSecret', (params, callback) => {
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

  it('Should rollback an secret and write it on the current.json', async (done) => {
    const secret = await rollback('test', 'test');

    expect(secret).toBeDefined();
    expect(fs.writeFileSync).toHaveBeenCalled();

    done();
  });

  it('Should throw an error when not sending the right version id', () => {
    expect((done) => {
      rollback('test');
      done();
    }).toThrow();
  });
});
