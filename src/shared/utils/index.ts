import { Themes } from 'shared/types';
import { author as _author, name } from '~/package.json'

const author = _author.name ?? _author
const authorInKebabCase = author.replace(/\s+/g, '-')
const appId = `com.${authorInKebabCase}.${name}`.toLowerCase()

/**
 * @param {string} id
 * @description Create the app id using the name and author from package.json transformed to kebab case if the id is not provided.
 * @default 'com.{author}.{app}' - the author and app comes from package.json
 * @example
 * makeAppId('com.example.app')
 * // => 'com.example.app'
 */
export function makeAppId(id: string = appId): string {
	return id
}

export function themeIdToReadableString(theme: Themes): string {
	switch(theme) {
		case Themes.SYSTEM: return 'System';
		case Themes.LIGHT: return 'Light';
		case Themes.DARK: return 'Dark';
		case Themes.JASPER_CUSTOM: return 'Jasper Custom';
		default: return 'System';
	}
}

export function stringToTheme(theme: string): Themes {
	switch(theme) {
		case 'SYSTEM': return Themes.SYSTEM;
		case 'LIGHT': return Themes.LIGHT;
		case 'DARK': return Themes.DARK;
		case 'JASPER_CUSTOM': return Themes.JASPER_CUSTOM;
		default: return Themes.SYSTEM;
	}
}
