import { createTheme } from '@mui/material';

export const darkThemeStyles = createTheme({
	palette: {
		mode: 'dark',
	},
	typography: {
		allVariants: {
			color: '#FFFFFF'
		},
		h1: {
			fontSize: '2rem'
		}
	}
});
