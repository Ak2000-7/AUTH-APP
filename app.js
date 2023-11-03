import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'

 


dotenv.config()

connectDB()

const app = express()
// app.use(cors());


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use('/api/users', userRoutes)



const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

