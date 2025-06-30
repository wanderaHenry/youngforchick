// Registration
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const user = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      userType: document.getElementById("userType").value,
      nin: document.getElementById("nin").value,
    };

    localStorage.setItem("registeredUser", JSON.stringify(user));

    if (user.userType === "farmer") {
      document.getElementById("chickRequestSection").style.display = "block";
    } else {
      alert("Only farmers can request chicks.");
    }

    alert("Registration successful!");
  });

// Chick Request
document
  .getElementById("chickRequestForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("registeredUser"));
    const quantity = parseInt(document.getElementById("quantity").value);
    const type = document.getElementById("chickType").value;

    if (!user || user.userType !== "farmer") {
      alert("Only registered farmers can request chicks!");
      return;
    }

    if (user && quantity > 500) {
      alert("Returning farmers can only request up to 500 chicks!");
      return;
    }

    if (user && quantity < 100) {
      alert("Minimum 100 chicks per request.");
      return;
    }

    const request = {
      name: user.name,
      quantity,
      type,
      date: new Date().toLocaleString(),
    };

    const requests = JSON.parse(localStorage.getItem("chickRequests")) || [];
    requests.push(request);
    localStorage.setItem("chickRequests", JSON.stringify(requests));

    alert("Chick request submitted!");
    displayRequests();
    document.getElementById("chickRequestForm").reset();
  });

// Display requests
function displayRequests() {
  const tbody = document.querySelector("#requestsTable tbody");
  tbody.innerHTML = "";

  const requests = JSON.parse(localStorage.getItem("chickRequests")) || [];
  requests.forEach((req) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${req.name}</td>
      <td>${req.quantity}</td>
      <td>${req.type}</td>
      <td>${req.date}</td>
    `;
    tbody.appendChild(row);
  });
}

// Load saved requests on page load
window.onload = function () {
  const user = JSON.parse(localStorage.getItem("registeredUser"));
  if (user && user.userType === "farmer") {
    document.getElementById("chickRequestSection").style.display = "block";
    displayRequests();
  }
};
