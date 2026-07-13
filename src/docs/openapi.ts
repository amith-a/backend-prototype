const openApiDefinition = {
  openapi: "3.0.0",

  info: {
    title: "Backend Prototype API",
    version: "1.0.0",
    description: "Learning backend engineering with Express and PostgreSQL",
  },

  servers: [
    {
      url: "http://localhost:5000/api/v1",
    },
  ],
};

export default openApiDefinition;