import mongoose from 'mongoose';

const camDataSchema = mongoose.Schema({
	symbol: { type: String, required: true },
	interval: { type: String, required: true },
	startTimeStamp: { type: String, required: true },
	endTimeStamp: { type: String, required: true },
	dataType: { type: String, required: true },
	camL3Val: { type: Number, required: true },
	camL4Val: { type: Number, required: true },
	camL5Val: { type: Number, required: true },
	camL6Val: { type: Number, required: true },
	camH3Val: { type: Number, required: true },
	camH4Val: { type: Number, required: true },
	camH5Val: { type: Number, required: true },
	camH6Val: { type: Number, required: true },
	id: { type: String },
});

export default mongoose.model('camData', camDataSchema);
