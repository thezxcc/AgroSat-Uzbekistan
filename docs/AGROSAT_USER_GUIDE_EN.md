# AgroSat Uzbekistan — User Guide (English)

AgroSat is a research and educational tool for comparing crop-rotation options in Khorezm, Uzbekistan. It makes NASA climate history and published agricultural studies easier to explore, but **does not guarantee a harvest, profit or water saving**.

## 1. Start the application

For the easiest cross-platform setup, install and start Docker with Compose v2, then run this command in the cloned project directory:

```bash
docker compose up --build
```

Open **http://localhost:8080**. The backend API starts automatically.

Without Docker, Windows users can double-click **`START_HERE.bat`**; macOS/Linux users can run **`python3 run.py`** after installing Python 3.12+ and Node.js 22.12+/24+. Native startup uses **http://127.0.0.1:5173**.

For troubleshooting, prerequisites and clean shutdown, see [Quick Start](../QUICKSTART.md).

## 2. Explore your situation

The starting wizard asks three simple questions:
1. **Water:** How reliably is irrigation available during the additional growing season?
2. **Soil:** Is salinity known or measured? If unknown, say so; do not guess a laboratory value.
3. **Priority:** Which concerns matter most for your farm?

The tool treats these answers as **farmer-provided information**. It does not claim to detect them from space.

## 3. Compare three illustrative strategies

- **A — Wheat → fallow → cotton:** a reference case without an additional post-wheat summer crop.
- **B — Wheat → mung bean → cotton:** a possible additional summer crop if water and seasonal timing permit.
- **C — Wheat → mung bean → winter-pea green manure → cotton:** a longer sequence with a separate winter stage and added water/operations constraints.

A is not assumed to be the actual current farm rotation. B and C are not automatically better. Use the explanations rather than interpreting a coloured status as a guaranteed prediction.

## 4. Read the six-factor comparison

The comparison explains **water**, **living soil cover**, **soil nutrients**, **pests and diseases**, **field work/machinery** and **harvest/market factors**. It includes evidence, uncertainty and missing information. Open an explanation to see why a warning appears.

If crop planting/harvest dates are supplied, chronology checks detect impossible orderings and unknown dates. A date-consistent schedule still requires local agronomic checks.

## 5. Explore NASA data and research

Climate views use preserved daily NASA datasets for **2000–2025** near Urgench, Khorezm: historical rainfall, temperature, heat/frost exposure and planting-window summaries.

The two NASA GIBS/MODIS raster images are **illustrative regional context**, not field-level NDVI measurement. Scientific inputs, units and limitations are documented in [Data Sources and Credits](DATA_SOURCES_AND_CREDITS.md).

## 6. Optional field observations

Additional input controls may include crop-stage dates, reported irrigation, soil **ECe** and **pH**, units, sampling date and measurement source. Use a real measurement only when available. Blank or unknown inputs should remain unknown.

AgroSat does not perform soil laboratory testing and cannot independently verify a farmer's report.

## 7. Languages and accessibility

The website provides **English, Uzbek and Russian** interfaces. The public submission documents are in English; the multilingual application is intentional and helps different users.

## 8. What the results do not mean

The project does **not** estimate yield, profit, exact irrigation savings, soil improvement, farm-specific salinity or a validated future climate forecast. Before a real crop decision, consult local agronomic expertise, irrigation records and laboratory soil measurements.

For software reviewers: [2-minute Judges Guide](../JUDGES_GUIDE.md) · [Technical Audit](NASA_CODE_AND_SCIENCE_AUDIT_EN.md).
