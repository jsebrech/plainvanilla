import todo from './todo.js';

export default [
	{
		type: 'kwd',
		match: /@\w+/g
	},
	{
		type: 'class',
		match: /{[\w\s|<>,.@\[\]]+}/g
	},
	{
		type: 'var',
		match: /\[[\w\s="']+\]/g
	},
	...todo
];
export let type = 'cmnt';
