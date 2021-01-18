import dotenv from 'dotenv';
dotenv.config();
import HandleMessage from '../app/messages/repositories/repository';
import VerifToken from '../app/Auth/Services/AuthService';
const message = new HandleMessage();
const verify = new VerifToken();

const connectionEvent = (socket) => {
    socket.on('message', async (request) => {
        await socket.to(request.receiver.toString()).emit('message', {
            senderId: socket.userId,
            senderName: socket.userName,
            msg: request.msg,
        })
        const context = {
            senderId: socket.userId,
            receiverId: request.receiver,
            content: request.msg,
        }
        message.newMessage(context);
        // console.log("oke");
    })

    //validate singin
    socket.on('singinUser', async (msg) => {
        try {
            const user = await verify.verifyToken(msg.token, process.env.ACCESS_TOKEN_SECRET);
            socket.userId = user.id;
            socket.userName = user.lastName;
            socket.join(user.id.toString());
        }
        catch(err) {
            console.log("Can't singin user.");
            socket.disconnect();
        }
    })
    
    socket.on('disconnect', () => {
        console.log(`${socket.userId} has disconnected`);
        socket.leave(socket.userId);
    });
}

export default connectionEvent;