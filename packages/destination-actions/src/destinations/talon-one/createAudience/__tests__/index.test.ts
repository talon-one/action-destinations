import { createTestIntegration } from '@segment/actions-core'
import Destination from '../../index'
import nock from 'nock'

const testDestination = createTestIntegration(Destination)

describe('Talon.One - Create Audience', () => {
  it('Audience ID is missing', async () => {
    try {
      await testDestination.testAction('createAudience', {
        settings: {
          apiKey: 'some_api_key',
          deployment: 'https://internal.europe-west1.talon.one'
        }
      })
    } catch (err) {
      expect(err.message).toContain("missing the required field 'audienceId'.")
    }
  })

  it('Audience Name is missing', async () => {
    try {
      await testDestination.testAction('createAudience', {
        settings: {
          apiKey: 'some_api_key',
          deployment: 'https://something.europe-west1.talon.one'
        },
        mapping: {
          audienceId: 'some_audience_id'
        }
      })
    } catch (err) {
      expect(err.message).toContain("missing the required field 'audienceName'.")
    }
  })

  it('Should work', async () => {
    nock('https://integration.talon.one')
      .post('/segment/audiences', {
        audienceId: 'some_audience_id',
        audienceName: 'some_audience_name'
      })
      .matchHeader('Authorization', 'ApiKey-v1 some_api_key')
      .matchHeader('destination-hostname', 'https://something.europe-west1.talon.one')
      .reply(201)

    await testDestination.testAction('createAudience', {
      settings: {
        apiKey: 'some_api_key',
        deployment: 'https://something.europe-west1.talon.one'
      },
      mapping: {
        audienceId: 'some_audience_id',
        audienceName: 'some_audience_name'
      }
    })
  })
})
