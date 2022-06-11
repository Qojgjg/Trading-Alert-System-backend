import mongoose from 'mongoose';

// 9 / 13 / 21 / 34 / 55 / 89 / 100 / 200;

const emaDataSchema = mongoose.Schema({
	symbol: { type: String, required: true },
	interval: { type: String, required: true },
	dataType: { type: String, required: true },
	startTimeStamp: { type: String, required: true },
	endTimeStamp: { type: String, required: true },
	ema9PriceVal: { type: Number, required: true },
	ema13PriceVal: { type: Number, required: true },
	ema21PriceVal: { type: Number, required: true },
	ema34PriceVal: { type: Number, required: true },
	ema55PriceVal: { type: Number, required: true },
	ema89PriceVal: { type: Number, required: true },
	ema100PriceVal: { type: Number, required: true },
	ema200PriceVal: { type: Number, required: true },
	id: { type: String },
});

export default mongoose.model('emaData', emaDataSchema);
