import serverless from "serverless-http";
import app from "../../server.js"; // this depends on where your server.js is

export const handler = serverless(app);
