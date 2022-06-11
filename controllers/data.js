import WebSocket from 'ws';
import coinData from '../models/ohlc.js';
import { calculate } from './functions.js';
import { sendMtfOrRsi2Alert } from '../models/mtfAlert.js';

var i = 0;

export const getData = (spotParamArray, futureParamArray) => {
	try {
		const wss_future = new WebSocket('wss://fstream.binance.com:443/ws');
		const wss_spot = new WebSocket('wss://stream.binance.com:9443/ws');
		wss_future.on('open', () => {
			const subMessage = {
				method: 'SUBSCRIBE',
				params: futureParamArray,
				id: 1,
			};
			wss_future.send(JSON.stringify(subMessage));
		});
		wss_future.on('message', (data) => {
			try {
				processData(JSON.parse(data));
			} catch (error) {
				console.log(error.message);
			}
		});
		wss_future.on('error', (error) => {
			console.log(error.message);
		});
		wss_spot.on('open', () => {
			const subMessage = {
				method: 'SUBSCRIBE',
				params: spotParamArray,
				id: 1,
			};
			wss_future.send(JSON.stringify(subMessage));
		});
		wss_spot.on('message', (data) => {
			try {
				processData(JSON.parse(data));
			} catch (error) {
				console.log(error.message);
			}
		});
		wss_spot.on('error', (error) => {
			console.log(error.message);
		});
	} catch (error) {
		console.log(error.message);
	}
};

const processData = (dataStream) => {
	if (dataStream.k.x == true) {
		var startDateTime = new Date(dataStream.k.t);
		var endDateTime = new Date(dataStream.k.T);
		if (dataStream.k.s !== undefined) {
			insertInDatabase(dataStream, startDateTime, endDateTime, 'SPOT');
		} else {
			insertInDatabase(dataStream, startDateTime, endDateTime, 'FUTURE');
		}
	}
};

const insertInDatabase = async (
	dataStream,
	startDateTime,
	endDateTime,
	dataType
) => {
	try {
		await coinData.create({
			symbol: dataType == 'SPOT' ? dataStream.k.s : dataStream.ps,
			interval: dataStream.k.i,
			startTimeStamp: startDateTime.toLocaleString(),
			endTimeStamp: endDateTime.toLocaleString(),
			openVal: dataStream.k.o,
			closeVal: dataStream.k.c,
			highVal: dataStream.k.h,
			lowVal: dataStream.k.l,
			dataType: dataType,
			candleType: dataStream.k.o > dataStream.k.c ? 'RED' : 'GREEN',
		});

		await calculate(
			dataType == 'SPOT' ? dataStream.k.s : dataStream.ps,
			dataStream.k.i,
			dataType
		);
		i++;
		console.log(i);

		if (dataStream.k.i == '1m' && i == 8) {
			console.log('Processing MTF Alerts');
			i = 0;
			sendMtfOrRsi2Alert();
		}
		if (dataStream.k.i == '5m' && i == 8) {
			console.log('Processing MTF Alerts');
			i = 0;
			sendMtfOrRsi2Alert();
		}
		if (dataStream.k.i == '5m' && i == 16) {
			console.log('Processing MTF Alerts');
			i = 0;
			sendMtfOrRsi2Alert();
		}
		if (dataStream.k.i == '5m' && i == 24) {
			console.log('Processing MTF Alerts');
			i = 0;
			sendMtfOrRsi2Alert();
		}
		if (dataStream.k.i == '5m' && i == 32) {
			console.log('Processing MTF Alerts');
			i = 0;
			sendMtfOrRsi2Alert();
		}
		if (dataStream.k.i == '5m' && i == 40) {
			console.log('Processing MTF Alerts');
			i = 0;
			sendMtfOrRsi2Alert();
		}
		if (dataStream.k.i == '5m' && i == 48) {
			console.log('Processing MTF Alerts');
			i = 0;
			sendMtfOrRsi2Alert();
		}
		if (dataStream.k.i == '5m' && i == 56) {
			console.log('Processing MTF Alerts');
			i = 0;
			sendMtfOrRsi2Alert();
		}
		if (dataStream.k.i == '5m' && i == 64) {
			console.log('Processing MTF Alerts');
			i = 0;
			sendMtfOrRsi2Alert();
		}
		if (dataStream.k.i == '5m' && i == 72) {
			console.log('Processing MTF Alerts');
			i = 0;
			sendMtfOrRsi2Alert();
		}
		if (dataStream.k.i == '5m' && i == 80) {
			console.log('Processing MTF Alerts');
			i = 0;
			sendMtfOrRsi2Alert();
		}
		if (dataStream.k.i == '5m' && i == 88) {
			console.log('Processing MTF Alerts');
			sendMtfOrRsi2Alert();
			i = 0;
		}
	} catch (error) {
		console.log(error.message);
	}
};
