const puppeteer = require("puppeteer");
const open = require("open");
const newBrowser = require('./browser')

async function startScrap(input) {
    const  browserInstance = newBrowser.browsers();
    let browser
	try {
        browser = await browserInstance;
        
    } catch (error) {
        console.log("Sorry something went WRONG !!! ", error);

    }
    /* new page ********/

    const page = await browser.newPage();
    await page.setViewport({"width": 0,"height": 0})
    await page.goto("https://www.goodreads.com/choiceawards/best-books-2020");
    let names
    try {
        names = await page.$$eval(".categoryContainer > .category.clearFix",(links,input) => {
            return links.filter(url => url.querySelector('a > h4').textContent.replace(/[\n\r]+|[\s]{2,}/g, '').trim() === input.replace("And","&"))
            .map(el => el.querySelector('a').href)},input);
            console.log(`going to ${input} Category ...` )
            await page.goto(names[0]);
    } catch (error) {
        console.log("soory no genre founded ! \n"+error)
            await browser.close();
            return 0
        
    }

    try {
        
        const [button] = await page.$x("//*[@id='gca2020']/div[3]/div/div/div[1]/button")
        if (button)
        await button.click()
        /* get the  books from the genre */
        const book = await page.$$eval(" .pollContents > .inlineblock.pollAnswer.resultShown", links =>{
            return links.map(url=>url.querySelector('a').href)
        })
        /* select Random book */ 
        let  randomBook = book[Math.floor(Math.random()*book.length)];
        console.log('getting the book ...')
        /**navigate the the selected book */
        await page.goto(randomBook)

        let bookDetails={}
        let checkSelector = (await page.$('#metacol > h1') )? true : false;

        /////////////////////////////////////////////



        let amazoneLink;
        if(checkSelector) {
            bookDetails['Title']= await page.$eval('#metacol > h1',text=>text.textContent.replace(/[\n\r]+|[\s]{2,}/g, '').trim())
            bookDetails['Author']= await page.$eval('#bookAuthors > span:nth-child(2) > div > a > span',text=>text.textContent.replace(/[\n\r]+|[\s]{2,}/g, '').trim())
            bookDetails['Description']= await page.$eval('#descriptionContainer > .readable.stacked > span:nth-child(1)',text=>text.textContent.replace(/[\n\r]+|[\s]{2,}/g, '').trim())
            console.log(bookDetails)
            amazoneLink = await page.$$eval(".buyButtonBar.left", link =>{
                return link.map(href=>href.querySelector('li > a').href)
            })
            await page.waitForSelector('#bookTitle')
            open(amazoneLink[0])
            
        } else {
            bookDetails['Title']= await page.$eval('.BookPageTitleSection__title > h1',text=>text.textContent.replace(/[\n\r]+|[\s]{2,}/g, '').trim())
            bookDetails['Author']= await page.$eval('div.BookPageMetadataSection__contributor > h3 > div > span:nth-child(1) > a > span.ContributorLink__name'
            ,text=>text.textContent.replace(/[\n\r]+|[\s]{2,}/g, '').trim())
            bookDetails['Description']=await page.$eval('div.TruncatedContent__text.TruncatedContent__text--large > div > div > span'
            ,text=> text.textContent.replace(/[\n\r]+|[\s]{2,}/g, '').trim()
            )
            console.log(bookDetails)
            amazoneLink = await page.waitForSelector('div.BookActions > div:nth-child(2) > div > div:nth-child(2) > button')
            await amazoneLink.click()
            console.log("done")
            const ama = await page.waitForSelector('.DropdownMenu > a')
            await ama.click()
            await page.waitForTimeout(3*1000)
            const pagesNum = await browser.pages()
            const page2 = pagesNum[pagesNum.length -1]
            try {
                
                const bookLink = await page2.$$eval(".bigBoxContent.containerWithHeaderContent > ol",links =>{
                    return links.filter(link=>link.querySelector('li > a')
                    .textContent.replace(/[\n\r]+|[\s]{2,}/g, '').trim() === "Amazon")
                    .map(href=>href.querySelector("a").href)
                })
                open(bookLink[0])
            } catch (error) {
                console.log("page not rigth")
            }
            
            
        }
    } catch (error) {
        console.log("can't find a book something went Wrong! \n"+error)
        await browser.close();
        return 0
        
    }
    await browser.close();

    console.log("Happy Reading :) ")
}
module.exports={
    startScrap
}