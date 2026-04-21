// Aggregated data pulled directly from the DSM final project report.
window.APP_DATA = {
  meta: {
    title: "Air Quality & Public Health in Indian Districts",
    subtitle: "DSM Final Project",
    period: "2018 – 2023",
    updated: "Apr 2026",
    districts: 150,
    states: 15,
    aqRecords: 328650,
    healthRecords: 10800,
    waterRecords: 3000,
  },

  // ---------- NATIONAL KPIs ----------
  kpis: {
    meanPm25: 58.9,
    medianPm25: 50.4,
    naaqs: 60,
    correlation: 0.385, // PM2.5 vs respiratory
    correlationP: "≈ 0",
    bestModelR2: 0.808, // Random Forest
    criticalDistricts: 33, // Clusters 1 + 3
    winterMultiplier: 1.56,
    monsoonMultiplier: 0.54,
  },

  // ---------- STATES: PM2.5 summary (µg/m³, annual mean bands) ----------
  states: [
    { name: "Delhi", pm25: 112, range: [31, 256], tier: "Critical" },
    { name: "Uttar Pradesh", pm25: 82, range: [20, 187], tier: "Critical" },
    { name: "Bihar", pm25: 80, range: [16, 184], tier: "Critical" },
    { name: "Haryana", pm25: 68, range: [19, 156], tier: "At Risk" },
    { name: "Punjab", pm25: 62, range: [17, 142], tier: "At Risk" },
    { name: "West Bengal", pm25: 59, range: [15, 138], tier: "At Risk" },
    { name: "Rajasthan", pm25: 58, range: [13, 133], tier: "At Risk" },
    { name: "Madhya Pradesh", pm25: 54, range: [14, 116], tier: "Moderate" },
    { name: "Gujarat", pm25: 50, range: [9, 113], tier: "Moderate" },
    { name: "Maharashtra", pm25: 51, range: [13, 108], tier: "Moderate" },
    { name: "Telangana", pm25: 39, range: [8, 87], tier: "Moderate" },
    { name: "Karnataka", pm25: 37, range: [9, 75], tier: "Safe" },
    { name: "Tamil Nadu", pm25: 32, range: [9, 73], tier: "Safe" },
    { name: "Andhra Pradesh", pm25: 32, range: [7, 70], tier: "Safe" },
    { name: "Kerala", pm25: 26, range: [5, 56], tier: "Safe" },
  ],

  // ---------- SEASONALITY ----------
  seasonal: {
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    pm25:        [86,76,63,54,50,44,35,32,38,57,83,93],
    no2:         [44,39,33,28,26,23,18,16,19,29,42,47],
    respiratory: [970,860,710,610,570,485,410,365,430,660,950,1050],
    diarrhoea:   [210,180,250,280,320,450,615,640,550,335,245,180],
  },

  // ---------- POLLUTANT DISTRIBUTIONS ----------
  pollutants: [
    { key: "PM2.5", unit: "µg/m³", mean: 58.9, median: 50.4, naaqs: 60, color: "oklch(0.58 0.18 28)" },
    { key: "PM10",  unit: "µg/m³", mean: 125.3, median: 107.6, naaqs: 100, color: "oklch(0.68 0.14 75)" },
    { key: "NO₂",   unit: "µg/m³", mean: 30.2, median: 27.1, naaqs: 40, color: "oklch(0.55 0.13 240)" },
    { key: "SO₂",   unit: "µg/m³", mean: 11.2, median: 10.0, naaqs: 80, color: "oklch(0.55 0.12 145)" },
  ],

  // ---------- CORRELATIONS (matrix values from report heatmap) ----------
  corrVars: ["pm25","pm10","no2","so2","aqi","resp","cardio","diarr","urban","lit"],
  corrMatrix: [
    [1.00, 0.99, 0.93, 0.90, 1.00, 0.38, 0.25,-0.23, 0.20,-0.29],
    [0.99, 1.00, 0.92, 0.90, 1.00, 0.40, 0.27,-0.23, 0.19,-0.30],
    [0.93, 0.92, 1.00, 0.96, 0.92, 0.32, 0.15,-0.30, 0.09,-0.17],
    [0.90, 0.90, 0.96, 1.00, 0.90, 0.33, 0.16,-0.29, 0.07,-0.17],
    [1.00, 1.00, 0.92, 0.90, 1.00, 0.40, 0.27,-0.23, 0.20,-0.30],
    [0.38, 0.40, 0.32, 0.33, 0.40, 1.00, 0.80, 0.34, 0.03,-0.19],
    [0.25, 0.27, 0.15, 0.16, 0.27, 0.80, 1.00, 0.55, 0.03,-0.22],
    [-0.23,-0.23,-0.30,-0.29,-0.23, 0.34, 0.55, 1.00, 0.04, 0.02],
    [0.20, 0.19, 0.09, 0.07, 0.20, 0.03, 0.03, 0.04, 1.00, 0.03],
    [-0.29,-0.30,-0.17,-0.17,-0.30,-0.19,-0.22, 0.02, 0.03, 1.00],
  ],

  // ---------- HYPOTHESIS TESTS ----------
  tests: [
    { name: "t-test: Respiratory cases (high vs low pollution)", stat: "t = 3.375", p: "9.42e-04", sig: true, note: "Reject H₀" },
    { name: "Mann-Whitney U (non-parametric)", stat: "U = 3840", p: "5.66e-05", sig: true, note: "Confirmed" },
    { name: "ANOVA: Respiratory across 15 states", stat: "F = 149.66", p: "≈ 0", sig: true, note: "Significant" },
    { name: "Pearson: PM2.5 ↔ Respiratory", stat: "r = 0.384", p: "≈ 0", sig: true, note: "95% CI [0.368, 0.400]" },
    { name: "t-test: Cardiovascular cases (high vs low)", stat: "t = 3.33", p: "1.08e-03", sig: true, note: "Reject H₀" },
    { name: "t-test: Diarrhoea (control, high vs low)", stat: "t = -0.51", p: "6.14e-01", sig: false, note: "No effect (expected)" },
  ],
  cohensD: 0.551,

  // ---------- MODELS ----------
  models: [
    { name: "OLS Linear Regression", r2: 0.6595, mae: 253.5, rmse: 434.8, cv: "0.650 ± 0.021" },
    { name: "Ridge (α=1)",           r2: 0.6594, mae: 253.5, rmse: 434.8, cv: "—" },
    { name: "Random Forest",         r2: 0.8080, mae: 181.3, rmse: 326.5, cv: "0.806 ± 0.025", best: true },
    { name: "Gradient Boosting",     r2: 0.8060, mae: 179.4, rmse: 328.2, cv: "0.803 ± 0.024" },
  ],

  features: [
    { name: "Population",    imp: 0.5946 },
    { name: "PM10",          imp: 0.2297 },
    { name: "PM2.5",         imp: 0.0766 },
    { name: "NO₂",           imp: 0.0439 },
    { name: "SO₂",           imp: 0.0387 },
    { name: "Urban %",       imp: 0.0092 },
    { name: "Literacy rate", imp: 0.0072 },
  ],

  // ---------- CLUSTERS ----------
  clusters: [
    { id: "C0", label: "At Risk — Moderate-High", count: 58, pm25: 65.2, pm10: 139.6, no2: 32.2, resp: 571.5, cardio: 246.7, urban: 29.6, color: "oklch(0.68 0.14 75)", desc: "Mixed tier-2 cities; proactive monitoring warranted before escalation." },
    { id: "C1", label: "Critical — High Pollution", count: 15, pm25: 110.3, pm10: 225.5, no2: 47.0, resp: 708.0, cardio: 304.3, urban: 49.0, color: "oklch(0.5 0.2 25)", desc: "All Delhi NCR districts. Strict GRAP enforcement needed." },
    { id: "C2", label: "Moderate — Average",      count: 59, pm25: 36.4, pm10: 77.5, no2: 23.6, resp: 374.6, cardio: 161.7, urban: 23.4, color: "oklch(0.55 0.12 145)", desc: "Southern & peripheral states. Baseline for comparison." },
    { id: "C3", label: "Critical — High Disease", count: 18, pm25: 70.4, pm10: 153.9, no2: 31.4, resp: 1944.2, cardio: 846.5, urban: 26.2, color: "oklch(0.6 0.18 340)", desc: "UP/Bihar. Socioeconomic factors amplify pollution damage." },
  ],

  // ---------- TOP POLLUTED DISTRICTS ----------
  topDistricts: [
    { name: "New Delhi",      state: "Delhi", pm25: 151.7, cluster: "C1" },
    { name: "Central Delhi",  state: "Delhi", pm25: 134.3, cluster: "C1" },
    { name: "North East Delhi", state: "Delhi", pm25: 126.2, cluster: "C1" },
    { name: "East Delhi",     state: "Delhi", pm25: 118.4, cluster: "C1" },
    { name: "Ghaziabad",      state: "Uttar Pradesh", pm25: 112.8, cluster: "C1" },
    { name: "Patna",          state: "Bihar", pm25: 108.3, cluster: "C3" },
    { name: "Lucknow",        state: "Uttar Pradesh", pm25: 102.1, cluster: "C3" },
    { name: "Muzaffarpur",    state: "Bihar", pm25: 99.6, cluster: "C3" },
    { name: "Faridabad",      state: "Haryana", pm25: 94.2, cluster: "C0" },
    { name: "Kanpur",         state: "Uttar Pradesh", pm25: 91.7, cluster: "C3" },
  ],

  // ---------- TIMELINE TRENDS (national avg) ----------
  trendYears: [2018, 2019, 2020, 2021, 2022, 2023],
  trendAnnualPm25: [58.7, 59.05, 59.08, 59.02, 59.0, 58.95],

  // ---------- RECOMMENDATIONS ----------
  recs: {
    immediate: [
      { n: 1, text: "<b>Targeted winter health alerts</b> for Cluster 1 (Delhi NCR) and Cluster 3 (UP/Bihar) districts during Nov–Feb, prioritising children, elderly, and patients with pre-existing conditions." },
      { n: 2, text: "<b>Deploy mobile health clinics</b> in high-risk rural districts during peak pollution weeks to absorb the respiratory-case surge." },
      { n: 3, text: "<b>Real-time AQI dashboards</b> for District Health Officers, linking CPCB air quality feeds directly to facility preparedness." },
    ],
    medium: [
      { n: 4, text: "<b>Strict GRAP enforcement</b> beyond Delhi NCR — extend to all 58 Cluster 0 districts before they escalate." },
      { n: 5, text: "<b>Crop residue management</b> targeting Punjab, Haryana and western UP, the primary contributors to winter pollution spikes." },
      { n: 6, text: "<b>Upgrade HMIS granularity</b> to weekly disease reporting in high-risk districts for dynamic response." },
    ],
    long: [
      { n: 7, text: "<b>Expand CPCB monitoring network</b> to cover under-instrumented districts; use model predictions to guide station placement." },
      { n: 8, text: "<b>Invest in healthcare infrastructure</b> in Cluster 3 districts where socioeconomic vulnerability amplifies pollution damage." },
      { n: 9, text: "<b>Clean energy transition incentives</b> for industrial and vehicular emissions in the 58 'At Risk' districts." },
      { n: 10, text: "<b>Annual cross-sectoral review</b> combining CPCB + HMIS + Census data to track policy effectiveness." },
    ],
  },
};
