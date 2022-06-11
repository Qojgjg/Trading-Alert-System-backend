import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/users.js';
import { getData } from './controllers/data.js';

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/user', userRoutes);

const CONNECTION_URL =
	'mongodb+srv://dbadmin:PauvMNi2OvS1j3XO@cluster0.3eex7.mongodb.net/tradingAlertDatabase?retryWrites=true&w=majority';

const PORT = process.env.PORT || 4000;

mongoose
	.connect(CONNECTION_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
	)
	.catch((error) => console.log(error));

const coinArray = [
	'eth',
	'btc',
	// 'ltc',
	// 'xmr',
	// 'ada',
	// 'sol',
	// 'doge',
	// 'ftm',
	// 'xrp',
	// 'matic',
];
const futureIntervalArray = [
	// 'usdt_perpetual@continuousKline_1m',
	'usdt_perpetual@continuousKline_5m',
	'usdt_perpetual@continuousKline_15m',
	'usdt_perpetual@continuousKline_30m',
	'usdt_perpetual@continuousKline_1h',
	'usdt_perpetual@continuousKline_2h',
	'usdt_perpetual@continuousKline_4h',
	'usdt_perpetual@continuousKline_8h',
	'usdt_perpetual@continuousKline_12h',
	'usdt_perpetual@continuousKline_1d',
	'usdt_perpetual@continuousKline_1w',
	'usdt_perpetual@continuousKline_1M',
	// 'busd_perpetual@continuousKline_1m',
	'busd_perpetual@continuousKline_5m',
	'busd_perpetual@continuousKline_15m',
	'busd_perpetual@continuousKline_30m',
	'busd_perpetual@continuousKline_1h',
	'busd_perpetual@continuousKline_2h',
	'busd_perpetual@continuousKline_4h',
	'busd_perpetual@continuousKline_8h',
	'busd_perpetual@continuousKline_12h',
	'busd_perpetual@continuousKline_1d',
	'busd_perpetual@continuousKline_1w',
	'busd_perpetual@continuousKline_1M',
];

const spotIntervalArray = [
	// 'usdt@kline_1m',
	'usdt@kline_5m',
	'usdt@kline_15m',
	'usdt@kline_30m',
	'usdt@kline_1h',
	'usdt@kline_2h',
	'usdt@kline_4h',
	'usdt@kline_8h',
	'usdt@kline_12h',
	'usdt@kline_1d',
	'usdt@kline_1w',
	'usdt@kline_1M',
	// 'busd@kline_1m',
	'busd@kline_5m',
	'busd@kline_15m',
	'busd@kline_30m',
	'busd@kline_1h',
	'busd@kline_2h',
	'busd@kline_4h',
	'busd@kline_8h',
	'busd@kline_12h',
	'busd@kline_1d',
	'busd@kline_1w',
	'busd@kline_1M',
];

const futureParamArray = [];
const spotParamArray = [];
for (let i = 0; i < coinArray.length; i++) {
	for (let j = 0; j < futureIntervalArray.length; j++) {
		futureParamArray.push(coinArray[i] + futureIntervalArray[j]);
	}
}
for (let i = 0; i < coinArray.length; i++) {
	for (let j = 0; j < spotIntervalArray.length; j++) {
		spotParamArray.push(coinArray[i] + spotIntervalArray[j]);
	}
}

getData(spotParamArray, futureParamArray);
