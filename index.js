import puppeteer from "puppeteer";
import fs from 'fs';
import request from "request";
import slugify from "slugify";

let dir = './Natraj';

//Making the directory in the same parent folder
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const natraj = async (URL, len) => {
    //Opening the browser
    const browser = await puppeteer.launch({
        headless: false
    });

    //Making the passed URL more appropriate for the internet
    const url = slugify(URL);

    //Opening 2 pages
    const page1 = await browser.newPage();
    const page2 = await browser.newPage();

    // One page for Unsplash
    await page1.goto(`https://unsplash.com/s/photos/${url}?license=free`);

    //And the other for Pexels
    await page2.goto(`https://www.pexels.com/search/${url}/`);

    //Scraping img tag from Unsplash page
    const imageTagFromUnsplash = await page1.$$('img');
    
    let result = [];

    //Getting the srcset attribute from the img tag obtained previously
    for (let img of imageTagFromUnsplash) {
        result.push(await img.evaluate(x => x.srcset))
    }

    // Filtering the "result" array we got, because it had multiple links (as it is an "srcset" so..) 
    let filteredResultOfUnsplash = [];
    for (let i = 0; i < result.length; i++) {
        let str = result[i];
        let desiredStr = str.split(',').filter(link => link.includes('w=1000')).find(link => link.includes('w=1000'));
        if (typeof desiredStr !== 'undefined') {
            filteredResultOfUnsplash.push(desiredStr);
        }
    }

    //Getting img tag from Pexels
    const imageTagFromPexels = await page2.$$('img');
    
    //Again obtaining the "src" attribute from the img tag of pexels
    let resultFromPexels = [];
    for (let img of imageTagFromPexels) {
        resultFromPexels.push(await img.evaluate(x => x.src))
    }

    //Little bit of filtering
    let filteredResultOfPexels = [];
    filteredResultOfPexels = resultFromPexels.filter(link => !link.startsWith('https://cdn-'));

    //Closing the browser
    await browser.close();

    //Combining both the arrays to get a vivid collection of images.
    const combinedResultFromBothSites = [];
    let i = 0, j = 0;
    while (i < filteredResultOfPexels.length && j < filteredResultOfUnsplash.length) {
        combinedResultFromBothSites.push(filteredResultOfPexels[i]);
        combinedResultFromBothSites.push(filteredResultOfUnsplash[j]);
        i++;
        j++;

    }
    combinedResultFromBothSites.push(...filteredResultOfPexels.slice(i));
    combinedResultFromBothSites.push(...filteredResultOfUnsplash.slice(j));

    //If demanded images are more than what we could arrange, then telling the user about the same and downloading what little we could arrange.
    if(len>combinedResultFromBothSites.length){
        console.log(`We could only arrange ${combinedResultFromBothSites.length} images 🥲. Downloading those..`)
        download(combinedResultFromBothSites, url);
    }
    //Else downloading the required number of images.
    else{
        combinedResultFromBothSites.splice(len);
        download(combinedResultFromBothSites, url);
    }
};

//Function to handle downloading.
const download = async (list, url) => {

    for (let i = 0; i < list.length; i++) {
        download_image(list[i], `./Natraj/${url}-${i + 1}.jpg`, function () { console.log(`Downloaded image number: ${i+1}`) })
    }
}

//Function to implement downloading
const download_image = function (uri, filename, callback) {
    try {
        request.head(uri, function (err, res, body) {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            //Piping a writeStream to bring the image data aboard (basically copying the image from the url obtained)
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    } catch (err) {
        console.log("Some error occured somewhere...")
    }
};
export default natraj;