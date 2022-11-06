import { join } from 'path'

// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron'

import { createWindow } from 'main/factories'
import { ENVIRONMENT } from 'shared/constants'
import { displayName } from '~/package.json'

export async function MainWindow() {
	const window = createWindow({
		id: 'main',
		title: displayName,
		width: 700,
		height: 473,
		show: false,
		center: true,
		movable: true,
		resizable: true,
		alwaysOnTop: false,
		autoHideMenuBar: true,

		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
		},
	})

	window.webContents.on('did-finish-load', () => {
		if (ENVIRONMENT.IS_DEV) {
			window.webContents.openDevTools({ mode: 'detach' })
		}

		window.show()
	})

	window.on('close', () =>
		BrowserWindow.getAllWindows().forEach((browserWin) => browserWin.destroy())
	)

	return window
}
