// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'

import { registerTestDataCallByIPC } from 'main/windows/Main/ipcs/register-handle-test-data';

import { makeAppSetup, makeAppWithSingleInstanceLock } from './factories'
import { MainWindow, registerAboutWindowCreationByIPC } from './windows'

makeAppWithSingleInstanceLock(async () => {
	await app.whenReady()
	await makeAppSetup(MainWindow)

	registerAboutWindowCreationByIPC()
	registerTestDataCallByIPC()
})
