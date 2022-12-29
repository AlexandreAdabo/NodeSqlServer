const connectToDb = require("./database/db");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
////////////// EJS ////////////////////////////////
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.get("/", (req, res) => {
  res.render("../views/form");
});
app.post("/post", async (req, res) => {
  res.render("../views/form");
  let resultAPI = await connectToDb.consomeAPI(
    req.body.nome,
    req.body.sobrenome,
    req.body.email,
  );
  let dadosInsert = resultAPI.split("#");
  let result3 = await connectToDb.Insert3(
    {
      nome: req.body.nome,
      cod: dadosInsert[1],
    },
    {
      nome: req.body.sobrenome,
      cod: dadosInsert[3],
    },
    {
      nome: req.body.email,
      cod: dadosInsert[5],
    },
  );
  console.log(result3, "RESULTADO DA 3");
  let result4 = await connectToDb.Select4(
    dadosInsert[1],
    dadosInsert[3],
    dadosInsert[5],
  );
  console.log(result4, "RESULTADO DA 4");
  let result5 = await connectToDb.Sum5(
    dadosInsert[1],
    dadosInsert[3],
    dadosInsert[5],
  );
  console.log(result5, "RESULTADO DA 5");
});
////////////// EJS ////////////////////////////////
app.listen(3000, () => {
  console.log(`Servidor rodando no endereço localhost:${3000}`);
});
