const fs = require("fs");
const express = require("express");
const path = require("path");
const http = require("http");
const url = require("url");
const crypto = require("crypto");
const EventEmitter = require("events");
const app = express();

const direactpath = path.join(__dirname, "Public");
app.set("view engine", "ejs");

// create path++++++++++
const filepath = `${direactpath}/App.js`;

// fs.writeFileSync(filepath, "helo first App File");

// Read file+++++++++++++

// fs.readFile(filepath, "utf8", (err, item) => {
//   console.log("item", item);
// });

// update file++++++++++

// fs.appendFile(filepath, "heloo bhai append kar doo", (err) => {
//   if (!err) console.log("data update");
// });

// Rename file +++++++++

// fs.rename(filepath, `${direactpath}/Rename.js`, (err) => {
//   console.log("err", err);
// });

// Delete filee+++++++++
// fs.unlinkSync(`${direactpath}/Rename.js`);

// let a = 20;
// let b = 0;

// let data = new Promise((res, err) => {
//   setTimeout(() => {
//     res(110);
//   }, 3000);
// })
//   .then((res) => {
//     b = res;
//     console.log("resp++++++=", a + b);
//   })
//   .catch((err) => {
//     console.log("err+++++++++++", err);
//   });
// console.log(direactpath);
// app.use(express.static(direactpath));

// app.get("/AboutMe", (req, resp) => {
//   resp.sendFile(`${direactpath}/About.html`);
// });
// app.get("/Profile", (req, resp) => {
//   const data = {
//     name: "waseem",
//     email: "waseemanjum899@gmail.com",
//     password: "123455",
//     city: "jatoi",
//     location: "lahore",
//     skiLL: [
//       "React native",
//       "node js",
//       "javascript",
//       "typescript",
//       "html",
//       "css",
//       "express js",
//       "mango db",
//       "mysql",
//     ],
//   };
//   resp.render("Profile", { data });
// });

// app.get("*", (req, resp) => {
//   resp.sendFile(`${direactpath}/NotPage.html`);
// });
// const reqfilter = (req, res, next) => {
//   next();
// };
// app.use(reqfilter);
// app.get("/Login", (req, resp) => {
//   resp.send("helo login page");
// });
// app.listen(4000);

// fs.readFile("./txt/input.tsx", "utf-8", (err, data) => {
//   console.log(data);
// });

// serverr +++++++++++++

// http
//   .createServer((req, res) => {
//     const path = req?.url;
//     const { query, pathname } = url.parse(req.url, true);
//     console.log(pathname);
//     if (path == "/data") {
//       res.end("data server is god");
//     } else if (path === "/name") {
//       fs.readFile(`${__dirname}/Api/data.json`, "utf-8", (err, data) => {
//         const datarecord = JSON.parse(data);
//         // console.log(datarecord);
//         res.writeHead(200, {
//           "Content-type": "Application/json",
//         });
//         res.end(data);
//       });
//     } else {
//       res.writeHead(404, {
//         "Content-type": "text/html",
//         "my-own-header": "hello world",
//       });
//       res.end("<h1>page Not found</h1>");
//     }
//   })
//   .listen(8000, "127.0.0.1", () => {
//     console.log("res");
//   });
// process.env.UV_THREADPOOL_SIZE = 2;
// const start = Date.now();

// crypto.pbkdf2("password", "salt", 10000, 1024, "sha512", () => {
//   console.log(Date.now() - start, "password incrupted");
// });
// crypto.pbkdf2("password", "salt", 10000, 1024, "sha512", () => {
//   console.log(Date.now() - start, "password incrupted");
// });
// crypto.pbkdf2("password", "salt", 10000, 1024, "sha512", () => {
//   console.log(Date.now() - start, "password incrupted");
// });

// const myEmitter = new EventEmitter();

// myEmitter.on("new sale", () => {
//   console.log("heloo first emitter");
// });
// myEmitter.on("new sale", () => {
//   console.log("heloo second emitter");
// });
// myEmitter.emit("new sale");

// const server = http.createServer();
// server.on("request", (req, res) => {
//   res.end("heloo server we are comming in");
// });
// server.on("close", (req, res) => {
//   console.log("server is closed");
// });
// server.listen(8000);
// const server = http.createServer();
// server.on("request", (req, res) => {
//soluton 1
// fs.readFile("text.txt", (data, err) => {
//   console.log(data);
//   res.end(data);
// });
// solution 2 streem methed
// const readable = fs.createReadStream("text.txt");
// readable.on("data", (chunk) => {
//   res.write(chunk);
// });
// readable.on("end", () => {
//   res.end();
// });
// readable.on("error", (err) => {
//   console.log("err", err);
//   res.statusCode = 500;
//   res.end("file not found");
// });

// solution 3++++++
//   const readable = fs.createReadStream("text.txt");
//   readable.pipe(res);
// });
// server.listen(7000, (res) => {
//   // console.log("response server");
// });

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello good api work", AppData: "heelo" });

  // send("helooo server");
});
app.post("/", (req, res) => {
  res.send("Api Post worjing fine");
});
app.listen(3000, "127.0.0.1", (res) => {
  console.log(res);
});
