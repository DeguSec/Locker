import { Typography } from '@mui/material';
import * as React from 'react';

import { Panes } from 'shared/types';

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;

export const LoginPane: React.FC = (): JSX.Element => {
	const changePane = () => {
		App.changeState({
			pane: Panes.SETUP_PANE
		});
	}

	return (
		<>
			<button type="button" onClick={changePane}>Change Pane</button>
			<Typography variant="h1">Login Page</Typography>
			<Typography paragraph>
				The Main Pane that load first where they would enter the password to their container.
			</Typography>
		</>
	)
}
