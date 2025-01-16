document.addEventListener("DOMContentLoaded", function () {
  // Allgemeine Funktion zum Ein- und Ausklappen von Sektionen
function setupToggleSection(toggleGroupSelector) {
  const toggleGroups = document.querySelectorAll(toggleGroupSelector);

  toggleGroups.forEach(group => {
    const toggleLabel = group.querySelector(".category_label"); // Nur das Label für Klick verwenden
    const toggleIcon = group.querySelector(".toggle-icon");
    const content = group.querySelector(".toggle-content");

    if (toggleLabel && content) {
      // Initialzustand setzen
      content.style.maxHeight = "0";
      content.style.overflow = "hidden"; // Nur während der Initialisierung

      toggleLabel.addEventListener("click", (event) => {
        // Blockiere keine Klicks auf Inputs
        if (event.target.tagName === "INPUT") return;

        if (content.classList.contains("expanded")) {
          // Collapse
          content.style.maxHeight = "0";
          content.style.overflow = "hidden"; // Temporär für die Animation
          content.classList.remove("expanded");
          toggleIcon.innerHTML = "&#x25BC;"; // Pfeil nach unten
        } else {
          // Expand
          content.style.maxHeight = content.scrollHeight + "px";

          // Nach der Animation auf "visible" setzen
          content.addEventListener(
            "transitionend",
            () => {
              if (content.classList.contains("expanded")) {
                content.style.overflow = "visible";
              }
            },
            { once: true } // Nur einmal ausführen
          );

          content.classList.add("expanded");
          toggleIcon.innerHTML = "&#x25B2;"; // Pfeil nach oben
        }
      });
    } else {
      console.error("Fehler: Toggle-Elemente nicht gefunden");
    }
  });
}

// Initialisierung
setupToggleSection(".form-group");


  // Ring 2: Aktivieren/Deaktivieren der Eingabefelder
  const enableRing2Checkbox = document.getElementById("enable-ring-2");
  const ring2Content = document.querySelector("#ring-2 .ring-2-content");

  if (enableRing2Checkbox && ring2Content) {
    function toggleRing2Inputs() {
      const inputs = ring2Content.querySelectorAll("select, input, textarea");
      const isEnabled = enableRing2Checkbox.checked;

      ring2Content.classList.toggle("disabled", !isEnabled);
      inputs.forEach(input => {
        input.disabled = !isEnabled;
      });
    }

    // Initialisierung und Eventlistener
    toggleRing2Inputs();
    enableRing2Checkbox.addEventListener("change", toggleRing2Inputs);
  }

  // Allgemeine und spezifische Diamanten-Logik
  function handleDiamondsField(radioGroupName, diamondSizeFieldId, allowedValues = null) {
    const diamondSizeField = document.getElementById(diamondSizeFieldId);
    const radioButtons = document.querySelectorAll(`input[name="${radioGroupName}"]`);

    if (diamondSizeField && radioButtons.length > 0) {
      function updateDiamondSizeField() {
        const selectedRadio = document.querySelector(`input[name="${radioGroupName}"]:checked`);
        const enableField = allowedValues
          ? allowedValues.includes(selectedRadio?.value)
          : selectedRadio?.value !== "Keine";

        diamondSizeField.disabled = !enableField;
        if (!enableField) diamondSizeField.value = ""; // Zurücksetzen
      }

      // Initialstatus prüfen und Eventlistener hinzufügen
      updateDiamondSizeField();
      radioButtons.forEach(radio => radio.addEventListener("change", updateDiamondSizeField));
    }
  }

  // Anwendung der Diamanten-Logik
  handleDiamondsField("contact[ring1_diamonds]", "ring1_diamondsize");
  handleDiamondsField("contact[ring2_diamonds]", "ring2_diamondsize");
  handleDiamondsField("contact[ring1_diamonds]", "ring1_diamondsize2", ["S9", "S10"]);
  handleDiamondsField("contact[ring2_diamonds]", "ring2_diamondsize2", ["S9", "S10"]);

  // Dateiupload-Logik
  document.querySelectorAll('.file-upload input[type="file"]').forEach(input => {
    input.addEventListener("change", function () {
      const fileName = this.files[0]?.name || "Kein Bild ausgewählt";
      const label = this.parentElement.querySelector(".upload-label");
      if (label) label.textContent = fileName;
    });
  });

  // Lupe-Logik
  document.querySelectorAll(".material-option").forEach(option => {
    const loupe = option.querySelector(".loupe");
    const image = option.querySelector(".color-box img");
    const loupeImage = loupe?.querySelector("img");

    if (loupe && image && loupeImage) {
      option.addEventListener("mousemove", (e) => {
        const rect = option.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;

        const multiplier = 5;
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

        loupe.style.transform = `translate(-50%, -50%) scale(1)`;
        loupe.style.opacity = "1";

        if (!isMobile) {
          loupe.style.left = `${x - 150}px`;
          loupe.style.top = `${y - 100}px`;
        } else {
          loupe.style.left = "10px";
          loupe.style.top = "10px";
        }

        const scaleX = image.naturalWidth / rect.width;
        const scaleY = image.naturalHeight / rect.height;
        loupeImage.style.transform = `translate(${
          -(x * scaleX * multiplier - loupe.offsetWidth / 2)
        }px, ${-(y * scaleY * multiplier - loupe.offsetHeight / 2)}px)`;
      });

      option.addEventListener("mouseleave", () => {
        loupe.style.transform = "scale(0)";
        loupe.style.opacity = "0";
      });
    }
  });

  // Gravurtext- und Schriftart-Logik
  const engravingTextInput = document.getElementById("engravingText");
  const fontBoxes = document.querySelectorAll(".font-box");
  const engravingPreview = document.getElementById("engravingPreview");
  const selectedFontInput = document.getElementById("selectedFont");

  if (engravingTextInput && fontBoxes && engravingPreview && selectedFontInput) {
    // Gravurtext live aktualisieren
    engravingTextInput.addEventListener("input", () => {
      engravingPreview.textContent = engravingTextInput.value.substring(0, 32) || "Gravurtext Vorschau";
    });

    // Schriftart auswählen und anwenden
    fontBoxes.forEach(box => {
      box.addEventListener("click", () => {
        fontBoxes.forEach(b => b.classList.remove("selected"));
        box.classList.add("selected");

        const selectedFont = box.getAttribute("data-font");
        engravingPreview.style.fontFamily = selectedFont || "inherit";
        selectedFontInput.value = selectedFont || ""; // Schriftart übermitteln
      });
    });
  }
});
