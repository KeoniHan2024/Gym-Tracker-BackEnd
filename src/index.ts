import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';

dotenv.config();

const usersRouter = require('./routes/users')
const exercisesRouter = require('./routes/exercises')
const musclegroupRouter = require('./routes/musclegroups')
const setsRouter = require('./routes/sets')
const bodyweightsRouter= require('./routes/bodyweights')



const app = express();
const cors = require('cors');
const corsOptions = {
  origin: [
    'http://localhost:5173', // React dev server
    'https://www.musclemap.co' // Production domain
  ],
  methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
  credentials: true, // Allow cookies (if needed)
};
app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

///////// Setting Routes
app.use('/users', usersRouter);
app.use('/exercises', exercisesRouter);
app.use('/musclegroups', musclegroupRouter);
app.use('/sets', setsRouter);
app.use('/bodyweights', bodyweightsRouter)


//////

app.listen(8080, () => {
    console.log("Server Running");
});

process.on("SIGINT", () => {
    console.log("Shutting down server...");
    process.exit();
});








