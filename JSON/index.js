const http=require("http");
var jsonText=`
{
    "image":"https://images.hdqwalls.com/wallpapers/2020-joker-smile-4k-um.jpg",
    "title":"Joker",
    "description":"Joker laughing at the violent protests while driving in a taxi"
}`;
var jsonResp=JSON.parse(jsonText);

const hostname = '0.0.0.0';
const port = 3000;

const server=http.createServer((req,res)=>{
    res.writeHead(200,{"Content-Type":"application/json"});
    res.end(JSON.stringify(jsonResp));
});

server.listen(port,hostname,()=>{
    console.log("started server");
});
/*  DATA
    `{
        image:"https://images.hdqwalls.com/wallpapers/2020-joker-smile-4k-um.jpg",
        title:"Joker",
        description:"Joker laughing at the violent protests while driving in a taxi"
    }`
*/