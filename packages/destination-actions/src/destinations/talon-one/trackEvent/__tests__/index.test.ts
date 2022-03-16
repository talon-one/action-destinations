import { createTestIntegration } from '@segment/actions-core'
import Destination from '../../index'
import nock from 'nock'

const testDestination = createTestIntegration(Destination)

describe('TalonOne.trackEvent', () => {
  it('customer_profile_id is missing', async () => {
    try {
      await testDestination.testAction('trackEvent', {
        settings: {
          api_key: 'some_api_key',
          deployment: 'https://internal.europe-west1.talon.one'
        }
      })
    } catch (err) {
      expect(err.message).toContain("The root value is missing the required field 'customerProfileId'.")
    }
  })

  it('eventType is missing', async () => {
    try {
      await testDestination.testAction('trackEvent', {
        settings: {
          api_key: 'some_api_key',
          deployment: 'https://internal.europe-west1.talon.one'
        },
        mapping: {
          customerProfileId: 'some_customer_profile_id'
        }
      })
    } catch (err) {
      expect(err.message).toContain("The root value is missing the required field 'eventType'.")
    }
  })

  it('type is missing', async () => {
    try {
      await testDestination.testAction('trackEvent', {
        settings: {
          api_key: 'some_api_key',
          deployment: 'https://internal.europe-west1.talon.one'
        },
        mapping: {
          customerProfileId: 'some_customer_profile_id',
          eventType: 'event_type'
        }
      })
    } catch (err) {
      expect(err.message).toContain("The root value is missing the required field 'type'.")
    }
  })

  it('should work', async () => {
    nock('https://integration.talon.one')
      .put('/segment/event', {
        customerProfileId: 'some_customer_profile_id',
        eventType: 'event_type',
        type: 'string',
        attributes: {
          favoriteProduct: 'fruits',
          isDogLover: true
        }
      })
      .matchHeader('Authorization', 'ApiKey-v1 some_api_key')
      .matchHeader('destination-hostname', 'https://something.europe-west1.talon.one')
      .reply(200)

    await testDestination.testAction('trackEvent', {
      settings: {
        api_key: 'some_api_key',
        deployment: 'https://something.europe-west1.talon.one'
      },
      mapping: {
        customerProfileId: 'some_customer_profile_id',
        eventType: 'event_type',
        type: 'string',
        attributes: {
          favoriteProduct: 'fruits',
          isDogLover: true
        }
      }
    })
  })
})
