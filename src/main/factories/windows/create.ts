import { join } from 'path'

// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron'
import { createFileRoute, createURLRoute } from 'electron-router-dom'

import { ENVIRONMENT } from 'shared/constants'
import { WindowProps } from 'shared/types'

export function createWindow({ id, ...settings }: WindowProps) {
	const window = new BrowserWindow(settings)

	const devServerURL = createURLRoute(process.env.ELECTRON_RENDERER_URL!, id)

	const fileRoute = createFileRoute(
		join(__dirname, '../renderer/index.html'),
		id
	)

	if(ENVIRONMENT.IS_DEV) window.loadURL(devServerURL)
	else window.loadFile(...fileRoute)

	window.on('closed', window.destroy)

	return window
}
