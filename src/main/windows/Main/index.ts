import { join } from 'path'

// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron'

import { ConfigFiles, ConfigManager, createWindow } from 'main/factories'
import { ENVIRONMENT } from 'shared/constants'
import { Panes, ReactState } from 'shared/types';
import { displayName } from '~/package.json'

export async function MainWindow(configManager: ConfigManager) {
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
		frame: true,

		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
		},
	});

	window.webContents.on('did-finish-load', () => {
		if (ENVIRONMENT.IS_DEV) {
			window.webContents.openDevTools({ mode: 'detach' });
		}

		window.show();

		try {
			// This must use the spread operator else it will save the pane to be opened
			const reactState = {
				...configManager.getConfigData<ReactState>(ConfigFiles.REACT_STATE)
			};
			// TODO: Either load login pane or setup pane if container is setup has to be done like below else it will cause the file to save the pane
			reactState.pane = Panes.SETUP_PANE;

			window.webContents.send('newState', reactState);
		} catch(err) {
			console.error(`[DeguSec Locker] An error occurred when sending initial react config state to render proc...`);
		}
	});


	window.webContents.on('devtools-reload-page', () => {
		try {
			window.webContents.send('newState', configManager.getConfigData<ReactState>(ConfigFiles.REACT_STATE));
		} catch(err) {
			console.error(`[DeguSec Locker] An error occurred when sending initial react config state to render proc...`);
		}
	});

	window.on('close', () =>
		BrowserWindow.getAllWindows().forEach((browserWin) => browserWin.destroy())
	);

	return window;
}
