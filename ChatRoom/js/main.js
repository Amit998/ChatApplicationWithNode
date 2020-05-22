// import e from "express";

// import users from "../../utils/users";


const chatForm = document.getElementById('chat-form');

const chatMessages= document.querySelector('.chat-messages');


const roomName= document.getElementById('room-name');
const userNameList= document.getElementById('users');



// Get Username and room from URL

const { username,room } = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});


// console.log(username, room);

const socket = io();

// Message From Server

socket.emit('joinRoom',{username,room})

socket.on('roomUsers',({ room,users})=>{
    outPutRoomName(room);
    outPutUserName(users);
});


socket.on('message', message =>{
    // console.log(message);
    outputMessage(message);

    // Scroll Down

    chatMessages.scrollTop=chatMessages.scrollHeight;
});

chatForm.addEventListener('submit',(e) => {
    // console.log('lol');
    e.preventDefault();

    // Get Message Text

    const msg = e.target.elements.msg.value;
    // Emit msg to serve

    socket.emit('chatMessage',msg)

    // clear Input

    e.target.elements.msg.value ='';
    e.target.elements.msg.focus();

});

// Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages')?.appendChild(div);
}

// Add Roomname to DOM

function outPutRoomName(room){
    roomName.innerHTML= room;
    // console.log(room);



}
// Add username to DOM

function outPutUserName(users){
    userNameList.innerHTML = 
    `${users.map(user => `<li> ${user.username} </li>`).join()}`;

    console.log(users.user);



}