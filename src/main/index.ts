// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron';

import { registerTestDataCallByIPC } from 'main/windows/Main/ipcs/register-handle-test-data';
import { registerChangeStateCallByIPC } from 'main/windows/Main/ipcs/registerHandleChangeState';

import { ConfigManager, makeAppSetup, makeAppWithSingleInstanceLock, registerRequestReactByIPC } from './factories';
import { MainWindow, registerAboutWindowCreationByIPC } from './windows';

import BrowserWindow = Electron.BrowserWindow;

makeAppWithSingleInstanceLock(async () => {
	const configManager: ConfigManager = new ConfigManager();
	await app.whenReady();
	const win: BrowserWindow = await makeAppSetup(MainWindow, configManager);

	registerAboutWindowCreationByIPC();
	registerTestDataCallByIPC();
	registerChangeStateCallByIPC(win, configManager);
	registerRequestReactByIPC(win, configManager);
});
