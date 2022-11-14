import { ConfigManager, registerChangeStateByIPC } from 'main/factories';

import BrowserWindow = Electron.BrowserWindow;

export function registerChangeStateCallByIPC(win: BrowserWindow, configManager: ConfigManager) {
	registerChangeStateByIPC(win, configManager);
}
