const { any } = require("joi");
module.exports={
    components: {
        bearerAuth: {
            type: "http",
            in: "header",
            name: "Authorization",
            description: "Bearer token to access these api endpoints",
            scheme: "bearer",
          },

          security: [
            {
              bearerAuth: [],
            },
          ],
          schemas: {
            loginInput: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    description: "User email ID",
                    example: "somthing@somthing.com",
                  },
                  password: {
                    type: "string",
                    description: "",
                  },
                },
              },
          }

    }

}