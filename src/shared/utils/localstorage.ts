/**
 * @type {import("./path/to/module").default}
 */

/**
 * Creates a Json for item from local storage that is same as key parameters
 * @param {string} key item key from local storage
 * @returns {T | undefined} returns a Json parsed state or undefined.
 */
export function loadState<T>(key: string): T | undefined {
	try {
		const serializedState = localStorage.getItem(key);
		if (!serializedState) return undefined;
		return JSON.parse(serializedState);
	} catch {
		return undefined;
	}
}

/**
 * Creates a Json local storage state
 * @param {any} state state
 * @param {string | undefined} key item key
 */
export const saveState = (state: any, key?: string): void => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem(key || "generic:state", serializedState);
	} catch {
		// @ts-ignore
	}
};
