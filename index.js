import express from "express";
import cors from 'cors';
import setupDB from "./Db.js";
import login_router from "./user/login/login_register.control.js";
import portfolio_router from "./user/portfolio/portfolio.control.js"

const port = process.env.PORT || 3003;
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Set up database
setupDB();

// CORS configuration
const corsOptions = {
    origin: '*', // Update to specific domains in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow GET, POST, PUT, and DELETE requests
    // allowedHeaders: ['Content-Type', 'Authorization'], // Uncomment and specify headers if needed
};
app.use(cors(corsOptions));
app.use('/auth',login_router);
app.use('/portfolio',portfolio_router);

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
