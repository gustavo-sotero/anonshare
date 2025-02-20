import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN || '');
bot.catch((error) => {
	console.log('Erro não tratado:', error);
});

export { bot };
