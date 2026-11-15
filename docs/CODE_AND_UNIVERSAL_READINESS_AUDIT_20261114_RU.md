# AgroSat — независимый технический и конкурсный аудит
**Дата аудита: 14 ноября 2026** · Рабочая папка `D:\AgroSat`
**Challenge:** NASA Space Apps 2026 — Field Shift: Adapting Farms with NASA Data
**Область:** Хорезм, координаты пилотной точки 41.55°N, 60.62°E (близ Ургенча)
**Режим:** Локальная проверка, не публикация и не отправка в NASA.

## 1. Итог без рекламных формулировок

- **Реально работает:** Python/FastAPI + React/TypeScript, проверенные JSON NASA 2000–2025, климатические показатели, сравнение трёх исследовательских вариантов A/B/C, шесть качественных критериев, локальные источники ICARDA, две темы и три языка.
- **Научный уровень:** прозрачный учебно-исследовательский comparison / screening tool; **не** численный урожайный прогноз, оптимизатор воды, точная карта NDVI или система рекомендаций по конкретному полю.
- **Код:** выполнены серьёзные проверки и исправления; после очередного `check_all.ps1` закрепляются конкретные итоги. Чистый аудит кода не может гарантировать отсутствие любых ошибок в непроверенных сценариях.
- **Конкурс NASA Universal:** **полное соответствие НЕ ПОДТВЕРЖДЕНО**. Критически важный блокер: для Universal Event на Global Judging нужны минимум **2 зарегистрированных участника**, тогда как из известных нам условий дочь работает одна. NASA account/Project Tab/состав команды не просматривали. Публичной демонстрации, GitHub remote и отправленного NASA Project Tab пока нет.
- **Ресурсы:** GO Team требует **как минимум один из NASA data sources в Resources выбранного задания**, а не весь каталог. NASA POWER/GPM-IMERG подходят по назначению, оригинальные файлы проверяются и расчёты используют их реально. Полнота ссылок/кредиты в Project Tab ещё не подтверждены.

## 2. Кодовая база: результаты анализа программных принципов

### A. Single Responsibility / Separation of Concerns
| Модуль | Ответственность | Аудит |
|---|---|---|
| `backend/app/repository.py` | чтение и проверка NASA рядов, сводки год/месяц/75-дневные окна | PASS, кеширование дорогих операций; расчёты находятся вне React |
| `backend/app/service.py` | сборка A/B/C сценариев из данных и вводов пользователя | PASS для качественного объяснения; разделить на меньшие функции можно при последующем развитии |
| `backend/app/impact.py` | шесть качественных критериев | PASS, неизвестный идентификатор отсекается |
| `backend/app/evidence.py` | единый реестр аргументации A/B/C и ссылки | PASS, добавлены NASA методологические URL |
| `backend/app/schemas.py` | строгие запросы и ответы | PASS, отказ от лишних полей, несуществующих дат/пустых собственных ротаций, типизация ID/status |
| `backend/app/main.py` | API и CORS | PASS, response_model на data/evidence, никакой бизнес-логики в контроллере |
| `frontend/src/App.tsx` | маршрутизация экранов, данные API, состояние пользователя | PASS для доступных сценариев; при росте кода можно выделить `useFarmComparison` / `useClimate` |
| `frontend/src/components/` | визуальные компоненты и формы | PASS: scientifique text codes/отображение отделены |
| `frontend/src/scienceText.ts` | одна функция перевода научных кодов | Исправлено дублирование локализации в Compare и Spotlight |
| `frontend/src/styles/` | стили по смысловым блокам | 40KB монолитный CSS без изменения каскада разделён на foundation/comparison/jury-polish |

### B. Data validation & fail-closed
- Pydantic `ComparisonRequest` валидирует значения, дату, 300-символьную строку севооборота, отсекает неизвестные ключи; для custom baseline теперь нужно ненулевое описание, иначе HTTP 422.
- У неизвестного scenario ID теперь явный ValueError, а не скрытый fallback в C. Response-model не позволит незаметно отдать некорректный ID/status/размер месячного массива.
- На React пустой custom baseline отмечается и блокирует кнопку; текст доступен на EN/RU/UZ.
- `repository.py` использует оригинальные JSON, проверяет совпадение дат и пропуски, manifest SHA256; new provenance tests дополнительно сравнивают фактический NASA API version/time standard/coordinates/parameter identities.
- Тесты не проверяют отсутствующие по смыслу натурные измерения ECe, сортоустойчивости и экономических результатов. Эти параметры **по-прежнему Unknown**.

### C. Reliability & concurrency
- Исправлена гонка React: ответы `/api/compare`, пришедшие позже, больше не перезаписывают состояние для более новых вводных. Это проверяется браузерным тестом с задержанными и внеочередными ответами.
- `/api/evidence` теперь грузится отдельно от сравнения; сбой библиографии не отключает NASA показатели и A/B/C.
- Аналогично `/api/climate/{year}` и `/monthly` не зависят от одновременного успеха обоих запросов.
- Кеш на год/месяц/историческую дату посева помогает отзывчивости без изменения вычислений.
- Риск на будущее: пользовательские ошибки API всё ещё отображаются в общем блоке; для production улучшить разделение научных и сетевых ошибок, добавить CSP/security headers и мониторинг ошибок с минимизацией пользовательских данных.

### D. Tests & software supply chain
- Набор научных/контрактных тестов расширен с 35 до **49**. Тесты проверяют оригинальные NASA ряды, 9497 дней, отсутствие пропусков, валидность дат, типы API, публичное происхождение NASA и отдельное время для сидерата.
- Три языка: **783 структурные проверки строк** (наличие ключей и интерполяций). Это **не** лингвистическая экспертиза носителя узбекского/агронома.
- Frontend production TS build, `oxlint`, 7 реальных API сценариев / 1,065 научных ссылок, 4 Chrome-сценария: UI, тема, NASA-jury, гонки API. Результат зафиксирован в разделе 7 после последнего запуска.
- `pip check` не показывает конфликтов установленных зависимостей.
- `npm audit --omit=dev` на 14 ноября показал 0 предупреждений для production-пакетов. Это **не** полный software security penetration test.
- Одно неблокирующее предупреждение `StarletteDeprecationWarning` от тестового клиента FastAPI/httpx.
- Системы GitHub Actions пока не исполнялись на публичном репозитории (remote отсутствует): локальный Python 3.14, CI запланирован на 3.13; после публикации нужен независимый CI PASS.

### E. Open issues (не выдавать за PASS)
- Мониторинг/логирование ошибок production, CSP/security headers, независимый деплой и работающий публичный HTTPS endpoint отсутствуют.
- Дублирующая legacy route `/api/sources` и главный `/api/evidence`: полезно постепенно объединить в одном каталоге, не ломая клиентов.
- UI accessibility: keyboard focus and tested contrasts есть, но **полного WCAG аудита, screen-reader и RTL-тестов нет**.
- В реальных данных нет polygon per farm, количественной/QA NDVI, ECe или подтверждённого water-volume. Не пытаться заполнять их числами «для красоты».
- Нет измеренных crop thresholds for Durdona, wheat, cotton, winter pea across water/salinity/soil/temperature. Пункт требований задания «crop characteristics» выполнен лишь **частично**.

## 3. Научный аудит Хорезмской области — пересмотрено
Подробный реестр документов: `docs/KHOREZM_SCIENTIFIC_VERIFICATION_20261114_RU.md`.

| Факт | Источник | Как используется |
|---|---|---|
| Хорезм — орошаемые земли нижней Амударьи, с важными проблемами грунтовых вод/засоления/дренажа | Water (2018) https://www.mdpi.com/2073-4441/10/2/208 | Региональный контекст и **Unknown** в оценке ECe, не прогноз засоления |
| Durdona mung bean ~70–75 дней после июньского сбора пшеницы при благоприятных условиях | ICARDA 2022 https://mel.cgiar.org/reporting/download/hash/fba943f8c8f8343218dfcf56484114a8 | Модель 75-дневного **исторического погодного окна**, не срок для каждого сорта |
| Озимый горох как сидерат после уборки маша | ICARDA/GIZ 2023 https://mel.cgiar.org/reporting/download/hash/6b054f0772e3ad9f8cd6d8b3e76af588 | В C добавлено самостоятельное предупреждение о сезонной стадии |
| Станционный климат Ургенча и Хорезмской области | Узгидромет https://hydromet.uz/sites/default/files/inline-files/Климат_сайт_рус_2022.pdf | Контекст; **число 109.7 мм для станции в 2025 пока не подтверждено** |
| Реестр контуров посевов, культур, урожая, водопотребления | Минсельхоз Узбекистана https://gov.uz/ru/agro/pages/ochiq-ma-lumotlar-reyestri | Ресурсы найдены, **не загружены по отдельным полям** |
| Открытая сельхоз ГИС / геопортал | https://gov.uz/ru/agrosanoat/pages/geoaxborot-tizimi | Возможный P2 геопространственный источник, без добавления вымышленной карты |
| Общий забор воды для орошения по Узбекистану | https://siat.stat.uz/data/3506/?lang=en | **Национальный агрегат, НЕ вода конкретного канала Ургенча** |

NASA исходники физически содержат:
- 2000–2025, ровно **9497 дней** без пропущенных записей;
- `IMERG_PRECTOT` через NASA POWER Daily API **v2.10.3**, source IMERG, UTC, миллиметры/сутки;
- `T2M_MAX`, `T2M_MIN` из MERRA2/POWER, °C, UTC, данные реанализа, не локальный термометр;
- точку `41.55N, 60.62E`, координаты в GeoJSON `[60.62,41.55,100.94]`;
- суммарные осадки 2025 года **94.47 мм** (NASA оценка на пространственной сетке; не подвод поливной воды).
NASA POWER методика: https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/
NASA Daily API: https://power.larc.nasa.gov/docs/services/api/temporal/daily/
Растительность MODIS/GIBS показывается на двух PNG за 2025, не является измеренной числовой NDVI картой отдельного поля.

**Ограничение опытов:** A — иллюстративный baseline, B — исследовательская альтернатива, C — сидерат после маша. Публикация 2023 **не** сравнивала все три варианта как отдельные равнозначные группы. Устойчивость к соли, прибыль, yield и вода на конкретном участке не подсчитаны.

## 4. NASA Field Shift Resources & соответствие заданию

Полный 24-позиционный исходный список со статусами:
`docs/NASA_FIELD_SHIFT_RESOURCE_COMPARISON_20261114_RU.md` и V10 screenshot archive.
Официальная динамическая вкладка Resources повторно не открылась через публичный веб-поиск (Cache miss); поэтому нельзя честно заявлять, что в ходе **этого** аудита просмотрена каждая URL из её DOM. Названия ресурсов сверены с сохранёнными официальными скриншотами и описаниями организаторов.

### Реально используются NASA
| NASA family в Resources | Статус кодовой реализации | Научная роль |
|---|---|---|
| NASA GPM/IMERG | **ГОТОВО** — NASA POWER `IMERG_PRECTOT` | ежедневные и месячные осадки, региональные исторические показатели |
| NASA POWER | **ГОТОВО** — T2M_MAX/T2M_MIN | жара/заморозки/75-дневные окна |
| Landsat/MODIS/VIIRS | **ЧАСТИЧНО** — NASA GIBS/MODIS PNG | только качественное визуальное представление региона |
| NASA SMAP | **в архиве**, не numeric analysis | будущая региональная влага при QA |
| SRTM / ECOSTRESS / GLDAS / GEDI | **не подключены** | optional, не обязательны для Хорезма |
| FAO GAEZ, ESA Sentinel-2, ERA5 | **в архиве**, не numeric analysis | optional extra source; не заменяют NASA source |
| USA-only USDA WSS/CDL, PRISM, SSURGO, NAIP, USGS NLCD, NWIS, USDA NASS, AMS, OpenET, LANDFIRE и т.п. | **не подключены** | в большинстве случаев США, переносить цифры в Хорезм ошибочно |

GO Team 2026: **как минимум один NASA dataset из официального Resources** обязателен для Global Awards; дополнительные NASA/agency data рекомендованы, не обязательны. Цитировать абсолютно всё использованное, включая код, снимки и AI tools:
https://github.com/nasa/spaceapps/discussions/1827
https://github.com/nasa/spaceapps/discussions/1849

### Оценка относительно сути Field Shift
| Составляющая | Итог |
|---|---|
| Decision support tool | **ДА, локальный качественный MVP** |
| NASA Earth observation | **ДА, числовой IMERG/POWER + визуальный MODIS** |
| Реальная география/возможности Хорезма | **ДА — региональный research context**, но нет полевых сенсоров |
| Crop characteristics (вид/сорт/водный спрос/соль/температурные границы) | **ЧАСТИЧНО** — литература, без полноценной таблицы порогов |
| Local soil (ECe, pH, texture, organic carbon) | **ЧАСТИЧНО** — ручной high/low/unknown, без measured ECe |
| Farmer priorities | **ДА** — вода/почва/доход как поясняющие цели, не количественный оптимизатор |
| Existing vs A/B/C rotations | **ЧАСТИЧНО** — A может быть реальным текстом, но точные свойства A не высчитываются |
| Soil health/yield/water savings evidence | **ЧАСТИЧНО** — qualitative risk flags, **НЕ calibrated improvements** |
| References, transparency, reproducibility | **ДА в приложении**, для NASA Project Tab нужна отдельная полная citation matrix |

## 5. 2026 Universal Event — критические правила и препятствия

**Не путать Universal Event с виртуальным Local Event.** Условия доступа к Global Judging имеют отличия.

1. **TEAM SIZE: CRITICAL / NOT CONFIRMED.** Официальный ответ NASA GO Team 11 ноября 2026: Universal Event team **минимум 2 участника**, максимум 6 для Global Judging. Команда с одной участницей не соответствует Universal Global Judging даже при отличном сайте. Для Virtual Local Event это Universal-specific правило не действует, но нужно проверить выбранный event и статус регистрации каждого.
   https://github.com/nasa/spaceapps/discussions/1938
   https://github.com/nasa/spaceapps/discussions/1947
2. **Участница 15 лет**: NASA Participant FAQ 2026 требует регистрации несовершеннолетней через родителя/опекуна, сопровождения во время мероприятия и исключения узнаваемого имени, голоса и изображения несовершеннолетней из публичного проекта/видео.
   https://www.spaceappschallenge.org/resources/participant-faqs/
3. **Время:** официально старт работы 14 ноября 09:00 local event / Team Owner locale (Universal), дедлайн **15 ноября 2026, 23:59** local. Research и подготовка до старта разрешены, конкурсное программирование до старта — риск дисквалификации. Локальный первый коммит разработки был после 09:00 14 ноября, но Git сам по себе **не доказательство**, что до старта никто ничего не делал.
   https://github.com/nasa/spaceapps/discussions/1827
   https://github.com/nasa/spaceapps/discussions/1973
4. **NASA DATA:** минимум один источник из заданных NASA Resources; он используется, но URL original product/API and attribution должны быть заполнены в Project Tab.
5. **DEMO:** видеоролик до 30 секунд **или** презентация до 7 слайдов, английский язык в Project Tab/слайдах, английские субтитры если видео не на английском. Годовой Project Submission Guide 2026 объявлен на 13 ноября, но прямой открываемый `project-submission-guide` показывает **дату 2025**, поэтому точные поля 2026 проверить на сайте в Team Project Edit.
   https://github.com/nasa/spaceapps/discussions/1973
   https://www.spaceappschallenge.org/resources/project-submission-guide/
6. **AI disclosure / branding:** ChatGPT использован в кодировании, переводах, исследовании, тестах, документации и должен быть указан вместе с ресурсами. Приложение **не AI-based**. NASA GO Team требует указать AI-generated code/data, AI-generated image/video должен быть отмечен; не использовать AI-generated материалы с логотипом NASA или миссионными эмблемами.
   https://github.com/nasa/spaceapps/discussions/1849
7. **PUBLICITY / SUBMISSION:** сейчас репозиторий локальный и удалённого `origin` нет; frontend и FastAPI доступны только на `127.0.0.1`. Конкурсной публичной демо, презентации и статуса `Submitted for Judging` **нет**. Публичная ссылка и реальная отправка обязательнее научного расширения.
   https://github.com/nasa/spaceapps/discussions/1973
8. **THEME:** официальное краткое задание `Field Shift: Adapting Farms with NASA Data` — про научный инструмент для севооборотов, не про обязательную нейросеть. Тема соответствует; **полнота научной модели частична**.

### Judging criteria
NASA использует пять направлений: **Impact, Creativity, Validity, Relevance, Presentation**. Для AgroSat: Impact — проблема Хорезма, Creativity — объяснимое решение на NASA data, Validity — reproducible API и honesty unknowns, Relevance — NASA as mathematical driver, Presentation — первый экран и demo. Источник открытый NASA guide `https://www.spaceappschallenge.org/resources/judging-awards-guide/` имеет **дату 2025**, поэтому не выдавать старый текст за актуальную редакцию 2026 без подтверждения guide 2026.

## 6. Минимальный порядок завершения — не распыляться

| Приоритет | Работа | PASS критерий |
|---|---|---|
| **P0-1** | Узнать выбранный Universal/Local Event и число зарегистрированных участников, уточнить регистрацию несовершеннолетней | В NASA Team Members / Event видно корректный состав; для Universal >=2 |
| **P0-2** | Публичный GitHub + HTTPS frontend + HTTPS Python backend, корректные CORS, `VITE_API_URL`, origin, без логинов | Открывается инкогнито; `/api/health`, сравнение, NASA imagery, источники, язык/тема |
| **P0-3** | Дать Project Tab точные NASA product names, даты/координаты/API version, ICARDA ссылки, credits images/code, AI usage | Источники проверяются и публично доступны, нет NASA-мнимого endorsement |
| **P0-4** | 7 английских слайдов **или** 30-секундное видео; лучше слайды без лица/голоса/имени ребёнка | Открывается публичная ссылка, ясно показана польза, NASA данные и ограничения |
| **P0-5** | Заполнить Project Tab, сохранить, реально нажать Submit for Judging и проверить подтверждение до дедлайна | Статус отправки, не Draft, ссылки работают |
| P1-1 | Структурировать фактическую ротацию / даты пшеница–маш–сидерат–хлопок | Сценарий C проверяет сезонный календарь, неполные поля помечены unknown |
| P1-2 | Полевые измерения объёма полива м³/га и ECe почвы/дата/глубина, характеристики сорта Durdona | Нет ложных выводов; flags зависят от реальных вводов |
| P2 | Числовой NDVI/SMAP/FAO WaPOR с QA, независимый Узгидромет station-vs-grid, независимый агроном/узбекский переводчик | Достоверные данные, методика, источник, оговорка масштаба |
| P3 | CI security hardening, полноценные accessibility/e2e, расширить диагностику API | Только после публичной сдачи; не ломать локальный MVP |

## 7. Контрольное тестирование и воспроизведение

На 2026-11-14 после текущих правок:
- **49 Python тестов** + 1 сторонний Starlette/httpx deprecation warning;
- **783** структурных проверок EN/RU/UZ, **7 API scenarios / 1086** explanation refs;
- `oxlint` 0 warnings/errors, TS/Vite production build PASS;
- браузер: 4 smoke suites (EN/RU/UZ and full source trace; Light/Dark/contrast; jury navigation; artificial delayed API and evidence outage) PASS;
- `pip check`: **no broken requirements**; `npm audit --omit=dev`: 0 current production vulnerability reports;
- исходные NASA JSON: SHA256 unchanged, 9497 dates, 94.47mm in 2025.
**THIS IS A LOCAL TECHNICAL PASS, NOT CLINICAL/AGRONOMIC FIELD VALIDATION OR NASA SUBMITTED STATUS.**

Команда для повторения после запуска обеих служб:
```powershell
cd D:\AgroSat
.\check_all.ps1
```

**Documentation:** `docs/KHOREZM_SCIENTIFIC_VERIFICATION_20261114_RU.md`, `docs/NASA_FIELD_SHIFT_RESOURCE_COMPARISON_20261114_RU.md`, `docs/MASTER_STATUS_AND_FINISH_PLAN_20261114_RU.md`.
