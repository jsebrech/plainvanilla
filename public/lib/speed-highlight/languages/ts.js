import js from './js.js'

export default [
	{
		type: 'type',
		match: /:\s*(any|void|number|boolean|string|object|never|enum)\b/g
	},
	{
		type: 'kwd',
		match: /\b(type|namespace|typedef|interface|public|private|protected|implements|declare|abstract|readonly)\b/g
	},
	...js
]
