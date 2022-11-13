import { registerChangePaneByIPC } from 'main/factories/ipcs/registerHandleChangePane';

import BrowserWindow = Electron.BrowserWindow;

export function registerChangePaneCallByIPC(win: BrowserWindow) {
	registerChangePaneByIPC(win);
}
