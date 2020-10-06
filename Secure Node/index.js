const https = require("https");
const fs = require("fs");

const hostname = '127.0.0.1';
const port = 443;

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem")
};

var server=https.createServer(options, function (req, res) {
    res.writeHead(200,{"Content-Type":"text/plain"});
    res.end("Only you can decipher this text.");
});

server.listen(port,hostname,()=>{
    console.log(`Listening on https://${hostname}:${port}`);
});