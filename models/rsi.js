import mongoose from 'mongoose';

const rsiDataSchema = mongoose.Schema({
	symbol: { type: String, required: true },
	interval: { type: String, required: true },
	dataType: { type: String, required: true },
	startTimeStamp: { type: String, required: true },
	endTimeStamp: { type: String, required: true },
	rsi2Val: { type: Number, required: true },
	rsi14Val: { type: Number, required: true },
	cumRsi2Val: { type: Number, required: true },
	avgGain14Val: { type: Number, required: true },
	avgLoss14Val: { type: Number, required: true },
	avgGain2Val: { type: Number, required: true },
	avgLoss2Val: { type: Number, required: true },
	id: { type: String },
});

export default mongoose.model('rsiData', rsiDataSchema);
