import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import eslintParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
	{
		languageOptions: {
			parser: eslintParser,
			parserOptions: {
				ecmaVersion: 2018,
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': eslintPluginTypescript,
			prettier: eslintPluginPrettier,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',
			'no-var': 'warn',
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variableLike',
					format: ['camelCase'],
					leadingUnderscore: 'allow',
				},
				{
					selector: 'function',
					format: ['camelCase'],
				},
				{
					selector: 'class',
					format: ['PascalCase'],
				},
				{
					selector: 'enum',
					format: ['PascalCase'],
				},
				{
					selector: 'interface',
					format: ['PascalCase'],
					custom: {
						regex: '^I[A-Z]',
						match: true,
					},
				},
				{
					selector: 'typeAlias',
					format: ['PascalCase'],
				},
				{
					selector: 'enumMember',
					format: ['UPPER_CASE'],
				},
			],
			'prettier/prettier': 'error',
		},
	},
];
