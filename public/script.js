let botao = document.getElementById("botaoAPI");
let nome = document.getElementById("nome");
let sobrenome = document.getElementById("sobrenome");
let email = document.getElementById("email");
var resultadoAPI;
botao.addEventListener("click", async () => {
  resultadoAPI = await consomeAPI(nome.value, sobrenome.value, email.value);
  let resultado = document.getElementById("Resultado");
  resultado.innerHTML = resultadoAPI;
  /////////////////////////////////
  const dividido = resultadoAPI.split("#");
  let ResultNome = document.getElementById("ResultNome");
  ResultNome.innerHTML = `Nome: ${nome.value} | COD: ${dividido[1]}`;
  let ResultSobrenome = document.getElementById("ResultSobrenome");
  ResultSobrenome.innerHTML = `Sobrenome: ${sobrenome.value} | COD: ${dividido[3]}`;
  let ResultEmail = document.getElementById("ResultEmail");
  ResultEmail.innerHTML = `Sobrenome: ${email.value} | COD: ${dividido[5]}`;
});
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
