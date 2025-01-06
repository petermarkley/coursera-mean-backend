import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { connectToDatabase } from './database';
import { myObjectRouter } from './object.routes';

dotenv.config();


const {ATLAS_URL} = process.env;
const BASE_URL = process.env.BASE_URL
const PORT = process.env.PORT

if(!ATLAS_URL){
    console.error("No ATLAS_URL environment variable has been declared in .env");
    process.exit(1);
}

connectToDatabase(ATLAS_URL)
    .then(() => {
        const app = express();
        app.use(cors());

        app.use("/objects", myObjectRouter)
        app.listen(PORT, () => {
            console.log(`Server running at ${BASE_URL}:${PORT}...`)
        })
    })
    .catch(error => console.error(error));

