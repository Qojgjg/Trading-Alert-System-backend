import { sendMessageToTelegramBot } from '../controllers/tgbot.js';
import coinData from '../models/ohlc.js';
import rsiData from '../models/rsi.js';
import camData from '../models/camarilla.js';
import cprData from '../models/cpr.js';
import emaData from '../models/ema.js';
import rpsData from '../models/rps.js';

export const calculate = async (coin, interval, dataType) => {
	var smarsi14 = 0,
		rsi14 = 0,
		rsi2 = 0,
		cumRsi2 = 0;
	var checkCandles = [];
	var rsiCheckValues = [];
	const data = await coinData
		.find({ symbol: coin, interval: interval, dataType })
		.sort({ endTimeStamp: -1 });
	// console.log(
	// 	'Length of Data for ' +
	// 		coin +
	// 		' ' +
	// 		interval +
	// 		' ' +
	// 		dataType +
	// 		' is: ' +
	// 		data.length
	// );

	const btcData = await coinData
		.find({ symbol: 'BTCBUSD', interval: interval, dataType: 'FUTURE' })
		.sort({ endTimeStamp: -1 });

	if (data.length >= 15 && btcData.length >= 15) {
		const btcPriceChange =
			(btcData[0].closeVal - btcData[14].closeVal) / btcData[14].closeVal;

		// console.log(
		// 	btcData[0].closeVal + ' ' + btcData[1].closeVal + ' ' + btcPriceChange
		// );
		const priceChange =
			(data[0].closeVal - data[14].closeVal) / data[14].closeVal;
		// console.log(data[0].closeVal + ' ' + data[1].closeVal + ' ' + priceChange);
		const rpsVal = priceChange / btcPriceChange;

		try {
			await rpsData.create({
				symbol: data[0].symbol,
				interval: data[0].interval,
				startTimeStamp: data[0].startTimeStamp,
				endTimeStamp: data[0].endTimeStamp,
				dataType,
				rpsVal,
			});
		} catch (error) {
			console.log(error.message);
		}

		var rpsAlert;
		if (rpsVal > 1) {
			rpsAlert =
				'For ' +
				coin +
				' ' +
				dataType +
				' in ' +
				interval +
				' RPS is greater than 1. Value is: ' +
				rpsVal;
			sendMessageToTelegramBot(rpsAlert);
		} else {
			rpsAlert =
				'For ' +
				coin +
				' ' +
				dataType +
				' in ' +
				interval +
				' RPS is lesser than 1. Value is: ' +
				rpsVal;
			sendMessageToTelegramBot(rpsAlert);
		}
	}

	var currentDate = new Date().toLocaleString();

	var highDayPrice = 0,
		highWeekPrice = 0;

	var gainSum14 = 0.0,
		lossSum14 = 0.0,
		avgGain14 = 0,
		avgLoss14 = 0;
	var gainSum2 = 0.0,
		lossSum2 = 0.0,
		avgGain2 = 0,
		avgLoss2 = 0;

	var cpr_bc,
		cpr_pivot,
		cpr_tc,
		cam_h3,
		cam_h4,
		cam_h5,
		cam_h6,
		cam_l3,
		cam_l4,
		cam_l5,
		cam_l6;

	var rsiEntry = await rsiData
		.find({
			symbol: coin,
			interval: interval,
			dataType,
		})
		.sort({ endTimeStamp: -1 });

	var emaEntry = await emaData
		.find({
			symbol: coin,
			interval: interval,
			dataType,
		})
		.sort({ endTimeStamp: -1 })
		.limit(14);

	var cprEntry = await cprData
		.find({
			symbol: coin,
			interval: interval,
			dataType,
		})
		.sort({ endTimeStamp: -1 })
		.limit(14);

	console.log(
		'Length of Data for RSI of ' +
			coin +
			' ' +
			interval +
			' ' +
			dataType +
			': ' +
			data.length
	);

	if (data.length > 0) {
		if (interval == '1d') {
			highDayPrice = data[0].highVal;
		}
		if (interval == '1w') {
			highWeekPrice = data[0].highVal;
		}
	}

	var highAlert;

	if (
		highDayPrice != 0 &&
		data[0].closeVal < highDayPrice &&
		data[1].closeVal > highDayPrice
	) {
		highAlert =
			'For ' +
			coin +
			' ' +
			dataType +
			' in ' +
			interval +
			' Price: ' +
			data[0].closeVal +
			" dropped below yesterday's high price: " +
			highDayPrice;
		sendMessageToTelegramBot(highAlert);
	} else if (highDayPrice != 0 && data[0].closeVal < highDayPrice) {
		highAlert =
			'For ' +
			coin +
			' ' +
			dataType +
			' in ' +
			interval +
			' Price: ' +
			data[0].closeVal +
			" is below yesterday's high price: " +
			highDayPrice;
		sendMessageToTelegramBot(highAlert);
	}
	if (
		highDayPrice != 0 &&
		data[0].closeVal > highDayPrice &&
		data[1].closeVal < highDayPrice
	) {
		highAlert =
			'For ' +
			coin +
			' ' +
			dataType +
			' in ' +
			interval +
			' Price: ' +
			data[0].closeVal +
			" crossed above yesterday's high price: " +
			highDayPrice;
		sendMessageToTelegramBot(highAlert);
	} else if (highDayPrice != 0 && data[0].closeVal > highDayPrice) {
		highAlert =
			'For ' +
			coin +
			' ' +
			dataType +
			' in ' +
			interval +
			' Price: ' +
			data[0].closeVal +
			" is above yesterday's high price: " +
			highDayPrice;
		sendMessageToTelegramBot(highAlert);
	}
	if (
		highWeekPrice != 0 &&
		data[0].closeVal > highWeekPrice &&
		data[1].closeVal < highWeekPrice
	) {
		highAlert =
			'For ' +
			coin +
			' ' +
			dataType +
			' in ' +
			interval +
			' Price: ' +
			data[0].closeVal +
			" crossed above previous week's high price: " +
			highWeekPrice;
		sendMessageToTelegramBot(highAlert);
	} else if (highWeekPrice != 0 && data[0].closeVal > highWeekPrice) {
		highAlert =
			'For ' +
			coin +
			' ' +
			dataType +
			' in ' +
			interval +
			' Price: ' +
			data[0].closeVal +
			" is above previous week's high price: " +
			highWeekPrice;
		sendMessageToTelegramBot(highAlert);
	}
	if (
		highWeekPrice != 0 &&
		data[0].closeVal < highWeekPrice &&
		data[1].closeVal > highWeekPrice
	) {
		highAlert =
			'For ' +
			coin +
			' ' +
			dataType +
			' in ' +
			interval +
			' Price: ' +
			data[0].closeVal +
			" dropped below previous week's high price: " +
			highWeekPrice;
		sendMessageToTelegramBot(highAlert);
	} else if (highWeekPrice != 0 && data[0].closeVal < highWeekPrice) {
		highAlert =
			'For ' +
			coin +
			' ' +
			dataType +
			' in ' +
			interval +
			' Price: ' +
			data[0].closeVal +
			" is below previous week's high price: " +
			highWeekPrice;
		sendMessageToTelegramBot(highAlert);
	}

	if (rsiEntry.length > 0) {
		console.log(
			data[0].symbol +
				' ' +
				data[0].interval +
				' ' +
				data[0].endTimeStamp +
				' ' +
				data[0].closeVal +
				' ' +
				data[0].dataType
		);
		var change = data[0].closeVal - data[1].closeVal;
		// console.log(
		// 	change + ' ' + rsiEntry[0].avgGain14Val + ' ' + rsiEntry[0].avgLoss14Val
		// );
		// console.log(
		// 	change + ' ' + rsiEntry[0].avgGain2Val + ' ' + rsiEntry[0].avgLoss2Val
		// );
		if (change >= 0) {
			avgGain14 = (rsiEntry[0].avgGain14Val * 13 + change) / 14;
			avgLoss14 = (rsiEntry[0].avgLoss14Val * 13) / 14;
			avgGain2 = (rsiEntry[0].avgGain2Val * 1 + change) / 2;
			avgLoss2 = (rsiEntry[0].avgLoss2Val * 1) / 2;
		} else {
			avgGain14 = (rsiEntry[0].avgGain14Val * 13) / 14;
			avgLoss14 = (rsiEntry[0].avgLoss14Val * 13 + Math.abs(change)) / 14;
			avgGain2 = (rsiEntry[0].avgGain2Val * 1) / 2;
			avgLoss2 = (rsiEntry[0].avgLoss2Val * 1 + Math.abs(change)) / 2;
		}
	} else {
		for (let i = data.length >= 15 ? 14 : data.length - 1; i >= 0; i--) {
			console.log(
				data[i].symbol +
					' ' +
					data[i].interval +
					' ' +
					data[i].endTimeStamp +
					' ' +
					data[i].closeVal
			);
			if (i != 0) {
				var change = data[i - 1].closeVal - data[i].closeVal;
				change >= 0 ? (gainSum14 += change) : (lossSum14 += Math.abs(change));
			}
		}
		if (data.length >= 15) {
			avgGain14 = gainSum14 / 14;
			avgLoss14 = lossSum14 / 14;

			for (let i = 2; i >= 0; i--) {
				// console.log(
				// 	data[i].symbol +
				// 		' ' +
				// 		data[i].interval +
				// 		' ' +
				// 		data[i].endTimeStamp +
				// 		' ' +
				// 		data[i].closeVal
				// );
				if (i != 0) {
					var change = data[i - 1].closeVal - data[i].closeVal;
					change >= 0 ? (gainSum2 += change) : (lossSum2 += Math.abs(change));
				}
			}

			avgGain2 = gainSum2 / 2;
			avgLoss2 = lossSum2 / 2;
		}
	}

	// console.log(gainSum14 + ' ' + avgGain14 + ' ' + lossSum14 + ' ' + avgLoss14);
	// console.log(avgGain2 + ' ' + avgLoss2);

	if (avgLoss14 > 0) {
		rsi14 = 100 - 100 / (1 + avgGain14 / avgLoss14);
	} else rsi14 = 100;

	if (avgLoss2 > 0) {
		rsi2 = 100 - 100 / (1 + avgGain2 / avgLoss2);
	} else rsi2 = 100;

	console.log(
		'RSI14 for : ' +
			data[0].symbol +
			' ' +
			data[0].interval +
			' ' +
			data[0].endTimeStamp +
			' ' +
			data[0].dataType +
			' is: ' +
			rsi14
	);

	console.log(
		'RSI2 for : ' +
			data[0].symbol +
			' ' +
			data[0].interval +
			' ' +
			data[0].endTimeStamp +
			' ' +
			data[0].dataType +
			' is: ' +
			rsi2
	);

	if (rsiEntry.length >= 2) {
		cumRsi2 = rsiEntry[0].rsi2Val + rsiEntry[1].rsi2Val;
	}

	if (rsiEntry.length >= 14) {
		for (let i = rsiEntry.length - 1; i >= 0; i--) {
			smarsi14 += rsiEntry[i].rsi14Val;
		}
		smarsi14 /= 14;
		console.log('SMARSI14 is: ' + smarsi14);
	}

	// ----- Bullish and Hidden Bullish Divergence ----- //
	if (rsiEntry.length >= 45 && data[0].candleType == 'RED') {
		console.log('Candles in past 20');
		console.log(coin + ' ' + dataType + ' ' + interval + '\n');

		for (let i = 45; i > 0; i--) {
			if (data[i].candleType == 'RED') {
				if (data[i].lowVal >= data[0].lowVal) {
					checkCandles.push(data[i].endTimeStamp);
					console.log(data[i].endTimeStamp + ' ' + data[i].lowVal);
				}
			}
		}
		for (let i = 45; i >= 0; i--) {
			for (let j = checkCandles.length - 1; j >= 0; j--) {
				if (rsiEntry[i].endTimeStamp == checkCandles[j]) {
					console.log(rsiEntry[i].endTimeStamp + ' ' + rsiEntry[i].rsi14Val);
					if (rsiEntry[i].rsi14Val < rsi14) console.log('BULLISH DIVERGENCE');
				}
			}
		}
		for (let i = 45; i > 0; i--) {
			if (rsiEntry[i].rsi14Val >= rsi14) {
				rsiCheckValues.push(rsiEntry[i].endTimeStamp);
				console.log(rsiEntry[i].endTimeStamp + ' ' + rsiEntry[i].rsi14Val);
			}
		}
		for (let i = 45; i >= 0; i--) {
			for (let j = rsiCheckValues.length - 1; j >= 0; j--) {
				if (
					data[i].endTimeStamp == rsiCheckValues[j] &&
					data[i].candleType == 'RED'
				) {
					console.log(data[i].endTimeStamp + ' ' + data[i].lowVal);
					if (data[i].lowVal < data[0].lowVal)
						console.log('HIDDEN BULLISH DIVERGENCE');
				}
			}
		}
	}

	// ----- Bearish and Hidden Bearish Divergence ----- //

	if (rsiEntry.length >= 20 && data[0].candleType == 'GREEN') {
		console.log('Candles in past 20');
		console.log(coin + ' ' + dataType + ' ' + interval + '\n');

		for (let i = 20; i > 0; i--) {
			if (data[i].candleType == 'GREEN') {
				if (data[i].highVal <= data[0].highVal) {
					checkCandles.push(data[i].endTimeStamp);
					console.log(data[i].endTimeStamp + ' ' + data[i].highVal);
				}
			}
		}
		for (let i = 20; i >= 0; i--) {
			for (let j = checkCandles.length - 1; j >= 0; j--) {
				if (rsiEntry[i].endTimeStamp == checkCandles[j]) {
					console.log(rsiEntry[i].endTimeStamp + ' ' + rsiEntry[i].rsi2Val);
					if (rsiEntry[i].rsi2Val > rsi2) console.log('BEARISH DIVERGENCE');
				}
			}
		}
		for (let i = 20; i > 0; i--) {
			if (rsiEntry[i].rsi2Val <= rsi2) {
				rsiCheckValues.push(rsiEntry[i].endTimeStamp);
				console.log(rsiEntry[i].endTimeStamp + ' ' + rsiEntry[i].rsi2Val);
			}
		}
		for (let i = 20; i >= 0; i--) {
			for (let j = rsiCheckValues.length - 1; j >= 0; j--) {
				if (
					data[i].endTimeStamp == rsiCheckValues[j] &&
					data[i].candleType == 'GREEN'
				) {
					console.log(data[i].endTimeStamp + ' ' + data[i].highVal);
					if (data[i].highVal > data[0].highVal)
						console.log('HIDDEN BEARISH DIVERGENCE');
				}
			}
		}
	}

	// ----- RSI14 Alerts ----- //
	var rsi14Alert;
	if (data.length >= 15) {
		if (rsi14 < 20) {
			rsi14Alert =
				'For ' +
				coin +
				' in ' +
				interval +
				' RSI14 is less than 20. Value is: ' +
				rsi14;
			sendMessageToTelegramBot(rsi14Alert);
		}

		if (rsi14 > 80) {
			rsi14Alert =
				'For ' +
				coin +
				' in ' +
				interval +
				' RSI14 is greater than 80. Value is: ' +
				rsi14;
			sendMessageToTelegramBot(rsi14Alert);
		}

		if (
			rsiEntry.length >= 14 &&
			rsi14 > smarsi14 &&
			rsiEntry[1].rsi14Val < smarsi14
		) {
			rsi14Alert =
				'For ' +
				coin +
				' in ' +
				interval +
				' RSI14 crossed above SMA14 of RSI14. Value is: ' +
				rsi14;
			sendMessageToTelegramBot(rsi14Alert);
		}

		if (rsiEntry.length >= 14 && rsi14 > smarsi14) {
			rsi14Alert =
				'For ' +
				coin +
				' in ' +
				interval +
				' RSI14 is above SMA14 of RSI14. Value is: ' +
				rsi14;
			sendMessageToTelegramBot(rsi14Alert);
		}

		if (
			rsiEntry.length >= 14 &&
			rsi14 < smarsi14 &&
			rsiEntry[1].rsi14Val > smarsi14
		) {
			rsi14Alert =
				'For ' +
				coin +
				' in ' +
				interval +
				' RSI14 dropped below SMA14 of RSI14. Value is: ' +
				rsi14;
			sendMessageToTelegramBot(rsi14Alert);
		}

		if (rsiEntry.length >= 14 && rsi14 < smarsi14) {
			rsi14Alert =
				'For ' +
				coin +
				' in ' +
				interval +
				' RSI14 is below SMA14 of RSI14. Value is: ' +
				rsi14;
			sendMessageToTelegramBot(rsi14Alert);
		}

		if (rsi14 < 40) {
			rsi14Alert =
				'For ' +
				coin +
				' in ' +
				interval +
				' RSI14 is below 40. Value is: ' +
				rsi14;
			sendMessageToTelegramBot(rsi14Alert);
		}

		if (rsi14 > 40 && rsi14 < 50) {
			rsi14Alert =
				'For ' +
				coin +
				' in ' +
				interval +
				' RSI14 is between 40 and 50. Value is: ' +
				rsi14;
			sendMessageToTelegramBot(rsi14Alert);
		}

		if (rsi14 > 50 && rsi14 < 60) {
			rsi14Alert =
				'For ' +
				coin +
				' in ' +
				interval +
				' RSI14 is between 50 and 60. Value is: ' +
				rsi14;
			sendMessageToTelegramBot(rsi14Alert);
		}

		if (rsi14 > 60) {
			rsi14Alert =
				'For ' +
				coin +
				' in ' +
				interval +
				' RSI14 is greater than 60. Value is: ' +
				rsi14;
			sendMessageToTelegramBot(rsi14Alert);
		}
	}

	// ----- Bullish and Hidden Bullish Divergence ----- //
	if (rsiEntry.length >= 20 && data[0].candleType == 'RED') {
		console.log('Candles in past 20');
		console.log(coin + ' ' + dataType + ' ' + interval + '\n');

		for (let i = 20; i > 0; i--) {
			if (data[i].candleType == 'RED') {
				if (data[i].lowVal >= data[0].lowVal) {
					checkCandles.push(data[i].endTimeStamp);
					console.log(data[i].endTimeStamp + ' ' + data[i].lowVal);
				}
			}
		}
		for (let i = 20; i >= 0; i--) {
			for (let j = checkCandles.length - 1; j >= 0; j--) {
				if (rsiEntry[i].endTimeStamp == checkCandles[j]) {
					console.log(rsiEntry[i].endTimeStamp + ' ' + rsiEntry[i].rsi2Val);
					if (rsiEntry[i].rsi2Val < rsi2) {
						await divergenceData.create({
							symbol: data[0].symbol,
							interval: data[0].interval,
							startTimeStamp: data[0].startTimeStamp,
							endTimeStamp: data[0].endTimeStamp,
							divExists: true,
							divType: 'BULLISH DIVERGENCE',
							dataType,
						});
					}
				}
			}
		}
		for (let i = 20; i > 0; i--) {
			if (rsiEntry[i].rsi2Val >= rsi2) {
				rsiCheckValues.push(rsiEntry[i].endTimeStamp);
				console.log(rsiEntry[i].endTimeStamp + ' ' + rsiEntry[i].rsi2Val);
			}
		}
		for (let i = 20; i >= 0; i--) {
			for (let j = rsiCheckValues.length - 1; j >= 0; j--) {
				if (
					data[i].endTimeStamp == rsiCheckValues[j] &&
					data[i].candleType == 'RED'
				) {
					console.log(data[i].endTimeStamp + ' ' + data[i].lowVal);
					if (data[i].lowVal < data[0].lowVal)
						console.log('HIDDEN BULLISH DIVERGENCE');
				}
			}
		}
	}

	// ----- Bearish and Hidden Bearish Divergence ----- //

	if (rsiEntry.length >= 20 && data[0].candleType == 'GREEN') {
		console.log('Candles in past 20');
		console.log(coin + ' ' + dataType + ' ' + interval + '\n');

		for (let i = 20; i > 0; i--) {
			if (data[i].candleType == 'GREEN') {
				if (data[i].highVal <= data[0].highVal) {
					checkCandles.push(data[i].endTimeStamp);
					console.log(data[i].endTimeStamp + ' ' + data[i].highVal);
				}
			}
		}
		for (let i = 20; i >= 0; i--) {
			for (let j = checkCandles.length - 1; j >= 0; j--) {
				if (rsiEntry[i].endTimeStamp == checkCandles[j]) {
					console.log(rsiEntry[i].endTimeStamp + ' ' + rsiEntry[i].rsi2Val);
					if (rsiEntry[i].rsi2Val > rsi2) console.log('BEARISH DIVERGENCE');
				}
			}
		}
		for (let i = 20; i > 0; i--) {
			if (rsiEntry[i].rsi2Val <= rsi2) {
				rsiCheckValues.push(rsiEntry[i].endTimeStamp);
				console.log(rsiEntry[i].endTimeStamp + ' ' + rsiEntry[i].rsi2Val);
			}
		}
		for (let i = 20; i >= 0; i--) {
			for (let j = rsiCheckValues.length - 1; j >= 0; j--) {
				if (
					data[i].endTimeStamp == rsiCheckValues[j] &&
					data[i].candleType == 'GREEN'
				) {
					console.log(data[i].endTimeStamp + ' ' + data[i].highVal);
					if (data[i].highVal > data[0].highVal)
						console.log('HIDDEN BEARISH DIVERGENCE');
				}
			}
		}
	}

	// ----- RSI2 Alerts ----- //

	var rsi2Alert;
	if (rsi2 < 10 && data.length >= 15) {
		rsi2Alert =
			'For ' +
			coin +
			' in ' +
			interval +
			' RSI2 is less than 10. Value is: ' +
			rsi2;
		sendMessageToTelegramBot(rsi2Alert);
	}
	if (rsi2 > 90 && data.length >= 15) {
		rsi2Alert =
			'For ' +
			coin +
			' in ' +
			interval +
			' RSI2 is greater than 90. Value is: ' +
			rsi2;
		sendMessageToTelegramBot(rsi2Alert);
	}
	if (cumRsi2 > 90 && data.length >= 15 && rsiEntry.length >= 2) {
		rsi2Alert =
			'For ' +
			coin +
			' in ' +
			interval +
			' Cumulative RSI2 is greater than 90. Value is: ' +
			cumRsi2;
		sendMessageToTelegramBot(rsi2Alert);
	}
	if (cumRsi2 < 10 && data.length >= 15 && rsiEntry.length >= 2) {
		rsi2Alert =
			'For ' +
			coin +
			' in ' +
			interval +
			' Cumulative RSI2 is lesser than 10. Value is: ' +
			cumRsi2;
		sendMessageToTelegramBot(rsi2Alert);
	}
	// ----- Storing RSI2 and RSI14 in Database ----- //

	if (data.length >= 15)
		try {
			await rsiData.create({
				symbol: data[0].symbol,
				interval: data[0].interval,
				startTimeStamp: data[0].startTimeStamp,
				endTimeStamp: data[0].endTimeStamp,
				rsi14Val: rsi14,
				avgGain14Val: avgGain14,
				avgLoss14Val: avgLoss14,
				rsi2Val: rsi2,
				cumRsi2Val: cumRsi2,
				avgGain2Val: avgGain2,
				avgLoss2Val: avgLoss2,
				dataType,
			});
		} catch (error) {
			console.log(error.message);
		}

	// ----- CPR Calculation ----- //

	if (
		interval == '30m' ||
		interval == '1d' ||
		interval == '1w' ||
		interval == '1M'
	) {
		cpr_bc = (data[0].highVal + data[0].lowVal) / 2;
		cpr_pivot = (data[0].highVal + data[0].lowVal + data[0].closeVal) / 3;
		cpr_tc = cpr_pivot - cpr_bc + cpr_pivot;

		try {
			await cprData.create({
				symbol: data[0].symbol,
				interval: data[0].interval,
				startTimeStamp: data[0].startTimeStamp,
				endTimeStamp: data[0].endTimeStamp,
				cprTcVal: cpr_tc,
				cprBcVal: cpr_bc,
				cprPivotVal: cpr_pivot,
				dataType,
			});
		} catch (error) {
			console.log(error);
		}

		cam_l3 = data[0].closeVal - ((data[0].highVal - data[0].lowVal) * 1.1) / 4;
		cam_l4 = data[0].closeVal - ((data[0].highVal - data[0].lowVal) * 1.1) / 2;
		cam_h3 = data[0].closeVal + ((data[0].highVal - data[0].lowVal) * 1.1) / 4;
		cam_h4 = data[0].closeVal + ((data[0].highVal - data[0].lowVal) * 1.1) / 2;
		cam_h5 = (data[0].highVal / data[0].lowVal) * data[0].closeVal;
		cam_l5 = data[0].closeVal - (cam_h5 - data[0].closeVal);
		cam_h6 = cam_h5 + 1.168 * (cam_h5 - cam_h4);
		cam_l6 = data[0].closeVal - (cam_h6 - data[0].closeVal);

		try {
			await camData.create({
				symbol: data[0].symbol,
				interval: data[0].interval,
				startTimeStamp: data[0].startTimeStamp,
				endTimeStamp: data[0].endTimeStamp,
				dataType,
				camL3Val: cam_l3,
				camL4Val: cam_l4,
				camL5Val: cam_l5,
				camL6Val: cam_l6,
				camH3Val: cam_h3,
				camH4Val: cam_h4,
				camH5Val: cam_h5,
				camH6Val: cam_h6,
			});
		} catch (error) {
			console.log(error);
		}

		console.log(
			data[0].symbol +
				' ' +
				data[0].interval +
				' ' +
				data[0].endTimeStamp +
				' ' +
				data[0].highVal +
				' ' +
				data[0].lowVal +
				' ' +
				data[0].closeVal +
				' ' +
				'BC: ' +
				cpr_bc +
				' PIVOT: ' +
				cpr_pivot +
				' TC: ' +
				cpr_tc
		);
		console.log(
			data[0].symbol +
				' ' +
				data[0].interval +
				' ' +
				data[0].endTimeStamp +
				' ' +
				data[0].highVal +
				' ' +
				data[0].lowVal +
				' ' +
				data[0].closeVal +
				' L3: ' +
				cam_l3 +
				' L4: ' +
				cam_l4 +
				' L5: ' +
				cam_l5 +
				' L6: ' +
				cam_l6 +
				' H3: ' +
				cam_h3 +
				' H4: ' +
				cam_h4 +
				' H5: ' +
				cam_h5 +
				' H6: ' +
				cam_h6
		);
	}

	//------ CPR and Camarilla Alerts ------//
	var cprCamAlert;
	if (
		interval == '30m' ||
		interval == '1d' ||
		interval == '1w' ||
		interval == '1M'
	) {
		if (data[0].closeVal > cpr_bc && data[0].closeVal < cpr_tc) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'between BC: ' +
				cpr_bc +
				' and TC: ' +
				cpr_tc;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if (data[0].closeVal > cpr_tc) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'greater than TC:' +
				cpr_tc;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if (data[0].closeVal < cpr_bc) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'lesser than BC:' +
				cpr_bc;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if (
			(data[0].closeVal > cam_l3 && data[0].closeVal < cpr_bc) ||
			(data[0].closeVal < cam_l3 && data[0].closeVal > cpr_bc)
		) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'between L3: ' +
				cam_l3 +
				' and BC: ' +
				cpr_bc;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if (
			(data[0].closeVal > cam_l3 && data[0].closeVal < cam_l4) ||
			(data[0].closeVal < cam_l3 && data[0].closeVal > cam_l4)
		) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'between L3: ' +
				cam_l3 +
				' and L4: ' +
				cam_l4;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if (
			(data[0].closeVal > cam_l4 && data[0].closeVal < cam_l5) ||
			(data[0].closeVal < cam_l4 && data[0].closeVal > cam_l5)
		) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'between L4: ' +
				cam_l4 +
				' and L5: ' +
				cam_l5;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if (
			(data[0].closeVal > cam_l5 && data[0].closeVal < cam_l6) ||
			(data[0].closeVal < cam_l5 && data[0].closeVal > cam_l6)
		) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'between L5: ' +
				cam_l5 +
				' and L6: ' +
				cam_l6;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if (data[0].closeVal < cam_l6) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'lower than L6: ' +
				cam_l6;
			sendMessageToTelegramBot(cprCamAlert);
		}
		if (
			(data[0].closeVal > cam_h3 && data[0].closeVal < cpr_tc) ||
			(data[0].closeVal < cam_h3 && data[0].closeVal > cpr_tc)
		) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'between H3: ' +
				cam_h3 +
				' and TC: ' +
				cpr_tc;
			sendMessageToTelegramBot(cprCamAlert);
		}
		if (
			(data[0].closeVal > cam_h3 && data[0].closeVal < cam_h4) ||
			(data[0].closeVal < cam_h3 && data[0].closeVal > cam_h4)
		) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'between H3: ' +
				cam_h3 +
				' and H4: ' +
				cam_h4;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if (
			(data[0].closeVal > cam_h4 && data[0].closeVal < cam_h5) ||
			(data[0].closeVal < cam_h4 && data[0].closeVal > cam_h5)
		) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'between H4: ' +
				cam_h4 +
				' and H5: ' +
				cam_h5;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if (
			(data[0].closeVal > cam_h5 && data[0].closeVal < cam_h6) ||
			(data[0].closeVal < cam_h5 && data[0].closeVal > cam_h6)
		) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'between H5: ' +
				cam_h5 +
				' and H6: ' +
				cam_h6;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if (data[0].closeVal > cam_h6) {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Price is: ' +
				data[0].closeVal +
				'higher than H6: ' +
				cam_h6;
			sendMessageToTelegramBot(cprCamAlert);
		}

		//------ Types of CPR Alerts -----//
		if ((cpr_tc - cpr_bc) / cpr_tc < 0.05 && interval == '1M') {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Monthly CPR is Narrow. Width is: ' +
				((cpr_tc - cpr_bc) / cpr_tc) * 100;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if ((cpr_tc - cpr_bc) / cpr_tc < 0.025 && interval == '1w') {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Weekly CPR is Narrow. Width is: ' +
				((cpr_tc - cpr_bc) / cpr_tc) * 100;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if ((cpr_tc - cpr_bc) / cpr_tc < 0.0025 && interval == '1d') {
			cprCamAlert =
				'For ' +
				coin +
				' in ' +
				interval +
				' Daily CPR is Narrow. Width is: ' +
				((cpr_tc - cpr_bc) / cpr_tc) * 100;
			sendMessageToTelegramBot(cprCamAlert);
		}

		if (data[0].highVal < cpr_bc) {
			cprCamAlert = 'For ' + coin + ' in ' + interval + ' CPR is Virgin CPR.';
			sendMessageToTelegramBot(cprCamAlert);
		}
	}

	if (cprEntry.length !== 0) {
		switch (true) {
			case cprEntry[0].cprBcVal < cpr_bc &&
				cprEntry[0].cprTcVal > cpr_tc &&
				interval == '1d':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					" Today's CPR is INSIDE the previous day CPR.";
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprBcVal > cpr_bc &&
				cprEntry[0].cprTcVal < cpr_tc &&
				interval == '1d':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					" Today's CPR is OUTSIDE the previous day CPR.";
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprBcVal <= cpr_bc &&
				cprEntry[0].cprTcVal > cpr_bc &&
				cprEntry[0].cprTcVal < cpr_tc &&
				interval == '1d':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					" Today's CPR is UP OVERLAP the previous day CPR.";
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprTcVal >= cpr_tc &&
				cprEntry[0].cprBcVal < cpr_tc &&
				cprEntry[0].cprBcVal > cpr_bc &&
				interval == '1d':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					" Today's CPR is DOWN OVERLAP the previous day CPR.";
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprTcVal < cpr_bc && interval == '1d':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					" Today's CPR is STEP UP the previous day CPR.";
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprBcVal > cpr_tc && interval == '1d':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					" Today's CPR is STEP DOWN the previous day CPR.";
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprBcVal < cpr_bc &&
				cprEntry[0].cprTcVal > cpr_tc &&
				interval == '1w':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Weekly CPR is INSIDE the previous week CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprBcVal > cpr_bc &&
				cprEntry[0].cprTcVal < cpr_tc &&
				interval == '1w':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Weekly CPR is OUTSIDE the previous week CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprBcVal <= cpr_bc &&
				cprEntry[0].cprTcVal > cpr_bc &&
				cprEntry[0].cprTcVal < cpr_tc &&
				interval == '1w':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Weekly CPR is UP OVERLAP the previous week CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprTcVal >= cpr_tc &&
				cprEntry[0].cprBcVal < cpr_tc &&
				cprEntry[0].cprBcVal > cpr_bc &&
				interval == '1w':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Weekly CPR is DOWN OVERLAP the previous week CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprTcVal < cpr_bc && interval == '1w':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Weekly CPR is STEP UP the previous week CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprBcVal > cpr_tc && interval == '1w':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Weekly CPR is STEP DOWN the previous week CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprBcVal < cpr_bc &&
				cprEntry[0].cprTcVal > cpr_tc &&
				interval == '1M':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Monthly CPR is INSIDE the previous month CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprBcVal > cpr_bc &&
				cprEntry[0].cprTcVal < cpr_tc &&
				interval == '1M':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Monthly CPR is OUTSIDE the previous month CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprBcVal <= cpr_bc &&
				cprEntry[0].cprTcVal > cpr_bc &&
				cprEntry[0].cprTcVal < cpr_tc &&
				interval == '1M':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Monthly CPR is UP OVERLAP the previous month CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprTcVal >= cpr_tc &&
				cprEntry[0].cprBcVal < cpr_tc &&
				cprEntry[0].cprBcVal > cpr_bc &&
				interval == '1M':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Monthly CPR is DOWN OVERLAP the previous month CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprTcVal < cpr_bc && interval == '1M':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Monthly CPR is STEP UP the previous month CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cprEntry[0].cprBcVal > cpr_tc && interval == '1M':
				cprCamAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Monthly CPR is STEP DOWN the previous month CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;

			//----- CPR and Camarilla ------//
			case cpr_bc < cam_l6 && cpr_tc > cam_l6:
				cprCamAlert =
					'For ' + coin + ' in ' + interval + ' L6 is between the CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cpr_bc < cam_l5 && cpr_tc > cam_l5:
				cprCamAlert =
					'For ' + coin + ' in ' + interval + ' L5 is between the CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cpr_bc < cam_l4 && cpr_tc > cam_l4:
				cprCamAlert =
					'For ' + coin + ' in ' + interval + ' L4 is between the CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cpr_bc < cam_l3 && cpr_tc > cam_l3:
				cprCamAlert =
					'For ' + coin + ' in ' + interval + ' L3 is between the CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cpr_bc < cam_h3 && cpr_tc > cam_h3:
				cprCamAlert =
					'For ' + coin + ' in ' + interval + ' H3 is between the CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cpr_bc < cam_h4 && cpr_tc > cam_h4:
				cprCamAlert =
					'For ' + coin + ' in ' + interval + ' H4 is between the CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cpr_bc < cam_h5 && cpr_tc > cam_h5:
				cprCamAlert =
					'For ' + coin + ' in ' + interval + ' H5 is between the CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
			case cpr_bc < cam_h6 && cpr_tc > cam_h6:
				cprCamAlert =
					'For ' + coin + ' in ' + interval + ' H6 is between the CPR.';
				sendMessageToTelegramBot(cprCamAlert);
				break;
		}
	}

	//------ Candlestick Calculation ------//
	var candleAlert;
	if (data[0].candleType == 'RED') {
		candleAlert =
			'For ' +
			coin +
			' in ' +
			interval +
			' The Candle is ' +
			data[0].candleType;
		sendMessageToTelegramBot(candleAlert);
	} else {
		candleAlert =
			'For ' +
			coin +
			' in ' +
			interval +
			' The Candle is ' +
			data[0].candleType;
		sendMessageToTelegramBot(candleAlert);
	}

	//----- RPS Calculation -------//

	//----- EMA Calculation -------//

	var newEma9PriceVal = 0,
		newEma13PriceVal = 0,
		newEma21PriceVal = 0,
		newEma34PriceVal = 0,
		newEma55PriceVal = 0,
		newEma89PriceVal = 0,
		newEma100PriceVal = 0,
		newEma200PriceVal = 0;

	if (emaEntry.length > 0) {
		console.log(
			emaEntry[0].symbol +
				' ' +
				emaEntry[0].interval +
				' ' +
				emaEntry[0].endTimeStamp +
				' EMA9: ' +
				emaEntry[0].ema9PriceVal +
				' EMA13: ' +
				emaEntry[0].ema13PriceVal +
				' EMA21: ' +
				emaEntry[0].ema21PriceVal +
				' EMA34: ' +
				emaEntry[0].ema34PriceVal +
				' EMA55: ' +
				emaEntry[0].ema55PriceVal +
				' EMA89: ' +
				emaEntry[0].ema89PriceVal +
				' EMA100: ' +
				emaEntry[0].ema100PriceVal +
				' EMA200: ' +
				emaEntry[0].ema200PriceVal +
				' ' +
				emaEntry[0].dataType
		);
		// console.log(
		// 	change + ' ' + rsiEntry[0].avgGain14Val + ' ' + rsiEntry[0].avgLoss14Val
		// );
		if (emaEntry[0].ema9PriceVal !== 0) {
			var multiplier = 2 / (9 + 1);
			newEma9PriceVal =
				emaEntry[0].ema9PriceVal +
				(data[0].closeVal - emaEntry[0].ema9PriceVal) * multiplier;
		} else {
			if (data.length >= 9) {
				var priceSum = 0;
				for (let i = 8; i >= 0; i--) {
					console.log(
						data[i].symbol +
							' ' +
							data[i].interval +
							' ' +
							data[i].endTimeStamp +
							' ' +
							data[i].closeVal
					);
					priceSum += data[i].closeVal;
					console.log(priceSum);
				}
				console.log(priceSum);
				newEma9PriceVal = priceSum / 9;
			}
		}
		if (emaEntry[0].ema13PriceVal !== 0) {
			var multiplier = 2 / (13 + 1);
			newEma13PriceVal =
				emaEntry[0].ema13PriceVal +
				(data[0].closeVal - emaEntry[0].ema13PriceVal) * multiplier;
		} else {
			if (data.length >= 13) {
				var priceSum = 0;
				for (let i = 12; i >= 0; i--) {
					console.log(
						data[i].symbol +
							' ' +
							data[i].interval +
							' ' +
							data[i].endTimeStamp +
							' ' +
							data[i].closeVal
					);
					priceSum += data[i].closeVal;
				}
				newEma13PriceVal = priceSum / 13;
			}
		}
		if (emaEntry[0].ema21PriceVal !== 0) {
			var multiplier = 2 / (21 + 1);
			newEma21PriceVal =
				emaEntry[0].ema21PriceVal +
				(data[0].closeVal - emaEntry[0].ema21PriceVal) * multiplier;
		} else {
			if (data.length >= 21) {
				var priceSum = 0;
				for (let i = 20; i >= 0; i--) {
					console.log(
						data[i].symbol +
							' ' +
							data[i].interval +
							' ' +
							data[i].endTimeStamp +
							' ' +
							data[i].closeVal
					);
					priceSum += data[i].closeVal;
				}
				newEma21PriceVal = priceSum / 21;
			}
		}
		if (emaEntry[0].ema34PriceVal !== 0) {
			var multiplier = 2 / (34 + 1);
			newEma34PriceVal =
				emaEntry[0].ema34PriceVal +
				(data[0].closeVal - emaEntry[0].ema34PriceVal) * multiplier;
		} else {
			if (data.length >= 34) {
				var priceSum = 0;
				for (let i = 33; i >= 0; i--) {
					console.log(
						data[i].symbol +
							' ' +
							data[i].interval +
							' ' +
							data[i].endTimeStamp +
							' ' +
							data[i].closeVal
					);
					priceSum += data[i].closeVal;
				}
				newEma34PriceVal = priceSum / 34;
			}
		}
		if (emaEntry[0].ema55PriceVal !== 0) {
			var multiplier = 2 / (55 + 1);
			newEma55PriceVal =
				emaEntry[0].ema55PriceVal +
				(data[0].closeVal - emaEntry[0].ema55PriceVal) * multiplier;
		} else {
			if (data.length >= 55) {
				var priceSum = 0;
				for (let i = 54; i >= 0; i--) {
					console.log(
						data[i].symbol +
							' ' +
							data[i].interval +
							' ' +
							data[i].endTimeStamp +
							' ' +
							data[i].closeVal
					);
					priceSum += data[i].closeVal;
				}
				newEma55PriceVal = priceSum / 55;
			}
		}
		if (emaEntry[0].ema89PriceVal !== 0) {
			var multiplier = 2 / (89 + 1);
			newEma89PriceVal =
				emaEntry[0].ema89PriceVal +
				(data[0].closeVal - emaEntry[0].ema89PriceVal) * multiplier;
		} else {
			if (data.length >= 89) {
				var priceSum = 0;
				for (let i = 88; i >= 0; i--) {
					console.log(
						data[i].symbol +
							' ' +
							data[i].interval +
							' ' +
							data[i].endTimeStamp +
							' ' +
							data[i].closeVal
					);
					priceSum += data[i].closeVal;
				}
				newEma89PriceVal = priceSum / 89;
			}
		}
		if (emaEntry[0].ema100PriceVal !== 0) {
			var multiplier = 2 / (100 + 1);
			newEma100PriceVal =
				emaEntry[0].ema100PriceVal +
				(data[0].closeVal - emaEntry[0].ema100PriceVal) * multiplier;
		} else {
			if (data.length >= 100) {
				var priceSum = 0;
				for (let i = 99; i >= 0; i--) {
					console.log(
						data[i].symbol +
							' ' +
							data[i].interval +
							' ' +
							data[i].endTimeStamp +
							' ' +
							data[i].closeVal
					);
					priceSum += data[i].closeVal;
				}
				newEma100PriceVal = priceSum / 100;
			}
		}
		if (emaEntry[0].ema200PriceVal !== 0) {
			var multiplier = 2 / (200 + 1);
			newEma200PriceVal =
				emaEntry[0].ema200PriceVal +
				(data[0].closeVal - emaEntry[0].ema200PriceVal) * multiplier;
		} else {
			if (data.length >= 200) {
				var priceSum = 0;
				for (let i = 199; i >= 0; i--) {
					console.log(
						data[i].symbol +
							' ' +
							data[i].interval +
							' ' +
							data[i].endTimeStamp +
							' ' +
							data[i].closeVal
					);
					priceSum += data[i].closeVal;
				}
				newEma200PriceVal = priceSum / 200;
			}
		}
	}

	//------- EMA Alerts -------//

	if (data.length >= 9) {
		var emaAlert;
		switch (true) {
			case newEma9PriceVal > newEma13PriceVal &&
				newEma9PriceVal != 0 &&
				newEma13PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA9 is greater than EMA13. Value of EMA9 is: ' +
					newEma9PriceVal +
					' Value of EMA13 is: ' +
					newEma13PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;

			case newEma13PriceVal > newEma21PriceVal &&
				newEma13PriceVal != 0 &&
				newEma21PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA13 is greater than EMA21. Value of EMA13 is: ' +
					newEma13PriceVal +
					' Value of EMA21 is: ' +
					newEma21PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma21PriceVal > newEma34PriceVal &&
				newEma21PriceVal != 0 &&
				newEma34PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA21 is greater than EMA34. Value of EMA21 is: ' +
					newEma21PriceVal +
					' Value of EMA34 is: ' +
					newEma34PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma34PriceVal > newEma55PriceVal &&
				newEma34PriceVal != 0 &&
				newEma55PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA34 is greater than EMA55. Value of EMA34 is: ' +
					newEma34PriceVal +
					' Value of EMA55 is: ' +
					newEma55PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma55PriceVal > newEma89PriceVal &&
				newEma55PriceVal != 0 &&
				newEma89PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA55 is greater than EMA89. Value of EMA55 is: ' +
					newEma55PriceVal +
					' Value of EMA89 is: ' +
					newEma89PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma55PriceVal > newEma100PriceVal &&
				newEma55PriceVal != 0 &&
				newEma100PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA55 is greater than EMA100. Value of EMA55 is: ' +
					newEma55PriceVal +
					' Value of EMA100 is: ' +
					newEma100PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma89PriceVal > newEma200PriceVal &&
				newEma89PriceVal != 0 &&
				newEma200PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA89 is greater than EMA200. Value of EMA89 is: ' +
					newEma89PriceVal +
					' Value of EMA200 is: ' +
					newEma200PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma100PriceVal > newEma200PriceVal &&
				newEma100PriceVal != 0 &&
				newEma200PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA100 is greater than EMA200. Value of EMA100 is: ' +
					newEma100PriceVal +
					' Value of EMA200 is: ' +
					newEma200PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma9PriceVal < newEma13PriceVal &&
				newEma9PriceVal != 0 &&
				newEma13PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA9 is lesser than EMA13. Value of EMA9 is: ' +
					newEma9PriceVal +
					' Value of EMA13 is: ' +
					newEma13PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma13PriceVal < newEma21PriceVal &&
				newEma13PriceVal != 0 &&
				newEma21PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA13 is lesser than EMA21. Value of EMA13 is: ' +
					newEma13PriceVal +
					' Value of EMA21 is: ' +
					newEma21PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma21PriceVal < newEma34PriceVal &&
				newEma21PriceVal != 0 &&
				newEma34PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA21 is lesser than EMA34. Value of EMA21 is: ' +
					newEma21PriceVal +
					' Value of EMA34 is: ' +
					newEma34PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma34PriceVal < newEma55PriceVal &&
				newEma34PriceVal != 0 &&
				newEma55PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA34 is lesser than EMA55. Value of EMA34 is: ' +
					newEma34PriceVal +
					' Value of EMA55 is: ' +
					newEma55PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma55PriceVal < newEma89PriceVal &&
				newEma55PriceVal != 0 &&
				newEma89PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA55 is lesser than EMA89. Value of EMA55 is: ' +
					newEma55PriceVal +
					' Value of EMA89 is: ' +
					newEma89PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma89PriceVal < newEma200PriceVal &&
				newEma89PriceVal != 0 &&
				newEma200PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA89 is lesser than EMA200. Value of EMA89 is: ' +
					newEma89PriceVal +
					' Value of EMA200 is: ' +
					newEma200PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case newEma100PriceVal < newEma200PriceVal &&
				newEma100PriceVal != 0 &&
				newEma200PriceVal != 0:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' EMA100 is lesser than EMA200. Value of EMA100 is: ' +
					newEma100PriceVal +
					' Value of EMA200 is: ' +
					newEma200PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma9PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is higher than EMA9. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA9 is: ' +
					newEma9PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma9PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is lesser than EMA9. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA9 is: ' +
					newEma9PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma9PriceVal &&
				data[1].closeVal < newEma9PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price crossed above than EMA9. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA9 is: ' +
					newEma9PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma9PriceVal &&
				data[1].closeVal > newEma9PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price dropped below than EMA9. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA9 is: ' +
					newEma9PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma13PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is higher than EMA13. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA13 is: ' +
					newEma13PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma13PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is lesser than EMA13. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA13 is: ' +
					newEma13PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma13PriceVal &&
				data[1].closeVal < newEma13PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price crossed above than EMA13. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA13 is: ' +
					newEma13PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma13PriceVal &&
				data[1].closeVal > newEma13PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price dropped below than EMA13. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA13 is: ' +
					newEma13PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma21PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is higher than EMA21. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA21 is: ' +
					newEma21PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma21PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is lesser than EMA21. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA21 is: ' +
					newEma21PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma21PriceVal &&
				data[1].closeVal < newEma21PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price crossed above than EMA21. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA21 is: ' +
					newEma21PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma21PriceVal &&
				data[1].closeVal > newEma21PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price dropped below than EMA21. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA21 is: ' +
					newEma21PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma34PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is higher than EMA34. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA34 is: ' +
					newEma34PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma34PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is lesser than EMA34. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA34 is: ' +
					newEma34PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma34PriceVal &&
				data[1].closeVal < newEma34PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price crossed above than EMA34. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA34 is: ' +
					newEma34PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma34PriceVal &&
				data[1].closeVal > newEma34PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price dropped below than EMA34. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA34 is: ' +
					newEma34PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma55PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is higher than EMA55. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA55 is: ' +
					newEma55PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma55PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is lesser than EMA55. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA55 is: ' +
					newEma55PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma55PriceVal &&
				data[1].closeVal < newEma55PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price crossed above than EMA55. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA55 is: ' +
					newEma55PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma55PriceVal &&
				data[1].closeVal > newEma55PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price dropped below than EMA55. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA55 is: ' +
					newEma55PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma89PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is higher than EMA89. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA89 is: ' +
					newEma89PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma89PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is lesser than EMA89. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA89 is: ' +
					newEma89PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma89PriceVal &&
				data[1].closeVal < newEma89PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price crossed above than EMA89. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA89 is: ' +
					newEma89PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma89PriceVal &&
				data[1].closeVal > newEma89PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price dropped below than EMA89. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA89 is: ' +
					newEma89PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma100PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is higher than EMA100. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA100 is: ' +
					newEma100PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma100PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is lesser than EMA100. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA100 is: ' +
					newEma100PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma100PriceVal &&
				data[1].closeVal < newEma100PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price crossed above than EMA100. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA100 is: ' +
					newEma100PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma100PriceVal &&
				data[1].closeVal > newEma100PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price dropped below than EMA100. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA100 is: ' +
					newEma100PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma200PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is higher than EMA200. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA200 is: ' +
					newEma200PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma200PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price is lesser than EMA200. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA200 is: ' +
					newEma200PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal > newEma200PriceVal &&
				data[1].closeVal < newEma200PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price crossed above than EMA200. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA200 is: ' +
					newEma200PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
			case data[0].closeVal < newEma200PriceVal &&
				data[1].closeVal > newEma200PriceVal:
				emaAlert =
					'For ' +
					coin +
					' in ' +
					interval +
					' Price dropped below than EMA200. Close Price is: ' +
					data[0].closeVal +
					' Value of EMA200 is: ' +
					newEma200PriceVal;
				sendMessageToTelegramBot(emaAlert);
				break;
		}
	}

	console.log(
		data[0].symbol +
			' ' +
			data[0].interval +
			' ' +
			data[0].endTimeStamp +
			' ' +
			data[0].closeVal +
			' EMA9: ' +
			newEma9PriceVal +
			' EMA13: ' +
			newEma13PriceVal +
			' EMA21: ' +
			newEma21PriceVal +
			' EMA34: ' +
			newEma34PriceVal +
			' EMA55: ' +
			newEma55PriceVal +
			' EMA89: ' +
			newEma89PriceVal +
			' EMA100: ' +
			newEma100PriceVal +
			' EMA200: ' +
			newEma200PriceVal +
			' ' +
			data[0].dataType
	);

	if (data.length >= 9)
		try {
			await emaData.create({
				symbol: data[0].symbol,
				interval: data[0].interval,
				dataType,
				startTimeStamp: data[0].startTimeStamp,
				endTimeStamp: data[0].endTimeStamp,
				ema9PriceVal: newEma9PriceVal,
				ema13PriceVal: newEma13PriceVal,
				ema21PriceVal: newEma21PriceVal,
				ema34PriceVal: newEma34PriceVal,
				ema55PriceVal: newEma55PriceVal,
				ema89PriceVal: newEma89PriceVal,
				ema100PriceVal: newEma100PriceVal,
				ema200PriceVal: newEma200PriceVal,
			});
		} catch (error) {
			console.log(error);
		}
};
