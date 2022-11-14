// eslint-disable-next-line import/no-extraneous-dependencies
import {
	BrowserWindow,
	IpcMainInvokeEvent,
	BrowserWindowConstructorOptions,
} from 'electron';

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
	NONE,
	LOGIN_PANE,
	SETUP_PANE,
	HOME_PANE,
	IDENTITY_PANE,
	SETTINGS_PANE,
	RECOVERY_PANE
}

export type ReactState = {
	theme?: Themes,
	pane?: Panes
}

export interface LooseObject {
	[key: string]: any
}

export enum Themes {
	SYSTEM = 1,
	LIGHT,
	DARK,
	JASPER_CUSTOM,
}
