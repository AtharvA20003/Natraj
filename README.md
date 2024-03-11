# Natraj

Natraj is a Node.js package designed to simplify the process of sourcing copyright-free images for web development projects. Say goodbye to the hassle of manually searching, downloading, and organizing images - Natraj automates the entire process for you!

## Problem

Developers often face the tedious task of sourcing and integrating images into their projects. This involves switching between the development environment and browsers, searching for suitable images, downloading them, and then organizing them within the project directory. Not only does this consume valuable time and effort, but it also breaks concentration and disrupts workflow.

## Solution

Natraj streamlines the image sourcing process by automating the search, download, and organization of copyright-free images from trusted sources like Unsplash and Pexels. With Natraj, developers can seamlessly integrate high-quality images directly into their projects, saving time and effort while maintaining focus on their coding tasks.

## Features

- **Effortless Integration:** Natraj seamlessly integrates with your project directory, automatically downloads copyright-free images from Unsplash and Pexels.
- **Copyright-Free Images:** Access a vast library of high-quality, copyright-free images from trusted sources.
- **Time-Saving:** Save valuable time and effort by eliminating the need for manual image sourcing and organization.

## Installation

To install Natraj, simply run:

```npm install natraj```

Then in the package.json file, add (if not already present)
```json
 "type":"module",
```
(as currently it is only supporting ES6 imports).

Then make an js file (say natraj.js):
```JS
import natraj from 'natraj';

natraj('forest', 20); //Say you want 20 photos for forest

natraj('dogs'); //If you do not pass the arguments of how many images you want, natraj will give you all the images it could gather at that time.

natraj('cats', 500); //If your argument is more than the images we could gather at that time, there will be a console.log saying "We could only arrange {number of how much images we could gather} images 🥲. Downloading those.."

```

And then run the natraj.js file:
```
node ./natraj.js
```
You'll soon enough see 2 'electron' windows opening up, firstly you'll see a page with an unsplash link opening up. Then nearly after 3 seconds it'll close automatically. You should NOT close it manually.
Then another page with Pexels link will open up and last for around 3 seconds.
This process is necessary because it helps in scraping the pages, because it seems pexels blocks browserless requests.

Then soon enough you'll start seeing seeing messages in your console link "downloaded image number-{some number}" and 
"content length:{some number}"

And lo and behold you'll notice a directory called 'Natraj' in your present working directory which will have the required number of images downloaded.

## How Natraj Works: 
Natraj uses <b>Nightmare.js</b> to scrape unsplash and pexels page. The first argument (WhatKindOfPhotosYouWant) is passed on to the function and sllugify converts this into a slug. Then the URL is modified according to the slug and we visit the page using Nightmare's goto() function.
We then wait for 2 seconds so that the page loads fully...
And then we evaluate the page using the .evakuate() function of Nightmare. In evaluate(), we find all the <img> tags and then `forEach` img tag, we take the src attribute and push it into an array.
Then when we have scraped both unsplash and pexels, we download those images using the `request` node package and we write it in a file using `fs.createWriteStream()` function of `fs` module.

## The challenges we faced:
Puppeteer is also an amazing library for web-scraping.
But on many devices we faced an error that puppeteer was not being installed. (<i>ERROR: Failed to set up Chrome ... Set "PUPPETEER_SKIP_DOWNLOAD" env variable to skip download</i> such an error we faced)
In manier cases, another error which we encountered was : <i>UnhandledPromiseRejectionWarning: Error: Chromium revision is not downloaded. Run "npm install" or "yarn install" at Launcher.launch</i>
Due to these errors, we decided to use Nightmare and changed from puppeteer (used in version 1._._) and we updated version to 2._._


## Contributing

Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests through our GitHub repository.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.



















