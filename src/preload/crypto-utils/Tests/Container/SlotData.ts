import { KeyDerivationFunction } from "../../CustomTypes.js";
import { randomCharacters } from "../../Functions.js";

export class SlotData {
	// Settings
	DEFAULT_ARGON2_ITERATIONS = 20;

	DEFAULT_ARGON2_MEMORY_COSTS = 2 ** 16;

	DEFAULT_PBKDF2_ITERATIONS = 10000;

	DEFAULT_PASSWORD_LENGTH = 32;

	// values
	iterations: number;

	memory_cost = 0;

	kdf: KeyDerivationFunction;

	password: string;

	constructor(kdf: KeyDerivationFunction, password?: string) {
		this.kdf = kdf;
		this.iterations = kdf === "Argon2" ? this.DEFAULT_ARGON2_ITERATIONS : this.DEFAULT_PBKDF2_ITERATIONS;
		if (kdf === "Argon2") this.memory_cost = this.DEFAULT_ARGON2_MEMORY_COSTS;
		this.password = password == null ? randomCharacters(this.DEFAULT_PASSWORD_LENGTH): password;
	}
}
