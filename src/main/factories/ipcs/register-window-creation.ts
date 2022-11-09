// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcMain } from 'electron'

import { WindowCreationByIPC, BrowserWindowOrNull } from 'shared/types'

export function registerWindowCreationByIPC({
	channel,
	callback,
	window: createWindow,
}: WindowCreationByIPC) {
	let window: BrowserWindowOrNull

	ipcMain.handle(channel, (event) => {
		if (!createWindow || window) return

		window = createWindow()

		window!.on('closed', () => (window = null))

		if(callback) callback(window!, event)
	})
}
