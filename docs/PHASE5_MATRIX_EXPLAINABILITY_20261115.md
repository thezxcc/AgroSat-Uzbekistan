# AgroSat Uzbekistan — Stage 5 interface and explainability pass

Date: 15 November 2026. Local project: D:\AgroSat.

## User issue addressed
The comparison matrix previously showed "Not known yet" and the equivalent Russian/Uzbek translations without visible explanations (only a mouse hover tooltip). Touch and keyboard users could not reliably see why a status was unknown.

## Changes
- Each of 18 A/B/C-by-factor cells now offers a native keyboard- and touch-accessible "Why?" expander.
- Expanding reveals the existing localized backend reason code, plus an explicit check/measurement to consider next. Instructions do **not** promise the factor will become known automatically.
- Separate EN/RU/UZ guidance for water, soil cover, nutrients, pests, labor and market.
- No changes to scientific statuses, API outputs, original NASA files, or numerical claims.
- Scrollable matrix remains usable on 320 px and 390 px screens, without document-wide overflow.
- Automated browser suite `frontend/scripts/matrix-explanations-smoke.mjs` checks 18 elements, English/Russian/Uzbek explanation switching, mobile layouts, JavaScript errors.
- Integrated into `check_all.ps1` as a mandatory quality check.

## Limits
The additional text explains the *existing* qualitative statuses, not scientifically validated field predictions. Filling the form does not automatically convert every unknown into a measured conclusion. Stage 4's optional numerical satellite products remain unintegrated; Stage 8 public deployment and NASA submission have not been performed by this stage.
