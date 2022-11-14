import { Account } from "../Account.js";
import { log } from "../Functions.js";

/**
 * This class holds and serialises the data used for holding account information.
 * @todo implement {@link Extra}.
 */
export class Identity implements iJSON {
	public accounts: Array<Account>;

	public identityName: string;

	public identityDesc: string;

	constructor(identityData: any) {
		const jsonIdentityData = JSON.parse(identityData);
		log("making accounts");
		// add accounts
		this.accounts = [];
		for (let index = 0; index < jsonIdentityData.accounts.length; index++) {
			log(index);
			const data = JSON.parse(jsonIdentityData.accounts[index]);
			log(data);
			const account = new Account(data);
			log(account);
			this.accounts.push(account);
		}
		log("all accounts: ");
		log(this.accounts);

		// misc
		this.identityName = jsonIdentityData.identityName;
		this.identityDesc = jsonIdentityData.identityDesc;
	}

	getJSON() {
		// gather accounts' JSON
		const accounts = [] as Array<string>;
		for (let index = 0; index < this.accounts.length; index++) {
			accounts.push(this.accounts[index].getJSON());
		}

		return JSON.stringify({
			"accounts": accounts,
			"identityName": this.identityName,
			"identityDesc": this.identityDesc,
		});
	}
}
