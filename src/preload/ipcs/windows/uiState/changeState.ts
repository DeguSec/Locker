import { ipcRenderer } from 'electron';

import { ReactState } from 'shared/types';

export async function changeState(state: ReactState): Promise<void> {
	await ipcRenderer.invoke('changeState', state);
}
