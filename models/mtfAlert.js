import { sendMessageToTelegramBot } from '../controllers/tgbot.js';

var mtfAlertArray = [];
var intervalArray = [];
var uniqueAlerts = [];
var rsi2Alert;
var mtfAlert;

export const sendNormalRSI2Alert = () => {
	for (let i = 0; i < mtfAlertArray.length; i++) {
		for (let j = 0; j < mtfAlertArray[i][2].length; j++) {
			switch (mtfAlertArray[i][2][j].alertType) {
				case 'BUDRSI2':
					rsi2Alert =
						'For ' +
						mtfAlertArray[i][0] +
						' in ' +
						mtfAlertArray[i][2][j].interval +
						' BULLISH DIVERGENCE';
					sendMessageToTelegramBot(rsi2Alert);
					break;
				case 'BEDRSI2':
					rsi2Alert =
						'For ' +
						mtfAlertArray[i][0] +
						' in ' +
						mtfAlertArray[i][2][j].interval +
						' BEARISH DIVERGENCE';
					sendMessageToTelegramBot(rsi2Alert);
					break;
				case 'HBUDRSI2':
					rsi2Alert =
						'For ' +
						mtfAlertArray[i][0] +
						' in ' +
						mtfAlertArray[i][2][j].interval +
						' HIDDEN BULLISH DIVERGENCE';
					sendMessageToTelegramBot(rsi2Alert);
					break;
				case 'HBEDRSI2':
					rsi2Alert =
						'For ' +
						mtfAlertArray[i][0] +
						' in ' +
						mtfAlertArray[i][2][j].interval +
						' HIDDEN BEARISH DIVERGENCE';
					sendMessageToTelegramBot(rsi2Alert);
					break;
				case 'RSI2<10':
					rsi2Alert =
						'For ' +
						mtfAlertArray[i][0] +
						' in ' +
						mtfAlertArray[i][2][j].interval +
						' RSI2 is less than 10.';
					sendMessageToTelegramBot(rsi2Alert);
					break;
				case 'RSI2>90':
					rsi2Alert =
						'For ' +
						mtfAlertArray[i][0] +
						' in ' +
						mtfAlertArray[i][2][j].interval +
						' RSI2 is greater than 90.';
					sendMessageToTelegramBot(rsi2Alert);
					break;
			}
		}
	}
};

export const checkForMTFAlert = (
	coin,
	interval,
	dataType,
	alertType,
	val1,
	val2
) => {
	console.log(
		'Coin: ' +
			coin +
			' Interval: ' +
			interval +
			' ' +
			dataType +
			' ' +
			alertType +
			' ' +
			val1 +
			' ' +
			val2
	);

	if (mtfAlertArray.length == 0) {
		mtfAlertArray.push([coin, dataType, [{ interval, alertType }]]);
	}

	for (let i = mtfAlertArray.length - 1; i >= 0; i--) {
		if (mtfAlertArray[i][0] == coin && mtfAlertArray[i][1] == dataType) {
			mtfAlertArray[i][2].push({ interval, alertType });
			break;
		} else if (i == 0) {
			mtfAlertArray.push([coin, dataType, [{ interval, alertType }]]);
		}

		// console.log(mtfAlertArray[i][2]);
	}

	// console.log(mtfAlertArray[i][2]);
};

export const sendMtfOrRsi2Alert = () => {
	for (let i = 0; i < mtfAlertArray.length; i++) {
		console.log(mtfAlertArray[i][0] + ' ' + mtfAlertArray[i][1]);
		for (let j = 0; j < mtfAlertArray[i][2].length; j++) {
			console.log(mtfAlertArray[i][2][j].interval);

			intervalArray.push(mtfAlertArray[i][2][j].interval);
		}
		uniqueAlerts = [...new Set(intervalArray)];
		intervalArray = [];
		console.log(uniqueAlerts);

		if (uniqueAlerts.length == 1) {
			sendNormalRSI2Alert();
			uniqueAlerts.pop();
		} else {
			console.log('Multitime Frame Alert');

			if (uniqueAlerts.includes('1d')) {
				if (uniqueAlerts.includes('8h')) {
					if (uniqueAlerts.includes('2h')) {
						if (uniqueAlerts.includes('30m')) {
							mtfAlert = 'MTF Alert for 1d, 8h, 2h, 30m';
							sendMessageToTelegramBot(mtfAlert);
						} else {
							mtfAlert = 'MTF Alert for 1d, 8h, 2h';
							sendMessageToTelegramBot(mtfAlert);
						}
					} else {
						mtfAlert = 'MTF Alert for 1d, 8h';
						sendMessageToTelegramBot(mtfAlert);
					}
				} else {
					sendNormalRSI2Alert();
				}
			}
			if (uniqueAlerts.includes('12h')) {
				if (uniqueAlerts.includes('4h')) {
					if (uniqueAlerts.includes('1h')) {
						if (uniqueAlerts.includes('15m')) {
							mtfAlert = 'MTF Alert for 12h, 4h, 1h, 15m';
							sendMessageToTelegramBot(mtfAlert);
						} else {
							mtfAlert = 'MTF Alert for 12h, 4h, 1h';
							sendMessageToTelegramBot(mtfAlert);
						}
					} else {
						mtfAlert = 'MTF Alert for 12h, 4h';
						sendMessageToTelegramBot(mtfAlert);
					}
					if (uniqueAlerts.includes('30m')) {
						if (uniqueAlerts.includes('15m')) {
							mtfAlert = 'MTF Alert for 12h, 4h, 1h, 15m';
							sendMessageToTelegramBot(mtfAlert);
						} else {
							mtfAlert = 'MTF Alert for 12h, 4h, 30m';
							sendMessageToTelegramBot(mtfAlert);
						}
					} else {
						mtfAlert = 'MTF Alert for 12h, 4h';
						sendMessageToTelegramBot(mtfAlert);
					}
				} else {
					sendNormalRSI2Alert();
				}
			}

			if (uniqueAlerts.includes('8h')) {
				if (uniqueAlerts.includes('2h')) {
					if (uniqueAlerts.includes('30m')) {
						if (uniqueAlerts.includes('5m')) {
							mtfAlert = 'MTF Alert for 8h, 2h, 30m, 5m';
							sendMessageToTelegramBot(mtfAlert);
						} else {
							mtfAlert = 'MTF Alert for 8h, 2h, 30m';
							sendMessageToTelegramBot(mtfAlert);
						}
					} else {
						mtfAlert = 'MTF Alert for 8h, 2h';
						sendMessageToTelegramBot(mtfAlert);
					}
				} else {
					sendNormalRSI2Alert();
				}
			}

			if (uniqueAlerts.includes('4h')) {
				if (uniqueAlerts.includes('1h')) {
					if (uniqueAlerts.includes('15m')) {
						if (uniqueAlerts.includes('5m')) {
							mtfAlert = 'MTF Alert for 4h, 1h, 15m, 5m';
							sendMessageToTelegramBot(mtfAlert);
						} else {
							mtfAlert = 'MTF Alert for 4h, 1h, 15m';
							sendMessageToTelegramBot(mtfAlert);
						}
					} else {
						mtfAlert = 'MTF Alert for 4h, 1h';
						sendMessageToTelegramBot(mtfAlert);
					}
				} else {
					sendNormalRSI2Alert();
				}
				if (uniqueAlerts.includes('30m')) {
					if (uniqueAlerts.includes('15m')) {
						if (uniqueAlerts.includes('5m')) {
							mtfAlert = 'MTF Alert for 4h, 30m, 15m, 5m';
							sendMessageToTelegramBot(mtfAlert);
						} else {
							mtfAlert = 'MTF Alert for 4h, 30m, 15m';
							sendMessageToTelegramBot(mtfAlert);
						}
					} else {
						mtfAlert = 'MTF Alert for 4h, 30m';
						sendMessageToTelegramBot(mtfAlert);
					}
				} else {
					sendNormalRSI2Alert();
				}
			}

			if (uniqueAlerts.includes('1h')) {
				if (uniqueAlerts.includes('15m')) {
					if (uniqueAlerts.includes('5m')) {
						mtfAlert = 'MTF Alert for 1h, 15, 5m';
						sendMessageToTelegramBot(mtfAlert);
					} else {
						mtfAlert = 'MTF Alert for 1h, 15m';
						sendMessageToTelegramBot(mtfAlert);
					}
				} else {
					sendNormalRSI2Alert();
				}
			}
		}
		uniqueAlerts = [];
	}
};
