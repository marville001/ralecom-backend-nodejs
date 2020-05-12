const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    lowercase: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    default: 0,
    min: 0
  },
  inCart: {
    type: Boolean,
    default: false
  }
});

const Product = mongoose.model("Product", productSchema);

function validateProducts(product) {
  const schema = {
    name: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    imageUrl: Joi.string().required(),
    price: Joi.number().required()
  };
  return Joi.validate(product, schema);
}

module.exports = {
  Product,
  validate: validateProducts
};
