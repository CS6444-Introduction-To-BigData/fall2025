---
layout: page
title: Assignment
permalink: /assignment/
---

For this assignment, you will clean, aggregate, analyze, and map a real 5G/LTE drive-test dataset to surface actionable network insights. You’ll design a composite performance KPI, compare cartographic representations (points vs. paths vs. hexes), and deliver a brief with evidence-backed findings.

---

## Dataset

Download: [Google Drive (CSV/Parquet)](https://drive.google.com/file/d/16VVkSs9TIAyWzg58T7rHcirebSppRnLx/view)

Column dictionary

- `Lon`, `Lat` *(float, WGS-84)* — GPS coordinates.  
- `Time` *(timestamp with microseconds)* — measurement time.  
- `NR5G_RF_RSRP` *(dBm, float)* — 5G signal strength *(higher = better; e.g., −80 > −100)*.  
- `NR5G_RF_SINR` *(dB, float)* — 5G signal quality *(positive good; 0 ≈ midpoint)*.  
- `NR5G_Throughput_PDSCH_TP` *(Mb/s, float)* — 5G downlink rate.  
- `LTE_L1_RF_RSRP` *(dBm, float)* — LTE signal strength.  
- `LTE_L1_RF_RS_SINR` *(dB, float)* — LTE signal quality.  
- `LTE_Data_Throughput_Downlink_All_PDSCH_PDSCH_TP_Total` *(Mb/s, float)* — LTE downlink rate.  
- `sheetid` *(int)* — import tag (constant in this file).  
- `MarketFileName` *(str)* — market label *(e.g., “Milwaukee-WI”)*.

> Notes:  
> • Some rows include only 5G values, others only LTE (different RATs active over time).  
> • A small number of rows have missing coordinates — drop these during cleaning.

---

## Tasks

### 1) Clean & Aggregate to 1-Second Granularity
1. Parse `Time` to a proper timestamp; drop rows with missing `Lon`/`Lat`.  
2. Create `TimeSec = floor(Time to second)`.  
3. Define RAT (Radio Access Tech) for each row:
   - `NR5G` if any 5G KPI present,  
   - `LTE` if any LTE KPI present,  
   - else `Unknown` (drop).  
4. Aggregate per `(TimeSec, RAT)` and a spatial key of your choice (pick one and justify in your brief):
   - Option A — exact path: order by time, keep the most recent sample per second;  
   - Option B — spatial bin: snap to an H3 hex (choose a resolution and explain), then aggregate by `(TimeSec, H3, RAT)`.  
5. For numeric KPIs (RSRP, SINR, Throughput for the active RAT), compute mean, median, and count per group; keep categorical columns by first/most-recent.

### 2) Define a Management KPI & Extract Knowledge
Propose a single Performance Index that blends Coverage (RSRP), Quality (SINR), and Capacity (Throughput).

- Example you may improve:  
  <math display="block">
    <mi>Perf</mi>
    <mo>=</mo>
    <mn>0.4</mn><mo>&#x22C5;</mo>
    <mi>z</mi><mo>(</mo><mi>RSRP</mi><mo>)</mo>
    <mo>+</mo>
    <mn>0.4</mn><mo>&#x22C5;</mo>
    <mi>z</mi><mo>(</mo><mi>SINR</mi><mo>)</mo>
    <mo>+</mo>
    <mn>0.2</mn><mo>&#x22C5;</mo>
    <mi>z</mi><mo>(</mo><mi>Throughput</mi><mo>)</mo>
  </math>
- Requirements in your brief:
  - Final formula and weights with rationale (per-RAT standardization recommended).  
  - Missing values handling strategy (e.g., mask component, re-weight remaining, or impute safely).  
  - Interpretation bands (e.g., Low / Medium / High or quantile-based thresholds).
- Insights (choose any 3): examples include interchanges with degraded performance, time-of-day congestion bands, LTE fallback pockets, or persistent poor-SINR corridors.

### 3) Visualize Insights on a Map (and Compare Representations)
Build an interactive HTML map with three switchable layers:

1. Point-based (1-second samples): color by `Perf` *(diverging palette if centered at 0)*; popups with KPI stats.  
2. Path-based: connect consecutive 1-second points into line segments; color by segment `Perf` *(fewer DOM elements than dense points)*.  
3. Hex clustering (H3 or hexbin): aggregate `Perf` and KPI percentiles per hex; reveal both magnitude and sample count.

Add a ≤150-word comparison: point vs. path vs. hex — what patterns each reveals, browser performance, and when you’d use each in production.

---

## Deliverables

1. Cleaned 1-second dataset: `clean_1s.csv`  
   - Must include: `TimeSec`, spatial key (`Lon`,`Lat` or `H3`), `RAT`, aggregated KPIs, and `Perf`.  
2. Notebook / script: performs cleaning, aggregation, KPI computation, and exports map data (GeoJSON/CSV).  
3. Interactive map (HTML): three layers (point, path, hex) with legend and tooltips.  
4. 2-page brief (PDF) including:
   - (a) Performance Index definition & justification,  
   - (b) Three manager insights with screenshots/figures,  
   - (c) Limitations & next steps.

> Optional: include a short README with run instructions and library versions.

---

## Tips (H3 + Visualization)

- H3 resolution: start with res 9–10 (street scale: ~174 m to ~63 m across); adjust to balance detail vs. noise. Persist the hex id and compute stats per hex (mean `Perf`, 25th/50th/75th percentiles, sample count).  
- Coloring: use sequential scales for RSRP / Throughput; use diverging (center at 0) for SINR and any z-score-centered `Perf`.  
- Performance: path and hex layers usually render smoother than many points. If needed, throttle point rendering (e.g., show every *N* seconds) for side-by-side comparison.  
- RAT separation: standardize KPIs within each RAT before blending (5G vs. LTE distributions differ).  
- QC checks: plot KPI histograms by RAT; map count per group to spot sparse areas.

---

## Submission

- Place all files in a repo folder, e.g., `/network-mapping-assignment/` with subfolders:
```
/data (original & cleaned)
/notebooks (or /src)
/maps (exported .html, GeoJSON)
/docs (2-page brief PDF, figures)
```
- Publish the assignment page at this URL and link to:
  - dataset download,  
  - map HTML (viewable),  
  - brief PDF,  
  - cleaned CSV, and notebook/script.  
- Create a repository Issue titled `Network Mapping Assignment` and assign it to Jugal Gajjar.

**Deadline:** *November 15, 2025 – 11:59 PM EST*

> Submissions after this time may not be graded or may incur late penalties as per course policy.
