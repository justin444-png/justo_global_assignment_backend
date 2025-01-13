module.exports = {
  "/api/auth/register": {
    post: {
      tags: ["Auth"],
      description: "To rgister",
      operationId: "rgister",
      parameters: [],
      consumes: ["application/json"],
      parameters: [
        {
          name: "rgister",
          in: "body",
          schema: {
            $ref: "#/components/schemas/loginInput",
          },
        },
      ],
      responses: {
        201: {
          description: "",
        },
        500: {
          description: "Server error",
        },
      },
    },
  },

  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      description: "To login",
      operationId: "login",
      parameters: [],
      consumes: ["application/json"],
      parameters: [
        {
          name: "login",
          in: "body",
          schema: {
            $ref: "#/components/schemas/loginInput",
          },
        },
      ],
      responses: {
        201: {
          description: "",
        },
        500: {
          description: "Server error",
        },
      },
    },
  },
  "/api/auth/generateLink/{userId}": {
    post: {
      tags: ["Auth"],
      description: "To gnerate link",
      operationId: "generateLink",
      consumes: ["application/json"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "userId",
          in: "path",
          type: "integer",
          required: true,
        },
      ],
      responses: {
        201: {
          description: "",
        },
        500: {
          description: "Server error",
        },
      },
    },
  }, 
  '/api/auth/verifyLink/{link}': {
    get: {
        tags: ['Auth'],
        description: "To verify link",
        operationId: "verifyLink",
        parameters: [
          {
            name: "link",
            in: "path",
            type: "string",
            required: true,
          },
        ],
        responses: {
            '201': {
                description: ""
            },
            '500': {
                description: 'Server error'
            }
        }
    }
},
  '/api/auth/getServerTime/{userId}': {
    get: {
        tags: ['Auth'],
        description: "To server time",
        operationId: "getServerTime",
        parameters: [
          {
            name: "userId",
            in: "path",
            type: "integer",
            required: true,
          },
        ],
        responses: {
            '201': {
                description: ""
            },
            '500': {
                description: 'Server error'
            }
        }
    }
},
"/api/auth/kickOutUser/{userId}": {
  delete: {
    tags: ["Auth"],
    description: "To remove token ",
    operationId: "kickOut",
    consumes: ["application/json"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "userId",
        in: "path",
        type: "integer",
        required: true,
      },
    ],
    responses: {
      201: {
        description: "",
      },
      500: {
        description: "Server error",
      },
    },
  },
},
}