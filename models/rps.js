import mongoose from 'mongoose';

const rpsDataSchema = mongoose.Schema({
	symbol: { type: String, required: true },
	interval: { type: String, required: true },
	dataType: { type: String, required: true },
	startTimeStamp: { type: String, required: true },
	endTimeStamp: { type: String, required: true },
	rpsVal: { type: Number, required: true },
	id: { type: String },
});

export default mongoose.model('rpsData', rpsDataSchema);
