import { BIP } from "./BIP";

/**
 * A word has text and may be underlined
 */
export class Word {
	text: string;

	underlined: boolean

	constructor(text: string, underlined: boolean) {
		this.text = text;
		this.underlined = underlined;
	}

	/**
   * check if the word is valid
   * @param bip an instanciated BIP element. Resued to save resources
   */
	checkWord(bip: BIP) {
		return bip.isWordValid(this.text);
	}
}
