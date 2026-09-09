import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Search, Copy, Check, Circle } from "lucide-react";

const EXPERIENCE = [
  {
    date: "JUN 2025 — JAN 2026",
    role: "Decision Analytics Associate",
    org: "ZS Associates",
    bullets: [
      "Ran patient-level claims analysis, treatment journeys, and HCP segmentation across 20+ pharma assets to support US market go / no-go decisions.",
      "Defined market-sizing and patient-funnel logic stage by stage — inclusion criteria, time windows, denominator correctness — before any estimate went out.",
      "Pushed computation for 50Bn+ record workloads into Snowflake and Snowpark rather than local Python, and built reusable Snowpark pipelines that automated an estimated 40–45% of recurring analyses.",
    ],
  },
  {
    date: "MAR 2026 — MAY 2026",
    role: "Data Analyst",
    org: "Zomato — Feeding India",
    bullets: [
      "Built ETL workflows and Google Sheets / Apps Script automation across 1,000+ NGO sites, orchestrated through Airflow DAGs with idempotent reruns.",
      "Traced and fixed a recurring centre-ID mismatch (606 vs 606.0) and a Trino cast error caused by empty strings reaching numeric fields — both silently breaking joins upstream.",
      "Modelled holiday-nudge tracking as an explicit state machine (app-opened → nudge-viewed → submitted) instead of a one-off flag.",
    ],
  },
];

const PROJECTS = [
  {
    id: "ecommerce",
    name: "E-commerce API Pipeline",
    tags: ["python", "postgresql", "rest api", "star schema", "etl"],
    desc: "An independent, end-to-end build: a REST API source, a Python client, and a PostgreSQL warehouse in proper star schema — built to survive the failures a happy-path pipeline never plans for.",
    features: [
      "Pagination, retries, and exponential backoff against a mock API simulating real source failures",
      "Idempotent upserts — safe to rerun without duplicating or corrupting state",
      "Soft deletion and reactivation instead of destructive deletes",
      "Incremental loading with explicit change detection",
      "Rejected records preserved, not silently dropped",
      "Dimension tables for product / category / brand / date, plus a one-product-per-date snapshot fact table",
    ],
    note: '"Design for failure, not just the happy path. Separate current state from historical state. Define fact-table grain before you design anything."',
    link: "https://github.com/SriAman247/Ecommerce_API_Pipeline",
  },
  {
    id: "warehouse",
    name: "Sales Data Warehouse",
    tags: ["sql server", "etl", "medallion architecture", "star schema"],
    desc: "A modern data warehouse built on Medallion architecture — consolidating ERP and CRM CSV sources into a single, analytics-ready model for customer, product, and sales-trend reporting.",
    features: [
      "Bronze layer: raw ERP + CRM data ingested as-is from CSV",
      "Silver layer: cleansing, standardization, and normalization",
      "Gold layer: business-ready star schema for analysis",
      "Documented data catalog and table/column naming conventions",
      "Architecture, ETL, and data-flow diagrams kept alongside the code",
    ],
    note: "datasets/ raw CSVs · docs/ architecture + catalog · scripts/bronze,silver,gold · tests/ data quality checks",
    link: "https://github.com/SriAman247/Sales_data_warehouse",
  },
  {
    id: "music",
    name: "Digital Music Analysis",
    tags: ["sql", "window functions", "pivoting"],
    desc: "A SQL deep-dive into a music-store database — songs, albums, artists, and user interactions — moving from basic retrieval up to window functions and pivoted, statistical analysis.",
    features: [
      "Simple queries: retrieval, filtering, sorting, basic aggregation",
      "Moderate queries: joins, subqueries, data transformation",
      "Advanced queries: window functions, pivoting, statistical analysis",
      "Findings packaged as a presentation deck alongside the raw SQL",
    ],
    note: null,
    link: "https://github.com/SriAman247/SQL-Digital-Music-Analysis",
  },
  {
    id: "debt",
    name: "International Debt Statistics",
    tags: ["sql", "jupyter", "world bank data"],
    desc: "An analysis of World Bank data on debt owed by developing countries, answering a small set of concrete questions with SQL over a Jupyter notebook.",
    features: [
      "Total debt owed across all listed countries",
      "Which country carries the largest debt, and how large",
      "Average debt owed per country, broken down by indicator",
    ],
    note: null,
    link: "https://github.com/SriAman247/SQL-Analyze-International-debt-statistics",
  },
];

const SKILLS = [
  {
    tier: "CORE",
    items: ["SQL", "Python", "Snowflake", "Snowpark", "PostgreSQL", "Airflow", "Trino / Presto", "Git", "Sheets + Apps Script"],
  },
  {
    tier: "WORKING",
    items: ["REST APIs", "Incremental ETL", "Star schemas", "Idempotency & upserts", "Docker (concepts)", "dbt (concepts)", "AWS (concepts)", "PySpark (concepts)"],
  },
  {
    tier: "LEARNING",
    items: ["Kafka", "Kubernetes", "Distributed Spark", "Cloud architecture at scale", "Production dbt ownership"],
  },
];

const ACHIEVEMENTS = [
  { tag: "SQL", label: "HackerRank 5-Star Gold Badge in SQL" },
  { tag: "CERT", label: "Data Analysis using Python — DataFlair" },
  { tag: "ROBOTICS", label: "International Representative, Robocon" },
];

const NAV = ["about", "experience", "projects", "skills", "contact"];
const QUERY_TEXT = "SELECT bio FROM engineer WHERE curiosity = true;";

export default function Portfolio() {
  const [typed, setTyped] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [openExp, setOpenExp] = useState(0);
  const [openProj, setOpenProj] = useState("ecommerce");
  const [filter, setFilter] = useState("");
  const [activeNav, setActiveNav] = useState("about");
  const [copied, setCopied] = useState(false);

  const sectionRefs = useRef({});

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(QUERY_TEXT.slice(0, i));
      if (i >= QUERY_TEXT.length) {
        clearInterval(t);
        setTimeout(() => setShowResult(true), 200);
      }
    }, 32);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveNav(entry.target.dataset.section);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filteredProjects = PROJECTS.filter((p) => {
    if (!filter.trim()) return true;
    const f = filter.toLowerCase();
    return p.name.toLowerCase().includes(f) || p.tags.some((t) => t.includes(f));
  });

  const copyEmail = () => {
    const email = "amansr.24.7@gmail.com";
    navigator.clipboard.writeText(email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const setRef = (name) => (el) => {
    sectionRefs.current[name] = el;
  };

  return (
    <div className="console-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

        .console-root{
          --bg:#F3F4F1;
          --surface:#FFFFFF;
          --ink:#14181A;
          --ink-dim:#5B6360;
          --line:#DADDD7;
          --accent:#2455F2;
          --accent-dim:#8FA3F6;
          --good:#12805C;
          --amber:#B4750E;
          --mono:'JetBrains Mono', monospace;
          --sans:'Manrope', sans-serif;

          background:var(--bg);
          color:var(--ink);
          font-family:var(--sans);
          min-height:100vh;
          line-height:1.6;
        }
        .console-root *{ box-sizing:border-box; }
        .console-root a{ color:inherit; }
        .console-root button{ font-family:inherit; cursor:pointer; background:none; border:none; color:inherit; }
        .console-root ::selection{ background:var(--accent); color:#fff; }

        .cw{ max-width:880px; margin:0 auto; padding:0 24px; }

        /* top bar */
        .topbar{
          position:sticky; top:0; z-index:40;
          background:rgba(243,244,241,0.92);
          backdrop-filter:blur(6px);
          border-bottom:1px solid var(--line);
        }
        .topbar-inner{
          max-width:880px; margin:0 auto; padding:12px 24px;
          display:flex; align-items:center; justify-content:space-between;
          font-family:var(--mono); font-size:12.5px;
        }
        .topbar-left{ display:flex; align-items:center; gap:10px; color:var(--ink-dim); }
        .dots{ display:flex; gap:5px; }
        .dots span{ width:8px; height:8px; border-radius:50%; display:inline-block; }
        .dots span:nth-child(1){ background:#E0862B; }
        .dots span:nth-child(2){ background:#B4750E; }
        .dots span:nth-child(3){ background:var(--good); }
        .breadcrumb b{ color:var(--ink); }
        .pulse{
          width:6px; height:6px; border-radius:50%; background:var(--good); display:inline-block;
          animation:pulse 2s ease-in-out infinite;
        }
        @keyframes pulse{ 0%,100%{opacity:1;} 50%{opacity:0.35;} }

        .navtabs{ display:flex; gap:18px; }
        .navtabs button{
          font-size:12.5px; color:var(--ink-dim); padding-bottom:2px;
          border-bottom:1px solid transparent; transition:color .15s ease, border-color .15s ease;
        }
        .navtabs button.active, .navtabs button:hover{ color:var(--accent); border-color:var(--accent); }
        @media (max-width:640px){ .navtabs{ display:none; } }

        /* hero */
        .hero{ padding:64px 0 56px; }
        .query-box{
          background:var(--ink); color:#D9E0DE; border-radius:6px; padding:18px 20px;
          font-family:var(--mono); font-size:14px;
        }
        .query-box .prompt{ color:var(--good); margin-right:8px; }
        .cursor{
          display:inline-block; width:7px; height:15px; background:var(--accent-dim);
          margin-left:2px; vertical-align:-2px; animation:blink 1s step-end infinite;
        }
        @keyframes blink{ 50%{ opacity:0; } }

        .result-panel{
          margin-top:14px; padding-top:14px; border-top:1px dashed rgba(217,224,222,0.25);
          opacity:0; transform:translateY(4px); transition:opacity .4s ease, transform .4s ease;
        }
        .result-panel.show{ opacity:1; transform:translateY(0); }
        .result-panel .row{ display:flex; gap:12px; font-size:13px; margin-bottom:6px; }
        .result-panel .k{ color:#8FA39C; min-width:64px; }

        .hero h1{
          font-family:var(--mono); font-weight:700; font-size:clamp(1.7rem, 4.2vw, 2.5rem);
          margin-top:28px; line-height:1.25; max-width:20ch; letter-spacing:-0.01em;
        }
        .hero p.sub{ margin-top:16px; max-width:56ch; color:var(--ink-dim); font-size:1.02rem; }
        .hero .ctas{ margin-top:28px; display:flex; gap:12px; flex-wrap:wrap; }
        .btn{
          font-family:var(--mono); font-size:13px; padding:10px 18px; border-radius:5px;
          text-decoration:none; display:inline-flex; align-items:center; gap:6px;
          transition:background .15s ease, border-color .15s ease, color .15s ease;
        }
        .btn-primary{ background:var(--accent); color:#fff; }
        .btn-primary:hover{ background:#1c40c9; }
        .btn-ghost{ border:1px solid var(--line); color:var(--ink); }
        .btn-ghost:hover{ border-color:var(--accent); color:var(--accent); }

        /* sections */
        section{ padding:56px 0; border-top:1px solid var(--line); }
        .sec-head{ display:flex; align-items:baseline; gap:10px; margin-bottom:8px; }
        .sec-head .tname{ font-family:var(--mono); font-weight:600; font-size:1.05rem; }
        .sec-head .count{ font-family:var(--mono); font-size:12px; color:var(--ink-dim); }
        .sec-hint{ font-family:var(--mono); font-size:12px; color:var(--ink-dim); margin-bottom:24px; }

        /* about */
        .kv-grid{ display:grid; grid-template-columns:1fr 1fr; gap:32px; margin-top:20px; }
        @media (max-width:700px){ .kv-grid{ grid-template-columns:1fr; } }
        .kv-grid p{ margin-bottom:14px; max-width:54ch; }
        .kv{ font-family:var(--mono); font-size:12.5px; }
        .kv .r{ display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px solid var(--line); gap:12px; }
        .kv .r span:first-child{ color:var(--ink-dim); }
        .kv .r span:last-child{ text-align:right; }

        /* rows (experience + projects share this) */
        .rowlist{ border-top:1px solid var(--line); }
        .rowitem{ border-bottom:1px solid var(--line); }
        .rowhead{
          width:100%; display:grid; grid-template-columns:150px 1fr 20px; gap:18px; align-items:start;
          padding:16px 0; text-align:left;
        }
        @media (max-width:640px){ .rowhead{ grid-template-columns:1fr 20px; } .rowhead .rdate{ grid-column:1/2; } }
        .rdate{ font-family:var(--mono); font-size:11.5px; color:var(--accent); padding-top:3px; }
        .rtitle{ font-family:var(--mono); font-weight:600; font-size:0.98rem; }
        .rorg{ color:var(--ink-dim); font-size:0.88rem; margin-top:2px; }
        .rchev{ transition:transform .2s ease; color:var(--ink-dim); }
        .rowitem.open .rchev{ transform:rotate(90deg); color:var(--accent); }
        .rowbody{ padding:0 0 20px 0; }
        .rowbody ul{ list-style:none; padding-left:0; }
        .rowbody li{ font-size:0.92rem; padding-left:16px; position:relative; margin-bottom:8px; }
        .rowbody li::before{ content:"›"; position:absolute; left:0; color:var(--accent); }

        /* project rows */
        .filter-row{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:22px; align-items:center; }
        .search-box{
          display:flex; align-items:center; gap:8px; border:1px solid var(--line); border-radius:5px;
          padding:8px 12px; font-family:var(--mono); font-size:12.5px; background:var(--surface); flex:1 1 220px;
        }
        .search-box input{ border:none; outline:none; background:none; font-family:var(--mono); font-size:12.5px; width:100%; color:var(--ink); }
        .search-box svg{ flex:0 0 auto; color:var(--ink-dim); }
        .chip-filter{
          font-family:var(--mono); font-size:11.5px; padding:7px 11px; border:1px solid var(--line);
          border-radius:5px; color:var(--ink-dim); transition:border-color .15s ease, color .15s ease;
        }
        .chip-filter.active, .chip-filter:hover{ border-color:var(--accent); color:var(--accent); }

        .proj-tags{ display:flex; flex-wrap:wrap; gap:6px; margin:12px 0 16px; }
        .proj-tags span{
          font-family:var(--mono); font-size:10.5px; padding:3px 8px; border-radius:4px;
          background:rgba(36,85,242,0.08); color:var(--accent);
        }
        .proj-desc{ color:var(--ink-dim); font-size:0.92rem; max-width:60ch; margin-bottom:14px; }
        .proj-note{
          font-family:var(--mono); font-size:11.5px; color:var(--amber); margin-top:14px;
          padding:10px 12px; background:rgba(180,117,14,0.07); border-radius:5px;
        }
        .proj-link{
          margin-top:16px; display:inline-flex; align-items:center; gap:6px;
          font-family:var(--mono); font-size:12.5px; color:var(--accent);
          border-bottom:1px solid var(--accent-dim);
        }
        .proj-link:hover{ border-color:var(--accent); }
        .no-results{ font-family:var(--mono); font-size:13px; color:var(--ink-dim); padding:24px 0; }
        .also{ margin-top:24px; font-family:var(--mono); font-size:12px; color:var(--ink-dim); }
        .also b{ color:var(--good); }

        /* skills */
        .skill-block{ margin-bottom:26px; }
        .skill-block .tier-tag{
          font-family:var(--mono); font-size:11.5px; font-weight:600; color:var(--good);
          display:block; margin-bottom:10px;
        }
        .skill-block:nth-child(2) .tier-tag{ color:var(--amber); }
        .skill-block:nth-child(3) .tier-tag{ color:var(--ink-dim); }
        .skill-row{ display:flex; flex-wrap:wrap; gap:8px; }
        .skill-row span{
          font-family:var(--mono); font-size:12px; padding:6px 10px; border:1px solid var(--line);
          border-radius:5px; transition:border-color .15s ease, background .15s ease;
        }
        .skill-row span:hover{ border-color:var(--accent); background:rgba(36,85,242,0.05); }

        /* achievements */
        .ach-row{ display:flex; gap:16px; align-items:baseline; padding:12px 0; border-bottom:1px solid var(--line); font-size:0.92rem; }
        .ach-row .tag{ font-family:var(--mono); font-size:11px; color:var(--good); flex:0 0 70px; }

        /* contact */
        .contact-block{ background:var(--ink); color:#D9E0DE; border-radius:6px; padding:22px 22px 18px; font-family:var(--mono); font-size:13px; }
        .contact-block .kw{ color:#8FA3F6; }
        .contact-block .row{
          display:flex; justify-content:space-between; align-items:center; padding:9px 0;
          border-bottom:1px dashed rgba(217,224,222,0.15);
        }
        .contact-block .row:last-child{ border-bottom:none; }
        .contact-block .val{ color:#F2C57A; }
        .contact-block .val:hover{ color:#FFD98F; }
        .copy-affordance{ display:flex; align-items:center; gap:6px; color:#8FA39C; font-size:11px; }
        .copy-affordance:hover{ color:#D9E0DE; }

        footer.foot{ padding:36px 0 60px; }
        .foot-meta{
          font-family:var(--mono); font-size:11px; color:var(--ink-dim);
          display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; padding-top:18px;
        }

        :focus-visible{ outline:2px solid var(--accent); outline-offset:2px; }
      `}</style>

      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <span className="dots"><span></span><span></span><span></span></span>
            <span className="breadcrumb"><b>portfolio.db</b> › aman_srivastava</span>
            <span className="pulse" title="connected"></span>
          </div>
          <div className="navtabs">
            {NAV.map((n) => (
              <button
                key={n}
                className={activeNav === n ? "active" : ""}
                onClick={() => sectionRefs.current[n]?.scrollIntoView({ behavior: "smooth" })}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero" style={{ borderTop: "none" }}>
        <div className="cw">
          <div className="query-box">
            <span className="prompt">›</span>{typed}
            {typed.length < QUERY_TEXT.length && <span className="cursor"></span>}
            <div className={`result-panel ${showResult ? "show" : ""}`}>
              <div className="row"><span className="k">name</span><span>Aman Srivastava</span></div>
              <div className="row"><span className="k">role</span><span>Data Engineer (in the making)</span></div>
              <div className="row"><span className="k">based</span><span>Gurgaon, India</span></div>
              <div className="row"><span className="k">status</span><span>open to work</span></div>
            </div>
          </div>

          <h1>I build data pipelines that don't break when reality does.</h1>
          <p className="sub">
            One year spent inside patient-scale healthcare datasets and operational trackers,
            now building production-grade pipelines of my own — and looking for the team to
            build the next ones with.
          </p>
          <div className="ctas">
            <a className="btn btn-primary" href="#projects" onClick={(e) => { e.preventDefault(); sectionRefs.current.projects?.scrollIntoView({ behavior: "smooth" }); }}>
              query the projects <ChevronRight size={14} />
            </a>
            <a className="btn btn-ghost" href="#contact" onClick={(e) => { e.preventDefault(); sectionRefs.current.contact?.scrollIntoView({ behavior: "smooth" }); }}>
              get in touch
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section ref={setRef("about")} data-section="about">
        <div className="cw">
          <div className="sec-head"><span className="tname">about</span></div>
          <div className="kv-grid">
            <div>
              <p>
                I trained as a mechanical engineer at BIT Mesra, then spent my first year of
                work applying that same systems instinct to data — first inside pharma and
                healthcare claims data at ZS Associates, then keeping operational trackers
                honest at Zomato's Feeding India.
              </p>
              <p>
                What carried over wasn't the syntax, it was the discipline: define the grain
                before you build, design for the failure case first, and never trust a number
                you haven't validated stage by stage. I'm now deepening the engineering side of
                that — pipelines, warehousing, orchestration — through a structured self-built
                roadmap and hands-on projects, on my own time.
              </p>
            </div>
            <div className="kv">
              <div className="r"><span>education</span><span>B.Tech Mech. Eng. — BIT Mesra</span></div>
              <div className="r"><span>experience</span><span>1 year, healthcare &amp; ops analytics</span></div>
              <div className="r"><span>currently</span><span>open to Data Engineering roles</span></div>
              <div className="r"><span>also considering</span><span>Analytics Eng. / Data Analyst</span></div>
              <div className="r"><span>base</span><span>Gurgaon, India</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section ref={setRef("experience")} data-section="experience">
        <div className="cw">
          <div className="sec-head"><span className="tname">TABLE experience</span><span className="count">({EXPERIENCE.length} rows)</span></div>
          <div className="sec-hint">click a row to expand</div>
          <div className="rowlist">
            {EXPERIENCE.map((exp, i) => (
              <div className={`rowitem ${openExp === i ? "open" : ""}`} key={i}>
                <button className="rowhead" onClick={() => setOpenExp(openExp === i ? -1 : i)}>
                  <span className="rdate">{exp.date}</span>
                  <span>
                    <span className="rtitle">{exp.role}</span>
                    <span className="rorg" style={{ display: "block" }}>{exp.org}</span>
                  </span>
                  <ChevronRight className="rchev" size={16} />
                </button>
                {openExp === i && (
                  <div className="rowbody">
                    <ul>
                      {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section ref={setRef("projects")} data-section="projects">
        <div className="cw">
          <div className="sec-head"><span className="tname">TABLE projects</span><span className="count">({filteredProjects.length} of {PROJECTS.length} rows)</span></div>
          <div className="sec-hint">filter by tag, or click a row to expand</div>

          <div className="filter-row">
            <div className="search-box">
              <Search size={14} />
              <input
                placeholder='WHERE tag LIKE "..."'
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            {["all", "sql", "python", "etl"].map((c) => (
              <button
                key={c}
                className={`chip-filter ${filter === c || (c === "all" && filter === "") ? "active" : ""}`}
                onClick={() => setFilter(c === "all" ? "" : c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="rowlist">
            {filteredProjects.map((p) => (
              <div className={`rowitem ${openProj === p.id ? "open" : ""}`} key={p.id}>
                <button className="rowhead" style={{ gridTemplateColumns: "1fr 20px" }} onClick={() => setOpenProj(openProj === p.id ? "" : p.id)}>
                  <span>
                    <span className="rtitle">{p.name}</span>
                  </span>
                  <ChevronRight className="rchev" size={16} />
                </button>
                {openProj === p.id && (
                  <div className="rowbody">
                    <div className="proj-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                    <p className="proj-desc">{p.desc}</p>
                    <ul>
                      {p.features.map((f, j) => <li key={j}>{f}</li>)}
                    </ul>
                    {p.note && <div className="proj-note">{p.note}</div>}
                    <a className="proj-link" href={p.link} target="_blank" rel="noopener noreferrer">
                      view on GitHub <ChevronRight size={12} />
                    </a>
                  </div>
                )}
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="no-results">0 rows returned — try a different filter.</div>
            )}
          </div>

          <div className="also">
            <b>also explored</b> — NLP review classification · Snowpark automation pipelines · Pharma launch analytics
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section ref={setRef("skills")} data-section="skills">
        <div className="cw">
          <div className="sec-head"><span className="tname">TABLE skills</span></div>
          <div className="sec-hint">grouped by depth, not sorted by preference</div>
          {SKILLS.map((s) => (
            <div className="skill-block" key={s.tier}>
              <span className="tier-tag">{s.tier}</span>
              <div className="skill-row">
                {s.items.map((it) => <span key={it}>{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section>
        <div className="cw">
          <div className="sec-head"><span className="tname">achievements</span></div>
          {ACHIEVEMENTS.map((a, i) => (
            <div className="ach-row" key={i}>
              <span className="tag">{a.tag}</span>
              <span>{a.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section ref={setRef("contact")} data-section="contact">
        <div className="cw">
          <div className="sec-head"><span className="tname">contact</span></div>
          <p className="sub" style={{ color: "var(--ink-dim)", maxWidth: "52ch", marginBottom: "20px" }}>
            Open to Data Engineering roles, and adjacent Analytics Engineering / Data Analyst positions.
            Based in Gurgaon, open to remote and relocation.
          </p>
          <div className="contact-block">
            <div><span className="kw">INSERT INTO</span> contact (channel, value) <span className="kw">VALUES</span></div>
            <div className="row">
              <span>&nbsp;&nbsp;('email', &nbsp;<span className="val">amansr.24.7@gmail.com</span>)</span>
              <button className="copy-affordance" onClick={copyEmail}>
                {copied ? <><Check size={12} /> copied</> : <><Copy size={12} /> copy</>}
              </button>
            </div>
            <div className="row">
              <span>&nbsp;&nbsp;('github', &nbsp;
                <a className="val" href="https://github.com/SriAman247" target="_blank" rel="noopener noreferrer">github.com/SriAman247</a>)
              </span>
            </div>
            <div className="row">
              <span>&nbsp;&nbsp;('linkedin', &nbsp;
                <a className="val" href="#" target="_blank" rel="noopener noreferrer">linkedin.com/in/sr-aman</a>);
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="cw">
          <div className="foot-meta">
            <span>AMAN SRIVASTAVA — DATA ENGINEERING PORTFOLIO</span>
            <span>portfolio.db · 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
