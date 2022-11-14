// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

import { IPC } from 'shared/constants';

export function whenAboutWindowClose(fn: (...args: Array<any>) => void) {
	const channel = IPC.WINDOWS.ABOUT.WHEN_WINDOW_CLOSE;

	ipcRenderer.on(channel, (_, ...args) => {
		fn(...args);
	});
}
