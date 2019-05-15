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
        NextToken: 'AAGWzGu7c3fnjy994XFY80EKjACAkQA3jPXB5sokoh0+PEQgQ+UY7OiiU0yt2WIfHhNLenRUW7cy1X+okG6qkgsEBvqO3kxmm7tzq+awLyWUPVF4wbmXVYdxYHXyiMMzGlR884DfhX3uYJU35BAAAXTkB6pAu5c2U71zGAskNco34Ev1O7GBIPqV56qjBXpWp1n6AAIUDPxgdfz2CkzbN21ZPO48aHkA4OTAyZmriB26wTerot72pgLSS6ze+3RZzk0BdFU/jmXO54g3b/GQetQKBD2X2CCvUfu6zo92gaar',
        ARN: 'arn:aws:secretsmanager:us-east-1:249634870252:secret:reliquary-test-GRIQNJ',
        Name: 'reliquary-test',
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

  it('Should rollback an secret and write it on the current.json', () => {
    listVersions('test');
  });
});
