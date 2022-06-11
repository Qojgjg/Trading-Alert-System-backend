import mongoose from 'mongoose';

const divergenceDataSchema = mongoose.Schema({
	symbol: { type: String, required: true },
	interval: { type: String, required: true },
	startTimeStamp: { type: String, required: true },
	endTimeStamp: { type: String, required: true },
	divExists: { type: Boolean, required: true },
	divType: { type: String, required: true },
	divIndicator: { type: String, required: true },
	dataType: { type: String, required: true },
	id: { type: String },
});

export default mongoose.model('divergenceData', divergenceDataSchema);
