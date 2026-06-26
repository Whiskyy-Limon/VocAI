const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    optionLabel: { type: String },
    score: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { _id: false }
)

const recommendedCareerSchema = new mongoose.Schema(
  {
    careerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
    title: { type: String },
    affinity: { type: Number, default: 0 },
  },
  { _id: false }
)

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: { type: [answerSchema], default: [] },
    categoryScores: { type: Map, of: Number, default: {} },
    recommendedCareers: { type: [recommendedCareerSchema], default: [] },
    totalScore: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Result', resultSchema)
