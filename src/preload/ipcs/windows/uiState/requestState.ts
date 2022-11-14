import { ipcRenderer } from 'electron';

export async function requestState(): Promise<void> {
	await ipcRenderer.invoke('requestReactState');
}
