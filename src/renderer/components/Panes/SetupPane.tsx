import { Typography } from '@mui/material';
import * as React from 'react';

import { Panes } from 'shared/types';

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;

export const SetupPane: React.FC = (): JSX.Element => {
	const devBypassPane = () => {
		App.changeState({ pane: Panes.HOME_PANE });
	};

	return (
		<>
			<Typography variant="h1">Setup Page</Typography>
			<button type="button" onClick={devBypassPane}>bypass</button>
			<Typography paragraph>
				The pane to be used for first time load that will be used to setup a container
			</Typography>
		</>
	);
};
