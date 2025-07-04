import express from 'express';
import cors from 'cors';
import { connectDB } from './util/db.js';
import { UserRouter } from './Routes/User.router.js';
import { UrlRouter } from './Routes/Url.router.js';
import { getUrl } from './controller/Url.Controller.js';



const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;


app.use('/api/user', UserRouter);
app.use('/api/url', UrlRouter);


app.get("/:shortUrl", getUrl);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
        .then(() => console.log('Database connected successfully'))
        .catch(err => console.error('Database connection failed:', err));
});