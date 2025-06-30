
document.addEventListener("DOMContentLoaded", () => {
  const inventoryTableBody = document.querySelector("#inventoryTable tbody");
  const totalDistributedElem = document.getElementById("totalDistributed");
  const pendingRequestsElem = document.getElementById("pendingRequests");
  const approvedRequestsElem = document.getElementById("approvedRequests");
  const approveRequestsTableBody = document.querySelector("#requestsTable tbody");
  const approveRequestsSection = document.getElementById("approveRequestsSection");
  const bmDashboardSection = document.getElementById("bmDashboardSection");
  const pendingLink = document.getElementById("pendingLink");

  function loadInventory() {
    const records = JSON.parse(localStorage.getItem("inventoryRecords") || "[]");
    inventoryTableBody.innerHTML = "";
    let totalDistributed = 0;

    records.forEach(record => {
      const totalChicks = (record.broilers || 0) + (record.layers || 0) + (record.locals || 0);
      totalDistributed += totalChicks;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          Broilers: ${record.broilers || 0}<br>
          Layers: ${record.layers || 0}<br>
          Locals: ${record.locals || 0}
        </td>
        <td>${totalChicks}</td>
        <td>${record.vaccinated ? "Yes" : "No"}</td>
        <td>${record.feedBags || 0}</td>
        <td>${record.date || "N/A"}</td>
      `;
      inventoryTableBody.appendChild(row);
    });

    totalDistributedElem.textContent = totalDistributed;
  }

  function loadChickRequests() {
    const requests = JSON.parse(localStorage.getItem("chickRequests")) || [];
    approveRequestsTableBody.innerHTML = "";
    let pendingCount = 0;
    let approvedCount = 0;

    requests.forEach((req, index) => {
      if (req.status === "approved") {
        approvedCount++;
      } else {
        pendingCount++;
      }

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${req.name}</td>
        <td>${req.type}</td>
        <td>${req.quantity}</td>
        <td>${req.quantity === 100 ? "Starter" : "Returning"}</td>
        <td>2</td>
        <td>${req.status || "pending"}</td>
        <td>
          ${req.status === "approved"
            ? "✓"
            : `<button data-index="${index}" class="approveBtn">Approve</button>`}
        </td>
      `;
      approveRequestsTableBody.appendChild(row);
    });

    pendingRequestsElem.textContent = pendingCount;
    approvedRequestsElem.textContent = approvedCount;

    document.querySelectorAll(".approveBtn").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = this.getAttribute("data-index");
        approveRequest(idx);
      });
    });
  }

  function approveRequest(index) {
    const requests = JSON.parse(localStorage.getItem("chickRequests")) || [];
    if (requests[index]) {
      requests[index].status = "approved";
      localStorage.setItem("chickRequests", JSON.stringify(requests));
      loadChickRequests();
    }
  }

  // Handle click on "Pending Requests" link
  pendingLink.addEventListener("click", (e) => {
    e.preventDefault();
    bmDashboardSection.classList.add("hidden");
    approveRequestsSection.classList.remove("hidden");
    approveRequestsSection.scrollIntoView({ behavior: "smooth" });
  });

  // Initial loads
  loadInventory();
  loadChickRequests();
});

