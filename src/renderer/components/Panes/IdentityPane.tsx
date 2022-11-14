import { Typography } from '@mui/material';
import * as React from 'react';

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;

export const IdentityPane: React.FC = (): JSX.Element => (
	<>
		<Typography variant="h1">Identities</Typography>
		<Typography paragraph>
			The Pane to be used for switching identities
		</Typography>
	</>
);
