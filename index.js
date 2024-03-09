import Nightmare from 'nightmare';
import fs from 'fs';
import request from "request";
import slugify from "slugify";
let nightmare = Nightmare({ show: true });
const natraj = async (URL, len) => {

    let dir = './Natraj';

    //Making the directory in the same parent folder
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    try {
        //Making the passed URL more appropriate for the internet
        const url = slugify(URL);
        
        //Opening 2 pages
        let linkFromUnsplash = []
        let linksFromPexels = [];
        await nightmare.goto(`https://unsplash.com/s/photos/${url}?license=free`)
            .wait(2000)
            .evaluate(() => {
                const links = [];
                let img = [...document.querySelectorAll('img.tB6UZ.a5VGX')];
                img.forEach((img) => {
                    links.push(img.getAttribute('src'));
                })
                return links;
            })
            .end()
            .then((links) => linkFromUnsplash = links);

            nightmare = Nightmare({show:true});
            await nightmare.goto(`https://www.pexels.com/search/${url}/`)
            .wait(2000)
            .evaluate(() => {
                const links = [];
                // let src = document.querySelector('img');
                let img = [...document.querySelectorAll('img')];
                img.forEach((img)=>{
                    links.push(img.getAttribute('src'));
                })
                return links;
            })
            .end()
            .then((links) => {
                linksFromPexels = links;
            })

        //Combining both the arrays to get a vivid collection of images.
        const combinedResultFromBothSites = [];
        let i = 0, j = 0;
        while (i < linksFromPexels.length && j < linkFromUnsplash.length) {
            combinedResultFromBothSites.push(linksFromPexels[i]);
            combinedResultFromBothSites.push(linkFromUnsplash[j]);
            i++;
            j++;

        }
        combinedResultFromBothSites.push(...linksFromPexels.slice(i));
        combinedResultFromBothSites.push(...linkFromUnsplash.slice(j));
        len = typeof len !== "undefined" ? len : combinedResultFromBothSites.length-2;
        //If demanded images are more than what we could arrange, then telling the user about the same and downloading what little we could arrange.
        if (len > combinedResultFromBothSites.length) {
            console.log(`We could only arrange ${combinedResultFromBothSites.length} images 🥲. Downloading those..`)
            download(combinedResultFromBothSites, url);
        }
        //Else downloading the required number of images.
        else {
            combinedResultFromBothSites.splice(len);
            download(combinedResultFromBothSites, url);
        }

    } catch (error) {
        console.log(error);
    }
};

//Function to handle downloading.
const download = async (list, url) => {

    for (let i = 0; i < list.length; i++) {
        download_image(list[i], `./Natraj/${url}-${i + 1}.jpg`, function () { console.log(`Downloaded image number: ${i + 1}`) })
    }
}

//Function to implement downloading
const download_image = function (uri, filename, callback) {
    // try {
        request.head(uri, function (err, res, body) {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            //Piping a writeStream to bring the image data aboard (basically copying the image from the url obtained)
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    // } catch (err) {
    //     console.log("Some error occured somewhere...")
    // }
};
export default natraj;