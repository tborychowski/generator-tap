import { get, save, del } from './base';


const Table1 = {
	base: 'table1',
	get () { return get(this.base); },
	getOne (id) { return get(`${this.base}/${id}`); },
	save (data) { return save(this.base, data); },
	del (id) { return del(`${this.base}/${id}`); }
};


export default {
	Table1,
};
