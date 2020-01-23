const {Note} = require('./db');


function getOne (id) {
	return Note.findByPk(id);
}

function get (query) {
	const where = {};
	if (query.folder) where.folder = query.folder;
	return Note.findAll({ where, order: [['title', 'ASC'], ['id', 'DESC']] });
}

// add new
function post (data) {
	const createFn = Array.isArray(data) ? 'bulkCreate' : 'create';
	return Note[createFn](data);
}

// update
function put (id, data) {
	return Note.update(data, { where: { id } }).then(() => getOne(id));
}

// delete
function del (id) {
	return Note.destroy({ where: { id } });
}


module.exports = {
	getOne,
	get,
	post,
	put,
	del
};
