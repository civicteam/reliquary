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

  it('Should fetch an secret and write it on the current.json', async () => {
    const mock = jest.spyOn(fs, 'readFileSync');
    mock.mockImplementation(() => '');

    const secret = await fetch('test');

    expect(secret).toBeDefined();
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('Should fetch an secret and write it on the current.json when an old version exists', async () => {
    const mock = jest.spyOn(fs, 'readFileSync');
    mock.mockImplementation(() => '.secrets');

    const mock2 = jest.spyOn(fs, 'existsSync');
    mock2.mockImplementation(() => true);

    const secret = await fetch('test');

    expect(secret).toBeDefined();
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});
