const mongoose = require('mongoose')

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { _id: false }
)

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    category: { type: String, required: true },
    options: { type: [optionSchema], required: true, default: [] },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Question', questionSchema)
