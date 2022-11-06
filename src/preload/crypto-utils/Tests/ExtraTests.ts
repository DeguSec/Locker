import { Extra } from "../Extra/Extra.js";
import { log, randomCharacters } from "../Functions.js";
import { RunTest } from "./RunTest.js";

export class ExtraTests extends RunTest {
	constructor() {
		super();
		// == Sync Tests ==
		log("Testing ExtraDataSorted");

		async function ExtraTestRandom1() {
			const extraData = new Extra();
			const MAX_LOOPS = 100_000;
			const checkingIndex = Math.floor(Math.random() * (MAX_LOOPS - 1));

			let myIdentifier;
			let myData;
			for (let i = 0; i < MAX_LOOPS; i++) {
				let identifier = randomCharacters(16);
				const data = randomCharacters(16);

				// Check for collisions now
				if (i > checkingIndex) {
					// while a collision exists
					while (myIdentifier === identifier) {
						// reroll identifier
						identifier = randomCharacters(16);
					}
				}

				// since this i is chosen, this will be the data
				if (i === checkingIndex) {
					myIdentifier = identifier;
					myData = data;
				}

				extraData.setData(identifier, data);
			}

			// As any because my identifier will always fall between the bounds.
			return extraData.getData(myIdentifier as any) === myData;
		}

		// Extra
		super.tests = [
			async function ExtraTextFull1() {
				const extraData = new Extra();
				extraData.setData("test", "test");
				extraData.setData("teset", "test string");

				let pass = extraData.getData("test") === "test";
				pass &&= extraData.getData("teset") === "test string";
				pass &&= !extraData.hadData("not here");
				pass &&= extraData.hadData("test");

				return pass;
			},

			async function ExtraTestSimple1() {
				const extraData = new Extra();
				extraData.setData("test", "test");

				return extraData.hadData("test");
			},

			async function ExtraTestSimple2() {
				const extraData = new Extra();
				extraData.setData("test", "test");
				extraData.setData("teset", "test string");

				return !extraData.hadData("non existent");
			},

			async function ExtraTestSimple3() {
				const extraData = new Extra();
				extraData.setData("test", "test");
				extraData.setData("teset", "test string");

				return extraData.getData("test") === "test";
			},

			async function ExtraTestSimple4() {
				const extraData = new Extra();
				extraData.setData("test", "test");
				extraData.setData("teset", "test string");
				extraData.setData("test", "updated value");

				return extraData.getData("test") === "updated value";
			},

			ExtraTestRandom1,

			async function ExtraTestRandom2() {
				// small brute force
				for (let i = 0; i < 20; i++) {
					if (!ExtraTestRandom1()) return false;
				}

				return true;
			},

			async function ExtraTestRandom3() {
				const extra = new Extra();

				for(let i = 0; i < 20; i++) {
					extra.setData(randomCharacters(16), randomCharacters(255));
				}

				const identifier = randomCharacters(16);
				const data = randomCharacters(255);

				extra.setData(identifier, data);

				const extraJSON = extra.getJSON();
				const extra2 = new Extra(JSON.parse(extraJSON));

				return extra2.getData(identifier) === extra.getData(identifier) && extra2.getData(identifier) === data;
			}
		];
	}

	async RunTests(resultObject: HTMLElement) {
		log("Running tests");
		log(this.tests);
		super.RunTests(resultObject);
	}
}
