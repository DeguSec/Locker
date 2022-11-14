import { Account } from "../../Account.js";
import { Container } from "../../Crypto/Container/Container.js";
import { hash, encrypt } from "../../Crypto/CryptoFunctions.js";
import { Identity } from "../../Crypto/Identity.js";
import { KeyDerivationFunction } from "../../CustomTypes.js";
import { Extra } from "../../Extra/Extra.js";
import { Settings } from "../../Extra/Settings/Settings.js";
import { log, randomCharacters } from "../../Functions.js";
import { RunTest } from "../RunTest.js";
import { InitialContainerData } from "./InitialContainerData.js";
import { SlotData } from "./SlotData.js";


async function makeStandardContainer(containerData: InitialContainerData, slotData?: SlotData): Promise<Container> {
	const container = new Container();

	container.identities = [containerData.defaultIdentity];
	container.settings = new Settings();
	container.iv = containerData.containerIv;
	container.encryptionType = containerData.algorithm;
	container.dataHash = encrypt(containerData.algorithm, containerData.masterKey, containerData.containerIv, hash(containerData.masterKey));

	// Add slot if data exists
	if (slotData != null) {
		await container.addSlot(
			slotData.password,
			container.encryptionType,
			slotData.iterations,
			slotData.kdf,
			slotData.memory_cost,
			containerData.masterKey);
	}

	return container;
}

async function makeMultiSlotContainer(containerData: InitialContainerData, slotData: Array<SlotData>): Promise<Container> {
	const container = await makeStandardContainer(containerData);

	for (let slot = 0; slot < slotData.length; slot++) {
		const currentSlot = slotData[slot];
		// TODO: Rewrite with Promise.all()
		// eslint-disable-next-line no-await-in-loop
		await container.addSlot(
			currentSlot.password,
			containerData.algorithm,
			currentSlot.iterations,
			currentSlot.kdf,
			currentSlot.memory_cost,
			containerData.masterKey
		);
	}

	return container;
}

function EvaulationFunction(container: Container, containerData: InitialContainerData) {
	if (!container.identities) return false;
	return container.identities[0].identityName === containerData.defaultIdentity.identityName;
}

export class ContainerTests extends RunTest {
	constructor() {
		super();

		super.tests = [
			async function ContainerTestAESPBKDF2Test1() {
				const slotData = new SlotData("PBKDF2");
				const containerData = new InitialContainerData("AES");
				const container = await makeStandardContainer(containerData, slotData);
				container.lock();

				await container.unlock(slotData.password);

				return EvaulationFunction(container, containerData);
			},

			async function ContainerTestAESArgon2Test1() {
				const slotData = new SlotData("Argon2");
				const containerData = new InitialContainerData("AES");
				const container = await makeStandardContainer(containerData, slotData);
				container.lock();

				await container.unlock(slotData.password);

				return EvaulationFunction(container, containerData);
			},

			async function ContainerTestBlowPBKDF2Test1() {
				const slotData = new SlotData("PBKDF2");
				const containerData = new InitialContainerData("Blow");
				const container = await makeStandardContainer(containerData, slotData);
				container.lock();

				await container.unlock(slotData.password);

				return EvaulationFunction(container, containerData);
			},

			async function ContainerTestBlowArgon2Test1() {
				const slotData = new SlotData("Argon2");
				const containerData = new InitialContainerData("Blow");
				const container = await makeStandardContainer(containerData, slotData);
				container.lock();

				await container.unlock(slotData.password);

				return EvaulationFunction(container, containerData);
			},

			// Multi Passwords
			// TODO: Check all the passwords

			async function ContainerTestAESPBKDF2Test2() {
				const kdf = "PBKDF2" as KeyDerivationFunction;
				const containerData = new InitialContainerData("AES");
				const slotData1 = new SlotData(kdf);
				const slotData2 = new SlotData(kdf);
				const container = await makeMultiSlotContainer(containerData, [slotData1, slotData2]);

				await container.lock();
				await container.unlock(slotData1.password);

				return EvaulationFunction(container, containerData);
			},

			async function ContainerTestAESArgon2Test2() {
				const kdf = "Argon2" as KeyDerivationFunction;
				const containerData = new InitialContainerData("AES");
				const slotData1 = new SlotData(kdf);
				const slotData2 = new SlotData(kdf);
				const container = await makeMultiSlotContainer(containerData, [slotData1, slotData2]);

				await container.lock();
				await container.unlock(slotData1.password);

				return EvaulationFunction(container, containerData);
			},

			async function ContainerTestBlowPBKDF2Test2() {
				const kdf = "PBKDF2" as KeyDerivationFunction;
				const containerData = new InitialContainerData("Blow");
				const slotData1 = new SlotData(kdf);
				const slotData2 = new SlotData(kdf);
				const container = await makeMultiSlotContainer(containerData, [slotData1, slotData2]);

				await container.lock();
				await container.unlock(slotData1.password);

				return EvaulationFunction(container, containerData);
			},

			async function ContainerTestBlowArgon2Test2() {
				const kdf = "Argon2" as KeyDerivationFunction;
				const containerData = new InitialContainerData("Blow");
				const slotData1 = new SlotData(kdf);
				const slotData2 = new SlotData(kdf);
				const container = await makeMultiSlotContainer(containerData, [slotData1, slotData2]);

				await container.lock();
				await container.unlock(slotData1.password);

				return EvaulationFunction(container, containerData);
			},

			// Multi Algo

			async function ContainerTestAESPBKDF2Test3() {
				const containerData = new InitialContainerData("AES");
				const slotData1 = new SlotData("Argon2");
				const slotData2 = new SlotData("PBKDF2");
				const container = await makeMultiSlotContainer(containerData, [slotData1, slotData2]);

				await container.lock();
				await container.unlock(slotData1.password);

				return EvaulationFunction(container, containerData);
			},

			async function ContainerTestAESArgon2Test3() {
				const containerData = new InitialContainerData("AES");
				const slotData1 = new SlotData("PBKDF2");
				const slotData2 = new SlotData("Argon2");
				const container = await makeMultiSlotContainer(containerData, [slotData1, slotData2]);

				await container.lock();
				await container.unlock(slotData1.password);

				return EvaulationFunction(container, containerData);
			},

			async function ContainerTestBlowPBKDF2Test3() {
				const containerData = new InitialContainerData("Blow");
				const slotData1 = new SlotData("Argon2");
				const slotData2 = new SlotData("PBKDF2");
				const container = await makeMultiSlotContainer(containerData, [slotData1, slotData2]);

				await container.lock();
				await container.unlock(slotData1.password);

				return EvaulationFunction(container, containerData);
			},

			async function ContainerTestBlowArgon2Test3() {
				const containerData = new InitialContainerData("Blow");
				const slotData1 = new SlotData("PBKDF2");
				const slotData2 = new SlotData("Argon2");
				const container = await makeMultiSlotContainer(containerData, [slotData1, slotData2]);

				await container.lock();
				await container.unlock(slotData1.password);

				return EvaulationFunction(container, containerData);
			},

			async function ContainerTestBlowArgon2Intensive1() {
				const kdf = "Argon2" as KeyDerivationFunction;

				const slotData = [
					new SlotData(kdf),
					new SlotData(kdf),
					new SlotData(kdf),
					new SlotData(kdf),
					new SlotData(kdf), // selected for password
					new SlotData(kdf, "password"),
				];

				const containerData = new InitialContainerData("Blow");
				const container = await makeMultiSlotContainer(containerData, slotData);

				if (container.identities === null)
					throw new Error("Container had no identities");

				// create 100 identities
				for (let i = 0; i < 100; i++) {
					// create identity
					const iData = JSON.stringify(
						{
							"accounts": [],
							"identityDesc": randomCharacters(64),
							"identityName": randomCharacters(64),
						}
					);

					const identity = new Identity(iData);

					// create 100 accounts
					for (let acc = 0; acc < 100; acc++) {
						const accountData = {
							"website": randomCharacters(64),
							"password": randomCharacters(64),
							"login": randomCharacters(64),
							"extra": new Extra().getJSON(),
						};

						identity.accounts.push(new Account(accountData));
					}

					if(!container.identities)
						throw new Error("Container not found");

					container.identities.push(identity);
				}

				await container.lock();

				await container.unlock(slotData[4].password);

				const containerJSON = container.getJSON();
				log(containerJSON);
				log(containerJSON.length);

				container.save();

				return EvaulationFunction(container, containerData);
			},
		];
	}
}
