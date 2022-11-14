import * as fs from 'fs';
import * as path from 'path';

import { configFolder, JSONStore } from 'main/factories/app/JSONStore';
import { LooseObject } from 'shared/types';

import ErrnoException = NodeJS.ErrnoException;

export class ConfigManager {
	private configFiles: Map<string, JSONStore<any>> = new Map<string, JSONStore<any>>();

	constructor() {
		try {
			if (!fs.existsSync(configFolder)) fs.mkdirSync(configFolder);
			// TODO: Load all json config files from the configs dir
			this.walkConfigFiles(configFolder, (configs: Array<string>) => {
				const jsonOnlyConfigs = configs.filter((config: string) => config.endsWith('.json'));
				jsonOnlyConfigs.forEach((config: string) => {
					const filename: string = config.substring(configFolder.length).split('.')[0];
					this.getConfigData<any>(filename);
					// eslint-disable-next-line no-console
					console.info(`[DeguSec Locker] fetched config ${filename}...`);
				});
			});
		} catch(err) {
			console.error(`[DeguSec Locker] Failed to start config manager.\n${err}`);
		}
	}

	public getConfigData<T>(configName: string, configDefaults?: T): T {
		const config: JSONStore<T> | undefined = this.configFiles.get(configName);
		if(!config) {
			const fetchedConfig: JSONStore<any> = new JSONStore<any>(configName, configDefaults ?? {});
			this.configFiles.set(configName, fetchedConfig);
			return fetchedConfig.getData() as T;
		}
		return config.getData() as T;
	}

	public setConfigData<T>(configName: string, newData: LooseObject): boolean {
		const config: JSONStore<T> = this.configFiles.get(configName) as JSONStore<T>;
		if(!config) {
			try {
				return this.createConfig<T>(configName, newData as T);
			} catch(err) {
				console.error(err);
			}
		}
		const keys: Array<string> = Object.keys(newData);
		keys.forEach((key: string) => config.set(key, newData[key]));
		this.configFiles.set(configName, config);
		return true;
	}

	public createConfig<T>(configName: string, data: T): boolean {
		if(this.configFiles.has(configName))
			throw Error('[DeguSec Locker] Attempted to create a config that already exists please use ConfigManager.setConfigData');
		const config: JSONStore<T> = new JSONStore<T>(configName, data);
		this.configFiles.set(configName, config);
		return true;
	}

	private walkConfigFiles(dir: string, done: (res: Array<string>) => void): void {
		let results: Array<string> = [];
		fs.readdir(dir, (error: ErrnoException| null, list: Array<string>) => {
			if (error) throw Error(`[DeguSec Locker] error walking directory ${error}`);

			let pending = list.length;
			if (!pending) {
				done(results);
				return;
			}

			list.forEach((file) => {
				file = path.resolve(dir, file);

				fs.stat(file, (error1: ErrnoException| null, stat) => {
					if(error1) throw Error(`[DeguSec Locker] error walking directory ${error1}`);

					if (stat && stat.isDirectory()) {
						this.walkConfigFiles(file, (res) => {
							results = results.concat(res);
							if (!--pending) done(results);
						});
					} else {
						results.push(file);
						if (!--pending) done(results);
					}
				});
			});
		});
	};
}

export enum ConfigFiles {
	REACT_STATE = 'reactPreferences'
}
