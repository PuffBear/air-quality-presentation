// ============ RECOMMENDATIONS PAGE ============
function RecsPage() {
  const D = window.APP_DATA;
  return (
    <div className="page">
      <PageHeader
        eyebrow="Conclusions · Policy Playbook"
        title="Ten actions. Three horizons. Cross-sectoral by design."
        lede="The analysis points to specific, targetable interventions — not generic 'reduce pollution' rhetoric. Each recommendation is tied to a finding: cluster membership, seasonal amplitude, feature-importance ranking, or temporal trend."
      />

      <SectionHead num="01" title="Immediate term" desc="0 – 6 months · execute this winter" />
      <div className="card">
        <ul className="rec-list">
          {D.recs.immediate.map(r => (
            <li className="rec-item" key={r.n}>
              <span className="rec-num">{String(r.n).padStart(2,"0")}</span>
              <span className="rec-body" dangerouslySetInnerHTML={{__html: r.text}} />
              <span className="rec-term">0–6 mo</span>
            </li>
          ))}
        </ul>
      </div>

      <SectionHead num="02" title="Medium term" desc="6 – 24 months · structural enforcement" />
      <div className="card">
        <ul className="rec-list">
          {D.recs.medium.map(r => (
            <li className="rec-item" key={r.n}>
              <span className="rec-num">{String(r.n).padStart(2,"0")}</span>
              <span className="rec-body" dangerouslySetInnerHTML={{__html: r.text}} />
              <span className="rec-term">6–24 mo</span>
            </li>
          ))}
        </ul>
      </div>

      <SectionHead num="03" title="Long term" desc="2 – 5 years · systemic change" />
      <div className="card">
        <ul className="rec-list">
          {D.recs.long.map(r => (
            <li className="rec-item" key={r.n}>
              <span className="rec-num">{String(r.n).padStart(2,"0")}</span>
              <span className="rec-body" dangerouslySetInnerHTML={{__html: r.text}} />
              <span className="rec-term">2–5 yr</span>
            </li>
          ))}
        </ul>
      </div>

      <SectionHead num="04" title="Key takeaways" desc="What this study adds to the evidence base." />
      <div className="two-col">
        <div className="card">
          <h3>The signal</h3>
          <p style={{fontSize:13.5, lineHeight:1.6, color:"var(--ink-2)", margin:0}}>
            PM2.5 and PM10 are statistically significant, independent predictors of respiratory disease across Indian districts (p ≈ 0). Four convergent tests — Pearson, t-test, Mann-Whitney, ANOVA — agree. The negative control (diarrhoea) behaves as expected, ruling out a spurious everything-correlates-with-everything artifact.
          </p>
        </div>
        <div className="card">
          <h3>The gap</h3>
          <p style={{fontSize:13.5, lineHeight:1.6, color:"var(--ink-2)", margin:0}}>
            Six years of policy — BS-VI, GRAP, odd-even, state-level schemes — have not moved the national PM2.5 baseline. The trend component shifted from 58.92 to 59.10 µg/m³. Escalated, cross-sectoral intervention at the district level is required, prioritising the 33 districts in Clusters 1 & 3.
          </p>
        </div>
      </div>

      <div className="callout">
        The data is clear: air pollution is not just an environmental problem — it is a public health emergency requiring cross-sectoral action at the district level.
        <cite>— DSM Final Project</cite>
      </div>

      <div className="foot-meta">
        Report: {D.meta.title} · Period {D.meta.period} · Updated {D.meta.updated}
      </div>
    </div>
  );
}

Object.assign(window, { RecsPage });
