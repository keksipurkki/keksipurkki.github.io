
async function incrementCount() {

  if (location.hostname === "localhost") {
    return;
  }

  const response = await fetch("https://api.keksipurkki.net/counter", {
    method: "POST"
  });

  const { count = 0 } = await response.json();
  const counter = document.querySelector("[data-view-counter]");

  if (count > 0 && counter) {
    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-eye");
    counter.textContent = ` ${count} views`;
    counter.insertBefore(icon, counter.firstChild);
  }


}

incrementCount();
