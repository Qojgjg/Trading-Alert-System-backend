import mongoose from 'mongoose';

const coinDataSchema = mongoose.Schema({
	symbol: { type: String, required: true },
	interval: { type: String, required: true },
	startTimeStamp: { type: String, required: true },
	endTimeStamp: { type: String, required: true },
	openVal: { type: Number, required: true },
	closeVal: { type: Number, required: true },
	highVal: { type: Number, required: true },
	lowVal: { type: Number, required: true },
	highestPrice: { type: Number },
	lowestPrice: { type: Number },
	dataType: { type: String, required: true },
	candleType: { type: String, required: true },
	id: { type: String },
});

export default mongoose.model('coinData', coinDataSchema);
