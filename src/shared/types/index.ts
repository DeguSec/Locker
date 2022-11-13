// eslint-disable-next-line import/no-extraneous-dependencies
import {
	BrowserWindow,
	IpcMainInvokeEvent,
	BrowserWindowConstructorOptions,
} from 'electron'

export type BrowserWindowOrNull = Electron.BrowserWindow | null

export interface WindowProps extends BrowserWindowConstructorOptions {
	id: string
}

export interface WindowCreationByIPC {
	channel: string
	window(): BrowserWindowOrNull
	callback(window: BrowserWindow, event: IpcMainInvokeEvent): void
}

export enum Panes {
	LOGIN_PANE,
	REGISTER_PANE
}
