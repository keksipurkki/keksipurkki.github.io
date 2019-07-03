
async function incrementCount() {

  const response = await fetch("https://api.keksipurkki.net/counter", {
    method: "POST"
  });

  const body = await response.json();

  console.log(body);

}

incrementCount();
