import HomeIcon from '@mui/icons-material/Home';
import IdentityIcon from '@mui/icons-material/RememberMe';
import SettingsIcon from '@mui/icons-material/Settings';
import RecoveryIcon from '@mui/icons-material/SettingsBackupRestore';
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, Toolbar } from '@mui/material';
import * as React from 'react';
import { PropsWithChildren } from 'react';

import { Panes } from 'shared/types';

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;

type SidebarProps = {
	sidebarWidth: number;
	currentPane: Panes;
}

export function Sidebar({ sidebarWidth, currentPane }: PropsWithChildren<SidebarProps>) {
	const changePane = (pane: Panes): void => {
		if(pane === currentPane) return;
		App.changeState({
			pane
		});
	}

	return (
		<Drawer
			sx={{
				width: sidebarWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: sidebarWidth,
					boxSizing: 'border-box',
					flexWrap: 'nowrap',
					overflow: 'hidden',
					maxWidth: sidebarWidth
				},
			}}
			variant="permanent"
			anchor="left"
		>
			<Toolbar />
			<Divider />
			<List sx={{ maxWidth: sidebarWidth }}>
				<ListItem disablePadding>
					<ListItemButton onClick={() => changePane(Panes.HOME_PANE)} disabled={currentPane === Panes.HOME_PANE}>
						<ListItemIcon>
							<HomeIcon/>
						</ListItemIcon>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => changePane(Panes.IDENTITY_PANE)} disabled={currentPane === Panes.IDENTITY_PANE}>
						<ListItemIcon>
							<IdentityIcon/>
						</ListItemIcon>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => changePane(Panes.SETTINGS_PANE)} disabled={currentPane === Panes.SETTINGS_PANE}>
						<ListItemIcon>
							<SettingsIcon/>
						</ListItemIcon>
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => changePane(Panes.RECOVERY_PANE)} disabled={currentPane === Panes.RECOVERY_PANE}>
						<ListItemIcon>
							<RecoveryIcon/>
						</ListItemIcon>
					</ListItemButton>
				</ListItem>
			</List>
		</Drawer>
	);
}
