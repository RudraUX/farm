const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

// const fileIn = fs.readFileSync('./txt/read-this.txt', 'utf-8')

// const fileOut = `This is a file out ${fileIn}.\nCreated ${Date.now()}`;

// fs.writeFileSync('./txt/outputfile.txt', fileOut)

//  fs.readFile('./txt/input.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/outputfile.txt','utf-8', (err, data3) => {
//             fs.writeFile('./txt/nested.txt',`${data2}\n${data3}`, 'utf-8', err => {
//                 console.log("nested file has been created!!!");
//             });
//         });
//     });
// });
// console.log('THis file is reading');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverView = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

//here data is  a string...JSON.parse makes this string into an array of object which is dataObj.
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));
console.log(slugs)

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);

    //Overview
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverView.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
        res.end(output);
    }
    //product
    else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[ query.id ];
        const output = replaceTemplate(tempProduct, product);



        res.end(output);
    }
    //api
    else if (pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    }
    //Not found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello world'
        });//header is the information about the response or meta-data as well.
        res.end('<h1>Sorry page not found!!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening the request on port 8000');
});
