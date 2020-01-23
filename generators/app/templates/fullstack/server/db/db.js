const Sequelize = require('sequelize');
const logger = require('../lib/logger');

const dbname = process.env.DB_NAME || 'database1.db';
const sequelize = new Sequelize(`sqlite:${dbname}`, {
	define: { timestamps: true, underscored: true },
	logging: s => logger.debug(`DB: ${s}\n`)
});

sequelize.authenticate()
	.then(() => logger.info('Connected to the database: ' + dbname))
	.catch(err => logger.error('Unable to connect to the database:', err));


const Item = sequelize.define('item', {
	id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
	name: { type: Sequelize.TEXT, defaultValue: '' },
}, { timestamps: true, paranoid: true });


const init = () => sequelize.sync();

init();


module.exports = {
	init,
	Item,
	Op: Sequelize.Op,
	sequelize,
};
