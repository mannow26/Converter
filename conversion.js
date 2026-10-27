const CONVERSION_RATES = {
  speed: { mps: 1, kmph: 0.277778, mph: 0.44704 },
  weight: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495, t: 1000 },
  distance: { m: 1, cm: 0.01, km: 1000, in: 0.0254, ft: 0.3048, mi: 1609.344 },
  time: { s: 1, min: 60, hr: 3600, d: 86400, wk: 604800, mo: 2592000, yr: 31536000 },
  volume: { l: 1, ml: 0.001, m3: 1000, kl: 1000 }
};
const TEMPERATURE_CONVERTERS = {
  toBase: { cel: (v) => v, fah: (v) => (v - 32) * (5 / 9), kel: (v) => v - 273.15 },
  fromBase: { cel: (v) => v, fah: (v) => (v * 9 / 5) + 32, kel: (v) => v + 273.15 }
};
const unitcardEls = document.querySelectorAll(".unitcard");
// 1 This stores the elements with class "unitcard" in a variable called unitcardEls.

showConverter("speed")
function showConverter(unitcardId) {
    const converterEls = document.querySelectorAll(".converter");
    // 6 This stores the elements with class "converter" in a variable called converterEls.
    // Hiding All Converters
    for (let index = 0; index < converterEls.length; index++) {
        converterEls[index].classList.add("hidden");
        // 10 This adds a class "hidden" to the classList of each Node in converterEls. It repeats for as long as the length of converterEls, which is a NodeList. //
    }
    // Hiding Borders From All Unit Cards
    for (let index = 0; index < unitcardEls.length; index++) {
        unitcardEls[index].classList.remove("selected")
        // 15 This removes a class "selected" to the classList of each Node in unitcardEls. It repeats for as long as the length of unitcardEls, which is a NodeList.
    }
    // Showing Selected Converter
    const selectedEl = document.querySelector(`#${unitcardId}-conv`);
    // 19 This stores the element with ID with each unitcardId's name and ending with "-conv" in a variable called selectedEl.
    selectedEl.classList.remove("hidden");
    // 21 This removes a class "hidden" to the classList of of the element selectedEl.
    // Showing Border For Selected Element
    document.querySelector(`#${unitcardId}`).classList.add("selected");
    // 24 This selects a single element by ITS ID, which matches the current UNITCARD's ID, and adds the class 'selected' to its classList.
}

function converter(e) {
    let unitcardId = e.currentTarget.id;
    // 29 This stores the ID of the current target of e (Event Object) in a variable called unitcardId.
    showConverter(unitcardId)
    // 31 This calls showConverter function with one parameter as unitcardId.
}

for (let index = 0; index < unitcardEls.length; index++) {
    unitcardEls[index].addEventListener("click", (e) => {
        converter(e)
        // 37 This calls converter function with one parameter as e (Event Object).
    });
}

// Loop through each converter card to make them interactive
const converter_cards = document.querySelectorAll('.converter');
converter_cards.forEach(card => {
  const category = card.id.split('-')[0]; // 'speed', 'temperature', etc.
  // console.log(category)
  // alert(card.id.split("-")[0])
  const inputNum = card.querySelector('input[type="number"]');
  const selectFrom = card.querySelector('select[id$="-from"]');
  const selectTo = card.querySelector('select[id$="-to"]');
  const displayBox = card.querySelector('.display strong');
  const form = card.querySelector('form');
  // console.log(form);

  // Stop forms from refreshing the page
  if (form) {
    form.addEventListener('submit', (e) => e.preventDefault());
  }

  function calculate() {
    const val = parseFloat(inputNum.value);
    const fromUnit = selectFrom.value;
    const toUnit = selectTo.value;

    // Handle empty state
    if (isNaN(val)) {
      displayBox.textContent = "Enter a value.";
      return;
    }

    let result;

    // Handling Kelvin less than 0 and converting other units
    if (category === 'temperature') {
      const inBase = TEMPERATURE_CONVERTERS.toBase[fromUnit](val);
      if (inBase < -273.15) {
        displayBox.textContent = "ERROR!";
        return;
      }
      result = TEMPERATURE_CONVERTERS.fromBase[toUnit](inBase);
    } else {
      const rates = CONVERSION_RATES[category];
      const baseVal = val * rates[fromUnit];
      result = baseVal / rates[toUnit];
    }

    // Format output nicely (e.g., up to 4 decimal places)
    const formattedResult = Number(result.toFixed(4));
    // Get text labels for units if you want nice output display
    const fromLabel = selectFrom.options[selectFrom.selectedIndex].text.match(/\(([^)]+)\)/)[1];
    const toLabel = selectTo.options[selectTo.selectedIndex].text.match(/\(([^)]+)\)/)[1];

    displayBox.textContent = `${val} ${fromLabel} = ${formattedResult} ${toLabel}`;
  }

  // Listen for any changes or typing to update live
  if (inputNum) inputNum.addEventListener('input', calculate);
  if (selectFrom) selectFrom.addEventListener('change', calculate);
  if (selectTo) selectTo.addEventListener('change', calculate);
});