const AWS = require('aws-sdk-mock');
const { listVersions } = require('../src/listVersions');

jest.mock('fs');

describe('Tests for the list versions methods', () => {
  beforeAll(() => {
    AWS.mock('SecretsManager', 'listSecretVersionIds', (params, callback) => {
      callback(null, {
        Versions: [{
          VersionId: '1d7ea461-066d-4e78-9c97-ccbbf27ba660',
          LastAccessedDate: '2019 - 05 - 13 T00: 00: 00.000 Z',
          CreatedDate: '2019 - 05 - 13 T13: 36: 40.566 Z',
        },
        ],
        NextToken: 'dummy',
        ARN: 'arn:aws:secretsmanager:us-east-1:99999999999:secret:dummy',
        Name: 'dummy',
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
    const listing = await listVersions('test');
    expect(listing).toBeDefined();
    expect(listing.Versions).toBeDefined();
    expect(listing.ARN).toBeDefined();
    expect(listing.Name).toBeDefined();
    done();
  });
});
