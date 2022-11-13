import { ipcRenderer } from 'electron';

import { Panes } from 'shared/types';

import IpcRendererEvent = Electron.IpcRendererEvent;

export async function handlePaneChange(listener: (pane: Panes) => void) {
	ipcRenderer.on('newPaneState', (event: IpcRendererEvent, newPane: Panes) => {
		listener(newPane)
	});
}
