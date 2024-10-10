import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import userRoutes from './routes/user_routes'
import authRoutes from './routes/auth_routes'
import adminRoutes from './routes/admin_routes'
import otpRoutes from './routes/otp_routes'
import connectDb from './config/database'
import passportAuth from './config/passport'
import path from 'path'
import cookieParser = require('cookie-parser')

dotenv.config()

const app = express()

connectDb()

app.use(cors({
    origin: ['http://localhost:5173'],
    methods:['GET','POST','PUT','DELETE','PATCH'],
    credentials:true
}))

app.use(cookieParser())

app.use('/Uploads',express.static(path.join(__dirname,'Uploads')))

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
app.use('/admin',adminRoutes)

const PORT = process.env.port || 3000

app.listen(PORT,()=>{
    console.log('Server is running'); 
}) 