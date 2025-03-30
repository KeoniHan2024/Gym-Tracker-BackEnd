import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';

dotenv.config();

const usersRouter = require('./routes/users')
const exercisesRouter = require('./routes/exercises')
const musclegroupRouter = require('./routes/musclegroups')


const app = express();
app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

///////// Setting Routes
app.use('/users', usersRouter);
app.use('/exercises', exercisesRouter);
app.use('/musclegroups', musclegroupRouter);


//////

app.listen(8080, () => {
    console.log("Server Running");
});

process.on("SIGINT", () => {
    console.log("Shutting down server...");
    process.exit();
});








