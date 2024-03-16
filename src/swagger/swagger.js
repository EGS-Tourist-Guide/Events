import swaggerJSDoc from 'swagger-jsdoc';
import config from '../config/config.js';

// Event schema definition for requests
const eventRequest = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'Event Name'
    },
    organizer: {
      type: 'string',
      example: 'Organizer Name'
    },
    street: {
      type: 'string',
      example: 'Street Name'
    },
    doornumber: {
      type: 'string',
      example: '123'
    },
    postcode: {
      type: 'string',
      example: '1234-567'
    },
    city: {
      type: 'string',
      example: 'City Name'
    },
    country: {
      type: 'string',
      example: 'Country Name'
    },
    contact: {
      type: 'string',
      format: 'email',
      example: 'organizer@example.com'
    },
    category: {
      type: 'string',
      enum: config.server.allowedCategories,
      example: 'technology'
    },
    startdate: {
      type: 'string',
      format: 'date-time',
      example: '2024-04-07T20:00:00.001Z'
    },
    enddate: {
      type: 'string',
      format: 'date-time',
      example: '2024-04-07T22:00:00.001Z'
    },
    about: {
      type: 'string',
      example: 'Event description'
    },
    price: {
      type: 'string',
      pattern: '^(EUR|USD|GBP)\d+\.\d{2}$',
      example: 'EUR25.55'
    },
    pointofinterest: {
      type: 'string',
      example: 'Point of interest'
    },
    maxparticipants: {
      type: 'integer',
      format: 'int32',
      minimum: 0,
      maximum: 9999999999,
      example: 100
    },
    currentparticipants: {
      type: 'integer',
      format: 'int32',
      minimum: 0,
      maximum: 9999999999,
      example: 25
    }
  },
  required: [
    'name',
    'organizer',
    'street',
    'doornumber',
    'postcode',
    'city',
    'country',
    'contact',
    'category',
    'startdate',
    'enddate',
    'about']
};

// Event schema definition for responses
const eventResponse = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      format: 'uuid',
      example: 'd290f1ee-6c54-4b01-90e6-d701748f0851'
    },
    name: {
      type: 'string',
      example: 'Event Name'
    },
    organizer: {
      type: 'string',
      example: 'Organizer Name'
    },
    street: {
      type: 'string',
      example: 'Street Name'
    },
    doornumber: {
      type: 'string',
      example: '123'
    },
    postcode: {
      type: 'string',
      example: '1234-567'
    },
    city: {
      type: 'string',
      example: 'City Name'
    },
    country: {
      type: 'string',
      example: 'Country Name'
    },
    contact: {
      type: 'string',
      format: 'email',
      example: 'organizer@example.com'
    },
    category: {
      type: 'string',
      enum: config.server.allowedCategories,
      example: 'technology'
    },
    startdate: {
      type: 'string',
      format: 'date-time',
      example: '2024-04-07T20:00:00.001Z'
    },
    enddate: {
      type: 'string',
      format: 'date-time',
      example: '2024-04-07T22:00:00.001Z'
    },
    about: {
      type: 'string',
      example: 'Event description'
    },
    price: {
      type: 'number',
      minimum: 0,
      example: 25.55
    },
    currency: {
      type: 'string',
      enum: ['EUR', 'USD', 'GBP'],
      example: 'EUR'
    },
    favorites: {
      type: 'integer',
      format: 'int32',
      minimum: 0,
      maximum: 9999999999,
      example: 100
    },
    created: {
      type: 'string',
      format: 'date-time',
      example: '2024-04-07T20:00:00.001Z'
    },
    pointofinterest: {
      type: 'string',
      example: 'Point of interest'
    },
    maxparticipants: {
      type: 'integer',
      format: 'int32',
      minimum: 0,
      maximum: 9999999999,
      example: 100
    },
    currentparticipants: {
      type: 'integer',
      format: 'int32',
      minimum: 0,
      maximum: 9999999999,
      example: 25
    }
  },
  required: [
    '_id',
    'name',
    'organizer',
    'street',
    'doornumber',
    'postcode',
    'city',
    'country',
    'contact',
    'category',
    'startdate',
    'enddate',
    'about',
    'price',
    'currency',
    'favorites',
    'created'
  ]
};

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Event Service API',
    version: '1.0.0',
    description: 'API that exposes endpoints for an event managing microservice',
    name: 'Luís Couto',
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    },
    contact: {
      name: 'Luís Couto',
      email: 'luiscouto10@ua.pt'
    }
  },
  tags: [
    {
      name: 'Events',
      description: 'Operations available for Events'
    },
    {
      name: 'Files',
      description: 'Operations available for Files'
    }
  ],
  security: {
    ApiKeyAuth: []
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'SERVICE-API-KEY'
      }
    },
    schemas: {
      Event_Request: eventRequest,
      Event_Response: eventResponse
    },
    responses: {
      Unauthorized: {
        description: 'The API key is missing or invalid',
        content: {
          'application/json': {
            description: 'The API key is missing or invalid',
          }
        },
        headers: {
          WWW_Authenticate: {
            description: 'API Key',
            schema: {
              type: 'string'
            }
          }
        }
      }
    }
  },
};

// Options for the swagger specification
const options = {
  swaggerDefinition,
  apis: ['src/routes/*.js']
};

// Generate the swagger specification
const swaggerSpec = swaggerJSDoc(options);

// Export the swagger specification
export default swaggerSpec;
