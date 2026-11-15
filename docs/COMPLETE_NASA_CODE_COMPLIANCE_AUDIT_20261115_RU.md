# AgroSat Uzbekistan — независимая проверка требований NASA Space Apps 2026 и кода
Дата: 2026-11-15 (Asia/Tashkent). Версия: Git `7827d63`. Проверка выполнена по локальному коду `D:\AgroSat` и опубликованным страницам NASA Space Apps. Основной код не изменялся.

## Краткий вывод
Соответствует центральной задаче Field Shift: интерактивный инструмент для изучения севооборотов с использованием NASA Earth observations, местной агрономической литературы, вводимых показателей почвы и целей фермера. Математическая и программная часть локально работоспособна. НЕ доказаны полевой эффект, публичное развёртывание, завершённая конкурсная отправка, независимый пользовательский тест и удалённый CI.

## Официальное задание (NASA 2026)
NASA Field Shift: создать decision-support tool с NASA Earth observations + local soil information + crop characteristics + farmer priorities, чтобы исследовать rotation strategies, которые могут укрепить почву и повысить устойчивость к меняющимся условиям.
Источник: https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/

| Требование | Статус | Доказательство / граница |
|---|---|---|
| Инструмент поддержки выбора севооборота | PASS (прототип) | A/B/C + предупреждения и следующие проверки |
| Интеграция NASA | PASS | 9 497 daily values в двух архивах 2000–2025, SHA-256 проверен |
| Жара/осадки/заморозки | PASS | Historical 75-day windows, year/month climate summaries, not predictions |
| Условия фермера | PASS (логика) | Water/salinity/priority, calendar, equipment, optional farmer measurements |
| Местная почва | PARTIAL | Категории/ECe/pH вводятся пользователем; карты полей и независимые лабораторные данные отсутствуют |
| Характеристики культур | PARTIAL | FAO/ICARDA и Durdona crop duration; не откалибровано для всех сортов/полей |
| Soil improvement/adaptation | PARTIAL | Потенциальные условные эффекты, без доказанного урожая/экономии воды |
| Удобство для широкого круга фермеров | PARTIAL | 3 простых вопроса, 3 языка, responsive; без независимых полевых usability tests |

## Запущенные проверки (повторно, непосредственно в этом аудите)
- `check_all.ps1`: ALL LOCAL AGROSAT QUALITY GATES: PASS (exit 0). Python pytest: 93 PASS, 1 неблокирующее StarletteDeprecationWarning.
- `oxlint`: 0 ошибок/предупреждений. TypeScript `tsc -b` и `vite build`: PASS.
- i18n: 1 128 checked localized messages, EN/RU/UZ, согласованные плейсхолдеры.
- Реальный headless Chrome: пользовательский сценарий, мобильные 320/390, планшет/ПК, dark/light themes, responsive, 18 scientific matrix explanations, NASA links, calendar, provenance, API race conditions: PASS.
- Независимый полный перебор 4 water × 3 salinity × 3 priorities = 36 /api/compare случаев, все согласованы: 3 rotations, 6 impacts, source IDs, warning codes, water risk headline/matrix; 9 невалидных запросов отклонены как HTTP 422.
- NASA original JSON SHA-256 совпадает с `backend/data/NASA_SOURCES_MANIFEST.json`.
- `python -m pip check`: No broken requirements. `npm audit --omit=dev`: found 0 vulnerabilities. Это не полноценный аудит безопасности.
- Локальное git дерево чистое до создания этого отчёта, Git remote origin отсутствует. Архив ZIP и 7-page deck имеются локально.

## Оценка по пяти критериям NASA (качественно)
- Relevance: СИЛЬНАЯ. Прямой ответ на Field Shift; ограниченный объём регионального пилота — допустим для MVP.
- Validity: ХОРОШАЯ ДЛЯ ПРОТОТИПА. Источники целостны, отсутствующие измерения честно помечены, календарные ограничения и исторические экспозиции проходят тесты. Нет агрономической калибровки конкретного поля.
- Creativity: УМЕРЕННО-ВЫСОКАЯ. Farmer-first, data provenance, explainable uncertainty, интерактивные 3 pathways; уникальность относительно существующих продуктов не исследована.
- Impact: ПОТЕНЦИАЛЬНЫЙ, НЕ ИЗМЕРЕННЫЙ. Нет интервью с фермерами и измерений воды, урожая, дохода.
- Presentation: ЛОКАЛЬНО ПОДГОТОВЛЕНА. Рабочая многоязычная демонстрация и 7-slide English PDF; публичное воспроизведение и качество storytelling независимыми судьями не проверялись.
Это оценки аудитора, не баллы жюри.

## Реальные найденные риски / приоритеты
### P0: не доказана официальная конкурсная отправка
Нет проверенного NASA Team Project Tab со статусом SUBMITTED, публичных адресов demo/slides/source и подтверждения регистрации участников. NASA 2026: Project Tab открыт 14–15 ноября, окончание 15 ноября в 23:59 локального времени. Для Universal Event уточнить timezone создателя команды. Участники младше 18: официальные условия требуют регистрации родителем/опекуном и сопровождения; проверьте правила своего event. Эти действия нельзя автоматически зачесть только по локальным тестам.
Источники: https://www.spaceappschallenge.org/2026/ ; https://www.spaceappschallenge.org/legal/

### FIXED 2026-11-15: картинки в публичной сборке с нестандартным базовым путём
`CropEvidencePanel.tsx` теперь использует `import.meta.env.BASE_URL`, так что четыре SVG-картинки культур правильно открываются на GitHub Pages с подкаталогом. Подтверждено экспериментально: Vite v8 автоматически переписывает все CSS `url('/illustrations/...')` при `VITE_BASE_PATH=/agrosat-test/`; менять эти исходные CSS пути не требуется. Два независимых регрессионных теста: `node scripts/base-path-assets-check.mjs` (root + nested dist, проверяет все десять SVG + две MODIS PNG и CSS/JS ссылки) и `node scripts/nested-base-assets-review.mjs` (real Vite preview, браузер Chrome, 1440/390/320 px, light/dark, реальный локальный API). Все проверки PASS. Тест сборки теперь добавлен в `check_all.ps1` и GitHub Actions workflow. Публичный продакшен-хостинг по-прежнему не проверен.

### P1: production API и CORS не проверены
`frontend/src/api.ts` использует `VITE_API_URL`, backend `CORS_ORIGINS`. На GitHub Pages нельзя использовать локальный Vite proxy. `render.yaml` — конфигурация, а не развёрнутый сервис. Нужны HTTPS backend+frontend, правильные значения переменных сборки и независимый тест без авторизации.

### P1: практическое понимание фермерами не доказано
Тексты уже проще, но automated UI tests ≠ проверка понимания. Особенно узбекский для говорящих на хорезмском варианте языка. Протокол: `docs/IMPACT_USABILITY_PILOT_20261115.md`; тест не проводился, не заявлять итоги.

### P2: научные и UX-границы
- Вариант A — иллюстративный baseline, а не доказанный лучший вариант; B — альтернативный сценарий, не отдельная измеренная ветвь того же эксперимента.
- Вар. C включает отдельную зиму/сезон гороха: ограниченная модель дат не покрывает все сельскохозяйственные календари.
- SMAP numeric soil-moisture был отклонён из-за 0 валидных значений в проверенном наборе; MODIS используется только как изображение, не numeric NDVI.
- Шесть qualitative impact factors — качественные соображения, не количественный прогноз или скоринг урожайности.
- На сайте показываются пояснения и источники, но не все пользователи найдут скрытую исследовательскую информацию без подсказки.
- CI workflow присутствует, но не выполнен в опубликованном AgroSat GitHub repository; нет независимой проверки общего production окружения.
- Web API без rate limiting / независимого pen-test; нет известных npm production advisories, но это не гарантия защищённости.

## Финальные действия по порядку
1. Проверить официальный NASA аккаунт Team Project Tab, участников и срок; сделать submission. **Сохранённый черновик не равен SUBMITTED.**
2. Опубликовать три независимые общедоступные HTTPS-ссылки: исходники, работающий demo и 7 слайдов; открыть без авторизации в приватном окне.
3. Проверить реальные картинки на публичном хостинге с path prefix, base-path fix и локальные браузерные тесты уже PASS.
4. Подтвердить CI на удалённом репозитории; при необходимости run `verify_public_release.ps1` с реальными публичными URL.
5. Позже — 3–5 реальных участников, локальный агроном, валидация почвы/воды и формулировок на узбекском без выдуманных результатов.

## Что НЕ проверено
Фактический NASA Project Tab, общедоступный деплой, юридическая/лицензионная чистота каждого мультимедийного элемента, реальная агрономическая эффективность и продуктивность под нагрузкой. Везде статус UNKNOWN, а не PASS.

## Запуск повторного аудита
- `D:\AgroSat\check_all.ps1`
- `D:\AgroSat\research\audit_matrix_full_20261115.py`
- Результаты второго теста: `D:\AgroSat\artifacts\AgroSat_independent_api_audit_20261115.json`
