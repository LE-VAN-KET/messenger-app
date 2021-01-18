  
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

export default mongoose.model("messages", {
    from_to: String,
    send_to: Array,
    body: String,
    sent_at: Date,
    seen_at: Date,
    is_seen: Boolean,
    seen_by: Array,
});