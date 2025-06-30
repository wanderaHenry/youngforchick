document.addEventListener("DOMContentLoaded", () => {
  const totalChicksElem = document.getElementById("totalChicks");
  const totalFeedElem = document.getElementById("totalFeed");
  const inventoryForm = document.getElementById("inventoryForm");

  // Function to calculate totals and update dashboard
  function updateDashboard() {
    const records = JSON.parse(localStorage.getItem("inventoryRecords") || "[]");

    let totalChicks = 0;
    let totalFeedBags = 0;

    records.forEach(record => {
      totalChicks += (record.broilers || 0) + (record.layers || 0) + (record.locals || 0);
      totalFeedBags += record.feedBags || 0;
    });

    totalChicksElem.textContent = totalChicks;
    totalFeedElem.textContent = totalFeedBags;
  }

  // Listen to inventory form submission
  if (inventoryForm) {
    inventoryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newRecord = {
        date: new Date().toLocaleString(),
        broilers: parseInt(document.getElementById("broilers").value) || 0,
        layers: parseInt(document.getElementById("layers").value) || 0,
        locals: parseInt(document.getElementById("locals").value) || 0,
        feedBags: parseInt(document.getElementById("feedBags").value) || 0,
        vaccinated: document.getElementById("vaccinated").checked
      };

      const records = JSON.parse(localStorage.getItem("inventoryRecords") || "[]");
      records.push(newRecord);
      localStorage.setItem("inventoryRecords", JSON.stringify(records));

      inventoryForm.reset();
      updateDashboard(); // update dashboard immediately
    });
  }

  updateDashboard(); // initial dashboard load
});
