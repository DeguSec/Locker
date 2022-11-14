import { Typography } from '@mui/material';
import * as React from 'react';

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;

export const HomePane: React.FC = (): JSX.Element => (
	<>
		<Typography variant="h1">Home</Typography>
		<Typography paragraph>
			The Main Pane after login to a container.
		</Typography>
	</>
)
