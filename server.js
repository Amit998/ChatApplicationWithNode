const express =require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js');

const { userJoin,getCurrentUser,userLeave,getRoomUser } =require('./utils/users.js');



const app = express();
const server = http.createServer(app);

const io= socketio(server);

// set Static Folder

app.use(express.static(path.join(__dirname,'ChatRoom')))


const botName= 'ChatChord Bot';

// Run With Client Connect

io.on('connection',socket => {
    socket.on('joinRoom',({username,room})=>{

        const user = userJoin(socket.id,username,room);
        socket.join(user.room);

        // Wellcome Current User

        socket.emit('message',formatMessage(botName,`Wellcome To the room ${room} `));

        // Broadcast When A client Enters
    
        // socket.broadcast.emit('message',formatMessage(username,`${username} Has Joined`));

        socket.broadcast.to(user.room)
        .emit(
            'message',
            formatMessage(botName,`${user.username} Has Arrived`)
            );

            // Send Users And Room Info
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users:getRoomUser(user.room)
            });






            // Listn For ChatMessage
        socket.on('chatMessage',(msg) =>{
            const user = getCurrentUser(socket.id);

            io.to(user.room).emit('message',formatMessage(user.username,msg));
            
        });

        // // Runs When client disconnect

        socket.on('disconnect',() => {
            const user =userLeave(socket.id);

            if(user){
                io.to(user.room).emit('message',formatMessage(botName,` ${user.username}  Has Left`));

            }

            // Send Users Room info
                io.to(user.room).emit('roomUsers',{
                room: user.room,
                users:getRoomUser(user.room)
            });


            
        });


    });


    


    // io.emit();

    
});


const PORT = 3000 || process.env.PORT;

server.listen(PORT,()=> console.log(`Server Running on port ${PORT}`));