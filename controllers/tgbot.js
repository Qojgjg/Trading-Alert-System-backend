import { Telegraf } from 'telegraf';

const BOT_TOKEN = '5363089488:AAHpGQToIoZkgr4uVM1r6CDX9GqAxZLRbU0';

const bot = new Telegraf(BOT_TOKEN);

var i = 0;
var alertMsg = '',
	alertArray = [];

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export const sendMessageToTelegramBot = (alert) => {
	bot.telegram.sendMessage(1177067598, alert);
	bot.telegram.sendMessage(413091776, alert);
	bot.telegram.sendMessage(380083526, alert);
	// console.log(alert);

	alertArray.push(alert);
	if (alertArray.length >= 10)
		for (let i = 9; i >= 0; i--) {
			sleep(1000).then(() => {
				try {
				} catch (error) {
					console.log(error.message);
				}
			});
		}

	// setTimeout(() => {
	// 	console.log('World! ' + Date().toString());
	// }, 500);
	// bot.telegram.sendMessage(1896337566, alert);
};

// (alert) => {
// 	// bot.telegram.sendMessage(-708924784, alert);

// };
