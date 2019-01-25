#!/usr/bin/env node
const Args = require('arg-parser');
const chalk = require('chalk');
const ora = require('ora');


function run (params) {
	const spinner = ora('Loading...').start();

	console.log(chalk.cyan('Done!'));
	spinner.succeed();
}


const args = new Args('<%= name %>', '1.0', '');
if (args.parse()) run(args.params);
