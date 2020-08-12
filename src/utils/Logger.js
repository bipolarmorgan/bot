const chalk = require('chalk');
const moment = require('moment');
const { settings } = require('../../config.json');

function timestamp(thread = 'Server') {
	return `[${moment().format('YYYY-MM-DD HH:mm:ss')}] [${thread} Thread]`;
}

module.exports = {
	info: function (contents, thread = 'Server') {
		console.log(`${timestamp(thread)} ${chalk.black.bgWhite('[INFO]')} : ${contents}`);
	},
	error: function (contents, thread = 'Server') {
		console.error(`${timestamp(thread)} ${chalk.black.bgRed('[ERROR]')} : ${contents}`);
		if (settings['tracing']) {
			console.error(chalk.black.bgRed('[ERROR_TRACE]'));
			console.trace(contents);
			console.error(chalk.black.bgRed('[/ERROR_TRACE]'));
		}
	},
	warn: function (contents, thread = 'Server') {
		if (settings['warnings']) {
			console.log(`${timestamp(thread)} ${chalk.black.bgYellow('[WARNING]')} : ${contents}`);
			if (settings['tracing']) {
				console.error(chalk.black.bgYellow('[WARNING_TRACE]'));
				console.trace(contents);
				console.error(chalk.black.bgYellow('[/WARNING_TRACE]'));
			}
		}
	},
	debug: function (contents, thread = 'Server') {
		if (settings['debug']) {
			console.debug(`${timestamp(thread)} ${chalk.black.bgGreen('[DEBUG]')} : ${contents}`);
		}
	}
}