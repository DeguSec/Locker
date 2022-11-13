import { ipcRenderer } from 'electron';

import { Panes } from 'shared/types';

export async function changePane(newPane: Panes) {
	await ipcRenderer.invoke('changePaneState', newPane);
}
