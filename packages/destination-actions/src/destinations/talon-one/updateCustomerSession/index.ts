import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'
import { attribute, attributesInfo, cardItems, customerProfileId } from '../t1-properties'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Update Customer Sessions',
  description: 'This updates a customer session.',
  fields: {
    customerSessionId: {
      label: 'Customer Session ID',
      description: 'The customer session integration identifier to use in Talon.One.',
      type: 'string',
      required: true
    },
    callbackDestination: {
      label: 'Callback Destination URI',
      description: 'This specifies the address of the service and its endpoint to do callback request.',
      type: 'string',
      placeholder: 'http://mydomain.com/api/callback_here'
    },
    callbackAPIKey: {
      type: 'string',
      label: 'Callback API Key',
      description: 'This specifies API key and relative header. The header is specified optionally',
      placeholder: 'X-API-Key 123456789123456789123456789123456789'
    },
    callbackForwardedFields: {
      type: 'string',
      label: 'Callback Forwarded Fields',
      description:
        'This specifies a list of the fields from the response you need to receive. Comma character is separator. If omitted, all the fields will be forwarded from the response.',
      placeholder: 'effects,customerProfile',
      default: 'effects'
    },
    callbackCorrelationId: {
      type: 'string',
      label: 'Correlation ID',
      description:
        'This specifies ID of the request that will be forwarded to the destination URI with the callback request with the same header name. If omitted, the X-Correlation-ID will not be in the callback request.'
    },
    customerSession: {
      label: 'Customer Profile ID',
      description: 'This contains all the data related to customer session.',
      type: 'object',
      required: true,
      properties: {
        profileId: { ...customerProfileId, required: false },
        couponCodes: {
          label: 'Coupon Codes',
          description: 'Any coupon codes entered. Up to 100 coupons.`',
          type: 'string',
          multiple: true
        },
        referralCode: {
          label: 'Referral Codes',
          description: 'Any referral code entered.`',
          type: 'string'
        },
        loyaltyCards: {
          label: 'Referral Codes',
          description: 'Any loyalty cards used. Up to 1 loyalty cards.`',
          type: 'string',
          multiple: true
        },
        state: {
          label: 'State',
          description: 'Indicates the current state of the session. `',
          type: 'string',
          choices: [
            { label: 'Open', value: 'open' },
            { label: 'Closed', value: 'closed' },
            { label: 'Partially returned', value: 'partially_returned' },
            { label: 'Cancelled', value: 'cancelled' }
          ]
        },
        cardItems: { ...cardItems },
        additionalCosts: {
          label: 'Additional Costs',
          description:
            'Use this property to set a value for the additional costs of this session, such as a shipping cost.`',
          type: 'object'
        },
        attributes: {
          ...attribute,
          default: {
            '@path': '$.properties.attributes'
          },
          description:
            'Use this property to set a value for the attributes of your choice. Attributes represent any information to attach to your session, like the shipping city. [See more info](https://docs.talon.one/docs/product/account/dev-tools/managing-attributes).'
        }
      }
    },
    sessionAttributesInfo: { ...attributesInfo },
    cartItemsAttributesInfo: { ...attributesInfo }
  },
  perform: (request, { payload }) => {
    // if (payload.customerSession.cardItems) {
    //   for (let i = 0; i < payload.customerSession.cardItems.length; i++) {
    //     const item = payload.customerSession.cardItems[i]
    //
    //     if (!item.name || !item.sku || !item.price || !item.quantity) {
    //       throw new IntegrationError(
    //         `card item must include an 'name', 'sku', 'price' and 'quantity' parameters.`,
    //         'Misconfigured required field',
    //         400
    //       )
    //     }
    //   }
    // }

    return request(`https://integration.talon.one/segment/customer_sessions/${payload.customerSessionId}`, {
      method: 'put',
      headers: {
        'X-Callback-Destination-URI': `${payload.callbackDestination}`,
        'X-Callback-API-Key': `${payload.callbackAPIKey}`,
        'X-Callback-Forwarded-Fields': `${payload.callbackForwardedFields}`,
        'X-Correlation-ID': `${payload.callbackCorrelationId}`
      },
      json: {
        customerSession: payload.customerSession,
        sessionAttributesInfo: payload.sessionAttributesInfo,
        cartItemAttributesInfo: payload.cartItemsAttributesInfo
      }
    })
  }
}

export default action
