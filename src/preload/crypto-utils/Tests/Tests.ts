import { BIPTests } from "./BIPTests.js";
import { ContainerTests } from "./ContainerTests.js";
import { ExtraTests } from "./ExtraTests.js";
import { RunTest } from "./RunTest.js";
import { ShamirTests } from "./ShamirTests.js";

export function runTests() {
	const tests = [
		new ContainerTests(),
		new ExtraTests(),
		new BIPTests(),
		new ShamirTests(),
	];

	// TODO: Slot
	// TODO: Account
	// TODO: Identity
	// TODO: Settings
	// TODO: CryptoFunctions

	/*
	for(let test = 0; test < tests.length; test++) {
		new Promise(() => tests[test].RunTests());
	}
    */
}
