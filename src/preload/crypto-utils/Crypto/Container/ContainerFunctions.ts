
import { log } from "../../Functions.js";
import { Container } from "./Container";

const storageLocation = "InternetNomad";

/**
 * Saves container to memory
 * @param container the container to save
 */
export function setStoredContainer(container: Container) {
	const storage = window.localStorage;
	if (storage == null) throw new Error("Not running under Electron");
	const rawData = container.getJSON();
	log("Putting data");
	log(rawData);

	storage.setItem(storageLocation, rawData);
}

/**
 * delete any stored container
 */
export function deleteContainer() {
	const storage = window.localStorage;
	if (storage == null) throw new Error("Not running under Electron");
	storage.setItem(storageLocation, null as any);
}

/**
 * check if there is currently a container stored
 * @returns true if there is a container stored here
 */
export function storageHasContainer(): boolean {
	const storage = window.localStorage;
	if (storage == null) throw new Error("Not running under Electron");
	const rawData = storage.getItem(storageLocation);
	return rawData != null;
}

/**
 * returns the currently stored container object
 * @returns a newly initialized container.
 */
export function getStoredContainer() {
	const storage = window.localStorage;
	if (storage == null) throw new Error("Not running under Electron");

	const rawData = storage.getItem(storageLocation);
	if (rawData == null) throw new Error("Container does not exist!");

	log(rawData);
	return new Container(rawData);
}

