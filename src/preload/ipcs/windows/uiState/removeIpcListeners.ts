import { ipcRenderer } from 'electron';

export async function removeIpcListeners(): Promise<void> {
	ipcRenderer.removeAllListeners('newState');
}
