// Base URL da API (escolhida automaticamente):
//  - json-server (front servido em localhost:3000): "" (mesma origem)
//  - outro localhost (ex.: abrir com Live Server): backend local em :3001
//  - produção: URL da API no Render (preencher PROD_API depois do deploy)
const PROD_API = "https://projeto-raiz.onrender.com";

(function () {
  const { hostname, port } = window.location;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  if (isLocal && port === "3000") window.API_URL = "";
  else if (isLocal) window.API_URL = "http://localhost:3001";
  else window.API_URL = PROD_API;
})();
