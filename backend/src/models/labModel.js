const mongoose = require('mongoose');


const labTestSchema = new mongoose.Schema({
patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
tests: [{ code: String, name: String, price: Number }],
status: { type: String, enum: ['requested','processing','done','cancelled'], default: 'requested' }
}, { timestamps: true });


module.exports = mongoose.model('LabTest', labTestSchema);