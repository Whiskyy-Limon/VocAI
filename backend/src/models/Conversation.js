const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

const conversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Conversation', conversationSchema)
