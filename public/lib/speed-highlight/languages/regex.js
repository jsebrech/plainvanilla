export default [
	{
		match: /^(?!\/).*/gm,
		sub: 'todo'
	},
	{
		type: 'num',
		match: /\[((?!\])[^\\]|\\.)*\]/g
	},
	{
		type: 'kwd',
		match: /\||\^|\$|\\.|\w+($|\r|\n)/g
	},
	{
		type: 'var',
		match: /\*|\+|\{\d+,\d+\}/g
	}
];
export let type = 'oper';
