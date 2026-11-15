# AgroSat remaining stage order after Design V2

These tasks must remain in this sequence so the working research demo is never replaced by a broken visual prototype.

1. **Release hygiene:** complete Python, translation, build, scientific reasoning and 2-theme browser gates; local Git commit on `design-v2`; merge after PASS.
2. **Research audit:** test source links, recheck the official challenge wording from actual NASA Resources and update methodological limitations in README and UI as required. Do not infer numerical field measurements.
3. **Demonstration clarity:** student's 2–3 minute English presentation, on-screen comparison with water available vs unavailable, and evidence/source trace explanation. Keep RU/UZ working.
4. **Independent review:** check wording and agronomic claims against original ICARDA, FAO, NASA reports and actual regional field data.
5. **Public readiness:** only on explicit approval, link GitHub remote, deploy FastAPI on HTTPS host, deploy static React frontend with `VITE_API_URL` and correct CORS, test public demo.
6. **NASA submission:** verify rules, AI coding disclosure, source credits, external links, screenshots, and actual SUBMITTED status. This step has NOT been performed.

Potential optional science extension: numerical NDVI by retrieving a documented MODIS quality-flagged product for a selected area; this needs independent validation and must not block main functioning application.
