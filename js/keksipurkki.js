const changelogNode = document.querySelector("[data-changelog]");
const counterNode = document.querySelector("[data-view-counter]");

(async function counter(node, location) {

  if (location.hostname === "localhost") {
    return;
  }

  const response = await fetch("https://api.keksipurkki.net/counter", {
    method: "POST"
  });

  const { count = 0 } = await response.json();

  if (count > 0 && node) {
    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-eye", "mr1");
    node.textContent = `${count} views`;
    node.insertBefore(icon, node.firstChild);
  }

})(counterNode, location);

