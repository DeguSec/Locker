import { ipcMain } from 'electron';

import { ConfigFiles, ConfigManager } from 'main/factories';
import { ReactState } from 'shared/types';

import BrowserWindow = Electron.BrowserWindow;

export function registerRequestReactByIPC(win: BrowserWindow, configManager: ConfigManager) {
	ipcMain.handle('requestReactState', () => {
		const reactState = configManager.getConfigData<ReactState>(ConfigFiles.REACT_STATE);
		win.webContents.send('newState', reactState);
	});
}
