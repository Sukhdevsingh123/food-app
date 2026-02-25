import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

export default mongoose.model("MenuItem", menuItemSchema);