// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

export async function sendData(data: object) {
	await ipcRenderer.invoke('test_data', data);
}
