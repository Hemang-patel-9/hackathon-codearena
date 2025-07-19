const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

        totalPrice: { type: Number, required: true },

        status: {
            type: String,
            enum: ['success', 'fail', 'refunded'],
            required: true
        },

        transactionId: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('transaction', TransactionSchema);