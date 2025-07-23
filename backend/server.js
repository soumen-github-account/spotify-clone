
import express, { json } from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectdb from './config/dbconnect.js';
import connectCloudinary from './config/cloudinary.js';
import songRouter from './routes/songRoute.js';
import albumRouter from './routes/albumRoute.js';

const app = express();
const port = process.env.PORT || 8000;


app.use(express.json());
app.use(cors());
connectdb();
connectCloudinary();

app.use('/api/song', songRouter)
app.use('/api/album', albumRouter)


app.get('/',(req, res)=>{
    res.send("api is working");
});

app.listen(port, ()=>{
    console.log("App is started in", port);
})
