import { ipcMain } from 'electron';

import { Panes } from 'shared/types';

import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import BrowserWindow = Electron.BrowserWindow;

export function registerChangePaneByIPC(win: BrowserWindow) {
	ipcMain.handle('changePaneState', (event: IpcMainInvokeEvent, pane: Panes) => {
		win.webContents.send('newPaneState', pane);
	});
}
