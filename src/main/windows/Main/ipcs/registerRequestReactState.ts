import { ConfigManager, registerRequestReactByIPC } from 'main/factories';

import BrowserWindow = Electron.BrowserWindow;

export function registerRequestReactStateCallByIPC(win: BrowserWindow, configManager: ConfigManager) {
	registerRequestReactByIPC(win, configManager);
}
