import { EncryptionType, JSONContainerData, KeyDerivationFunction } from "../../CustomTypes.js";
import { Settings } from "../../Extra/Settings/Settings.js";
import { log, convertToUint8Array, convertToBase64, convertFromBase64, compareArrays } from "../../Functions.js";
import { iJSON } from "../../iJSON";
import { encrypt, decrypt, hash, getRandomBytes, algorithmIvBytes } from "../CryptoFunctions.js";
import { Identity } from "../Identity.js";
import { MakeNewSlot, Slot } from "../Slot.js";
import { setStoredContainer } from "./ContainerFunctions";


/**
 * This class represents all of the data that is going to be stored.
 * It contains decrypted and encrypted data at any time. Check the functions
 * for functionality and try to avoid changing variables internally.
 */
export class Container implements iJSON {
	// external opening
	externalMasterKey = null as null | Uint8Array;

	// normal
	identities?: Array<Identity>;

	encryptionType?: EncryptionType;

	openSlot?: number;

	private slots = [] as Array<Slot>;

	iv?: Uint8Array;

	// settings
	settings?: Settings;

	encryptedSettings?: string;

	// encrypted data
	rawData?: string;

	encryptedIdentities?: string;

	dataHash?: Uint8Array;

	/**
   * @param JSONdata JSON data as described in {@link JSONContainerData}.
   * @returns a new container, given JSON data. If there is no JSON data, it'll create a brand new container
   */
	constructor(JSONdata?: string) {
		if (JSONdata == null) return;

		this.rawData = JSONdata;

		// if the data exists, do something with it
		const jsonData = JSON.parse(this.rawData) as JSONContainerData | any;
		this.encryptedIdentities = jsonData.encryptedIdentities;
		this.encryptedSettings = jsonData.encryptedSettings;
		if (this.encryptedSettings == null) this.settings = new Settings();

		this.dataHash = convertFromBase64(jsonData.dataHash);

		// add slots
		const jsonSlots = jsonData.slots as Array<any>;
		this.slots = [];
		for (let slot = 0; slot < jsonSlots.length; slot++) {
			this.slots.push(new Slot(jsonSlots[slot]));
		}

		// add encrypton iv
		this.iv = convertFromBase64(jsonData.iv);
		this.encryptionType = jsonData.encryptionType;
	}

	/**
   * Returns whether the container is empty.
   */
	get isEmpty() {
		return this.rawData == null;
	}

	/**
   * @returns all the {@link Identity}[] if they are decrypted.
   * @throws "Identities are null" if the {@link Identity}[]] are currently not decrypted.
   */
	getIdentites(): Array<Identity> {
		if (this.identities == null) throw new Error("Identities are null!");
		else return this.identities;
	}

	/**
   * Removes all unecrypted data from the container.
   */
	lock() {
		this.update();
		// remove external key
		if (this.externalMasterKey != null) {
			this.externalMasterKey = null;
		}

		// remove opened slot
		if (this.openSlot != null) {
			this.slots[this.openSlot].lock();
			this.openSlot = undefined;
		}

		// 0' valuable data
		this.identities = undefined;
		this.settings = undefined;
	}

	/**
   * Updates all encrypted data with current decrypted data.
   */
	private update() {
		if (this.encryptionType == null) throw new Error("Update: Encryption type needed!");
		const ivSize = algorithmIvBytes(this.encryptionType);
		this.iv = getRandomBytes(ivSize);

		// encrypt identities
		const masterKey = this.getMasterKey();

		// changed iv means changed datahash
		this.dataHash = encrypt(this.encryptionType, masterKey, this.iv, hash(masterKey));

		const currentIdentities = this.getIdentites();
		const identityList = []; // JSON the list, convert the list to Uint8Array, encrypt, convert to base64
		for (let identity = 0; identity < currentIdentities.length; identity++) {
			identityList.push(currentIdentities[identity].getJSON());
		}

		const encrypted = encrypt(this.encryptionType, masterKey, this.iv, convertToUint8Array(JSON.stringify(identityList)));
		this.encryptedIdentities = convertToBase64(encrypted);

		if (this.encryptedSettings == null || this.settings == null) this.settings = new Settings();

		const settingsJSON = this.settings.getJSON();
		this.encryptedSettings = convertToBase64(encrypt(this.encryptionType, masterKey, this.iv, convertToUint8Array(settingsJSON)));

		log("Updated container to: ");
		log(this);
	}

	/**
   * Saves container to storage
   */
	save() {
		log("Saved");
		log(this);
		this.update();
		setStoredContainer(this);
	}

	/**
   * This function decrypts all of the encrypted data stored in this container.
   * @param key a key to try and unlock the identities with.
   */
	private async unlockIdentites(key: Uint8Array) {
		if (this.dataHash == null) throw new Error("No dataHash!");
		if (this.encryptedIdentities == null) throw new Error("No encrypted identities!");

		log("unlocking identities");
		log(this.encryptionType);
		log(key);
		log(this.iv);

		if (this.encryptionType == null) throw new Error("Cannot decrypt without encryptionType");
		if (this.iv == null) throw new Error("Cannot decrypt without iv");

		// Test dataHash
		const decryptedHMAC = decrypt(this.encryptionType, key, this.iv, this.dataHash);
		const keyHash = hash(key);
		if (!compareArrays(decryptedHMAC, keyHash)) throw new Error("HMAC Missmatch");

		// identities
		log("identities;");
		log(this.encryptedIdentities);
		log(convertFromBase64(this.encryptedIdentities));

		const decryptedIdentitiesArray = decrypt(this.encryptionType, key, this.iv, convertFromBase64(this.encryptedIdentities));
		const decryptedIdentities = JSON.parse(Buffer.from(decryptedIdentitiesArray).toString("utf-8")) as Array<string>;

		this.identities = [];
		for (let index = 0; index < decryptedIdentities.length; index++) {
			this.identities.push(new Identity(decryptedIdentities[index]));
		}

		log(this.identities);

		// settings
		if (this.encryptedSettings != null) {
			const settingsArray = decrypt(this.encryptionType, key, this.iv, convertFromBase64(this.encryptedSettings));
			this.settings = new Settings(Buffer.from(settingsArray).toString("utf-8"));
			log("decrypted settings: ");
			log(this.settings);
		}
	}

	/**
   * This function attempts to unlock the container given the password.
   * It also takes care of decrypting the data if the password is correct.
   * @todo TODO: Refactor
   * @param password The password to attempt to unlock the container with
   */
	async unlock(password: string) {
		if (this.openSlot != null) {
			log("slot already opened");
			if (this.identities == null) {
				await this.unlockIdentites(this.slots[this.openSlot].getMasterKey());
			}
		}
		else for (let index = 0; index < this.slots.length; index++) {
			const slot = this.slots[index];
			log(`opening slot number ${index}`);
			log(slot);
			try {
				log("unlocking with password '{}'".replace("{}", password));
				// eslint-disable-next-line no-await-in-loop
				await slot.unlock(password);
			} catch (e) {
				log(`Failed to unlock slot ${index}`);
				log(e);
				// eslint-disable-next-line no-continue
				continue;
			}

			log("unlocking identities");
			this.openSlot = index;
			try {
				// eslint-disable-next-line no-await-in-loop
				await this.unlockIdentites(slot.getMasterKey());
				return; // success
			} catch (e) {
				log(e);
				// eslint-disable-next-line no-continue
				continue;
			}
		}

		throw new Error("Could not open any container");
	}

	/**
   * Change the password of the currently open slot.
   * @param password the new password
   */
	async changePassword(password: string) {
		if (this.openSlot == null) throw new Error("Container needs to be open");
		const slot = this.slots[this.openSlot];
		await slot.changePassword(password);
	}

	/**
   * This function is used when a password isn't used to unlock the container,
   * in the event of recovery or maybe some other future uses. It also decrypts
   * the container if the key is correct.
   * @param masterKey the masterkey to unlock to container with.
   */
	async externalUnlock(masterKey: Uint8Array) {
		this.externalMasterKey = masterKey;
		// This will throw HMAC missmatch if wrong
		await this.unlockIdentites(masterKey);
	}

	getJSON() {
		// update identites
		this.update();

		// add slots
		const allSlotsJson = [];
		for (let slot = 0; slot < this.slots.length; slot++) {
			allSlotsJson.push(this.slots[slot].getJSON());
		}

		const containerData = {} as JSONContainerData;
		containerData.slots = allSlotsJson;
		if (this.encryptedIdentities != null) containerData.encryptedIdentities = this.encryptedIdentities;
		if (this.iv != null) containerData.iv = convertToBase64(this.iv);
		if (this.encryptionType != null) containerData.encryptionType = this.encryptionType;
		if (this.dataHash != null) containerData.dataHash = convertToBase64(this.dataHash);
		if (this.encryptedSettings != null) containerData.encryptedSettings = this.encryptedSettings;

		return JSON.stringify(containerData);
	}

	/**
   * This function removes the specified slot from the slot list.
   * This is useful if a user wants to revoke access from a particular slot.
   * @param slot the slot index to remove
   * @todo Make so that no slots need to exist
   */
	removeSlot(slot: number) {
		if (this.openSlot == null)
			throw new Error("No slot is open");

		if (this.slots.length === 1) {
			const error = "Cannot have less than 1 slot";
			throw error;
		}

		if (slot < 0 || slot >= this.slots.length) {
			const error = `${slot} is not a valid range for a slot`;
			throw error;
		}

		if (slot === this.openSlot) {
			// set the key to be external instead.
			const error = `${slot} is currently used to decrypt the container. Cannot remove.`;
			throw error;
		}

		if (this.openSlot > slot) this.openSlot--; // move pointer to the left
		this.slots.splice(slot, 1);
		this.save(); // save changes
	}

	/**
   * This function allows the addition of a {@link Slot}.
   * This is useful if a user wants to allow someone else with a different password to open this container.
   * @param password The password for this {@link Slot}.
   * @param encryptionType encryption type for this {@link Slot}.
   * @param rounds the time cost for this {@link Slot}.
   * @param keyDerivationFunction the function that will derive the bytes from the password for the {@link Slot}.
   * @param roundsMemory the memory cost for this {@link Slot}.
   * @param masterKey the master key to unlock this container.
   */
	async addSlot(
		password: string,
		encryptionType?: EncryptionType | null,
		rounds?: number | null,
		keyDerivationFunction?: KeyDerivationFunction | null,
		roundsMemory?: number | null,
		masterKey?: Uint8Array | null) {

		let copySlot: number | null;
		if (this.openSlot != null) copySlot = this.openSlot;
		else copySlot = this.slots.length > 0 ? 0 : null;

		log(`Will be copying data from slot: ${copySlot}`);
		// if there is any data missing, it can be acquired here.
		if (copySlot != null) {
			const openSlotObject = this.slots[copySlot];
			encryptionType = encryptionType || openSlotObject.encryptionType;
			rounds = rounds || openSlotObject.rounds;
			keyDerivationFunction = keyDerivationFunction || openSlotObject.keyDerivationFunction;
			roundsMemory = roundsMemory || openSlotObject.roundsMemory;
			masterKey = masterKey || this.getMasterKey();
		}

		// if the data is still missing, throw this error:
		if (encryptionType == null) throw new Error("addSlot: Missing parameters: encryptionType");
		if (rounds == null) throw new Error("addSlot: Missing parameters: rounds");
		if (keyDerivationFunction == null) throw new Error("addSlot: Missing parameters: keyDerivationFunction");
		if (roundsMemory == null) throw new Error("addSlot: Missing parameters: roundsMemory");
		if (masterKey == null) throw new Error("addSlot: Missing parameters: masterKey");

		const slot = await MakeNewSlot(encryptionType, rounds, keyDerivationFunction, masterKey, password, roundsMemory);
		this.slots.push(slot);
		slot.lock();
		if (copySlot == null) {
			this.externalMasterKey = masterKey;
		}
		this.save();
	}

	/**
   * Add a new identity to store {@link Accounts} for.
   * @param identity identity to add
   */
	addIdentity(identity: Identity) {
		if (this.identities == null) throw new Error("Identities are not defined");
		this.identities.push(identity);
		this.save();
	}

	/**
   * Removes the specified identity
   * @param identity index of identity to remove
   */
	removeIdentity(identity: number) {
		if (this.identities == null) throw new Error("Identities are not defined");
		this.identities.splice(identity, 1);
		this.save();
	}

	/**
   *
   * @returns the masterKey used to encryption and decryption of this container
   */
	getMasterKey() {
		if (this.externalMasterKey != null) return this.externalMasterKey;
		if (this.openSlot == null) throw new Error("No slot is open");
		return this.slots[this.openSlot].getMasterKey();
	}

	/**
   * @returns current open slots
   */
	getSlots() {
		return this.slots;
	}
}
