import {Server} from 'socket.io'
import { createServer } from 'http'
import express from 'express'


const app = express()
const server = createServer(app)
const io = new Server(server,{
    pingTimeout:60000,
    cors:{
        origin:['http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true,
    } 
})


io.on('connection', (socket) => {  
    // console.log('a user connected',socket.id);
    
    socket.on('setup',(userId) => { 
        console.log('lol',userId);
    })

    socket.on('message',(data) => {
         
    })

    socket.on('disconnect',()=>{
        console.log('user disconnected');
    })
  });


  export {app,io,server}