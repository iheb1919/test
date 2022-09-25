const puppeteer = require('puppeteer');

async function browsers(){
	let browser;
	try {
	console.log("Opening the browser...");
	browser = await puppeteer.launch();
	} catch (error) {
	console.log("Sorry something went WRONG !!! ", error);
	}
	return browser;
}

module.exports = {
	browsers
};