# Deployment and NASA submission checklist

## Local readiness
- [x] Original NASA datasets copied from research archive, 2000–2025.
- [x] Backend pytest and live HTTP API smoke tests.
- [x] Frontend TypeScript build and lint.
- [x] Browser desktop and mobile smoke tests.
- [ ] Student reviews every claim and tests in her browser.

## GitHub
- [ ] Create a public GitHub repository and set origin.
- [ ] Push only project code and public NASA data; research/ and archives are gitignored.
- [ ] Confirm GitHub Actions CI is green.
- [ ] Decide frontend hosting (GitHub Pages) and backend hosting (Render or another FastAPI host).
- [ ] Set `VITE_BASE_PATH=/REPO_NAME/` for GitHub Pages if needed.
- [ ] Set `VITE_API_URL=https://API_HOST` when building frontend.
- [ ] Set backend `CORS_ORIGINS=https://USERNAME.github.io` for the public frontend origin.
- [ ] Confirm browser can fetch API `/api/health` over HTTPS and both maps return 200.
- [ ] Test on phone or small responsive viewport.

**Do not use GitHub Pages alone:** it serves static files and cannot execute FastAPI. A separate backend is necessary unless API results are precomputed into static JSON, which would change the architecture.

## NASA project submission
- [ ] Ensure challenge entry includes a source from official Field Shift NASA Resources (GPM/IMERG and POWER verified from official screenshot).
- [ ] Add public source repository, functional demo link, and explanation.
- [ ] List data sources, scientific method, unknown inputs, limitations, and AI-assisted coding disclosure.
- [ ] Review no trademark/logo misuse or private information.
- [ ] Verify the entry's actual `SUBMITTED` status before the deadline.

## Evidence
- The source data are NASA POWER daily API JSON point extracts for Urgench at 41.55 N, 60.62 E.
- GPM/IMERG 2025 annual sum is 94.47 mm, tested in Python.
- MODIS screenshots are NASA GIBS visualizations; no numerical NDVI extraction is claimed.
- Salinity, irrigation volume, farm yield and profitability remain unmeasured.
