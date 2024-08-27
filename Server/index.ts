import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import userRoutes from './routes/user_routes'
import authRoutes from './routes/auth_routes'
import otpRoutes from './routes/otp_routes'
import connectDb from './config/database'
import passportAuth from './config/passport'


dotenv.config()

const app = express()

connectDb()

app.use(cors({
    origin: ['http://localhost:5173'],
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passportAuth.initialize());
app.use(passportAuth.session());

app.use(express.json())

app.use('/',userRoutes)
app.use('/',authRoutes)
app.use('/',otpRoutes)

const PORT = process.env.port || 3000

app.listen(PORT,()=>{
    console.log('Server is running'); 
}) 