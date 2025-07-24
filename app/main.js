function initializeWidget() {
  ZOHO.embeddedApp.on("PageLoad", async function (data) {
    console.log("Віджет завантажено успішно");
    console.log("Дані зі сторінки:", data);

    try {
      const recordData = await ZOHO.CRM.API.getRecord({
        Entity: "Deals",
        RecordID: data.EntityId
      });

      const record = recordData.data[0];
      const dealRate = parseFloat(record.Currency_Rate || 0);
      const nbuRate = await getNBURate();
      const difference = (dealRate / nbuRate - 1) * 100;

      showValues(nbuRate, dealRate, difference);

      document.querySelector(".update-btn").addEventListener("click", async () => {
        await ZOHO.CRM.API.updateRecord({
          Entity: "Deals",
          RecordID: record.id,
          APIData: { Currency_Rate: nbuRate }
        });
        showValues(nbuRate, nbuRate, 0);
      });

    } catch (error) {
      console.error("Помилка:", error);
    }
  });

  ZOHO.embeddedApp.init();
}

async function getNBURate() {
  try {
    const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    const data = await response.json();
    const usdRate = data.find(d => d.cc === "USD");
    return usdRate ? parseFloat(usdRate.rate) : 0;
  } catch (e) {
    console.error("Помилка при запиті до НБУ:", e);
    return 0;
  }
}

function showValues(nbu, deal, diff) {
  document.querySelector(".nbu-rate").textContent = nbu.toFixed(4);
  document.querySelector(".deal-rate").textContent = deal.toFixed(4);
  document.querySelector(".difference").textContent = diff.toFixed(2) + "%";
  document.querySelector(".update-btn").style.display = (diff >= 5) ? "inline-block" : "none";
}