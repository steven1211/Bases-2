const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema= new Schema(
    {
      idPerson1: String,
      idPerson2: String,
      messages: Array,   
    }
);

module.exports = mongoose.model("Conversation", ConversationSchema);