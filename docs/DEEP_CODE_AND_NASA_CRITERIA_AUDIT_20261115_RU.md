# AgroSat Uzbekistan — независимый повторный аудит исходного кода и NASA Space Apps 2026
Дата: 2026-11-15. Аудируемый Git-коммит: e8eac83. Рабочая папка: D:\AgroSat. Только чтение/проверка продуктового кода; никакая бизнес-логика не менялась.

## 1. Верифицированные результаты
- Повторный запуск check_all.ps1: **ALL LOCAL AGROSAT QUALITY GATES: PASS**, процесс exit code 0 (~42.27 s). Внутри 92/92 pytest, 1 стороннее StarletteDeprecationWarning, 0 lint errors/warnings, TypeScript/Vite build PASS, 1125 структурных проверок строк EN/RU/UZ, реальный браузер Chrome и API, 18 объяснений матрицы, мобильные 320/390 px, темы, источники, несовпадения календаря и невалидные измерения.
- Независимый короткий API-аудит: 5 валидных пользовательских сценариев (no water, limited, available, unknown, custom baseline) дают HTTP 200 с вариантами A/B/C и шестью измерениями; 6 невалидных запросов дают HTTP 422.
- NASA original SHA-256 values match source manifest. Annual 2025: 94.47 mm precipitation; 21 Tmax >=40C days; 115 Tmin <=0C days. 2025 monthly rounded totals sum to 94.5 mm.
- Пример периода 15 августа: 26 годовых окон, 75 суток, среднее 2.3 очень жарких дней и заморозки в 13/26 годов; это история, не прогноз.
- Python pip check: No broken requirements found. npm audit --omit=dev: found 0 vulnerabilities. Не является тестом безопасности эксплуатации.
- После удаления листьев: браузерные снимки 1440/390 px в светлой и тёмной темах; проверено отсутствие ссылки на ботанический SVG и горизонтальной прокрутки.
- Git status clean на момент начала аудита, локального remote нет. Подключённый GitHub доступен только для thezxcc/Elder_Uz; нет опубликованного AgroSat из данного подключения. Не подтверждены публичный HTTPS-деплой и NASA submitted status.

## 2. Реальный код и архитектура
- FastAPI /api/health /api/climate/{year} /monthly /api/compare /api/evidence /api/crops /api/sources.
- repository.py валидирует даты и полноту NASA daily JSON, для 75-дневного окна вычисляет исторический диапазон осадков, жару и наличие заморозков. lru_cache ограничен.
- Pydantic ComparisonRequest: enum, extra forbid, дата, объемы/источники/единицы; неверные inputs отклоняются; нет скрытой подстановки неизвестных измерений. API CORS настроен явно через CORS_ORIGINS.
- service.py A — исследовательская иллюстрация либо пользовательский baseline; B — дополнительный маш; C — маш и отдельный зимний сидерат до хлопчатника. Никто не является гарантированным победителем. Impact matrix = 6 категориальных измерений, нет поддельной урожайности/водной экономии.
- frontend UI: инкрементальные формы FarmerEasy, detailed panels, state/revision checks against out-of-order API responses; readable three languages and two themes.
- CI yaml есть, но удалённый CI не выполнялся.
- Развёртывание Render backend требует CORS_ORIGINS; frontend в production требует VITE_API_URL, т.к. Vite dev proxy не существует в хостинге.

## 3. NASA Field Shift — соответствие
- Действительный decision-support prototype: PASS.
- NASA Earth observations: PASS — GPM IMERG_PRECTOT через NASA POWER daily and NASA POWER T2M_MAX/T2M_MIN; точка 41.55 N,60.62 E, 2000–2025, 9497 суток. NASA GIBS/MODIS лишь визуальный контекст; числовые NDVI/SMAP не интегрированы.
- Local soil information: PARTIAL — ввод ECe/pH, reported lab data, source/date/depth; нет локальных лабораторных измерений или пространственной карты.
- Crop characteristics: PARTIAL — опубликованные FAO/ICARDA свойства, сортовые сроки Durdona; нет местных коэффициентов урожайности/солевой толерантности и проверки всех культур.
- Farmer priorities: PASS — water/income/soil and equipment, crop dates, existing rotation.
- Strengthen soil health/adapt farms: QUALITATIVE PILOT ONLY — варианты и риски; нельзя утверждать фактическую экономию воды, улучшение soil health или прибыль.
- Availability and award eligibility: BLOCKED/UNKNOWN — фактическая подача NASA, публичные ссылки и подтверждённые участники/дедлайн не проверены.

## 4. Соответствие пяти критериям NASA
- RELEVANCE — высокая: явное попадание в задание, farmer priorities, rotation paths, NASA climate.
- VALIDITY — хорошая техническая/источниковая верификация; агрономическая валидность ограничена отсутствием замеров, независимой станции/ground truth и полевого pilot.
- PRESENTATION — прототип многоязычный, responsive, 7 английских слайдов; качество 7-slide demo и Storytelling не оценивались независимым жюри. Успешная локальная загрузка не гарантирует доступную презентацию онлайн.
- CREATIVITY — пользовательский понятный объяснимый интерфейс плюс честные Unknown, но novelty относительно других подобных спутниковых crop rotation apps не доказана. Декоративная графика не является инновацией сама по себе.
- IMPACT — актуальная региональная задача и actionable checklist, но нет проверки comprehension реальными фермерами, внедрения, измеренного уменьшения потерь/экономии полива.

## 5. Найденные ограничения и конструктивные проблемы
[P1] Несогласованность статусов при water=limited: impact.py water dimension -> risk для B/C; service.py candidate() маркирует B/C общим status=needs-data, а не water-risk, хотя детали предупреждают об ограничении воды. Для самого простого пользовательского пути это неоднозначный сигнал. Не меняли код во время аудита.
[P1] «Простой помощник» отображает по ответам высокоуровневое правило и список следующих проверок; нет независимой реальной оценки понимания фермерами. UI слова «Your next step» не должны превращаться в обещание точной рекомендации.
[P1] Календарная валидация stage C фиксирует green_manure_sowing_date в season_year, green_manure_end_date и cotton_sowing_date в season_year+1; не поддерживает все аграрно возможные варианты дат. Это особенность сферы модели и текущих тестов, не доказательство неправильного календаря представленного примера.
[P1] Источники не калибровались независимо с сопоставимым периодом станционных осадков/температуры Ургенча; спутниковые пиксели ~10 km и переанализ нельзя выдавать за поле.
[P1] Нет числовой агрономической проверки урожайности/водопотребления/засоления; используемые 6 категорий отражают условную правдоподобность, не score superiority.
[P0] Нет remote GitHub AgroSat, HTTPS публичного сайта, подтверждённой NASA Project Tab submitted и подтверждённых двух участников в одной команде. Дедлайн — 2026-11-15 23:59 по применимому местному времени Team Lead (Universal Event). Техническая локальная готовность НЕ равна конкурсной подаче.
[P2] Python dependencies в requirements заданы диапазонами, не lockfile; локальная среда могла отличаться от Python 3.13 в CI. Нужно воспроизводимое деплой-окружение, но до дедлайна не переписывать научную логику.
[P2] No CSP/security headers, production exception monitoring, independent WCAG/screen reader audits. npm audit 0 не равно pen-test.
[P2] Подробный режим может быть сложным для нетехнического фермера; улучшения текста после независимого usability test.
[P2] Разделен /api/evidence и /api/sources, повторенная source metadata. Неблокирующий долг технической поддержки.

## 6. Следующие действия по приоритету
1. P0 Опубликовать доступный на HTTPS продукт/исходный код и 7 слайдов, проверить без логина, связать backend CORS и frontend VITE_API_URL.
2. P0 Проверить NASA Team Project Tab, членов команды, английское объяснение NASA sources+limits+AI disclosure, нажать Submit for Judging и получить подтверждение статуса.
3. P1 После обеспечения подачи исправить ограниченный полив -> согласовать статус и матрицу; проверить минимум одним реальным человеком без технического опыта (не выдумывать тестовые результаты).
4. P2 При следующих итерациях — field trials/агроном, QA NDVI, сравнение с локальной метеостанцией и soil samples, прод-логирование и независимый CI.

## Официальные и научные страницы (проверены через веб в ходе текущего аудита)
- https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/
- https://www.spaceappschallenge.org/2026/
- https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/
- https://github.com/nasa/spaceapps/discussions/1973

Вывод: это качественно проверенный учебно-научный работающий MVP для NASA Field Shift, не field-validated agriculture product. Нет доказательств фактической конкурсной подачи.
