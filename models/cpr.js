import mongoose from 'mongoose';

const cprDataSchema = mongoose.Schema({
	symbol: { type: String, required: true },
	interval: { type: String, required: true },
	startTimeStamp: { type: String, required: true },
	endTimeStamp: { type: String, required: true },
	cprTcVal: { type: Number, required: true },
	cprBcVal: { type: Number, required: true },
	cprPivotVal: { type: Number, required: true },
	dataType: { type: String, required: true },
	id: { type: String },
});

export default mongoose.model('cprData', cprDataSchema);
