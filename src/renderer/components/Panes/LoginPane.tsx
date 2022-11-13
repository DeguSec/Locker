import * as React from 'react';

import { Panes } from 'shared/types';
import { Typography } from '@mui/material';

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;

export const LoginPane: React.FC = (): JSX.Element => {
	const changePane = () => {
		App.changePane(Panes.REGISTER_PANE);
	}

	return (
		<>
			<button type="button" onClick={changePane}>Change Pane</button>
			<h1>Login Page</h1>
			<Typography paragraph>
				The Main Pane that load first where they would enter the password to their container.
			</Typography>
		</>
	)
}
