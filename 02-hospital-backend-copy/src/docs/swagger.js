const swaggerUi = require('swagger-ui-express');

const errorResponse = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    code: { type: 'string' },
    requestId: { type: 'string' },
    errors: { type: 'array', items: { type: 'object' } },
  },
};

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Hospital Backend API',
    version: '3.0.0',
    description:
      'Hospital booking API — Express + Prisma + JWT + RBAC + Redis cache + BullMQ. P3 Engineering edition.',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8, maxLength: 72 },
          name: { type: 'string' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      RefreshRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
      PatientCreate: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
        },
      },
      DoctorCreate: {
        type: 'object',
        required: ['name', 'specialty', 'email'],
        properties: {
          name: { type: 'string' },
          specialty: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
      AppointmentCreate: {
        type: 'object',
        required: ['patientId', 'doctorId', 'time'],
        properties: {
          patientId: { type: 'integer' },
          doctorId: { type: 'integer' },
          time: { type: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$', example: '09:30' },
          status: { type: 'string', enum: ['booked', 'cancelled', 'completed'] },
          note: { type: 'string' },
          appointmentDate: { type: 'string', format: 'date' },
          contact: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              phone: { type: 'string' },
            },
          },
          symptoms: { type: 'array', items: { type: 'string' } },
        },
      },
      ErrorResponse: errorResponse,
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        security: [],
        tags: ['System'],
        summary: 'Liveness health check',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    service: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/ready': {
      get: {
        security: [],
        tags: ['System'],
        summary: 'Readiness — checks database',
        responses: {
          200: { description: 'Ready' },
          503: { description: 'Not ready', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/auth/register': {
      post: {
        security: [],
        tags: ['Auth'],
        summary: 'Register patient user',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } },
          },
        },
        responses: {
          201: { description: 'Created' },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          409: { description: 'Email exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        security: [],
        tags: ['Auth'],
        summary: 'Login — returns accessToken + refreshToken',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } },
          },
        },
        responses: {
          200: { description: 'OK' },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/auth/refresh': {
      post: {
        security: [],
        tags: ['Auth'],
        summary: 'Refresh tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RefreshRequest' } },
          },
        },
        responses: {
          200: { description: 'OK' },
          401: { description: 'Invalid/expired refresh', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/patients': {
      get: {
        tags: ['Patients'],
        summary: 'List patients (page, limit, search, sortBy, sortOrder)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      post: {
        tags: ['Patients'],
        summary: 'Create patient (admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PatientCreate' } },
          },
        },
        responses: {
          201: { description: 'Created' },
          400: { description: 'Validation', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/doctors': {
      get: {
        tags: ['Doctors'],
        summary: 'List doctors',
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Doctors'],
        summary: 'Create doctor (admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/DoctorCreate' } },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/appointments': {
      get: {
        tags: ['Appointments'],
        summary: 'List appointments (filter/search/pagination) — cached',
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Appointments'],
        summary: 'Book appointment — enqueues notify job',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/AppointmentCreate' } },
          },
        },
        responses: {
          201: { description: 'Created' },
          409: { description: 'Double booking', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/appointments/stats': {
      get: {
        tags: ['Appointments'],
        summary: 'Stats by status (admin / stats:read) — cached',
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};

function setupSwagger(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
}

module.exports = { setupSwagger, openApiSpec };
