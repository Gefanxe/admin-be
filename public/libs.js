async function getRootToken(host) {
  let uriIP = host + '/api/token/root';
  let response = await fetch(uriIP, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  let res = await response.text();
  return res;
}