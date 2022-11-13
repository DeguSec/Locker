import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { PropsWithChildren } from 'react';

type SidebarProps = {
	sidebarWidth: number;
}

export function Sidebar({ sidebarWidth }: PropsWithChildren<SidebarProps>) {
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
				{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemIcon>
								{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
							</ListItemIcon>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Drawer>
	);
}
