import express from 'express';
import api from './src/route/api.mjs';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.mjs'; // Add .js extension when using ES Modules





const app = express();

app.use(express.json());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(api);
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

