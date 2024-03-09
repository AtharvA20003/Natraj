import Nightmare from "nightmare";
let nightmare = Nightmare({ show: true });

nightmare.goto('https://unsplash.com/s/photos/night?license=free')
    .wait(2000)
    .evaluate(() => {
        const links = [];
        let img = [...document.querySelectorAll('img.tB6UZ.a5VGX')];
        img.forEach((img)=>{
            links.push(img.getAttribute('src'));
        })
        return links;
    })
    .end()
    .then((links)=>console.log(links));
    nightmare = Nightmare({show:true});
    nightmare.goto(`https://www.pexels.com/search/night/`)
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
        console.log(links);
    })