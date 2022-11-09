import { getRandomBytes } from "../Crypto/CryptoFunctions.js";
import { compareArrays, log } from "../Functions.js";
import { BIP } from "../Recovery/BIP/BIP.js";
import { RunTest } from "./RunTest.js";

export class BIPTests extends RunTest {
	constructor() {
		super();
		const bip = new BIP();

		super.tests = [
			async function BIPTestsRecover1() {
				const data = getRandomBytes(32);
				const bipData = bip.generateFromUint8Array(data);

				return compareArrays(bip.generateFromWords(bipData), data);
			},

			async function BIPTestsRecover2() {
				const data = getRandomBytes(256);
				const bipData = bip.generateFromUint8Array(data);

				return compareArrays(bip.generateFromWords(bipData), data);
			},

			async function BIPTestsRecover3() {
				const data = getRandomBytes(255);
				try {
					const bipData = bip.generateFromUint8Array(data);
					bip.generateFromWords(bipData)
					return false;
				} catch (e) {
					return true;
				}
			},

			async function BIPtestsword() {
				return bip.isWordValid("test");
			},

			async function BIPtestsintensivelarge1() {
				let pass = true;

				for(let _ = 0; _ < 10000; _++) {
					const data = getRandomBytes(256);
					const bipData = bip.generateFromUint8Array(data);
					pass = compareArrays(bip.generateFromWords(bipData), data);
					if(!pass) {
						log(`Failed on: ${ _ }`);
						log(data);
						log(bip.generateFromWords(bipData));
						break;
					}
				}

				return pass;
			},

			async function BIPtestsintensivesmall1() {
				let pass = true;

				for(let _ = 0; _ < 1000000; _++) {
					const data = getRandomBytes(2);
					const bipData = bip.generateFromUint8Array(data);
					pass = compareArrays(bip.generateFromWords(bipData), data);
					if(!pass) {
						// TODO: Remove this
						// eslint-disable-next-line no-debugger
						debugger;
						log(`Failed on: ${ _ }`);
						log(data);
						log(bip.generateFromWords(bipData));
						break;
					}
				}

				return pass;
			},
		];
	}
}
