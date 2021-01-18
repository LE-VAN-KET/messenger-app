import Message from '../../../database/message/message';
class HandleMessage {
    newMessage(context) {
        new Message({
            from_to: context.senderId,
            send_to: [context.receiverId],
            body: context.content,
            sent_at: new Date(),
            is_seen: false,
        }).save();
        // console.log('send message success');
    }
    // load message of friend
    async getMessage(senderId, receiverId) {
        // console.log(typeof receiverId)
        return Message.find({ from_to: senderId.toString(), send_to: [parseInt(receiverId)] }).exec();
    }

    //get message history
    async getMessageHistory(id) {
        const listMessage = await Message.aggregate([
            { $match: { from_to: id } },
            { $group: {
                _id: "$id",
                from_to: { "$last": "$from_to" },
                send_to: { "$last": "$send_to" },
                body: { "$last": "$body" },
                sent_at: { "$last": "$sent_at" },
            }
            },
        ]).exec();
        return listMessage;
    }
    
}

export default HandleMessage;