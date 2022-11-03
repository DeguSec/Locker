import { Container } from "../../Crypto/Container.js";
import { algorithmBytes } from "../../Crypto/CryptoFunctions.js";
import { DOMAlert } from "../../DOM/DOMAlert.js";
import { $, $$$, disableStatus } from "../../DOM/DOMHelper.js";
import { log } from "../../Functions.js";
import { BIP, Word } from "../../Recovery/BIP.js";
import { Pane } from "./Pane.js";

let bip : BIP;
let container : Container;

const checkboxes = [] as Array<string>;
const textfields = [] as Array<string>;

/**
 * A single page word recovery for the user to fill out and regain access of the password manager
 */
export class WordRecovery extends Pane {
	constructor(container_ : Container, BIP_ : BIP) {
		super("word_recovery_pane", "word_recovery_button");
    
		container = container_;
		bip = BIP_;

		log("WordRecovery");
		const {encryptionType} = container;
		if(encryptionType == null) throw "WordRecovery: Container encryption type is null";
		const blocksNeed = algorithmBytes(encryptionType) / 2;

		log(encryptionType);
		log(blocksNeed);

		// make blocks
		const recovery_fields = $("recovery_fields");

		for (let i = 1; i <= blocksNeed; i++) {
			const flexDiv = document.createElement("div");
			flexDiv.classList.add("d-flex", "flex-row", "flex-nowrap", "mx-auto", "mb-3", "form-check", "needs-validation");

			// Main elements
			const label = document.createElement("label") as HTMLLabelElement;
			label.classList.add("text-center", "mx-1", "mt-auto", "mb-auto");
			label.setAttribute("for", `ch_id_${  i}`);
			label.textContent = `${i  }. `;

			const checkbox = document.createElement("input") as HTMLInputElement;
			checkbox.classList.add("d-inline", "mx-1", "mt-auto", "mb-auto");
			checkbox.type = "checkbox";
			checkbox.id = `ch_id_${  i}`;

			const textfield = document.createElement("input") as HTMLInputElement;
			textfield.classList.add("d-inline", "mx-1", "mt-auto", "mb-auto", "form-control", "is-invalid");
			textfield.type = "text";
			textfield.id = `tx_id_${  i}`;

			// Add listeners
			checkbox.addEventListener("click", () => {
				if (checkbox.checked) textfield.classList.add("text-decoration-underline");
				else textfield.classList.remove("text-decoration-underline");
			});

			textfield.addEventListener("input", () => {
				log(`checking word: ${  textfield.value}`);
				if(textfield.value.includes("*")) {
					checkbox.checked = true;
					textfield.value = textfield.value.replace("*", "");
				}
        
				if (bip.isWordValid(textfield.value)) {
					textfield.classList.add("is-valid");
					textfield.classList.remove("is-invalid");
				} else {
					textfield.classList.remove("is-valid");
					textfield.classList.add("is-invalid");
				}
			});

			// Combine
			flexDiv.appendChild(label);
			flexDiv.appendChild(checkbox);
			flexDiv.appendChild(textfield);
			recovery_fields.appendChild(flexDiv);

			// add to the list
			checkboxes.push(checkbox.id);
			textfields.push(textfield.id);
		}

		// action listsner for button
		$("word_submit").addEventListener("click", () => {
			// make words
			const words = [];
			let valid = true;
			for (let i = 1; i <= textfields.length; i++) {
				const checkbox = $(`ch_id_${  i}`) as HTMLInputElement;
				const textfield = $(`tx_id_${  i}`) as HTMLInputElement;
				const word = new Word(textfield.value, checkbox.checked);
				valid = valid && word.checkWord(bip);
				if (!valid) break;
				words.push(word);
				textfield.value = "";
				checkbox.checked = false;
			}

			if (!valid) {
				// throw gang sign
				new DOMAlert("warning", "One or more fields are invalid. Check them please.", $("notification_container"));
			} else {
				log("success");

				// lock everything
				const lock = $$$(checkboxes, textfields) as Array<HTMLInputElement>;
				lock.push($("word_submit") as HTMLInputElement);
				disableStatus(lock, true);

				// make bip from words
				const masterKey = bip.generateFromWords(words);
				container.externalUnlock(masterKey).then(() => {
					// success
					this.onChange();
					disableStatus(lock, false);
				}, (error) => {
					// fail
					disableStatus(lock, false);
					new DOMAlert("danger", `Could not open container externally because: ${  error  }.\n\nPlease double check the recovery`, $("notification_container"));
				});

			}
		});
	}

	updatePane() {}
}
