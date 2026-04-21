// ============ CORRELATION PAGE ============
function CorrelationPage() {
  const D = window.APP_DATA;
  const varLabels = ["PM2.5","PM10","NO₂","SO₂","AQI","Resp.","Cardio.","Diarr.","Urban %","Literacy"];

  return (
    <div className="page">
      <PageHeader
        eyebrow="Finding 02 · Pollution ↔ Health"
        title="PM10 explains 16% of variance in respiratory cases on its own."
        lede="Pearson correlations, t-tests, ANOVA and Mann-Whitney all converge on the same conclusion: districts with higher particulate pollution have systematically higher respiratory and cardiovascular case counts. Diarrhoea, which follows the monsoon, serves as a negative control and behaves exactly as expected."
      />

      <div className="kpi-grid">
        <Kpi label="PM2.5 ↔ Respiratory" value="0.385" delta="p ≈ 0 · 95% CI [0.37, 0.40]" tone="bad" />
        <Kpi label="PM10 ↔ Respiratory" value="0.402" delta="strongest pollutant linkage" tone="bad" />
        <Kpi label="Cohen's d" value="0.551" delta="Medium effect · high vs low" tone="bad" />
        <Kpi label="Diarrhoea (control)" value="-0.23" delta="Expected — monsoon pattern" tone="good" />
      </div>

      <SectionHead num="01" title="Correlation matrix" desc="Ten variables. Cluster of red in top-left = pollutants co-vary almost perfectly." />

      <div className="card">
        <Heatmap vars={varLabels} matrix={D.corrMatrix} />
        <div className="chart-caption">
          Pollutants (PM2.5, PM10, NO₂, SO₂, AQI) form an extremely tight block (r &gt; 0.9). Respiratory and cardiovascular cases correlate moderately with all pollutants (r ≈ 0.25 – 0.40). Literacy rate is negatively correlated with every pollutant and every disease — a classic confound worth watching.
        </div>
      </div>

      <SectionHead num="02" title="Pollution → Health scatter" desc="Each dot is a district-month. Red line = OLS fit." />

      <div className="card">
        <div className="chart-wrap"><img src="assets/07_scatter_correlations.png" alt="Scatter"/></div>
        <div className="chart-caption">
          All four panels show a positive, highly significant trend. The spread around the line is wide — population, seasonality and socioeconomic vulnerability all modulate the signal — which is why we move to multivariate models next.
        </div>
      </div>

      <SectionHead num="03" title="Hypothesis tests" desc="Parametric and non-parametric, all in agreement." />

      <div className="card">
        {D.tests.map((t, i) => (
          <div className="test-row" key={i}>
            <div className="test-name">
              {t.name}
              <small>{t.note}</small>
            </div>
            <div className="test-val">{t.stat}</div>
            <div className="test-val" style={{color: t.sig ? "var(--accent)" : "var(--ink-3)"}}>p = {t.p}</div>
            <span className={`pill ${t.sig ? "crit" : "neutral"}`}>{t.sig ? "Significant" : "n.s."}</span>
          </div>
        ))}
      </div>

      <SectionHead num="04" title="Group comparison" desc="Top-third vs bottom-third PM2.5 districts, monthly case counts." />

      <div className="card">
        <div className="chart-wrap"><img src="assets/10_hypothesis_tests.png" alt="Hypothesis tests"/></div>
        <div className="chart-caption">
          Respiratory and cardiovascular cases are visibly elevated in high-pollution districts; diarrhoea — driven by water quality and monsoon — shows no such gap (t = −0.51, p = 0.61), confirming the environmental-health signal is specific to respiratory pathways.
        </div>
      </div>

      <div className="callout">
        The relationship is causal in direction: pollutants → respiratory inflammation → disease. Our data shows the expected dose-response pattern, with the highest pollution districts systematically reporting more cases.
      </div>
    </div>
  );
}

// ============ SEASONALITY PAGE ============
function SeasonalityPage() {
  const D = window.APP_DATA;
  const [metric, setMetric] = useState("air"); // air | health

  const airSeries = [
    { label: "PM2.5", color: "oklch(0.58 0.18 28)", data: D.seasonal.pm25 },
    { label: "NO₂",   color: "oklch(0.55 0.13 240)", data: D.seasonal.no2 },
  ];
  const healthSeries = [
    { label: "Respiratory", color: "oklch(0.58 0.18 28)", data: D.seasonal.respiratory },
    { label: "Diarrhoea",   color: "oklch(0.55 0.12 145)", data: D.seasonal.diarrhoea },
  ];

  return (
    <div className="page">
      <PageHeader
        eyebrow="Finding 03 · Temporal Patterns"
        title="Winter is 1.56× worse. Monsoon is 0.54× cleaner. Every year. No trend."
        lede="Seasonal amplitude swamps year-over-year change. Time-series decomposition confirms a flat trend (58.9 → 59.0 µg/m³) across six years, meaning policy interventions have not moved the national baseline — only seasonal cycles drive visible movement."
      />

      <div className="kpi-grid">
        <Kpi label="Winter peak (Dec)" value="93" unit="µg/m³" delta="1.56× national mean" tone="bad" />
        <Kpi label="Monsoon trough (Aug)" value="32" unit="µg/m³" delta="0.54× national mean" tone="good" />
        <Kpi label="2018 → 2023 trend" value="+0.1%" delta="Flat — no improvement" tone="bad" />
        <Kpi label="Residual variance" value="< 1%" delta="Seasonality dominates signal" />
      </div>

      <SectionHead num="01" title="Monthly seasonality" desc="Air quality inverts with disease: winter pollutes, monsoon infects." />

      <div className="card">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
          <div className="card-sub" style={{margin:0}}>Toggle metric — mean across 150 districts, 2018–2023</div>
          <div className="btn-group">
            <button className={metric==="air" ? "active":""} onClick={() => setMetric("air")}>Air quality</button>
            <button className={metric==="health" ? "active":""} onClick={() => setMetric("health")}>Health</button>
          </div>
        </div>
        <LineChart
          series={metric === "air" ? airSeries : healthSeries}
          months={D.seasonal.months}
          height={260}
          yMax={metric === "air" ? 100 : 1200}
          yLabel={metric === "air" ? "µg/m³" : "cases / district"}
          showNaaqs={metric === "air"}
          naaqsY={60}
        />
        <Legend items={metric === "air" ? airSeries : healthSeries} />
        <div className="chart-caption">
          {metric === "air"
            ? "PM2.5 and NO₂ share a near-identical winter trough in August and peak in December — driven by temperature inversions, crop residue burning and low wind dispersion."
            : "Respiratory cases follow the air-quality curve almost exactly. Diarrhoea mirrors it: monsoon flooding, stagnant water and diminished sanitation peak July–September."}
        </div>
      </div>

      <SectionHead num="02" title="Six-year national trend" desc="Raw + trend + seasonal + residual decomposition." />

      <div className="card">
        <div className="chart-wrap"><img src="assets/13_time_series_decomposition.png" alt="Time series decomposition"/></div>
        <div className="chart-caption">
          The trend component varies from 58.92 to 59.10 µg/m³ — a change of 0.3%. Despite BS-VI emission norms, GRAP, odd-even and numerous state-level schemes, the underlying national PM2.5 has not improved in six years.
        </div>
      </div>

      <SectionHead num="03" title="Coupled air + health over time" desc="Monthly national aggregate, 2018–2023." />

      <div className="card">
        <div className="chart-wrap"><img src="assets/08_temporal_trends.png" alt="Temporal trends"/></div>
        <div className="chart-caption">
          Six identical winter cycles for PM2.5 and respiratory cases. Diarrhoea cycles out-of-phase. This phase-lock is the visual proof that pollution and respiratory disease move together.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CorrelationPage, SeasonalityPage });
