const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema= new Schema(
    {
      title: String,
      description: String,
      category: Array,
      rate: Array,  
      totalRate: Number,  
      price: Number,
      stock: Number,
      shipmentInfo:String,
      isAvailable: Boolean,
      productId: Number,
      image: Array,
      isDeleted:Boolean,
      /*productPic:{
        imageName: {
          type: String,
          default: "none",
          //required: true
        },
        imageData: {
            type: String,
            //required: true
        }
      }
      */    
    }
);

module.exports = mongoose.model("Product", ProductSchema)