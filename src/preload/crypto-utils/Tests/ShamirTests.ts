/* eslint-disable no-continue */
// TODO: FIX
import { getRandomBytes } from "../Crypto/CryptoFunctions.js";
import { compareArrays, log } from "../Functions.js";
import { generateBIPs, generateScheme, recoverFromBIPs, recoverSecret } from "../Recovery/Shamir.js";
import { RunTest } from "./RunTest.js";

export class ShamirTests extends RunTest {
	constructor() {
		super();

		super.tests = [
			async function ShamirTestDefault() {
				// conduct test
				const secret = getRandomBytes(80);
				log("testing shamir");
				log(secret);

				const shamir = generateScheme(secret, 5, 2);
				log(shamir);
				delete shamir["1"];
				delete shamir["2"];
				log(shamir);

				const recovered = recoverSecret(shamir);
				log(recovered);

				if (compareArrays(secret, recovered)) log("test complete");
				else log("test failed");

				log("testing shamir BIPs");
				log(secret);
				const chunks = generateBIPs(secret, 10, 8);
				log(chunks);
				chunks.splice(3, 2); // delete index 3 and 4
				log(chunks);

				const recovered2 = recoverFromBIPs(chunks);
				log(recovered2);

				return compareArrays(recovered2, secret);
			},

			async function ShamirTestRandomScheme1() {
				const secret = getRandomBytes(256);
				let parts: number = Math.floor(Math.random() * 30) + 5;
				const originalParts = parts;
				const threshhold = Math.floor(Math.random() * 20) + 5;
				parts += threshhold > parts ? threshhold : 0;
				const takenParts = new Map<number, void>();

				const shamir = generateScheme(secret, parts, threshhold);

				// delete elements from the scheme
				while (threshhold < parts) {
					const selectedPiece = Math.floor(Math.random() * originalParts) + 1;
					if (takenParts.has(selectedPiece)) continue;

					takenParts.set(selectedPiece);
					delete shamir[selectedPiece.toString()];
					parts--;
				}

				const newSecret = recoverSecret(shamir);
				return compareArrays(secret, newSecret);
			},

			async function ShamirTestRandomScheme2() {
				const secret = getRandomBytes(2*11);
				let parts: number = Math.floor(Math.random() * 30) + 5;
				const originalParts = parts;
				const threshhold = Math.floor(Math.random() * 80) + 5;
				parts += threshhold > parts ? threshhold : 0;
				const takenParts = new Map<number, void>();

				const shamir = generateScheme(secret, parts, threshhold);

				// delete elements from the scheme
				while (threshhold < parts) {
					const selectedPiece = Math.floor(Math.random() * originalParts) + 1;
					if (takenParts.has(selectedPiece)) continue;

					takenParts.set(selectedPiece);
					delete shamir[selectedPiece.toString()];
					parts--;
				}

				const newSecret = recoverSecret(shamir);
				return compareArrays(secret, newSecret);
			},

			async function ShamirTestRandomSchemeIntensive1() {
				let passed = true;
				for (let _ = 0; _ < 1000; _++) {
					const secret = getRandomBytes(128);
					let parts: number = Math.floor(Math.random() * 30) + 5;
					const originalParts = parts;
					const threshhold = Math.floor(Math.random() * 20) + 5;
					parts += threshhold > parts ? threshhold : 0;
					const takenParts = new Map<number, void>();

					const shamir = generateScheme(secret, parts, threshhold);

					// delete elements from the scheme
					while (threshhold < parts) {
						const selectedPiece = Math.floor(Math.random() * originalParts) + 1;
						if (takenParts.has(selectedPiece)) continue;

						takenParts.set(selectedPiece);
						delete shamir[selectedPiece.toString()];
						parts--;
					}

					const newSecret = recoverSecret(shamir);
					passed = compareArrays(secret, newSecret);
					if(!passed) {
						// a user will never use the debugger here
						// eslint-disable-next-line no-debugger
						debugger;
						break;
					}
				}

				return passed;
			}
		];
	}
}
