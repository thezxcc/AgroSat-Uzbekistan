# AgroSat Uzbekistan — SCIENCE V3: LOCAL TECHNICAL PASS
Дата: 2026-11-14, Азия/Ташкент.
Рабочая папка: `D:\AgroSat`; ветка разработки: `science-v3-calendar-field-measurements`.
**Технический локальный PASS не означает полевую агрономическую валидацию или официальный статус NASA Submitted.**

## Этапы, выполненные к концу 14 ноября

| Этап из согласованного списка | Статус | Реальные изменения и доказательства |
|---|---|---|
| 1. NASA Field Shift, Universal, 24 Resources | **АУДИТ PASS** | Проверены актуальные правила GO Team, архив 24 official Resources пользовательских скриншотов V10; 2–6 реальных участников Universal, NASA минимум 1 источник из задания; GPM/IMERG, NASA POWER, MODIS используются; ссылки Project Tab/учётную запись не проверяли |
| 2. Хорезм / ICARDA / FAO / Узгидромет | **ДОКУМЕНТАЛЬНО PASS** | Прочитаны и сопоставлены ICARDA 2022/2023, FAO EcoCrop, FAO water needs, региональные источники; информация не объявляется измерениями конкретного поля |
| 3. Календарь A/B/C | **ПРОГРАММНО PASS** | `backend/app/calendar.py`; wheat→mung→winter pea→next cotton, неполные даты, пересечение этапов, отличие от 70–75 дней, no "feasible" label |
| 4. Реальная ротация | **ПРОГРАММНО PASS / АГРОНОМИЧЕСКИ ЧАСТИЧНО** | Структурированные crops/dates до 8 стадий, свободный текст сохраняется; реальные агрономические эффекты A по-прежнему UNKNOWN без испытаний |
| 5. Требования культур | **СПРАВОЧНИК PASS / ПОЛЕВАЯ ПРИГОДНОСТЬ НЕ ИЗМЕРЕНА** | `GET /api/crops`, FAO wheat/cotton сезонная вода, EcoCrop Vigna radiata температурные/pH предпочтения, ICARDA Durdona; нет подмены generic 'beans' требованиями Durdona |
| 6. Полив и ECe/pH | **ВВОД И ВАЛИДАЦИЯ PASS / РЕАЛЬНЫХ ЗНАЧЕНИЙ НЕТ** | Необязательные м³/га с периодом и источником, ECe дСм/м, pH и тип анализа/дата/глубина; API отказывает без provenance, нет ложной экономии воды |
| 7. Дополнительные спутники / новые анализы | **ЧАСТИЧНО** | Реальное усиление из существующего NASA IMERG: 75-дневное среднее, минимум и максимум осадков 2000–2025; документирована MOD13Q1/SMAP L4/Landsat QA, но новых численных SMAP/NDVI рядов **НЕТ** |
| 8. Прозрачные объяснения A/B/C | **PASS** | API возвращает chronology+source codes, конфликт дат повышает видимый риск, сохранены 6 qualitative факторов, климатика NASA и missing measurements |
| 9. Архитектура и тесты | **PASS** | Новые typed contracts, fail-closed validation, original NASA hash regression, independent rainfall window test, chronological order with missing middle step; React old-result protection, lint 0 |
| 10. EN/RU/UZ + Light/Dark + mobile | **PASS** | Новые компоненты и переводы, Chrome на 320/390/768/1024, accessibility focus, 5 suites |
| 11. Английская NASA презентация | **PASS ЛОКАЛЬНО** | `D:\AgroSat\artifacts\AgroSat_NASA_2026_7slides.pptx`, ровно 7 слайдов с реальными NASA числами; все 7 экспортированы в PNG и визуально проверены; нет идентифицирующих сведений/голоса ребёнка |
| 12. Документация и резервная копия | **ДОКУМЕНТЫ ГОТОВЫ, ZIP ПОСЛЕ КОММИТА** | `docs/NASA_SUBMISSION_DRAFT_EN_2026.md`, satellite feasibility report, README, собственная скриптовая сборка слайдов; ZIP создаётся из локального git HEAD после финального PASS |
| 13. Повторные локальные испытания | **PASS** | Итоги ниже, commit/tag после контроля Git |

## Последний локальный check_all.ps1

| Quality gate | Результат |
|---|---|
| Python pytest включая NASA integrity | **74/74 PASS**; 1 неблокирующий StarletteDeprecationWarning |
| Структура переводов EN/RU/UZ | **1 017 PASS** |
| Реальные Python API outputs / научные code refs | **7 сценариев / 1 233 reference checks PASS**; 4 crop records |
| React TypeScript build + oxlint | **PASS**, 0 ошибок/предупреждений |
| Chrome smoke: UI/наука/3 языка | **PASS** |
| Chrome smoke: light/dark/persistence/mobile | **PASS** |
| Chrome smoke: NASA jury user journey | **PASS** |
| Chrome smoke: out-of-order async API/evidence outage | **PASS** |
| Chrome smoke: Khorezm agronomy calendar/provenance/crops | **PASS**, включая 320px и 390px, 0 JS ошибок |
| NASA JSON original SHA256 + 9497 date integrity | **PASS; файлы не модифицированы** |

## Важно: что PASS НЕ означает
1. **Нет** фактических фермерских измерений ECe, pH, irrigation m³/ha или реальных сортовых результатов. Пользователь может их ввести, но приложение не объявляет их проверенными само по себе.
2. **Нет** калиброванного water balance, урожайности/прибыли, полевого NDVI, числового SMAP soil-moisture с NASA QA. Нельзя писать «экономия воды 15%», «урожайность +20%», «NDVI 0.76».
3. В календаре статус **chronological_only** означает только порядок введённых дат, не пригодность агротехнологии.
4. В FAO справочнике water requirements — **потребность культуры за сезон**, не поданный по каналу объём воды; нельзя интерпретировать мм как м³/га без физической модели/проверенных условий.
5. Узбекские научные переводы прошли тесты соответствия ключей и браузера, **не** независимую агрономическую редактуру.
6. NASA online Project Tab, список членов Universal и public URLs **не проверены** (сознательно отложено на 15 ноября).

## Учебная демонстрация для жюри
1. Открыть сайт локально `http://127.0.0.1:5173` (английский по умолчанию).
2. Показать NASA GPM/IMERG + POWER за 26 лет, спутниковую картинку NASA MODIS.
3. Сравнить A/B/C и 6 факторов; выбрать water='none' → B/C high-water-risk.
4. Развернуть **Field evidence & crop calendar**; ввести реальные или явно обозначенные тестовые даты и проверить случай конфликтного сидерата.
5. Открыть `Methods & Sources` и 4 культура-справочника FAO/ICARDA с provenance.
6. Показать график NASA осадков за любой год, затем historical 75-day NASA rain window (не фактический полив).
7. Переключить Light/Dark и RU/UZ; показать, что источники/значения NASA от языка не меняются.

## Что делать завтра (2026-11-15) ОБЯЗАТЕЛЬНО
- В NASA аккаунте удостовериться: оба реальных члена команды зарегистрированы в **одном Universal Event**, challenge Field Shift, правила регистрации несовершеннолетней выполнены.
- Public project/repo и frontend/HTTPS FastAPI с `VITE_API_URL`, CORS и проверками incognito.
- Загрузить/открыть без пароля 7-slide English PowerPoint (или PDF, если выбран публичный формат), проверить живую ссылку.
- Заполнить Project Tab (English) по `docs/NASA_SUBMISSION_DRAFT_EN_2026.md`; источники NASA/ICARDA/FAO, licences, credits, ChatGPT code/research/translation disclosure.
- Проверить публичный проект в incognito на другом устройстве: NASA stats, B/C, sources, field data, themes and 3 languages.
- **Нажать Submit for Judging и увидеть подтверждение SUBMITTED до 23:59 местного времени Team Owner**. Сохранить подтверждение для себя, без личных данных ребёнка в публичных файлах.

Источники правил: https://github.com/nasa/spaceapps/discussions/1938 ; https://github.com/nasa/spaceapps/discussions/1947 ; https://github.com/nasa/spaceapps/discussions/1973 .
