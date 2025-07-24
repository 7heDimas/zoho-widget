function applyLocalization(lang) {
  fetch('./localization.json')
    .then(response => response.json())
    .then(data => {
      const translations = data[lang];
      if (!translations) return;

      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
          el.textContent = translations[key];
        }
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "uk";
  applyLocalization(savedLang);

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      localStorage.setItem("lang", lang);
      applyLocalization(lang);
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "uk";
  setActiveLangButton(savedLang);
  applyLocalization(savedLang);

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      localStorage.setItem("lang", lang);
      setActiveLangButton(lang);
      applyLocalization(lang);
    });
  });
});

function setActiveLangButton(lang) {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}