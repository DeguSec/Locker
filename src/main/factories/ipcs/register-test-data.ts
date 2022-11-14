import * as fs from 'fs';

// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcMain } from 'electron';

export function registerTestDataByIPC() {
	ipcMain.handle('test_data', (event, data) => {
		fs.writeFileSync('./test', JSON.stringify(data, null, 4));
		console.log(data);
	});
}
