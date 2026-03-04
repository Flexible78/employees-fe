# Отчет по заданию лектора: StatisticsLineChart

## Что было в задании
Нужно было сделать 3 вещи:

1. Создать `StatisticsLineChart` как переиспользуемый компонент для любой числовой статистики.
2. Переделать `SalaryStatisticsPage`, чтобы он использовал этот новый компонент.
3. Переделать `AgeStatisticsPage`, чтобы он тоже использовал этот новый компонент.

---

## Что сделано по шагам (очень просто)

### Шаг 1. Создан общий компонент графика
Файл: `src/components/StatisticsLineChart.tsx`

Главная идея:
- раньше логика рисования графика была прямо в `SalaryStatisticsPage`;
- теперь эта логика вынесена в один общий компонент;
- теперь можно просто передавать ему данные и подписи осей.

Что внутри компонента:
- принимает `data` (точки графика) — `src/components/StatisticsLineChart.tsx:11`
- принимает `title`, `xAxisLabel`, `yAxisLabel` — `src/components/StatisticsLineChart.tsx:13-15`
- принимает `isLoading` для спиннера — `src/components/StatisticsLineChart.tsx:12`
- рисует оси, сетку, tooltip, линию — `src/components/StatisticsLineChart.tsx:53-82`
- если данных нет, показывает понятный текст — `src/components/StatisticsLineChart.tsx:46`

Тип точки графика:
- `amount` = сколько сотрудников в диапазоне
- `value` = значение диапазона (например, возрастная граница или зарплатная граница)
- тип описан здесь: `src/components/StatisticsLineChart.tsx:5-8`

---

### Шаг 2. Обновлен SalaryStatisticsPage
Файл: `src/components/pages/SalaryStatisticsPage.tsx`

Что теперь делает страница:
1. Берет список сотрудников — `src/components/pages/SalaryStatisticsPage.tsx:10`
2. Берет зарплаты в массив — `src/components/pages/SalaryStatisticsPage.tsx:13`
3. Делит зарплаты по группам (интервалам) через `lodash` — `src/components/pages/SalaryStatisticsPage.tsx:16-24`
4. Передает готовые точки в `StatisticsLineChart` — `src/components/pages/SalaryStatisticsPage.tsx:28-35`

Проще говоря:
- страница теперь только считает данные;
- рисование графика полностью делает общий компонент.

---

### Шаг 3. Обновлен AgeStatisticsPage
Файл: `src/components/pages/AgeStatisticsPage.tsx`

Что добавлено:
1. Функция расчета возраста из даты рождения — `src/components/pages/AgeStatisticsPage.tsx:10-25`
2. Расчет статистики возрастов по интервалам (по 10 лет) — `src/components/pages/AgeStatisticsPage.tsx:8, 30-44`
3. Передача данных в тот же `StatisticsLineChart` — `src/components/pages/AgeStatisticsPage.tsx:47-53`

Проще говоря:
- мы берем возраст каждого сотрудника;
- группируем людей по десятилетиям (0-10, 11-20, 21-30...);
- показываем линию: где сотрудников больше, а где меньше.

---

## Объяснение «как для младенца»
Представь коробки.

Для зарплаты:
- одна коробка для зарплат до первого порога,
- вторая коробка для следующего порога,
- и так далее.

Для возраста:
- коробка 0-10,
- коробка 11-20,
- коробка 21-30...

Дальше:
- кладем каждого сотрудника в правильную коробку,
- считаем, сколько людей в каждой коробке,
- соединяем точки линией на графике.

Вот и вся статистика.

---

## Что стало лучше после рефакторинга
1. Нет дублирования кода графика между страницами.
2. Легко сделать третью страницу статистики (например, стаж) — нужно только посчитать `data`.
3. Общий компонент сам обрабатывает `loading` и `empty state`.

---

## Как проверить руками
1. Открыть `/statistics/salary` — должен быть график распределения зарплат.
2. Открыть `/statistics/age` — должен быть график распределения возрастов.
3. Убедиться, что при загрузке показывается спиннер.
4. Убедиться, что tooltip отображается при наведении.

---

## Техническая проверка
Запущена команда:

```bash
npm run build
```

Результат:
- TypeScript компилируется без ошибок
- Vite build выполняется успешно

---

## Коммиты по шагам
1. `5d3bed9` - создан reusable-компонент `StatisticsLineChart`
2. `5ba70a6` - `SalaryStatisticsPage` переведен на `StatisticsLineChart`
3. `b8ea681` - `AgeStatisticsPage` переведен на `StatisticsLineChart`

