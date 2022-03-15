import { createTestIntegration } from '@segment/actions-core'
import Destination from '../../index'
import nock from 'nock'

const testDestination = createTestIntegration(Destination)

describe('TalonOne.updateCustomerProfile', () => {
  it('request body is missing', async () => {
    try {
      await testDestination.testAction('updateCustomerProfile', {
        settings: {
          api_key: 'some_api_key',
          deployment: 'https://internal.europe-west1.talon.one'
        }
      })
    } catch (err) {
      expect(err.message).toContain('Empty request is submitted')
    }
  })

  it('Missed customer profile ID', async () => {
    try {
      await testDestination.testAction('updateCustomerProfile', {
        settings: {
          api_key: 'some_api_key',
          deployment: 'https://something.europe-west1.talon.one'
        },
        mapping: {
          customerProfileId: '',
          attributes: [],
          audiencesChanges: {
            adds: [],
            deletes: []
          },
          runRuleEngine: true
        }
      })
    } catch (err) {
      expect(err.message).toContain('Not Found')
    }
  })

  it('should work', async () => {
    nock('https://integration.talon.one')
      .put(`/segment/customer_profile/abc123`, {
        attributes: [{ testAttribute1: 'testValue' }],
        audiencesChanges: {
          adds: [1, 2, 3],
          deletes: [4, 5, 6]
        },
        runRuleEngine: true
      })
      .matchHeader('Authorization', 'ApiKey-v1 some_api_key')
      .matchHeader('destination-hostname', 'https://something.europe-west1.talon.one')
      .reply(200)

    await testDestination.testAction('updateCustomerProfile', {
      settings: {
        api_key: 'some_api_key',
        deployment: 'https://something.europe-west1.talon.one'
      },
      mapping: {
        customerProfileId: 'abc123',
        attributes: [{ testAttribute1: 'testValue' }],
        audiencesChanges: {
          adds: [1, 2, 3],
          deletes: [4, 5, 6]
        },
        runRuleEngine: true
      }
    })
  })
})
