/**
 * Commonly used match pattern
*/

export default {
	num: {
		type: 'num',
		match: /(\.e?|\b)\d(e-|[\d.oxa-fA-F_])*(\.|\b)/g
	},
	str: {
		type: 'str',
		match: /(["'])(\\[^]|(?!\1)[^\r\n\\])*\1?/g
	},
	strDouble: {
		type: 'str',
		match: /"((?!")[^\r\n\\]|\\[^])*"?/g
	}
}
