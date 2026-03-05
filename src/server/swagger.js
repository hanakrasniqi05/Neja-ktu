const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Neja Ktu API",
      version: "1.0.0",
      description: `
Neja Ktu API Documentation.

This API powers a full event management platform where users can discover events, RSVP, and companies can organize events.

ROLES AND PERMISSIONS

Public:
- View homepage
- View events

User:
- Create RSVP
- Update RSVP status
- View RSVP history
- Edit profile

Company:
- Create events
- Edit events
- View RSVPs for their events
- Manage company profile

Admin:
- View all users
- Delete users
- View all events
- Verify companies
- Reject companies
- View system data
`,
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],

    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User profile management" },
      { name: "Events", description: "Public event endpoints" },
      { name: "Companies", description: "Company management" },
      { name: "RSVP", description: "RSVP management" },
      { name: "Admin", description: "Admin operations" },
      { name: "Comments", description: "Event comments" },
      { name: "Categories", description: "Event categories" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {

        User: {
          type: "object",
          properties: {
            UserId: { type: "integer", example: 5 },
            FirstName: { type: "string", example: "John" },
            LastName: { type: "string", example: "Doe" },
            Email: { type: "string", example: "john@email.com" },
            Role: {
              type: "string",
              enum: ["user", "admin", "company"],
            },
            ProfilePicture: {
              type: "string",
              example: "profile.jpg",
            },
          },
        },

        Company: {
          type: "object",
          properties: {
            id: { type: "integer", example: 2 },
            user_id: { type: "integer", example: 4 },
            full_name: { type: "string", example: "John Doe" },
            company_name: { type: "string", example: "Rezonanca" },
            business_registration_number: {
              type: "string",
              example: "BRN-12345",
            },
            company_email: {
              type: "string",
              example: "contact@rezonanca.com",
            },
            phone_number: {
              type: "string",
              example: "+38344123456",
            },
            address: {
              type: "string",
              example: "Prishtina, Kosovo",
            },
            website: {
              type: "string",
              example: "https://rezonanca.com",
            },
            logo_path: {
              type: "string",
              example: "rezonanca-logo.png",
            },
            verification_status: {
              type: "string",
              enum: ["pending", "verified", "rejected"],
            },
            description: {
              type: "string",
              example: "Healthcare company",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Event: {
          type: "object",
          properties: {
            EventID: { type: "integer", example: 20 },
            Title: { type: "string", example: "Dentist Workshop" },
            Description: {
              type: "string",
              example: "Workshop about modern dental equipment",
            },
            Location: {
              type: "string",
              example: "Prishtina",
            },
            StartDateTime: {
              type: "string",
              format: "date-time",
            },
            EndDateTime: {
              type: "string",
              format: "date-time",
            },
            Image: {
              type: "string",
              example: "workshop.jpg",
            },
            company_id: {
              type: "integer",
              example: 3,
            },
            RsvpLimit: {
              type: "integer",
              example: 200,
            },
          },
        },

        RSVP: {
          type: "object",
          properties: {
            rsvp_id: { type: "integer", example: 1 },
            user_id: { type: "integer", example: 3 },
            event_id: { type: "integer", example: 20 },
            rsvp_date: {
              type: "string",
              format: "date-time",
            },
            status: {
              type: "string",
              enum: ["attending", "interested", "not_attending"],
            },
          },
        },

        Category: {
          type: "object",
          properties: {
            CategoryID: { type: "integer", example: 1 },
            Name: { type: "string", example: "Technology" },
          },
        },

        Comment: {
          type: "object",
          properties: {
            CommentID: { type: "integer", example: 10 },
            EventID: { type: "integer", example: 20 },
            UserID: { type: "integer", example: 3 },
            Content: {
              type: "string",
              example: "This event looks amazing!",
            },
            CreatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Registration: {
          type: "object",
          properties: {
            RegistrationID: { type: "integer", example: 1 },
            UserID: { type: "integer", example: 2 },
            EventID: { type: "integer", example: 5 },
            RegistrationDate: {
              type: "string",
              format: "date-time",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },

        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js"],
};

module.exports = swaggerJsDoc(options);