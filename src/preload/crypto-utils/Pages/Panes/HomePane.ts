import { Account } from "../../Account.js";
import { Container } from "../../Crypto/Container.js";
import { generatePassword } from "../../Crypto/CryptoFunctions.js";
import { DOMAlert } from "../../DOM/DOMAlert.js";
import { DOMConfirm } from "../../DOM/DOMConfirm.js";
import { $, removeAllChildren, disableStatus } from "../../DOM/DOMHelper.js";
import { Settings } from "../../Extra/Settings/Settings.js";
import { log } from "../../Functions.js";
import { Pane } from "./Pane.js"

let container: Container;
let account = 0;
let currentIdentity = 0;

/**
 * This class is an abstraction of the account manager.
 * It is responsible for storing, creating, deleting and displaying accounts and account infromation.
 */
export class HomePane extends Pane {
	account?: Account;

	constructor(container_: Container) {
		super("home_pane", "home_pane_button");
		container = container_;

		// Add listeners
		// add account
		$("add_account").addEventListener("click", createAccount);

		// add change listener
		$("account_website").addEventListener("input", saveAccountChanges);
		$("account_username").addEventListener("input", saveAccountChanges);
		$("account_password").addEventListener("input", saveAccountChanges);

		// Toggle to show password
		$("account_show_password").addEventListener("change", showHidePassword);

		// Delete account
		$("account_delete").addEventListener("click", () => new DOMConfirm(removeAccount, () => {}, "Delete account?", "Are you sure you want to remove this account?", "Remove account"));

		// Copy password
		$("account_copy_password").addEventListener("click", copyPassword);

		// Generate password
		$("account_generate_password").addEventListener("click", askGeneratePasswordForAccount);

		// add search
		$("search_home").addEventListener("input", () => { updateHomePane() });
	}

	updatePane(currentIdentity_: number): void {
		currentIdentity = currentIdentity_;
		updateHomePane();
	}
}

/**
 * Show or hide password in the currently selected account. 
 */
function showHidePassword() {
	($("account_password") as HTMLInputElement).type = ($("account_show_password") as HTMLInputElement).checked ? "text" : "password";
}

/**
 * Create an empty account
 */
function createAccount() {
	log("create account");
	// get data
	const identity = container.getIdentites()[currentIdentity];
	const {accounts} = identity;

	const newAccount = new Account();
	accounts.push(newAccount);

	account = accounts.length - 1;

	container.save(); // save new account

	updateHomePane();
}

/**
 * Remove current account
 */
function removeAccount() {
	const identity = container.getIdentites()[currentIdentity];
	log("deleted: ");
	log(identity.accounts.splice(account, 1));

	container.save() // save deleted account

	account--;
	updateHomePane();
}

/**
 * Save the changes that the user made to the account. Should fire on user input
 */
function saveAccountChanges() {
	// get data
	const identity = container.getIdentites()[currentIdentity];
	const {accounts} = identity;
	const currentAccount = accounts[account];

	log(`saving account number: ${  account}`);

	const account_website = $("account_website") as HTMLInputElement;
	const account_username = $("account_username") as HTMLInputElement;
	const account_password = $("account_password") as HTMLInputElement;

	currentAccount.website = account_website.value;
	currentAccount.login = account_username.value;
	currentAccount.password = account_password.value;

	container.save();
	updateHomePane(false);
}

/**
 * Update the accounts
 */
function updateAccountPane() {
	// get data
	const identity = container.getIdentites()[currentIdentity];
	log(identity);

	const {accounts} = identity;
	log(accounts);

	const currentAccount = accounts[account];
	log(currentAccount);

	const account_website = $("account_website") as HTMLInputElement;
	const account_username = $("account_username") as HTMLInputElement;
	const account_password = $("account_password") as HTMLInputElement;
	const account_generate_password = $("account_generate_password") as HTMLInputElement;
	const account_copy_password = $("account_copy_password") as HTMLInputElement;
	const account_show_password = $("account_show_password") as HTMLInputElement;
	const account_delete = $("account_delete") as HTMLInputElement;

	const toDisable = [account_website, account_username, account_password, account_generate_password, account_copy_password, account_show_password, account_delete];

	// make off by default
	account_show_password.checked = false;
	showHidePassword();

	if (accounts.length == 0) {
		// disable them and clear them
		disableStatus(toDisable, true);
		account_website.value = account_username.value = account_password.value = "";
	} else {
		// enable them 
		disableStatus(toDisable, false);

		// fill them with data
		account_website.value = currentAccount.website;
		account_username.value = currentAccount.login;
		account_password.value = currentAccount.password;
	}
}

/* account entry should look like this
<a href="#" class="list-group-item list-group-item-action py-3 lh-tight">
<div class="d-flex w-100 align-items-center justify-content-between">
  <strong class="mb-1">Website</strong>
  //<small class="text-muted">Tues</small>
</div>
<div class="col-10 mb-1 small">Email</div>
</a>
*/

/* empty field should look like this
<div class="d-block my-auto small text-center text-muted">No accounts in identity.</div>
*/
/**
 * Update the home pane with the accounts.
 * @param updateAccountToo should you update the account pane too?
 */
function updateHomePane(updateAccountToo = true) {
	log("update home page. ");
	const account_space = $("account_space");

	const searchString = ($("search_home") as HTMLInputElement).value;

	// clear
	removeAllChildren(account_space);

	// create entries
	const identity = container.getIdentites()[currentIdentity];
	const {accounts} = identity;

	// check data
	account = accounts.length <= account ? accounts.length - 1 : (account < 0 ? 0 : account);

	const validAccounts = [];
	let currentAccountInvalid = false;
	for (let accountIndex = 0; accountIndex < accounts.length; accountIndex++) {
		// get the account
		const accountObject = accounts[accountIndex];
		if (accountSearchMatch(accountObject, searchString)) validAccounts.push(accountIndex);
		else currentAccountInvalid = currentAccountInvalid || accountIndex == account;
	}

	log("valid accounts: ");
	log(validAccounts);

	if (currentAccountInvalid) {
		if (validAccounts.length > 0) account = validAccounts[0]; // if the current account is invalid, return the first instance of a valid account
		else account = 0; // or just 0 when there is nothing.
	}

	log(`account number: ${  account}`);

	if (validAccounts.length == 0 && currentAccountInvalid) {
		// there is nothing valid
		const emptyAccountNotif = document.createElement("div");
		emptyAccountNotif.classList.add("d-block", "my-auto", "small", "text-center", "text-muted");
		emptyAccountNotif.textContent = `No accounts matching search term '${  searchString  }' in identity '${  identity.identityName  }'`;
		account_space.appendChild(emptyAccountNotif);

	} else if (accounts.length == 0) {
		// there is no accounts
		const emptyAccountNotif = document.createElement("div");
		emptyAccountNotif.classList.add("d-block", "my-auto", "small", "text-center", "text-muted");
		emptyAccountNotif.textContent = `No accounts in identity '${  identity.identityName  }'`;
		account_space.appendChild(emptyAccountNotif);

	} else {
		// fill them with data
		for (let validAccountsIndex = 0; validAccountsIndex < validAccounts.length; validAccountsIndex++) {
			// get the account
			const accountIndex = validAccounts[validAccountsIndex];
			const accountObject = accounts[accountIndex];

			// make elements
			const a = document.createElement("a");
			a.href = "#";
			a.classList.add("list-group-item", "list-group-item-action", "py-3", "lh-tight");
			if (accountIndex == account) a.classList.add("active");

			const divTop = document.createElement("div");
			divTop.classList.add("d-flex", "w-100", "align-items-center", "justify-content-between");

			const divTopStrong = document.createElement("strong");
			divTopStrong.classList.add("mb-1");
			divTopStrong.textContent = accountObject.website;

			divTop.appendChild(divTopStrong);
			a.appendChild(divTop);

			const divBottom = document.createElement("div");
			divBottom.classList.add("col-10", "mb-1", "small");
			divBottom.textContent = accountObject.login;

			a.appendChild(divBottom);

			// add event listener
			a.addEventListener("click", () => {
				account = accountIndex;
				log(`Changed account number to: ${  account}`);
				updateHomePane();
			})

			account_space.appendChild(a);
		}
	}

	if (updateAccountToo) updateAccountPane();
}

/**
 * Should the account be accepted given the search criteria
 * @param accountObject account to test
 * @param searchString search criteria
 * @returns true if the account meets the search criteria
 */
function accountSearchMatch(accountObject: Account, searchString: string) {
	searchString = searchString.trim().toLocaleLowerCase();
	if (searchString == "") return true;

	const login = accountObject.login.trim().toLocaleLowerCase();
	const website = accountObject.website.trim().toLocaleLowerCase();
	return login.includes(searchString) || website.includes(searchString);
}

/**
 * Ask the user if the password should be regenerated or overwritten.
 */
function askGeneratePasswordForAccount() {
	const account_password = $("account_password") as HTMLInputElement;
	if(account_password.value != "") new DOMConfirm(generatePasswordForAccount, () => {}, "Overwrite password?", "Do you want to overwrite the current password?");
	else generatePasswordForAccount();
}

/**
 * Listener for generate password button
 */
function generatePasswordForAccount() {
	if(container.getIdentites()[currentIdentity].accounts.length == 0) return;

	const account_password = $("account_password") as HTMLInputElement;
	const password = generatePassword((container.settings == null ? new Settings() : container.settings).passwordSettings);
	account_password.value = password;

	saveAccountChanges();
}

/**
 * Listener for copy password button. Copies the current password to the clipboard. 
 */
function copyPassword() {
	const account_password = $("account_password") as HTMLInputElement;
	navigator.clipboard.writeText(account_password.value).then(() => {
		new DOMAlert("secondary", "Password copied!");
	});
}