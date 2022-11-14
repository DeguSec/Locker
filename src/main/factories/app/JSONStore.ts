import * as fs from 'fs';
import * as path from 'path';

import { app } from 'electron';

import { LooseObject } from 'shared/types';

function parseDataFile<T>(filePath: string, defaults: T) {
	try {
		return JSON.parse(fs.readFileSync(filePath).toString());
	} catch(error) {
		return defaults;
	}
}

export const configFolder = path.join(app.getPath('userData'), `configs/`);

export class JSONStore<T> {
	private readonly configName: string;

	private readonly storePath: string;

	private readonly data: LooseObject;

	constructor(configName: string, defaults: T) {
		this.configName = configName;
		this.storePath = path.join(configFolder, `${configName}.json`);
		this.data = parseDataFile<T>(this.storePath, defaults);
	}

	/**
	 * Will Get a value by a given key name
	 * @param key the name of the key to get the value of
	 */
	public get(key: string): any {
		return this.data[key];
	}

	/**
	 * Will set a value in the store
	 * @param key the key to identify the value in the object
	 * @param val the value to set the key too
	 */
	public set(key: string, val: any): void {
		this.data[key] = val;

		try {
			fs.writeFileSync(this.storePath, JSON.stringify(this.data));
		} catch(err) {
			console.error(`[DeguSec Locker] Error Saving config file ${this.configName}...\n${err}`);
		}
	}

	/**
	 * Get all the data inside the JSON store file
	 */
	public getData(): LooseObject {
		return this.data;
	}
}
