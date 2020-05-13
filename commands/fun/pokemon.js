const puppeteer = require("puppeteer");

module.exports = {
	name          : "pokemon",
	aliases       : [],
	description   : "Create a Pocket Monster",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(message, args) {
		let end   = global.metrics.summaries.labels("pokemon").startTimer();
		let src   = "https://japeal.com/pkm/";

		(async () => {
			const browser           = await puppeteer.launch({headless: false});
			const page              = await browser.newPage();
			const navigationPromise = page.waitForNavigation();

			await page.goto(src),
				await page.click("#fbutton"),
				await navigationPromise,
				x = await page.evaluate(() => {
					console.log("In the function");
					let multiplier  = 1;
					let combined    = document.getElementById("canvas_download");
					let ctx         = combined.getContext("2d");
					let combinedX2  = document.getElementById("canvasShake");
					combined.width  = combinedX2.width;
					combined.height = combinedX2.height;

					console.log("In the function");

					combined.width  = combinedX2.width * multiplier;
					combined.height = combinedX2.height * multiplier;

					combined.imageSmoothingEnabled    = false;
					combined.mozImageSmoothingEnabled = false;
					combined.globalCompositeOperation = "source-over";

					ctx.drawImage(combinedX2, 0, 0, combinedX2.width * multiplier, combinedX2.height * multiplier);

					let combinedL1 = document.getElementById("canvas_SSJ2Lightning");
					ctx.drawImage(combinedL1, 0, 0, combinedL1.width * multiplier, combinedL1.height * multiplier);
					console.log("In the function");

					let imageDL = document.getElementById("canvas_download")
										  .toDataURL("image/png")
										  .replace("image/png", "image/octet-stream");
					console.log(imageDL);
					return Promise.resolve(imageDL);
				});

			//await browser.close();
			console.log(x);
		})();
		end();
	}
};