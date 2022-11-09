
import { algorithmBytes, algorithmIvBytes, getRandomBytes } from "../../Crypto/CryptoFunctions.js";
import { Identity } from "../../Crypto/Identity.js";
import { EncryptionType } from "../../CustomTypes.js";
import { randomCharacters } from "../../Functions.js";

/**
 * Helper class designed to keep all data decrypted
 */
export class InitialContainerData {
	// values
	algorithm: EncryptionType;

	masterKey: Uint8Array;

	containerIv: Uint8Array;

	defaultIdentity: Identity

	constructor(algorithm: EncryptionType, defaultIdentity?: Identity, masterKey?: Uint8Array, containerIV?: Uint8Array) {
		this.algorithm = algorithm;
		this.masterKey = masterKey == null ? getRandomBytes(algorithmBytes(algorithm)) : masterKey;
		this.containerIv = containerIV == null ? getRandomBytes(algorithmIvBytes(algorithm)) : containerIV;

		if (defaultIdentity == null) {
			const identityName = randomCharacters(64);
			const identityData = JSON.stringify({
				"accounts": [],
				"identityDesc": randomCharacters(64),
				"identityName": identityName,
			});

			this.defaultIdentity = new Identity(identityData);
		} else {
			this.defaultIdentity = defaultIdentity;
		}
	}
}
