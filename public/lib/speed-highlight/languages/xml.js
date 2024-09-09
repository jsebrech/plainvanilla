export let property = '\\s*(\\s+[a-z-]+\\s*(=\\s*([^"\']\\S*|("|\')(\\\\[^]|(?!\\4)[^])*\\4?)?)?\\s*)*',
	xmlElement = {
		match: RegExp(`<\/?[a-z_-]+${property}\/?>`, 'g'),
		sub: [
			{
				type: 'var',
				match: /^<\/?[^\s>\/]+/g,
				sub: [
					{
						type: 'oper',
						match: /^<\/?/g
					}
				]
			},
			{
				type: 'str',
				match: /=\s*([^"']\S*|("|')(\\[^]|(?!\2)[^])*\2?)/g,
				sub: [
					{
						type: 'oper',
						match: /^=/g
					}
				]
			},
			{
				type: 'oper',
				match: /\/?>/g
			},
			{
				type: 'class',
				match: /[a-z-]+/gi
			}
		]
	};

export default [
	{
		match: /<!--((?!-->)[^])*-->/g,
		sub: 'todo'
	},
	{
		type: 'class',
		match: RegExp(`<\\?xml${property}\\?>`, 'gi'),
		sub: [
			{
				type: 'oper',
				match: /^<\?|\?>$/g
			},
			{
				type: 'str',
				match: /"[^"]*"|'[^']*'/g
			},
			{
				type: 'var',
				match: /xml/gi
			}
		]
	},
	{
		type: 'class',
		match: /<!\[CDATA\[[\s\S]*?\]\]>/gi
	},
	xmlElement,
	{
		type: 'var',
		match: /&(#x?)?[\da-z]{1,8};/gi
	}
]