import { Container } from "../../Crypto/Container.js";
import { removeAllChildren, $ } from "../../DOM/DOMHelper.js";
import { log } from "../../Functions.js";
import { BIP } from "../../Recovery/BIP/BIP.js";
import { generateBIPs, ShamirChunk } from "../../Recovery/Shamir.js";
import { Pane } from "./Pane.js";

let container: Container;
let Bip: BIP;

/**
 * This pane is responsible for giving recovery options to the user
 */
export class RecoveryPane extends Pane {
	constructor(container_: Container, Bip_: BIP) {
		super("recovery_pane", "recovery_pane_button");
		container = container_;
		Bip = Bip_;

		// Event Listeners
		$("reveal_bip").addEventListener("click", revealBip);
		$("recovery_pane_generate_shared_recovery").addEventListener("click", createSharedRecovery);

		// up down change
		$("recovery_pane_pieces").addEventListener("change", sharedRecoveryUpDownEvent);
		$("recovery_pane_threshold").addEventListener("change", sharedRecoveryUpDownEvent);

		// previous next
		$("recovery_pane_generate_shared_recovery_previous").addEventListener("click", sharedRecoveryPrevious);
		$("recovery_pane_generate_shared_recovery_next").addEventListener("click", sharedRecoveryNext);
	}

	updatePane(data?: any): void {
		throw new Error("Method not implemented.");
	}
}

let bipRevealed = false;
/**
 * shows or hides the bip of the master key
 */
function revealBip() {
	if (bipRevealed) {
		removeAllChildren($("bip"));
		$("reveal_bip").textContent = "Reveal BIP";
		bipRevealed = false;
		return;
	}

	bipRevealed = true;

	const words = Bip.generateFromUint8Array(container.getMasterKey());
	const bip = $("bip");
	removeAllChildren(bip);

	for (let word = 0; word < words.length; word++) {
		const currentWord = words[word];

		const bipElement = document.createElement("p");
		bipElement.textContent = `${word + 1  }. ${  currentWord.text}`;

		bipElement.classList.add("mx-3");
		if (currentWord.underlined) {
			bipElement.classList.add("text-decoration-underline");
			bipElement.textContent += "*";
		}

		bip.appendChild(bipElement);
	}

	$("reveal_bip").textContent = "Hide BIP";
}

/**
 * Value change listener
 */
function sharedRecoveryUpDownEvent() {
	log("sharedRecoveryUpDownEvent");
	const pieces = $("recovery_pane_pieces") as HTMLInputElement;
	const threshold = $("recovery_pane_threshold") as HTMLInputElement;
	let piecesValue = Number.parseInt(pieces.value);
	let thresholdValue = Number.parseInt(threshold.value);

	// ensure minimum
	piecesValue = piecesValue < 2 ? 2 : piecesValue;
	thresholdValue = thresholdValue < 2 ? 2 : thresholdValue;

	// make sure that threshold is at least pieces
	thresholdValue = thresholdValue > piecesValue ? piecesValue : thresholdValue;

	// return values
	pieces.value = piecesValue.toString();
	threshold.value = thresholdValue.toString();
}

let shamirChunks = null as null | Array<ShamirChunk>;
/**
 * create shared recovery listener
 */
function createSharedRecovery() {
	// get data and make
	log("createSharedRecovery");
	const pieces = $("recovery_pane_pieces") as HTMLInputElement;
	const threshold = $("recovery_pane_threshold") as HTMLInputElement;
	const piecesValue = Number.parseInt(pieces.value);
	const thresholdValue = Number.parseInt(threshold.value);
	const masterKey = container.getMasterKey();

	log("mk:");
	log(masterKey);
	log(`pieces: ${  piecesValue}`);
	log(`thresh: ${  thresholdValue}`);

	shamirChunks = generateBIPs(masterKey, piecesValue, thresholdValue);
	log(shamirChunks);

	// make fields visible
	$("recovery_pane_generate_shared_recovery_screen").classList.remove("d-none");
	updateRecoveryScreen();
}

/**
 * Update recovery screen with shamir chunks
 */
function updateRecoveryScreen() {
	checkRecoveryPage();
	if (shamirChunks == null) throw "shamirChunks are undefined";
	log(`updateRecoveryScreen p:${  page}`);

	// make
	const shamirChunk = shamirChunks[page];
	const words = shamirChunk.makeBIP(Bip);

	// assign
	$("recovery_pane_generate_shared_recovery_title").textContent = `Piece number: ${  shamirChunk.part.toString()}`;
	const bipDiv = $("recovery_pane_generate_shared_recovery_bip");
	removeAllChildren(bipDiv);

	// display
	for (let word = 0; word < words.length; word++) {
		const currentWord = words[word];

		const bipElement = document.createElement("p");
		bipElement.textContent = `${word + 1  }. ${  currentWord.text}`;

		bipElement.classList.add("mx-3");
		if (currentWord.underlined) {
			bipElement.classList.add("text-decoration-underline");
			bipElement.textContent += "*";
		}

		bipDiv.appendChild(bipElement);
	}
}

var page = 0;
/**
 * Go forward
 */
function sharedRecoveryNext() {
	log("sharedRecoveryNext");
	page++;
	updateRecoveryScreen();
}

/**
 * Go back
 */
function sharedRecoveryPrevious() {
	log("sharedRecoveryNext");
	page--;
	updateRecoveryScreen();
}

/**
 * set button states and double check page number
 */
function checkRecoveryPage() {
	const next = $("recovery_pane_generate_shared_recovery_next") as HTMLInputElement;
	const previous = $("recovery_pane_generate_shared_recovery_previous") as HTMLInputElement;
	previous.disabled = next.disabled = false;

	if (shamirChunks == null) page = 0;
	else {
		page = page < 0 ? 0 : page;
		page = page >= shamirChunks.length ? shamirChunks.length - 1 : page;

		next.disabled = page == shamirChunks.length - 1; // last page
		previous.disabled = page == 0; // first page
	}
}

