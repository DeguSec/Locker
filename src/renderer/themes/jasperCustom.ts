import { createTheme } from '@mui/material';
import { deepOrange, grey } from '@mui/material/colors';

export const jasperCustomTheme = createTheme({
	palette: {
		primary: deepOrange,
		divider: deepOrange[700],
		background: {
			default: deepOrange[900],
			paper: deepOrange[900],
		},
		text: {
			primary: '#fff',
			secondary: grey[500],
		},
	}
});
