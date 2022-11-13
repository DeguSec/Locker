import { Box, Theme, ThemeProvider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoginPane, SetupPane, Sidebar } from 'renderer/components';
import { useWindowStore } from 'renderer/store'
import { darkThemeStyles } from 'renderer/themes/dark';
import { jasperCustomTheme } from 'renderer/themes/jasperCustom';
import { lightThemeStyles } from 'renderer/themes/light';
import { Panes } from 'shared/types';
import { LocalstorageTheme, Themes } from 'shared/types/localstorage.types';
import { loadState, saveState } from 'shared/utils/localstorage';

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;

export function MainScreen() {
	const [currentPane, setCurrentPane] = useState<Panes>(Panes.LOGIN_PANE);
	const navigate = useNavigate();
	const store = useWindowStore().about;

	useEffect(() => {
		App.sayHelloFromBridge();

		App.handlePaneChange((pane) => setCurrentPane(pane));

		App.whenAboutWindowClose(({ message }) => {
			console.log(message)

			store.setAboutWindowState(false)
		});
	}, [])

	/* function openAboutWindow() {
		App.createAboutWindow()
		store.setAboutWindowState(true)
	} */

	const test = () => {
		App.sendData({ some: 'data'});
	}

	// TODO: Improve upon this in time
	const getTheme = (): Theme => {
		const themeState: LocalstorageTheme | undefined = loadState<LocalstorageTheme>('locker:theme');
		if(!themeState) {
			saveState({ theme: Themes.LIGHT } as LocalstorageTheme, 'locker:theme')
			return lightThemeStyles;
		}

		switch (themeState.theme) {
			case Themes.DARK: return darkThemeStyles;
			case Themes.LIGHT: return lightThemeStyles;
			case Themes.JASPER_CUSTOM: return jasperCustomTheme;
			default: return lightThemeStyles;
		}
	}

	return (
		<ThemeProvider theme={getTheme}>
			<Box sx={{ display: 'flex', minHeight: '100vh'}}>
				<Sidebar sidebarWidth={60}/>
				{/* This is the Pane */}
				<Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
					{currentPane === Panes.LOGIN_PANE && <LoginPane/>}
					{currentPane === Panes.REGISTER_PANE && <SetupPane/>}
				</Box>
			</Box>
		</ThemeProvider>
	)
}
