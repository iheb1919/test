const puppeteer = require('puppeteer')

const open = require("open")

async function start(){    
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto("https://www.goodreads.com/choiceawards/best-books-2020")
    const names = await page.evaluate(()=>{
        return Array.from(document.querySelectorAll("a  h4")).map(x=>x.textContent.substring(1,x.textContent.length-1))
    })
    
    console.log(names)
    
   console.log(typeof(names[0]))
   console.log(names[0])
   console.log(input)
    console.log(names.indexOf("Science Fiction"))
    if (names.includes(input))
        console.log("true")
    else 
    console.log("false")
    await browser.close()

}

const input = process.argv[2].charAt(0).toUpperCase()+ process.argv[2].slice(1).toLowerCase()


start()