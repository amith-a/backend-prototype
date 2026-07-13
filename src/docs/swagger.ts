import swaggerJsdoc from "swagger-jsdoc";
import swaggerDefinition from "./openapi";

const options = {
  definition: swaggerDefinition,

  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;