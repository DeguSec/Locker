import { Box, Theme, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { HomePane, IdentityPane, LoginPane, RecoveryPane, SettingsPane, SetupPane, Sidebar } from 'renderer/components';
import { useWindowStore } from 'renderer/store'
import { darkThemeStyles } from 'renderer/themes/dark';
import { jasperCustomTheme } from 'renderer/themes/jasperCustom';
import { lightThemeStyles } from 'renderer/themes/light';
import { Panes, ReactState, Themes } from 'shared/types';

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;

export function MainScreen() {
	const [currentPane, setCurrentPane] = useState<Panes>(Panes.NONE);
	const [systemThemeDark, setSystemThemeDark] = useState<boolean>(window.matchMedia("(prefers-color-scheme: dark)").matches);
	const [currentTheme, setCurrentTheme] = useState<Themes>(Themes.SYSTEM);
	const [themeData, setThemeData] = useState<Theme>();
	const navigate = useNavigate();
	const store = useWindowStore().about;

	useEffect(() => {
		App.sayHelloFromBridge();

		App.requestState();

		App.whenAboutWindowClose(() => {
			store.setAboutWindowState(false)
		});

		return () => {
			App.removeIpcListeners();
		}
	}, []);

	useEffect(() => {
		App.handleStateChange((newState: ReactState) => {
			if(newState.pane && newState.pane !== currentPane) setCurrentPane(newState.pane);
			if(newState.theme && newState.theme !== currentTheme) setCurrentTheme(newState.theme);
		});
		return () => {
			App.removeIpcListeners();
		}
	}, [currentTheme, currentPane]);


	const mqListener = ((e: { matches: boolean; }) => {
		setSystemThemeDark(e.matches);
	});

	const toggleSystemThemeStyles = () => {
		if(currentTheme !== Themes.SYSTEM) return;
		setThemeData(systemThemeDark ? darkThemeStyles : lightThemeStyles);
	}

	useEffect(() => toggleSystemThemeStyles(), [systemThemeDark]);


	useEffect(() => {
		const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
		darkThemeMq.addEventListener('change', mqListener);

		switch (currentTheme) {
			case Themes.SYSTEM:
				toggleSystemThemeStyles();
				break;
			case Themes.DARK:
				setThemeData(darkThemeStyles);
				break;
			case Themes.LIGHT:
				setThemeData(lightThemeStyles);
				break;
			case Themes.JASPER_CUSTOM:
				setThemeData(jasperCustomTheme);
				break;
			default:
				toggleSystemThemeStyles();
				break;
		}

		return () => darkThemeMq.removeEventListener('change', mqListener);
	}, [currentTheme]);


	/* function openAboutWindow() {
		App.createAboutWindow()
		store.setAboutWindowState(true)
	} */

	const test = () => {
		App.sendData({ some: 'data'});
	}

	return (
		<ThemeProvider theme={themeData ?? lightThemeStyles}>
			<Box sx={{ display: 'flex', minHeight: '100vh'}}>
				{(currentPane !== Panes.SETUP_PANE && currentPane !== Panes.LOGIN_PANE) &&
					<Sidebar sidebarWidth={60} currentPane={currentPane}/>
				}
				{/* This is the Pane */}
				<Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
					{currentPane === Panes.LOGIN_PANE && <LoginPane/>}
					{currentPane === Panes.SETUP_PANE && <SetupPane/>}
					{currentPane === Panes.HOME_PANE && <HomePane/>}
					{currentPane === Panes.IDENTITY_PANE && <IdentityPane/>}
					{currentPane === Panes.SETTINGS_PANE && <SettingsPane currentTheme={currentTheme}/>}
					{currentPane === Panes.RECOVERY_PANE && <RecoveryPane/>}
				</Box>
			</Box>
		</ThemeProvider>
	)
}
