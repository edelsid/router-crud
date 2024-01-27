const express = require ("express");
const cors = require ("cors");
const bodyParser = require ("body-parser");
const app = express();

app.use(cors());
app.use(
   bodyParser.json({
   type(req) {
      return true;
   },
   })
);
app.use(function (req, res, next) {
   res.setHeader("Content-Type", "application/json");
   next();
});

let posts = [{
   id: 0,
   content: 'Test message',
   created: '26.01.24 22:31'
}];
let nextId = 1;

app.get("/posts", (req, res) => {
   res.send(JSON.stringify(posts));
});

app.get("/posts/:id", (req, res) => {
   const postId = Number(req.params.id);
   const index = posts.findIndex((o) => o.id === postId);
   res.send(JSON.stringify({ post: posts[index] }));
});

app.post("/posts", (req, res) => {
   const date = new Date();

   const yy = date.getFullYear().toString().slice(-2);
   const mm = JSON.stringify((date.getMonth() + 1)).padStart(2, 0);
   const dd = JSON.stringify(date.getDate()).padStart(2, 0);
   const hh = JSON.stringify(date.getHours()).padStart(2, 0);
   const min = JSON.stringify(date.getMinutes()).padStart(2, 0);

   const created = `${dd}.${mm}.${yy} ${hh}:${min}`;
   posts.push({ ...req.body, id: nextId++, created: created });
   res.status(204);
   res.end();
});

app.post("/posts/:id", (req, res) => {
   const postId = Number(req.params.id);
   posts.map((o) => {
      if (o.id === postId) {
      o.content = req.body.content;
      res.send(JSON.stringify({post: o}));
   }});
});

app.delete("/posts/:id", (req, res) => {
   const postId = Number(req.params.id);
   const index = posts.findIndex((o) => o.id === postId);
   if (index !== -1) {
      posts.splice(index, 1);
   }
   res.status(204);
   res.end();
});

const port = process.env.PORT || 7070;
app.listen(port, () =>
   console.log(`The server is running on http://localhost:${port}`)
);