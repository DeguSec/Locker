import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react'
import ReactDom from 'react-dom/client'

import { lightThemeStyles } from 'renderer/themes/light';

import { AppRoutes } from './routes'
import { WindowStoreProvider } from './store'

ReactDom.createRoot(document.querySelector('app') as HTMLElement).render(
	<ThemeProvider theme={lightThemeStyles}>
		<CssBaseline />
		<React.StrictMode>
			<WindowStoreProvider>
				<AppRoutes />
			</WindowStoreProvider>
		</React.StrictMode>
	</ThemeProvider>
)
