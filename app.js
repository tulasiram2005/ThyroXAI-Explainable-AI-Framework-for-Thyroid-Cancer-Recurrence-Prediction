const modelRows = [
  ["ExtraTrees", 95.87, 95.26, 95.8, 95.52],
  ["Random Forest", 93.05, 91.81, 93.9, 92.61],
  ["CatBoost", 92.06, 90.8, 93.54, 91.65],
  ["XGBoost", 89.77, 88.65, 91.72, 89.35],
  ["HistGradient Boosting", 88.05, 87.2, 90.42, 87.64],
  ["Decision Tree", 85.51, 84.34, 83.79, 84.05],
  ["Artificial Neural Network", 77.73, 75.96, 77.43, 76.42],
  ["TabNet", 75.82, 78.41, 80.42, 75.68],
  ["AdaBoost", 71.63, 68.89, 66.68, 67.29]
];

const caseTemplates = [
  {
    title: "Case A",
    similarity: "91%",
    text: "Medium-risk profile with elevated TSH and a 3.6 cm nodule. Prediction was supported by nodule size and endocrine markers."
  },
  {
    title: "Case B",
    similarity: "87%",
    text: "High-risk profile with family history and iodine deficiency. SHAP attribution emphasized categorical risk and exposure history."
  },
  {
    title: "Case C",
    similarity: "82%",
    text: "Older patient with borderline hormone values. Retrieved context lowered confidence because clinical factors were mixed."
  }
];

const defaults = {
  age: 58,
  gender: "Female",
  tsh: 7.8,
  t3: 2.1,
  t4: 9.4,
  nodule: 3.9,
  risk: "Medium",
  country: "India",
  family: true,
  radiation: false,
  iodine: true,
  smoking: false,
  obesity: false,
  diabetes: false
};

const form = document.querySelector("#risk-form");
const resetButton = document.querySelector("#reset-form");
const featureBars = document.querySelector("#feature-bars");
const caseList = document.querySelector("#case-list");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function readForm() {
  const data = new FormData(form);
  return {
    age: Number(data.get("age")),
    gender: data.get("gender"),
    tsh: Number(data.get("tsh")),
    t3: Number(data.get("t3")),
    t4: Number(data.get("t4")),
    nodule: Number(data.get("nodule")),
    risk: data.get("risk"),
    country: data.get("country"),
    family: data.get("family") === "on",
    radiation: data.get("radiation") === "on",
    iodine: data.get("iodine") === "on",
    smoking: data.get("smoking") === "on",
    obesity: data.get("obesity") === "on",
    diabetes: data.get("diabetes") === "on"
  };
}

function computeRisk(input) {
  const riskClass = { Low: 0.06, Medium: 0.18, High: 0.31 }[input.risk] ?? 0.12;
  const hormonePressure = clamp((input.tsh - 3.8) / 18, 0, 0.16) + clamp((input.t4 - 10.5) / 16, 0, 0.05);
  const nodulePressure = clamp((input.nodule - 1.5) / 10, 0, 0.2);
  const agePressure = clamp((input.age - 45) / 180, 0, 0.09);
  const factorPressure =
    (input.family ? 0.05 : 0) +
    (input.radiation ? 0.07 : 0) +
    (input.iodine ? 0.04 : 0) +
    (input.smoking ? 0.03 : 0) +
    (input.obesity ? 0.025 : 0) +
    (input.diabetes ? 0.025 : 0);
  return clamp(0.08 + riskClass + hormonePressure + nodulePressure + agePressure + factorPressure, 0.08, 0.94);
}

function buildFeatureImpacts(input) {
  return [
    ["Nodule Size", clamp(input.nodule / 5.5, 0.12, 1)],
    ["Risk Class", { Low: 0.24, Medium: 0.58, High: 0.92 }[input.risk]],
    ["TSH Level", clamp(input.tsh / 10, 0.1, 1)],
    ["Family History", input.family ? 0.68 : 0.22],
    ["Iodine Deficiency", input.iodine ? 0.56 : 0.18],
    ["Age", clamp(input.age / 90, 0.18, 0.96)]
  ].sort((a, b) => b[1] - a[1]);
}

function updatePrediction() {
  const input = readForm();
  const risk = computeRisk(input);
  const percent = Math.round(risk * 100);
  const benign = 100 - percent;
  const elevated = percent >= 55;

  document.querySelector(".gauge").style.setProperty("--score", risk.toFixed(2));
  document.querySelector("#risk-score").textContent = `${percent}%`;
  document.querySelector("#benign-score").textContent = `${benign}%`;
  document.querySelector("#malignant-score").textContent = `${percent}%`;
  document.querySelector("#risk-label").textContent = elevated ? "Elevated" : "Lower";
  document.querySelector("#risk-label").style.background = elevated ? "var(--coral)" : "var(--teal)";
  document.querySelector("#diagnosis-text").textContent = elevated
    ? "Malignant recurrence risk signal"
    : "Benign recurrence risk signal";
  document.querySelector("#risk-summary").textContent = elevated
    ? "Risk is driven by nodule size, risk class, TSH level, and selected clinical factors in this demo profile."
    : "The profile shows a lower recurrence signal, with model confidence tempered by hormone levels and retrieved cases.";

  featureBars.innerHTML = buildFeatureImpacts(input)
    .map(([label, value]) => {
      const width = Math.round(value * 100);
      return `
        <div class="feature-row">
          <span>${label}</span>
          <div class="bar-track"><div class="bar-fill" style="--width: ${width}%"></div></div>
          <strong>${width}%</strong>
        </div>
      `;
    })
    .join("");

  caseList.innerHTML = caseTemplates
    .map((item, index) => {
      const similarity = Math.max(64, Number.parseInt(item.similarity, 10) - Math.max(0, 55 - percent) - index * 2);
      return `
        <article class="case-card">
          <strong>${item.title}<span>${similarity}% match</span></strong>
          <p>${item.text}</p>
        </article>
      `;
    })
    .join("");
}

function resetForm() {
  Object.entries(defaults).forEach(([key, value]) => {
    const field = form.elements[key];
    if (!field) return;
    if (field.type === "checkbox") {
      field.checked = value;
    } else {
      field.value = value;
    }
  });
  updatePrediction();
}

document.querySelector("#model-table").innerHTML = modelRows
  .map(
    ([model, accuracy, precision, recall, f1]) => `
      <tr>
        <td>${model}</td>
        <td>${accuracy.toFixed(2)}%</td>
        <td>${precision.toFixed(2)}%</td>
        <td>${recall.toFixed(2)}%</td>
        <td>${f1.toFixed(2)}%</td>
      </tr>
    `
  )
  .join("");

form.addEventListener("input", updatePrediction);
form.addEventListener("change", updatePrediction);
resetButton.addEventListener("click", resetForm);
updatePrediction();
