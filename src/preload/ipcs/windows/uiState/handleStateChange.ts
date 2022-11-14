import { ipcRenderer } from 'electron';

import { ReactState } from 'shared/types';

import IpcRendererEvent = Electron.IpcRendererEvent;

export async function handleStateChange(listener: (state: ReactState) => void): Promise<void> {
	ipcRenderer.on('newState', (event: IpcRendererEvent, newState: ReactState) => {
		listener(newState)
	});
}
