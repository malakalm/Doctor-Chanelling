
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Doc Channeling API',
      version: '1.0.0',
      description: 'API documentation',
    },
    tags: [
      {
        name: 'Users',
        description: 'Operations related to users',
      },
      {
        name: 'Appointments',
        description: 'Doctor appointment routes',
      },
    ],
    servers: [{ url: 'https://api.pixelperfect.lk' }],
  },
  apis: ['./src/route/*.mjs'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;