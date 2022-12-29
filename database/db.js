const { request } = require("express");

var Connection = require("tedious").Connection;
var Request = require("tedious").Request;

var config = {
  server: "virtual2.febracorp.org.br",
  authentication: {
    type: "default",
    options: {
      userName: "user_trial",
      password: "7412LIVE!@#$&*()",
    },
  },
  options: {
    port: 1433,
    database: "CONTOSO",
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
    },
    encrypt: false,
    rowCollectionOnRequestCompletion: true,
    useColumnNames: true,
  },
};
const Insert3 = async (nome, sobrenome, email) => {
  var connection = new Connection(config);
  // Initialize the connection.
  connection.connect();
  var resultValue;
  async function RequestBD() {
    var request = new Request(
      `INSERT INTO tbs_nome (nome,cod) values('${nome.nome}',${nome.cod}) 
    INSERT INTO tbs_sobrenome (sobrenome,cod) values('${sobrenome.nome}',${sobrenome.cod})
    INSERT INTO tbs_email (email,cod) values('${email.nome}',${email.cod}) 
    SELECT 'Dados inseridos com sucesso' as result`,
      async function (err, rowCount, rows) {
        if (err) {
          console.log("Error: ", err);
          return err;
        } else {
          //console.log(rows[0].result.value);
          resultValue = await rows[0].result.value;
        }
      },
    );
    connection.execSql(request);
  }

  connection.on("connect", async function (err) {
    if (err) {
      console.log("Error: ", err);
    }
    await RequestBD();
  });
  return "Inseridos";
};
const Select4 = async (cod_nome, cod_sobrenome, cod_email) => {
  var connection = new Connection(config);
  connection.connect((err) => {
    if (err) {
      console.log("Error: ", err);
    }
    let request = new Request(
      `select * from dbo.tbs_nome where cod = ${cod_nome}
      union all
      select * from dbo.tbs_sobrenome where cod = ${cod_sobrenome}
      union all
      select * from dbo.tbs_email where cod = ${cod_email}     `,
      function (err, rowCount, rows) {
        if (err) {
          console.log("Error: ", err);
        } else {
          return rows;
        }
      },
    );
    connection.execSql(request);
  });
};
const Sum5 = async (cod_nome, cod_sobrenome, cod_email) => {
  var connection = new Connection(config);
  var nome;
  var Sobrenome;
  var email;
  var total;
  connection.connect((err) => {
    if (err) {
      console.log("Error: ", err);
    }
    let request = new Request(
      `select * from dbo.tbs_nome where cod = ${cod_nome}
      union all
      select * from dbo.tbs_sobrenome where cod = ${cod_sobrenome}
      union all
      select * from dbo.tbs_email where cod = ${cod_email}     `,
      function (err, rowCount, rows) {
        if (err) {
          console.log("Error: ", err);
        } else {
          let obj = [];
          [...rows].map((e, index) => {
            obj.push({
              id: "",
              name: "",
              cod: "",
            });
            if (e.id.value != undefined) {
              obj[index].id = e.id.value;
            }
            if (e.nome.value != undefined) {
              obj[index].nome = e.nome.value;
            }
            if (e.cod.value != undefined) {
              obj[index].cod = e.cod.value;
            }
          });
          nome = obj[0].id + obj[0].cod;
          Sobrenome = obj[1].id + obj[1].cod;
          email = obj[2].id + obj[2].cod;
          total = nome + sobrenome + email;
          return rows;
        }
      },
    );
    connection.execSql(request);
    return total;
  });
};
const Exec6 = async (valor_total) => {
  var connection = new Connection(config);
  connection.connect((err) => {
    if (err) {
      console.log("Error: ", err);
    }
    let request = new Request(
      `select 
        * 
      from 
      tbs_animais ta
      join tbs_cores tc on tc.total = ${valor_total}
      left join tbs_cores_excluidas tce on tce.total = ${valor_total}
      join tbs_paises tp on tp.total = ${valor_total}
      where
      ta.total = ${valor_total}`,
      function (err, rowCount, rows) {
        if (err) {
          console.log("Error: ", err);
        } else {
          return rows;
        }
      },
    );
    connection.execSql(request);
  });
};
async function consomeAPI(nome, sobrenome, email) {
  let reqBody = `nome=${nome}&sobrenome=${sobrenome}&email=${email}`;
  let response = await fetch("http://138.68.29.250:8082/", {
    method: "POST",
    body: reqBody,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
  });
  let data = await response.text();
  return data;
}
module.exports = { Insert3, Select4, Sum5, Exec6, consomeAPI };
