// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'

import { registerTestDataCallByIPC } from 'main/windows/Main/ipcs/register-handle-test-data';
import { registerChangePaneCallByIPC } from 'main/windows/Main/ipcs/registerHandleChangePane';

import { makeAppSetup, makeAppWithSingleInstanceLock } from './factories'
import { MainWindow, registerAboutWindowCreationByIPC } from './windows'

import BrowserWindow = Electron.BrowserWindow;

makeAppWithSingleInstanceLock(async () => {
	await app.whenReady();
	const win: BrowserWindow = await makeAppSetup(MainWindow);

	registerAboutWindowCreationByIPC();
	registerTestDataCallByIPC();
	registerChangePaneCallByIPC(win);
});
