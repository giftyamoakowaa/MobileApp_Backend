// // Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2
// // export default (request, context) => {
// //   try {
// //     const url = new URL(request.url)
// //     const subject = url.searchParams.get('name') || 'World'

// //     return new Response(`Hello ${subject}`)
// //   } catch (error) {
// //     return new Response(error.toString(), {
// //       status: 500,
// //     })
// //   }
// // }


// // netlify/functions/books-api/books-api.mjs
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

// const secretKey = process.env.JWT_PRIVATE_KEY; // Ensure this is set in Netlify environment variables
// const mongoUri = process.env.MONGO_URI; // Ensure this is set in Netlify environment variables

// // Database connection (adapted from your code)
// let dbConnection = null;
// const connectDB = async () => {
//   if (dbConnection) {
//     return dbConnection;
//   }
//   try {
//     await mongoose.connect(mongoUri);
//     dbConnection = mongoose.connection;
//     console.log('MongoDB connected from Netlify Function');
//     return dbConnection;
//   } catch (error) {
//     console.error('MongoDB connection error from Netlify Function:', error);
//     throw error;
//   }
// };

// // Middleware to verify the token
// const verifyToken = (event) => {
//   const authHeader = event.headers.authorization;
//   if (!authHeader) {
//     return {
//       statusCode: 401,
//       body: JSON.stringify({ message: 'Access denied' }),
//     };
//   }

//   const token = authHeader.split(' ')[1];
//   if (!token) {
//     return {
//       statusCode: 401,
//       body: JSON.stringify({ message: 'Access denied' }),
//     };
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);
//     return decoded; // Return the decoded user information
//   } catch (error) {
//     return {
//       statusCode: 401,
//       body: JSON.stringify({ message: 'Invalid token' }),
//     };
//   }
// };

// // Your main handler function
// export const handler = async (event, context) => {
//   // Enable CORS (important for web requests from a different origin)
//   const headers = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Headers': 'Authorization, Content-Type',
//   };

//   if (event.httpMethod !== 'GET') {
//     return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
//   }

//   // Verify the token
//   const user = verifyToken(event);
//   if (user && user.statusCode) {
//     return { headers, ...user }; // Return error response if token is invalid
//   }

//   try {
//     await connectDB();
//     const Book = mongoose.model('Book'); // Assuming you have a Book model
//     const books = await Book.find();

//     return {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify(books),
//     };
//   } catch (error) {
//     console.error('Error fetching books from Netlify Function:', error);
//     return {
//       statusCode: 500,
//       headers,
//       body: JSON.stringify({ message: 'Error fetching books' }),
//     };
//   }
// };