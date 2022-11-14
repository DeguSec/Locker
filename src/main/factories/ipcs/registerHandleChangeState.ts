import { ipcMain } from 'electron';

import { ConfigFiles, ConfigManager } from 'main/factories';
import { ReactState, Themes } from 'shared/types';

import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import BrowserWindow = Electron.BrowserWindow;


function handleConfigData(state: ReactState, configManager: ConfigManager): ReactState {
	const defaults: ReactState = {};
	if(state.theme) defaults.theme = state.theme;

	try {
		const configData: ReactState = configManager.getConfigData<ReactState>('reactPreferences', defaults);
		// Add more to if conditional as the React sate expands what it needs to save
		if(!state.theme) return configData;

		const newConfigData: ReactState = {
			theme: state.theme ?? configData.theme
		};

		configManager.setConfigData<ReactState>(ConfigFiles.REACT_STATE, newConfigData);
		return newConfigData;
	} catch(err) {
		const defaultConfig: ReactState = {
			theme: Themes.LIGHT
		};

		configManager.createConfig<ReactState>(ConfigFiles.REACT_STATE, defaultConfig);
		return defaultConfig;
	}
}

export function registerChangeStateByIPC(win: BrowserWindow, configManager: ConfigManager) {
	ipcMain.handle('changeState', (event: IpcMainInvokeEvent, state: ReactState) => {

		const stateFromConfig: ReactState = handleConfigData(state, configManager);

		win.webContents.send('newState', {
			...state,
			stateFromConfig
		});
	});
}
