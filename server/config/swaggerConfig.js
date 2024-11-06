import swaggerJsDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Recipe Guru API',
            version: '1.0.0',
            description: 'API documentation for Recipe Guru application',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Replace with your server URL
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token in the format: Bearer <token>',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs (add the path to your routes files)
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
