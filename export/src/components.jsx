// Shared UI primitives and chart components
const { useState, useEffect, useMemo, useRef } = React;

// ---------- Header ----------
function PageHeader({ eyebrow, title, lede }) {
  return (
    <div className="hdr">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="title">{title}</h1>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}

function SectionHead({ num, title, desc }) {
  return (
    <div className="section-head">
      <span className="section-num">{num}</span>
      <h2 className="section-title">{title}</h2>
      {desc && <span className="section-desc">{desc}</span>}
    </div>
  );
}

// ---------- KPI ----------
function Kpi({ label, value, unit, delta, tone }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {value}{unit && <span className="kpi-unit">{unit}</span>}
      </div>
      {delta && <div className={`kpi-delta ${tone || ""}`}>{delta}</div>}
    </div>
  );
}

// ---------- SVG Line chart ----------
function LineChart({ series, months, height = 220, yMax, yLabel, showNaaqs, naaqsY }) {
  const W = 640, H = height;
  const pad = { t: 14, r: 14, b: 26, l: 36 };
  const max = yMax || Math.max(...series.flatMap(s => s.data));
  const min = 0;
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const xs = months.map((_, i) => pad.l + (i * innerW) / (months.length - 1));
  const y = v => pad.t + innerH - ((v - min) / (max - min)) * innerH;
  const ticks = 4;
  const tickVals = Array.from({length: ticks+1}, (_,i) => min + (max-min)*i/ticks);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%", height:"auto"}}>
      {/* grid */}
      {tickVals.map((tv,i) => (
        <g key={i}>
          <line x1={pad.l} x2={W-pad.r} y1={y(tv)} y2={y(tv)} stroke="var(--line)" strokeWidth="1"/>
          <text x={pad.l-6} y={y(tv)+3} textAnchor="end" fontSize="10" fill="var(--ink-3)" fontFamily="JetBrains Mono">{Math.round(tv)}</text>
        </g>
      ))}
      {/* NAAQS */}
      {showNaaqs && (
        <g>
          <line x1={pad.l} x2={W-pad.r} y1={y(naaqsY)} y2={y(naaqsY)} stroke="var(--accent)" strokeDasharray="3 3" strokeWidth="1"/>
          <text x={W-pad.r} y={y(naaqsY)-4} textAnchor="end" fontSize="9" fill="var(--accent)" fontFamily="JetBrains Mono">NAAQS {naaqsY}</text>
        </g>
      )}
      {/* x labels */}
      {months.map((m,i) => (
        <text key={i} x={xs[i]} y={H-pad.b+14} textAnchor="middle" fontSize="10" fill="var(--ink-3)" fontFamily="JetBrains Mono">{m}</text>
      ))}
      {/* lines */}
      {series.map((s,si) => {
        const d = s.data.map((v,i) => `${i===0?"M":"L"} ${xs[i]} ${y(v)}`).join(" ");
        return (
          <g key={si}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
            {s.data.map((v,i) => (
              <circle key={i} cx={xs[i]} cy={y(v)} r="2.5" fill={s.color}/>
            ))}
          </g>
        );
      })}
      {yLabel && (
        <text x={8} y={pad.t+2} fontSize="10" fill="var(--ink-3)" fontFamily="JetBrains Mono">{yLabel}</text>
      )}
    </svg>
  );
}

function Legend({ items }) {
  return (
    <div style={{display:"flex", gap:16, flexWrap:"wrap", marginTop: 10, fontSize:12, color:"var(--ink-2)"}}>
      {items.map((it,i) => (
        <span key={i} style={{display:"inline-flex", alignItems:"center", gap:6}}>
          <span style={{width:12, height:2, background:it.color, display:"inline-block"}}></span>
          {it.label}
        </span>
      ))}
    </div>
  );
}

// ---------- Horizontal bar chart ----------
function HBarChart({ rows, max, unit, colorFn, threshold, thresholdLabel }) {
  const m = max || Math.max(...rows.map(r => r.value));
  return (
    <div className="bar-hchart" style={{position:"relative"}}>
      {threshold != null && (
        <div style={{position:"absolute", left: `calc(110px + 10px + ${(threshold/m)*100}% * (1 - 56/100))`, top:0, bottom:0, width:1, background:"var(--accent)", opacity:0.5}}/>
      )}
      {rows.map((r,i) => {
        const pct = (r.value/m)*100;
        const color = colorFn ? colorFn(r) : "var(--ink)";
        return (
          <div className="bar-row" key={i}>
            <div className="name">{r.name}</div>
            <div className="track"><div className="fill" style={{width:`${pct}%`, background:color}}/></div>
            <div className="val">{r.value}{unit||""}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Correlation heatmap ----------
function Heatmap({ vars, matrix }) {
  const scale = v => {
    // v in [-1, 1]
    if (v >= 0) {
      // white -> red
      const t = v;
      return `oklch(${0.98 - t*0.38} ${t*0.18} 25)`;
    } else {
      const t = -v;
      return `oklch(${0.98 - t*0.38} ${t*0.08} 240)`;
    }
  };
  const textColor = v => Math.abs(v) > 0.5 ? "#fff" : "var(--ink)";
  const n = vars.length;
  const gridStyle = { gridTemplateColumns: `90px repeat(${n}, 1fr)` };
  return (
    <div className="hm" style={gridStyle}>
      {/* header row */}
      <div className="hm-label" style={{background:"var(--paper)"}}></div>
      {vars.map((v,i) => (
        <div key={i} className="hm-label" style={{textAlign:"center", fontSize:10}}>{v}</div>
      ))}
      {/* rows */}
      {matrix.map((row, ri) => (
        <React.Fragment key={ri}>
          <div className="hm-label">{vars[ri]}</div>
          {row.map((v, ci) => {
            const hide = ci > ri;
            return (
              <div
                key={ci}
                className="hm-cell"
                style={{
                  background: hide ? "var(--bg-2)" : scale(v),
                  color: hide ? "transparent" : textColor(v),
                  fontWeight: ri===ci ? 600 : 400,
                }}
              >
                {hide ? "" : v.toFixed(2)}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

// ---------- Distribution bar (histogram-like) ----------
function DistBar({ p }) {
  const exceedance = p.mean > p.naaqs;
  const pctOver = p.naaqs > 0 ? Math.min(100, (p.mean/p.naaqs)*100) : 0;
  return (
    <div className="card" style={{padding:18}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
        <div>
          <div style={{fontFamily:"IBM Plex Serif", fontSize:22, fontWeight:500}}>{p.key}</div>
          <div style={{fontSize:11, color:"var(--ink-3)", letterSpacing:"0.06em", textTransform:"uppercase", marginTop:2}}>{p.unit}</div>
        </div>
        <span className={`pill ${exceedance ? "crit":"ok"}`}>{exceedance ? "Exceeds" : "Within"} NAAQS</span>
      </div>
      <div style={{display:"flex", gap:18, marginTop:16}}>
        <div>
          <div style={{fontSize:10, color:"var(--ink-3)", letterSpacing:"0.06em", textTransform:"uppercase"}}>Mean</div>
          <div style={{fontFamily:"IBM Plex Serif", fontSize:28, fontWeight:500}}>{p.mean}</div>
        </div>
        <div>
          <div style={{fontSize:10, color:"var(--ink-3)", letterSpacing:"0.06em", textTransform:"uppercase"}}>Median</div>
          <div style={{fontFamily:"IBM Plex Serif", fontSize:28, fontWeight:500, color:"var(--ink-3)"}}>{p.median}</div>
        </div>
        <div>
          <div style={{fontSize:10, color:"var(--ink-3)", letterSpacing:"0.06em", textTransform:"uppercase"}}>NAAQS</div>
          <div style={{fontFamily:"IBM Plex Serif", fontSize:28, fontWeight:500, color:"var(--ink-3)"}}>{p.naaqs}</div>
        </div>
      </div>
      <div style={{marginTop:14, height:6, background:"var(--bg-2)", borderRadius:3, position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute", left:0, top:0, bottom:0, width:`${pctOver}%`, background:p.color, borderRadius:3}}/>
        {p.naaqs > 0 && (
          <div style={{position:"absolute", left:`${Math.min(100, (p.naaqs/Math.max(p.mean, p.naaqs))*100 * (p.mean > p.naaqs ? p.mean/Math.max(p.mean, p.naaqs) : 1))}%`, top:-3, bottom:-3, width:1, background:"var(--ink)"}}/>
        )}
      </div>
      <div style={{fontSize:11, color:"var(--ink-3)", marginTop:6, fontFamily:"JetBrains Mono"}}>
        {p.mean > p.naaqs ? `${((p.mean/p.naaqs - 1)*100).toFixed(0)}% over standard` : `${((1 - p.mean/p.naaqs)*100).toFixed(0)}% below standard`}
      </div>
    </div>
  );
}

// Export
Object.assign(window, { PageHeader, SectionHead, Kpi, LineChart, Legend, HBarChart, Heatmap, DistBar });
