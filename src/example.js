const puppeteer = require("puppeteer");
const moment = require("moment");
// const relativeTime = require("./relative_time");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1040 });

  const mainPageAddress = "https://redcafe.net/";
  await page.goto(mainPageAddress, { waitUntil: "networkidle0" });

  const tabNames = await page.evaluate(() =>
    Array.from(document.querySelectorAll("ul.tabs li a")).map(
      el => "#" + el.getAttribute("id")
    )
  );

  /* Getting all the hrefs of the football news page */
  let tab = tabNames[2];

  await page.click(tab, { delay: 1000 });

  const titles = await page.evaluate(() =>
    Array.from($("li div div h3 a")).map(el => el.getAttribute("href"))
  );
  console.log(titles);

  /* get a post from each thread */
  const posts = [];
  for (const thread of titles) {
    await page.goto(mainPageAddress + thread, {
      waitUntil: "domcontentloaded"
    });

    async function getInfo(selector) {
      let test = await page.evaluate(selector => {
        return Array.from(document.querySelectorAll(selector)).map(
          el => el.innerText
        );
      }, selector);
      return test;
    }

    const textBody = await getInfo("blockquote");

    const users = await getInfo("a.username");

    const dates = await page.evaluate(() =>
      Array.from(document.querySelectorAll("abbr.DateTime")).map(el => {
        return {
          date: el.getAttribute("data-datestring"),
          timeDay: el.getAttribute("data-timestring")
        };
      })
    );
    console.log(dates);

    const urls = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("div.privateControls a.postNumber")
      ).map(el => el.getAttribute("href"))
    );
  }

  //get name of the author from data-author
  //get date from message title
  //get body of the post
  //get link of the post from permalink

  // await browser.close();
})();

// /* Getting titles of every publication */
// (async()=>{
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();
//     await page.goto('https://gol.bg', {waitUntil:'domcontentloaded'});

//     let titles = await page.evaluate(() => {
//         const ttles = document.querySelectorAll('h2 a')
//         let newArray=[]

//         for (let index = 0; index < ttles.length; index++) {
//             let element = ttles[index].getAttribute("title");
//             newArray.push(element);
//             }

//         return newArray;
//         }
//     );

//     await browser.close();

//     console.log(titles)

// })();
