import { Box, CssBaseline, Theme, ThemeProvider, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Sidebar } from 'renderer/components';
import { useWindowStore } from 'renderer/store'
import { darkThemeStyles } from 'renderer/themes/dark';
import { lightThemeStyles } from 'renderer/themes/light';
import { LocalstorageTheme, Themes } from 'shared/types/localstorage.types';
import { loadState, saveState } from 'shared/utils/localstorage';
import { jasperCustomTheme } from 'renderer/themes/jasperCustom';

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;

export function MainScreen() {
	const navigate = useNavigate()
	const store = useWindowStore().about

	useEffect(() => {
		App.sayHelloFromBridge()

		App.whenAboutWindowClose(({ message }) => {
			console.log(message)

			store.setAboutWindowState(false)
		})
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

		let theme: Theme | null;
		switch (themeState.theme) {
			case Themes.DARK:
				theme = darkThemeStyles;
				break;
			//return darkThemeStyles;
			case Themes.LIGHT:
				theme = lightThemeStyles;
				break;
			//return lightThemeStyles;
			case Themes.JASPER_CUSTOM:
				theme = jasperCustomTheme;
				break;
			//return jasperCustomTheme;
			default:
				theme = lightThemeStyles
			//return lightThemeStyles;
		}
		console.log(theme);
		return theme;
	}

	return (
		<ThemeProvider theme={getTheme}>
			<Box sx={{ display: 'flex', minHeight: '100vh'}}>
				<Sidebar sidebarWidth={60}/>
				{/* This is the Pane */}
				<Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
					<Typography paragraph>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
						tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
						enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
						imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
						Convallis convallis tellus id interdum velit laoreet id donec ultrices.
						Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
						adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
						nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
						leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
						feugiat vivamus at augue. At augue eget arcu dictum varius duis at
						consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
						sapien faucibus et molestie ac.
					</Typography>
				</Box>
			</Box>
		</ThemeProvider>
	)
}
