# Udemy Clone Backend (Node.js, Express, MongoDB)

## Project Overview
This is the backend server for a Udemy clone application. It is built using **Node.js**, **Express**, and **MongoDB** with **Mongoose** for managing database schema and queries. The project provides APIs to handle user authentication, course management, and purchase functionalities.

## Features
- **User authentication**: Sign up, log in, and token verification using JWT.
- **Course management**: Admins can add courses, and users can view and purchase courses.
- **Middleware validation**: Input validation using **Zod** and user authentication via **JWT** middleware.

## Project Setup

### Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (version >= 14.x)
- **MongoDB** (you can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local instance)
  
### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ShubhamPatel2305/udemy-backend-with-mongo.git
   cd udemy-backend-with-mongo
2. Install the dependencies:
   ```bash
   npm install
3. Start server:
   ```bash
   node index.js

## API Endpoints
Here is an overview of the available API routes, the expected data formats, and the constraints for each.

1. User Sign Up
  Endpoint: /user/signup
  Method: POST
  Body
    ```bash
    {
    "uname": "username",
    "pass": "password"
    }
  Constraints:
  uname: Minimum 4 characters, unique.
  pass: Minimum 8 characters.
  Response:
  201: {"message": "User created successfully", "token": "jwt_token"}
  400: {"message": "User already exists"}

2. User Log In
  Endpoint: /user/login
  Method: POST
  Body
    ```bash
    {
    "uname": "username",
    "pass": "password"
    }
  Constraints:
  uname: Registered username.
  pass: Matching password.
  Response:
  200: {"token": "jwt_token"}
  400: {"message": "Invalid credentials"}

3. Add Course (Admin Only)
  Endpoint: /admin/addcourse
  Method: POST
  Body
    ```bash
    {
      "cname": "Course Name",
      "description": "Course Description",
      "price": 100
    }
  Constraints:
  cname: Minimum 4 characters, unique.
  description: Required.
  price: Must be a number.
  Response:
  201: {"message": "Course added successfully"}
  400: {"message": "Course already exists"}

4. View Courses
  Endpoint: /courses
  Method: GET
  Response:
      ```bash
        [
      {
        "cid": 1,
        "cname": "Course Name",
        "description": "Course Description",
        "price": 100
      }
    ]

5. Purchase Course (Authenticated Users Only)
  Endpoint: /user/courses/:id
  Method: POST
  Headers: Authorization: Bearer <jwt_token>
  Body
    ```bash
    {
      "cid": 1
    }
Response:
200: {"message": "Course purchased successfully"}
400: {"message": "Invalid Course"}

Libraries and Their Purpose
1. Express
Why: Express is a minimal and flexible Node.js web application framework. It provides robust features for building web applications and APIs.
Usage: It's used here to create routes, handle middleware, and manage HTTP requests.
2. Mongoose
Why: Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js, which helps manage relationships between data, provides schema validation, and more.
Usage: Mongoose is used to define schemas for User, Course, and Admin models, ensuring structured data management.
3. Mongoose-Sequence
Why: This library is used to auto-increment fields like cid (course ID) and uid (user ID).
Usage: Applied to the CourseSchema and UserSchema to generate sequential IDs automatically.
4. JSON Web Token (JWT)
Why: JWT is a secure way to transmit information between parties. It is commonly used for authentication.
Usage: JWT is used for creating access tokens on successful user login, and verifying tokens during course purchases.
5. Zod
Why: Zod is a TypeScript-first schema declaration and validation library.
Usage: It is used for input validation in the user signup and login routes, ensuring the data follows the correct structure and constraints.
6. Body-Parser
Why: Body-parser is used to parse incoming request bodies in a middleware.
Usage: This library is used to parse JSON data from incoming POST requests so that it can be accessed in req.body.
Middlewares
The project uses various middlewares for validation and authentication:

userInputValidationMiddleware: Ensures that user signup and login inputs are valid.
userSignupValidationsMiddleware: Checks if the user already exists during signup.
userLoginValidationsMiddleware: Ensures valid credentials during login.
userValidateTokenMiddleware: Verifies if the user is authenticated by checking the JWT token.
userCourseValidationMiddleware: Ensures that the course ID provided by the user is valid.
Each middleware is located in the middleware folder and is applied to the respective routes to ensure proper validation and security.





