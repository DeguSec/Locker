export class ExtraDataMapped extends Map<string, number> {
	constructor(data?: Array<Array<string>>) {
		super();
		if (data == null) return;

		for (let index = 0; index < data.length; index++) {
			this.set(data[index][0], index);
		}
	}
}
