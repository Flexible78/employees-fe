# Отчет об изменениях за 2026-03-09

## Задание
Implementation of querying Employee objects according to the following filters:
- department
- minimal salary
- maximal salary
- minimal age
- maximal age
If all employees should be retrieved, no filters are used.
Update component HomePage.
Update useEmployees hook.
Update implementation of the method getEmployees in the class ApiClientJsonServer.

## Что сделано по заданию
1. HomePage получает значения фильтров из zustand-стора и передает их в `useEmployees`, поэтому список сотрудников пересчитывается при изменении фильтров.
2. `useEmployees` теперь сначала нормализует полный объект фильтров в `activeFilters`: все дефолтные значения выбрасываются, а если активных фильтров не осталось, в `apiClient.getEmployees(...)` уходит `undefined`. Это строго выполняет условие задания: если нужны все сотрудники, фильтры не используются.
3. `ApiClientJsonServer.getEmployees` теперь принимает только `ActiveFilters` и формирует параметры запроса для json-server только по реально активным полям. Детали: `department` передается как `department`; `minSalary` → `salary_gte`, `maxSalary` → `salary_lte`; `minAge` → `birthDate_lte`, `maxAge` → `birthDate_gte` через `getIsoDateFromAge`. Если активных фильтров нет, запрос идет без `params`, поэтому возвращаются все сотрудники.
4. Нормализация данных по дате рождения: из ответа API приводятся варианты `birthDate / birthdate / dateOfBirth` к единой дате, дублируя поле в ответе, чтобы UI стабильно видел дату.

## Дополнительные уточнения
1. `getAge` стал безопаснее для пустых или некорректных дат и корректно учитывает месяц/день при расчете возраста.
2. `getIsoDateFromAge` обрабатывает `NaN` и возвращает корректную ISO-дату (`YYYY-MM-DD`) для фильтрации по возрасту.
3. После исправления проект успешно проходит `npm run build`.
