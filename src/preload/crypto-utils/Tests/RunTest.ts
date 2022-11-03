const check = "✅"; // ✔️
const cross = "❎"; // ❌



export class RunTest {
	tests = [] as Array<(() => Promise<boolean>)>;

	// TODO: Run tests here
	// eslint-disable-next-line class-methods-use-this
	RunTests(resultObject : HTMLElement) {
		// for(let test = 0; test < this.tests.length; test++) {
		// 	new Promise(() => {
		// 		const currentTest = this.tests[test];

		// 		// create objects
		// 		const domObject = document.createElement("div");
		// 		const testName = document.createElement("div");
		// 		const testResult = document.createElement("div");
		// 		domObject.appendChild(testResult);
		// 		domObject.appendChild(testName);
		// 		resultObject.appendChild(domObject);

		// 		// assign values
		// 		domObject.classList.add("test");
		// 		testName.classList.add("test-title");
		// 		testResult.classList.add("test-result");

		// 		testName.textContent = currentTest.name;
		// 		testResult.textContent = "Waiting...";

		// 		currentTest().then((res) => {
		// 			testResult.textContent = res ? check : cross;
		// 		}, (reason) => {
		// 			testResult.textContent = `${cross  } ${  reason}`;
		// 		});
		// 	});
		// }
	}
}
