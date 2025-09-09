import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'AdoptMe API',
      description: 'Documentación del módulo Users',
      version: '1.0.0'
    }
  },
  
  apis: [
  './src/docs/users.yaml',
  './src/docs/pets.yaml',
  './src/docs/adoptions.yaml'
]
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export default {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpecs)
};