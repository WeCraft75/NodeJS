//imports
const http = require('http');
const fs = require('fs');
const qs = require('querystring');

//settings
const hostname = '0.0.0.0';
const port = '3333';
const url = `http://${hostname}:${port}/`;

const server = http.createServer((req, res) => {
    var action = req.url;
    var query;
    //if action doesn't have a ?, it most likely is list or unknown action
    if (action.includes('?')) {
        //sanitize action and prepare query data
        action = action.substring(0, req.url.indexOf('?'));
        query = req.url.substring(req.url.indexOf('?') + 1);
        var queryJSON = qs.parse(query);
    }
    //variables
    var content;
    var title;
    var files;
    var filesJSON;
    var i;
    var bufferedContent;
    //process request
    switch (action) {
        case '/save':
            res.setHeader('Content-Type', 'Text-Plain');
            title = queryJSON.title;
            content = queryJSON.content;
            //write a new file
            bufferedContent = new Uint8Array(Buffer.from(content));
            fs.writeFileSync(title + ".txt", bufferedContent, (err) => {
                if (err) {
                    res.write('error');
                    console.log('error');
                    throw err;
                }
            });
            //i wasn't actually able to test what happens if there is an error
            res.writeHead(200);
            res.write('done');
            break;
        case '/load':
            files = fs.readdirSync('.');
            res.setHeader('Content-Type', 'Text-Plain');
            if (files.includes(queryJSON.title + '.txt')) {
                content = fs.readFileSync('./' + queryJSON.title + '.txt', 'utf8');
                res.write(content);
            }
            else {
                //file does not exist
                res.write('file does not exist');
            }
            break;
        case '/list':
            res.setHeader('Content-Type', 'application/json');
            files = fs.readdirSync('.');
            res.writeHead(200);
            //construct json string and remove all but *.txt files
            filesJSON = '{';
            i = 0;
            files.forEach(file => {
                if (file.endsWith('.txt')) {
                    if (i == 0) {
                        // "i":"file.name"  don't start with ',' and remove .ext
                        filesJSON = filesJSON + `"${i}":"${file.substring(0, file.lastIndexOf('.'))}"`;
                    }
                    else {
                        // ,"i":"file.name"  start with ',' and remove .ext
                        filesJSON = filesJSON + `,"${i}":"${file.substring(0, file.lastIndexOf('.'))}"`;
                    }
                    i++;
                }
            });
            filesJSON = filesJSON + '}';
            res.write(filesJSON);
            break;
        case '/delete':
            files = fs.readdirSync('.');
            //check if file exists
            if (files.includes(queryJSON.title + ".txt")) {
                try {
                    //remove file
                    fs.unlinkSync(queryJSON.title + ".txt");
                    res.write('done');
                } catch (err) {
                    res.write('error');
                }
            }
            else {
                //file does not exist
                res.write('file does not exist');
            }
            break;
        default:
            //return error/warning
            res.setHeader('Content-Type', 'Text-Plain');
            res.writeHead(400);
            res.write('unknown action: ' + action);
            console.log('unknown action: ' + action);
    }
    res.end();
});
server.listen(port, hostname, () => {
    console.log('Server started on ' + url);
});
process.on('uncaughtException', (err, origin) => {
    //do nothing, ideally end req?
});

//http://localhost:3333/save?title=Groceries&content=eggs, milk, bread
//http://localhost:3333/save?title=Groceries&content=eggs
//http://localhost:3333/save?title=xd.yes&content=test xd.yes
//http://localhost:3333/save?title=xd&content=test xd
//http://localhost:3333/delete?title=xd
//http://localhost:3333/list
//http://localhost:3333/load?title=Groceries