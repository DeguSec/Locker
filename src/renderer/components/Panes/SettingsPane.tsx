import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import * as React from 'react';
import { FormEvent, useEffect } from 'react';

import { Themes } from 'shared/types';
import { stringToTheme, themeIdToReadableString } from 'shared/utils';

// The "App" comes from the context bridge in preload/index.ts
const { App } = window;

type Params = {
	currentTheme: Themes
}

export const SettingsPane: React.FC<Params> = ({ currentTheme }): JSX.Element => {
	const updateTheme = (e: FormEvent<HTMLInputElement>): void => {
		if(Number.isNaN(e.currentTarget.value)) return;
		const value: number = Number(e.currentTarget.value);
		let newTheme: Themes;

		switch (value) {
			case Themes.SYSTEM:
				newTheme = Themes.SYSTEM;
				break;
			case Themes.LIGHT:
				newTheme = Themes.LIGHT;
				break;
			case Themes.DARK:
				newTheme = Themes.DARK;
				break;
			case Themes.JASPER_CUSTOM:
				newTheme = Themes.JASPER_CUSTOM;
				break;
			default:
				newTheme = Themes.SYSTEM;
				break;
		}
		App.changeState({
			theme: newTheme
		});
	};


	return (
		<>
			<Typography variant="h1">Settings</Typography>
			<Typography paragraph>
				The settings pane.
			</Typography>
			<FormControl>
				<FormLabel id="themes">Themes</FormLabel>
				<RadioGroup
					aria-labelledby="themes"
					name="radio-buttons-group"
					onChange={updateTheme}
				>
					{Object.keys(Themes).filter((theme: string) => !(/[0-9]/.test(theme))).map((theme: string) =>  (
						<FormControlLabel
							form="themes"
							key={theme}
							checked={stringToTheme(theme) === currentTheme}
							value={stringToTheme(theme)}
							control={<Radio/>}
							label={themeIdToReadableString(stringToTheme(theme))}
						/>
					))}
				</RadioGroup>
			</FormControl>
		</>
	);
};
