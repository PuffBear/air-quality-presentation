// ============ OVERVIEW PAGE ============
function OverviewPage() {
  const D = window.APP_DATA;
  return (
    <div className="page">
      <PageHeader
        eyebrow="Overview · Problem Statement"
        title="Air pollution is India's #1 environmental health risk."
        lede="This study cross-references six years of daily CPCB air quality monitoring with monthly HMIS health indicators across 150 Indian districts — quantifying how particulate and gaseous pollutants translate into respiratory and cardiovascular disease burden at the district level."
      />

      <div className="kpi-grid">
        <Kpi label="Districts analysed" value={D.meta.districts} delta={`${D.meta.states} states · 2018–2023`} />
        <Kpi label="Mean national PM2.5" value={D.kpis.meanPm25} unit="µg/m³" delta={`NAAQS ${D.kpis.naaqs} · ${((D.kpis.meanPm25/D.kpis.naaqs - 1)*100).toFixed(0)}% over`} tone="bad" />
        <Kpi label="PM2.5 ↔ Respiratory" value={`r = ${D.kpis.correlation}`} delta={`p ${D.kpis.correlationP} · highly significant`} tone="bad" />
        <Kpi label="Best model R²" value={D.kpis.bestModelR2.toFixed(2)} delta="Random Forest · 5-fold CV" tone="good" />
      </div>

      <SectionHead num="01" title="What we set out to answer" desc="Four questions grounded in actionable, district-scale policy." />

      <div className="three-col">
        {[
          { q: "How does air quality vary?", a: "Map the distribution of PM2.5, PM10, NO₂ and SO₂ across 150 districts and identify spatial and temporal hotspots." },
          { q: "Is there a causal link?", a: "Test statistically whether pollutant concentrations correlate with respiratory and cardiovascular disease incidence." },
          { q: "Can we predict burden?", a: "Build regression and ensemble models that predict monthly disease cases from air quality and socioeconomic features." },
          { q: "Who needs help first?", a: "Cluster districts by risk profile to surface the places where intervention will save the most life-years." },
        ].map((c,i) => (
          <div key={i} className="card" style={{gridColumn: i === 3 ? "span 3" : "auto"}}>
            <div style={{fontSize:11, color:"var(--accent)", letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"JetBrains Mono"}}>Q{i+1}</div>
            <h3 style={{marginTop:8}}>{c.q}</h3>
            <p style={{fontSize:13.5, color:"var(--ink-2)", lineHeight:1.55, margin:0}}>{c.a}</p>
          </div>
        ))}
      </div>

      <SectionHead num="02" title="Data sources" desc="Four datasets joined on district_id and temporal keys." />

      <div className="card">
        <table className="data">
          <thead>
            <tr><th>Dataset</th><th>Source</th><th>Records</th><th>Period</th><th>Granularity</th></tr>
          </thead>
          <tbody>
            <tr><td>Air Quality (CPCB)</td><td>NDAP / data.gov.in</td><td className="num">328,650</td><td>2018–2023</td><td>Daily × 150 districts</td></tr>
            <tr><td>Health (HMIS)</td><td>data.gov.in</td><td className="num">10,800</td><td>2018–2023</td><td>Monthly × 150 districts</td></tr>
            <tr><td>Water Quality (JJM)</td><td>data.gov.in</td><td className="num">3,000</td><td>2019–2023</td><td>Quarterly × 150 districts</td></tr>
            <tr><td>District Demographics</td><td>Census / NDAP</td><td className="num">150</td><td>Latest</td><td>One row per district</td></tr>
          </tbody>
        </table>
      </div>

      <SectionHead num="03" title="Data quality" desc="Systematic audit of missingness and outliers before analysis." />

      <div className="two-col">
        <div className="card">
          <h3>Missingness</h3>
          <div className="card-sub">Air quality 2.9 – 3.1% missing per column; health 1.9 – 2.1%. Forward-fill within district, then median imputation. <b>0 nulls remain.</b></div>
          <div className="chart-wrap"><img src={window.__resources.img01} alt="Missing values"/></div>
        </div>
        <div className="card">
          <h3>Outlier strategy</h3>
          <div className="card-sub">IQR-flagged values retained — winter PM peaks and high-population respiratory spikes are <i>genuine</i>, not errors.</div>
          <div className="chart-wrap"><img src={window.__resources.img02} alt="Outlier boxplots"/></div>
        </div>
      </div>

      <div className="callout">
        The data is clear: air pollution is not just an environmental problem — it is a public health emergency requiring cross-sectoral action at the district level.
        <cite>— Final project conclusion</cite>
      </div>
    </div>
  );
}

// ============ POLLUTION PAGE ============
function PollutionPage() {
  const D = window.APP_DATA;
  const [sortBy, setSortBy] = useState("pm25");
  const sorted = [...D.states].sort((a,b) => sortBy === "pm25" ? b.pm25 - a.pm25 : a.name.localeCompare(b.name));
  const tierColor = (t) => ({
    "Critical": "oklch(0.5 0.2 25)",
    "At Risk":  "oklch(0.68 0.14 75)",
    "Moderate": "oklch(0.55 0.12 145)",
    "Safe":     "oklch(0.55 0.08 195)",
  }[t]);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Finding 01 · Pollution Hotspots"
        title="Delhi breathes 4× the safe limit. Kerala breathes less than half."
        lede="National mean PM2.5 sits at 58.9 µg/m³ — effectively at the NAAQS limit but masking an enormous spread. The Indo-Gangetic Plain accounts for every district above 100 µg/m³; the southern coast sits below 40."
      />

      <div className="kpi-grid">
        <Kpi label="Highest state avg" value="Delhi" delta="112 µg/m³ · 87% over NAAQS" tone="bad" />
        <Kpi label="Lowest state avg" value="Kerala" delta="26 µg/m³ · 57% below NAAQS" tone="good" />
        <Kpi label="Districts > NAAQS" value="94" unit="/ 150" delta="63% exceed 60 µg/m³" tone="bad" />
        <Kpi label="PM2.5 × PM10 corr." value="0.99" delta="near-perfect co-variation" />
      </div>

      <SectionHead num="01" title="Pollutant distributions" desc="Means, medians and standard exceedance per pollutant." />

      <div className="two-col">
        {D.pollutants.map((p,i) => <DistBar key={i} p={p}/>)}
      </div>

      <div className="card" style={{marginTop:16}}>
        <h3>Raw distribution shapes</h3>
        <div className="card-sub">All four pollutants show right-skewed, log-normal distributions — classic for environmental concentration data. Long tails represent winter pollution episodes, not measurement error.</div>
        <div className="chart-wrap"><img src={window.__resources.img03} alt="Distributions"/></div>
      </div>

      <SectionHead num="02" title="PM2.5 by state" desc="Ranked from worst to best. Red line = NAAQS 60 µg/m³." />

      <div className="card">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div className="card-sub" style={{margin:0}}>15 states · ordered by annual mean</div>
          <div className="btn-group">
            <button className={sortBy==="pm25" ? "active" : ""} onClick={() => setSortBy("pm25")}>By PM2.5</button>
            <button className={sortBy==="name" ? "active" : ""} onClick={() => setSortBy("name")}>Alphabetical</button>
          </div>
        </div>
        <HBarChart
          rows={sorted.map(s => ({name: s.name, value: s.pm25}))}
          max={120}
          unit=" µg/m³"
          colorFn={(r) => tierColor(sorted.find(s => s.name === r.name).tier)}
        />
        <div style={{display:"flex", gap:16, marginTop:16, fontSize:11, color:"var(--ink-3)"}}>
          <span><span style={{display:"inline-block", width:10, height:10, background:"oklch(0.5 0.2 25)", borderRadius:2, marginRight:5, verticalAlign:"middle"}}/>Critical (>75 µg/m³)</span>
          <span><span style={{display:"inline-block", width:10, height:10, background:"oklch(0.68 0.14 75)", borderRadius:2, marginRight:5, verticalAlign:"middle"}}/>At Risk (60–75)</span>
          <span><span style={{display:"inline-block", width:10, height:10, background:"oklch(0.55 0.12 145)", borderRadius:2, marginRight:5, verticalAlign:"middle"}}/>Moderate (40–60)</span>
          <span><span style={{display:"inline-block", width:10, height:10, background:"oklch(0.55 0.08 195)", borderRadius:2, marginRight:5, verticalAlign:"middle"}}/>Safe (&lt;40)</span>
        </div>
      </div>

      <SectionHead num="03" title="Top 10 most polluted districts (2022 mean)" desc="Delhi dominates, but Bihar and UP districts are rising." />

      <div className="card">
        <table className="data">
          <thead><tr><th>#</th><th>District</th><th>State</th><th>Mean PM2.5</th><th>Risk cluster</th></tr></thead>
          <tbody>
            {D.topDistricts.map((d,i) => (
              <tr key={i}>
                <td className="num" style={{color:"var(--ink-3)"}}>{String(i+1).padStart(2,"0")}</td>
                <td><b>{d.name}</b></td>
                <td>{d.state}</td>
                <td className="num">{d.pm25} µg/m³</td>
                <td>
                  <span className="pill crit">{d.cluster}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { OverviewPage, PollutionPage });
