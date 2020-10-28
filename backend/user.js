const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema= new Schema(
    {
      userName: String,
      password: String,
      salt: String,
      fullName: String,    
      email: String,
      birthDate: Date,
      salt: String,
      userType: String,
      profilePic:{
        imageName: {
          type: String,
          default: "none",
          required: true
        },
        imageData: {
            type: String,
            required: true
        }
      }
    }
);

module.exports = mongoose.model("User", UserSchema)