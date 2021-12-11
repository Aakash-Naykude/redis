const { Schema, model } = require("mongoose");
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    owner: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("products", productSchema);
