# `src` строка за строкой: подробный разбор проекта

Этот файл дополняет `PROJECT_EXPLANATION_FOR_BABY_RU.md`.

Там был обзор проекта целиком.
Здесь цель другая: пройти по каждому файлу внутри `src`, привязаться к строкам и объяснить, что именно происходит.

Как читать этот документ:

- `роль файла` - зачем файл вообще существует;
- `связи` - какие файлы он использует и кто использует его;
- `разбор по строкам` - объяснение строк или маленьких блоков;
- `приёмы и понятия` - скрытые языковые и архитектурные идеи.

Важно: разбор соответствует текущему состоянию кода на момент создания файла. Если строки потом сдвинутся, номера в документе перестанут быть точными.

---

## 1. Общая карта `src`

Внутри `src` сейчас есть такие слои:

1. точка входа: `main.tsx`;
2. роутинг: `router/routes.tsx`;
3. страницы: `components/pages/*`;
4. обычные компоненты: `components/*`;
5. служебные UI-обёртки Chakra: `components/ui/*`;
6. модели и типы: `models/*`;
7. конфиг: `config/*`;
8. сервисы и хуки данных: `services/*` и `services/hooks/*`;
9. утилиты: `utils/*`.

Если очень грубо, поток такой:

- `main.tsx` запускает всё приложение;
- `routes.tsx` решает, какая страница открыта;
- страница вызывает компоненты;
- компоненты при необходимости тянут данные через хуки;
- хуки ходят в API-клиент;
- API-клиент общается с сервером.

---

## 2. `src/index.css`

### Роль файла

Это глобальный CSS-файл. Сейчас он очень маленький и нужен для одного правила: выделять активную ссылку.

### Связи

- импортируется в `src/main.tsx:3`;
- влияет на `NavLink`, когда React Router добавляет классу `active` соответствующее имя класса.

### Разбор по строкам

- `src/index.css:1` - начинается CSS-селектор `.active`.
- `src/index.css:2` - активному элементу задаётся `font-weight: bold;`, то есть жирный шрифт.
- `src/index.css:3` - закрывается блок стилей.

### Приёмы и понятия

- `глобальный стиль` означает: правило применяется не к одному React-компоненту, а ко всему приложению.
- класс `.active` здесь особенно полезен вместе с `NavLink`, потому что `NavLink` умеет помечать активный маршрут.
- из-за этого код навигации можно держать простым: логика активной ссылки частично уходит в CSS.

---

## 3. `src/vite-env.d.ts`

### Роль файла

Это служебный TypeScript-файл для Vite.

### Связи

- напрямую в JSX не участвует;
- нужен TypeScript-компилятору.

### Разбор по строкам

- `src/vite-env.d.ts:1` - строка `/// <reference types="vite/client" />` подсказывает TypeScript подключить типы, которые предоставляет Vite.

### Приёмы и понятия

- `d.ts` - это файл деклараций типов.
- он не исполняется в браузере, а только помогает редактору и TypeScript.
- `triple-slash reference` - специальный синтаксис TypeScript для подключения дополнительных типов.

---

## 4. `src/main.tsx`

### Роль файла

Это точка входа приложения. Именно отсюда React начинает рендерить интерфейс.

### Связи

- импортирует глобальный CSS;
- подключает `Provider` из Chakra-слоя;
- подключает `router`;
- подключает React Query.

### Разбор по строкам

- `src/main.tsx:1` - импорт `StrictMode` из React. Это режим дополнительных проверок в разработке.
- `src/main.tsx:2` - импорт `createRoot` из `react-dom/client`. В React 18+ именно так создают корень приложения.
- `src/main.tsx:3` - импортируется `index.css`, чтобы глобальные стили попали в сборку.
- `src/main.tsx:4` - импорт `Provider as ChakraProvider`. Здесь есть `alias`: локально компонент называется `ChakraProvider`, хотя экспортируется как `Provider`.
- `src/main.tsx:5` - импорт `RouterProvider`, который показывает нужную страницу по текущему URL.
- `src/main.tsx:6` - импорт готового объекта `router`.
- `src/main.tsx:7` - импорт `QueryClient` и `QueryClientProvider` для работы React Query.
- `src/main.tsx:8` - пустая строка для визуального разделения импортов и основного кода.
- `src/main.tsx:9` - `createRoot(document.getElementById('root')!).render(` ищет элемент `root` в HTML и начинает рендер.
- `src/main.tsx:9` - здесь используется оператор `!` после `getElementById('root')`.
- `src/main.tsx:10` - всё приложение оборачивается в `StrictMode`.
- `src/main.tsx:11` - сверху добавляется Chakra-провайдер.
- `src/main.tsx:12` - внутрь вкладывается `QueryClientProvider client={new QueryClient()}`.
- `src/main.tsx:13` - ещё глубже кладётся `RouterProvider router={router}`.
- `src/main.tsx:14-15` - закрываются провайдеры.
- `src/main.tsx:16` - закрывается `StrictMode`.
- `src/main.tsx:17` - закрывается вызов `render`.

### Приёмы и понятия

- `оператор !` называется `non-null assertion`. Он говорит TypeScript: "я уверен, что `root` существует".
- `Provider`-обёртки - это способ дать общие возможности всем компонентам ниже.
- `new QueryClient()` создаёт объект кеша для запросов.
- здесь провайдеры вложены как матрёшки: тема -> запросы -> роутер.

### Что полезно заметить

- код короткий, но стратегически главный: если этот файл сломается, не поднимется всё приложение.
- в текущей реализации `QueryClient` создаётся прямо внутри JSX. Это рабочий вариант, но чаще его выносят в отдельную переменную.

---

## 5. `src/router/routes.tsx`

### Роль файла

Здесь описано дерево маршрутов приложения.

### Связи

- используется в `src/main.tsx:6`;
- импортирует все страницы;
- связывает URL и страницу.

### Разбор по строкам

- `src/router/routes.tsx:1` - импорт `createBrowserRouter`.
- `src/router/routes.tsx:2-7` - импорт страниц: `HomePage`, `AgeStatisticsPage`, `SalaryStatisticsPage`, `DepartmentStatisticsPage`, `LayoutPage`, `AddEmployeePage`.
- `src/router/routes.tsx:8` - начинается создание объекта роутера.
- `src/router/routes.tsx:9-27` - описывается корневой маршрут и его дочерние маршруты.
- `src/router/routes.tsx:10` - корневой путь `/`.
- `src/router/routes.tsx:11` - для корня используется `LayoutPage`, то есть общий каркас.
- `src/router/routes.tsx:12` - начинается массив `children`.
- `src/router/routes.tsx:13` - пустой дочерний путь `""` означает домашнюю страницу внутри корня.
- `src/router/routes.tsx:14` - путь `add` ведёт на форму добавления.
- `src/router/routes.tsx:15-24` - вложенный раздел `statistics`.
- `src/router/routes.tsx:16` - общий сегмент пути `statistics`.
- `src/router/routes.tsx:17` - начинаются дочерние маршруты статистики.
- `src/router/routes.tsx:18` - `statistics/age`.
- `src/router/routes.tsx:19` - `statistics/salary`.
- `src/router/routes.tsx:20-23` - `statistics/department` вынесен в объект на несколько строк.
- `src/router/routes.tsx:28` - закрытие вызова `createBrowserRouter`.
- `src/router/routes.tsx:29` - экспорт роутера по умолчанию.

### Приёмы и понятия

- `вложенный роутинг` позволяет иметь общий каркас и менять только содержимое через `Outlet`.
- `path: ""` - специальная запись для индексного содержимого родительского маршрута.
- это пример `декларативного описания`: мы не пишем `if (url === ...)`, а просто описываем структуру данных.

---

## 6. `src/components/pages/LayoutPage.tsx`

### Роль файла

Общий каркас для всех страниц. Он не является конкретным экраном по смыслу, а скорее рамкой: сверху шапка, ниже активная страница.

### Связи

- используется в `routes.tsx:11`;
- импортирует `AppBar`;
- использует `Outlet`.

### Разбор по строкам

- `src/components/pages/LayoutPage.tsx:1` - импорт `Box` из Chakra.
- `src/components/pages/LayoutPage.tsx:2` - импорт `Outlet` из React Router.
- `src/components/pages/LayoutPage.tsx:3` - импорт `AppBar`.
- `src/components/pages/LayoutPage.tsx:5` - объявление функционального компонента.
- `src/components/pages/LayoutPage.tsx:6-13` - JSX-разметка.
- `src/components/pages/LayoutPage.tsx:7` - React Fragment `<>...</>` позволяет вернуть несколько элементов без лишнего DOM-узла.
- `src/components/pages/LayoutPage.tsx:8` - всегда показывается `AppBar`.
- `src/components/pages/LayoutPage.tsx:9` - контейнер с верхним отступом.
- `src/components/pages/LayoutPage.tsx:10` - `Outlet` вставляет текущую дочернюю страницу.
- `src/components/pages/LayoutPage.tsx:16` - экспорт компонента.

### Приёмы и понятия

- `Fragment` нужен, когда в JSX требуется вернуть несколько соседних элементов.
- `Outlet` - отверстие в шаблоне, куда роутер вставляет дочерний контент.
- `Box` - универсальный Chakra-компонент-контейнер.

---

## 7. `src/components/pages/HomePage.tsx`

### Роль файла

Это самая простая страница проекта: она только подключает список сотрудников.

### Связи

- используется маршрутом `/`;
- импортирует `Employees`.

### Разбор по строкам

- `src/components/pages/HomePage.tsx:1` - импорт `Employees`.
- `src/components/pages/HomePage.tsx:2` - объявляется компонент `HomePage`.
- `src/components/pages/HomePage.tsx:3-5` - компонент возвращает JSX.
- `src/components/pages/HomePage.tsx:4` - рендерится `<Employees/>`.
- `src/components/pages/HomePage.tsx:8` - экспорт компонента.

### Приёмы и понятия

- это очень чистая `декомпозиция`: страница знает, какой компонент показывать, но не знает подробностей таблицы, загрузки и аватаров.

---

## 8. `src/components/pages/AddEmployeePage.tsx`

### Роль файла

Это страница-координатор для добавления сотрудника.

Она сама форму не рисует подробно и сама POST-запрос не пишет вручную. Она связывает форму, мутацию и навигацию.

### Связи

- используется маршрутом `/add`;
- импортирует `useEmployeesMutation`, `apiClient`, `EmployeeForm`, `Navigate`.

### Разбор по строкам

- `src/components/pages/AddEmployeePage.tsx:1` - импорт кастомного хука мутации.
- `src/components/pages/AddEmployeePage.tsx:2` - импорт API-клиента.
- `src/components/pages/AddEmployeePage.tsx:3` - импорт типа `Employee`.
- `src/components/pages/AddEmployeePage.tsx:4` - импорт формы.
- `src/components/pages/AddEmployeePage.tsx:5` - импорт `useState`.
- `src/components/pages/AddEmployeePage.tsx:6` - импорт `Navigate`.
- `src/components/pages/AddEmployeePage.tsx:8` - объявление компонента.
- `src/components/pages/AddEmployeePage.tsx:9-11` - создаётся объект `mutation`.
- `src/components/pages/AddEmployeePage.tsx:9` - в дженерики подставлены `Employee, Employee`.
- `src/components/pages/AddEmployeePage.tsx:9-10` - коллбэк `(empl) => apiClient.addEmployee(empl)` передаётся как функция мутации.
- `src/components/pages/AddEmployeePage.tsx:12` - локальное состояние `isHomeNavigate` и функция `setHomeNavigate`.
- `src/components/pages/AddEmployeePage.tsx:13-19` - JSX компонента.
- `src/components/pages/AddEmployeePage.tsx:15` - через `&&` условно рендерится `<Navigate to="/" />`.
- `src/components/pages/AddEmployeePage.tsx:16` - в `EmployeeForm` передаётся prop `submitter`.
- `src/components/pages/AddEmployeePage.tsx:16` - `submitter` реализован как инлайн-коллбэк.
- `src/components/pages/AddEmployeePage.tsx:16` - внутри одного блока вызывается `mutation.mutate(empl)` и затем `setHomeNavigate(true)`.
- `src/components/pages/AddEmployeePage.tsx:22` - экспорт компонента.

### Приёмы и понятия

- `инлайн-коллбэк` - функция написана прямо внутри JSX.
- `Navigate` - компонент для программного перехода.
- `useState(false)` создаёт булев флаг, который управляет навигацией.
- `дженерики` в `useEmployeesMutation<Employee, Employee>` задают типы результата и входных данных.

### Что полезно заметить

- страница построена по хорошему принципу: форма отвечает за сбор данных, а страница решает, что делать после submit.
- слабое место в текущей реализации: переход домой включается сразу, не дожидаясь успешного ответа сервера.

---

## 9. `src/components/pages/AgeStatisticsPage.tsx`

### Роль файла

Страница статистики по возрасту. Она очень тонкая: получает сотрудников и отдаёт в общий график массив возрастов.

### Связи

- используется маршрутом `statistics/age`;
- импортирует `useEmployees`, `employeesConfig`, `StatisticsLineChart`, `getAge`.

### Разбор по строкам

- `src/components/pages/AgeStatisticsPage.tsx:1` - импорт хука загрузки сотрудников.
- `src/components/pages/AgeStatisticsPage.tsx:2` - импорт конфига.
- `src/components/pages/AgeStatisticsPage.tsx:3` - импорт общего компонента графика.
- `src/components/pages/AgeStatisticsPage.tsx:4` - импорт функции подсчёта возраста.
- `src/components/pages/AgeStatisticsPage.tsx:6` - объявление компонента.
- `src/components/pages/AgeStatisticsPage.tsx:7` - через деструктуризацию берётся `employees`.
- `src/components/pages/AgeStatisticsPage.tsx:9-11` - возвращается компонент `StatisticsLineChart`.
- `src/components/pages/AgeStatisticsPage.tsx:10` - `numbers={employees.map(empl => getAge(empl.birthdate))}` превращает сотрудников в числовой массив возрастов.
- `src/components/pages/AgeStatisticsPage.tsx:10` - `interval={employeesConfig.age.interval}` подаёт размер корзины для группировки.
- `src/components/pages/AgeStatisticsPage.tsx:10` - `xLine` и `title` подписывают график.
- `src/components/pages/AgeStatisticsPage.tsx:14` - экспорт компонента.

### Приёмы и понятия

- это пример `параметризации`: одна и та же диаграмма получает другие числа и другой заголовок.

- `.map(...)` здесь выполняет проекцию массива `Employee[]` в `number[]`.
  
  ## 10. `src/components/pages/SalaryStatisticsPage.tsx`

### Роль файла

Страница статистики по зарплатам. По структуре почти зеркальна возрастной странице.

### Связи

- используется маршрутом `statistics/salary`;
- импортирует `useEmployees`, `employeesConfig`, `StatisticsLineChart`.

### Разбор по строкам

- `src/components/pages/SalaryStatisticsPage.tsx:1` - импорт хука загрузки.
- `src/components/pages/SalaryStatisticsPage.tsx:2` - импорт конфига зарплат.
- `src/components/pages/SalaryStatisticsPage.tsx:3` - импорт общего компонента графика.
- `src/components/pages/SalaryStatisticsPage.tsx:5` - объявление компонента.
- `src/components/pages/SalaryStatisticsPage.tsx:6` - получение `employees` из кастомного хука.
- `src/components/pages/SalaryStatisticsPage.tsx:8-10` - рендер общего графика.
- `src/components/pages/SalaryStatisticsPage.tsx:9` - `employees.map(empl => empl.salary)` превращает массив сотрудников в массив зарплат.
- `src/components/pages/SalaryStatisticsPage.tsx:9` - интервал берётся из `employeesConfig.salary.interval`.
- `src/components/pages/SalaryStatisticsPage.tsx:13` - экспорт.

### Приёмы и понятия

- это образец `переиспользования общего компонента`.
- различие между этой страницей и возрастной почти целиком сводится к одной функции преобразования данных.

---

## 11. `src/components/pages/DepartmentStatisticsPage.tsx`

### Роль файла

Страница статистики по отделам. В отличие от возрастной и зарплатной страницы, здесь нужен не график по числам, а подготовка агрегированной таблицы.

### Связи

- используется маршрутом `statistics/department`;
- импортирует `DepartmentsTable`, `useEmployees`, типы `DepartmentInfo` и `Employee`, `useMemo`, `lodash`, `getAge`.

### Разбор по строкам

- `src/components/pages/DepartmentStatisticsPage.tsx:1` - импорт `Box` и `Text`.
- `src/components/pages/DepartmentStatisticsPage.tsx:2` - импорт компонента таблицы отделов.
- `src/components/pages/DepartmentStatisticsPage.tsx:3` - импорт хука загрузки сотрудников.
- `src/components/pages/DepartmentStatisticsPage.tsx:4-5` - импорт типов `DepartmentInfo` и `Employee`.
- `src/components/pages/DepartmentStatisticsPage.tsx:6` - импорт `useMemo`.
- `src/components/pages/DepartmentStatisticsPage.tsx:7` - импорт `lodash` как `_`.
- `src/components/pages/DepartmentStatisticsPage.tsx:8` - импорт `getAge`.
- `src/components/pages/DepartmentStatisticsPage.tsx:10-14` - JSDoc-комментарий для функции ниже.
- `src/components/pages/DepartmentStatisticsPage.tsx:15` - объявление функции `getDepartmentsInfo`.
- `src/components/pages/DepartmentStatisticsPage.tsx:15` - функция принимает массив сотрудников и возвращает массив `DepartmentInfo[]`.
- `src/components/pages/DepartmentStatisticsPage.tsx:16` - `_.groupBy(employees, 'department')` разбивает сотрудников по отделам.
- `src/components/pages/DepartmentStatisticsPage.tsx:17` - `Object.entries(groupObj)` превращает объект групп в массив пар.
- `src/components/pages/DepartmentStatisticsPage.tsx:17-22` - `.map(([key, value]) => ({ ... }))` превращает каждую пару в объект статистики.
- `src/components/pages/DepartmentStatisticsPage.tsx:18` - `department: key` записывает имя отдела.
- `src/components/pages/DepartmentStatisticsPage.tsx:19` - `nEmployees: value.length` считает сотрудников.
- `src/components/pages/DepartmentStatisticsPage.tsx:20` - `_.round(_.meanBy(value, 'salary'))` считает и округляет среднюю зарплату.
- `src/components/pages/DepartmentStatisticsPage.tsx:21` - средний возраст считается через `getAge` для каждого сотрудника.
- `src/components/pages/DepartmentStatisticsPage.tsx:25` - объявление компонента страницы.
- `src/components/pages/DepartmentStatisticsPage.tsx:26` - получение `employees`.
- `src/components/pages/DepartmentStatisticsPage.tsx:27` - `useMemo(() => getDepartmentsInfo(employees), [employees])` мемоизирует результат расчёта.
- `src/components/pages/DepartmentStatisticsPage.tsx:29-36` - JSX страницы.
- `src/components/pages/DepartmentStatisticsPage.tsx:30` - внешний контейнер `Box`.
- `src/components/pages/DepartmentStatisticsPage.tsx:31-33` - заголовок страницы.
- `src/components/pages/DepartmentStatisticsPage.tsx:34` - таблица получает уже готовые данные через props.
- `src/components/pages/DepartmentStatisticsPage.tsx:39` - экспорт.

### Приёмы и понятия

- `JSDoc` - комментарий в специальном формате для подсказок и документации.
- `groupBy` - агрегирование по признаку.
- `Object.entries` - превращение объекта в массив пар `[ключ, значение]`.
- `useMemo` - сохранение результата вычислений до тех пор, пока зависимости не изменились.
- `meanBy` - среднее значение по выбранному полю или функции.

### Что полезно заметить

- в этой странице логика подготовки данных вынесена отдельно от JSX. Это хороший признак читаемого кода.

---

## 12. `src/components/AppBar.tsx`

### Роль файла

Верхняя навигационная панель.

### Связи

- используется в `LayoutPage`;
- импортирует `NavLink`, `StatisticsSelector`, `ColorModeButton`.

### Разбор по строкам

- `src/components/AppBar.tsx:1` - импорт горизонтального контейнера `HStack`.
- `src/components/AppBar.tsx:2` - импорт `NavLink`.
- `src/components/AppBar.tsx:3` - импорт `StatisticsSelector`.
- `src/components/AppBar.tsx:4` - импорт кнопки смены темы.
- `src/components/AppBar.tsx:6` - объявление компонента.
- `src/components/AppBar.tsx:8` - `HStack justifyContent={"space-evenly"}` равномерно раскладывает элементы по ширине.
- `src/components/AppBar.tsx:9` - ссылка на домашнюю страницу.
- `src/components/AppBar.tsx:10` - ссылка на добавление сотрудника.
- `src/components/AppBar.tsx:11` - вставка выпадающего меню статистики.
- `src/components/AppBar.tsx:12` - вставка переключателя темы.
- `src/components/AppBar.tsx:18` - экспорт.

### Приёмы и понятия

- `NavLink` отличается от `Link` тем, что умеет быть активным маршрутом.
- `HStack` - компонент-композиция Chakra для горизонтального расположения элементов.

---

## 13. `src/components/StatisticsSelector.tsx`

### Роль файла

Кнопка с выпадающим меню статистики.

### Связи

- используется в `AppBar`;
- импортирует Chakra `Menu`, `Button`, `Portal`, `react-icons`, `NavLink`, `useLocation`.

### Разбор по строкам

- `src/components/StatisticsSelector.tsx:1` - импорт `Button`, `Menu`, `Portal`.
- `src/components/StatisticsSelector.tsx:2` - импорт `useState`.
- `src/components/StatisticsSelector.tsx:3` - импорт иконок стрелок.
- `src/components/StatisticsSelector.tsx:4` - импорт `NavLink` и `useLocation`.
- `src/components/StatisticsSelector.tsx:6` - объявление компонента.
- `src/components/StatisticsSelector.tsx:7` - создаётся локальное состояние `open`.
- `src/components/StatisticsSelector.tsx:8` - `useLocation()` даёт доступ к текущему URL.
- `src/components/StatisticsSelector.tsx:10-35` - JSX меню.
- `src/components/StatisticsSelector.tsx:11` - `Menu.Root open={open} onOpenChange={(e) => setOpen(e.open)}` делает меню контролируемым.
- `src/components/StatisticsSelector.tsx:12` - `Menu.Trigger asChild` означает: использовать дочерний компонент как триггер меню без лишней обёртки.
- `src/components/StatisticsSelector.tsx:13` - кнопка получает `fontWeight` через тернарник.
- `src/components/StatisticsSelector.tsx:14` - текст кнопки `Statistics`.
- `src/components/StatisticsSelector.tsx:15` - через тернарник рисуется стрелка вверх или вниз.
- `src/components/StatisticsSelector.tsx:18` - содержимое меню помещается в `Portal`.
- `src/components/StatisticsSelector.tsx:19` - позиционер Chakra управляет положением попапа.
- `src/components/StatisticsSelector.tsx:20` - контейнер меню.
- `src/components/StatisticsSelector.tsx:21-29` - три пункта меню.
- `src/components/StatisticsSelector.tsx:22` - ссылка на возрастную статистику.
- `src/components/StatisticsSelector.tsx:25` - ссылка на зарплатную статистику.
- `src/components/StatisticsSelector.tsx:28` - ссылка на статистику отделов.
- `src/components/StatisticsSelector.tsx:38` - экспорт.

### Приёмы и понятия

- `контролируемый компонент` - когда состояние приходит извне или хранится явно у вас, а не живёт полностью внутри библиотеки.
- `Portal` рисует DOM-узел в другом месте дерева, обычно чтобы попап не ломался из-за overflow и вложенности.
- `тернарник` используется дважды: для веса шрифта и для иконки.
- `useLocation` - React Router-хук, который даёт информацию о текущем пути.
- `asChild` - полезный приём композиции в Chakra/Radix-подобных API.

---

## 14. `src/components/Employees.tsx`

### Роль файла

Компонент таблицы сотрудников на главной странице.

### Связи

- используется в `HomePage`;
- получает данные через `useEmployees`.

### Разбор по строкам

- `src/components/Employees.tsx:1` - импорт визуальных компонентов Chakra.
- `src/components/Employees.tsx:2` - импорт хука `useEmployees`.
- `src/components/Employees.tsx:4` - объявление компонента.
- `src/components/Employees.tsx:5` - получение `employees` и `isLoading` через деструктуризацию.
- `src/components/Employees.tsx:7` - открывается Fragment.
- `src/components/Employees.tsx:8` - если идёт загрузка, показывается `Spinner`.
- `src/components/Employees.tsx:9` - внешний `Stack` центрирует содержимое.
- `src/components/Employees.tsx:10` - `Table.ScrollArea` создаёт прокручиваемую область таблицы.
- `src/components/Employees.tsx:10` - `width={{base:"95vw", md: "80vw"}}` задаёт responsive-ширину.
- `src/components/Employees.tsx:11` - `Table.Root` создаёт саму таблицу.
- `src/components/Employees.tsx:11` - размер таблицы тоже responsive.
- `src/components/Employees.tsx:11` - `stickyHeader` закрепляет заголовок.
- `src/components/Employees.tsx:12-20` - заголовок таблицы.
- `src/components/Employees.tsx:14` - первая колонка скрывается на очень узких экранах.
- `src/components/Employees.tsx:21-36` - тело таблицы.
- `src/components/Employees.tsx:22` - `employees.map((empl) => (` начинает рендер строк.
- `src/components/Employees.tsx:23` - `key={empl.id}` помогает React отслеживать элементы списка.
- `src/components/Employees.tsx:24` - ячейка под аватар скрыта на маленьких экранах.
- `src/components/Employees.tsx:25` - `Avatar.Root` создаёт оболочку аватара.
- `src/components/Employees.tsx:26` - `Avatar.Fallback` показывает текстовый fallback, если картинки нет.
- `src/components/Employees.tsx:27` - `Avatar.Image src={empl.avatar}` пробует загрузить картинку.
- `src/components/Employees.tsx:30-33` - выводятся данные сотрудника.
- `src/components/Employees.tsx:44` - экспорт.

### Приёмы и понятия

- `условный рендер через &&` - компактный способ показать что-то только при истинном условии.
- `key` - обязательный признак в списках React.
- `responsive props` - Chakra умеет принимать объект по брейкпоинтам.
- `Fallback` - запасной вариант отображения, если основной ресурс недоступен.

### Что полезно заметить

- компонент занимается только отображением списка и не знает, как именно сервер отдаёт данные.

---

## 15. `src/components/EmployeeForm.tsx`

### Роль файла

Форма ввода нового сотрудника.

### Связи

- используется в `AddEmployeePage`;
- импортирует тип `Employee`, `useForm`, Chakra-поля, конфиг и утилиту дат.

### Разбор по строкам

- `src/components/EmployeeForm.tsx:1` - импорт `FC`.
- `src/components/EmployeeForm.tsx:2` - импорт типа `Employee`.
- `src/components/EmployeeForm.tsx:3` - импорт `useForm`.
- `src/components/EmployeeForm.tsx:4` - импорт UI-элементов формы.
- `src/components/EmployeeForm.tsx:5` - импорт общего конфига.
- `src/components/EmployeeForm.tsx:6` - импорт утилиты `getIsoDateFromAge`.
- `src/components/EmployeeForm.tsx:7-9` - описание `Props`.
- `src/components/EmployeeForm.tsx:8` - `submitter: (empl: Employee) => void` означает, что компонент ожидает функцию обратного вызова.
- `src/components/EmployeeForm.tsx:10` - объявление компонента с типом `FC<Props>`.
- `src/components/EmployeeForm.tsx:11-15` - деструктурируется результат `useForm<Employee>()`.
- `src/components/EmployeeForm.tsx:12` - `register` нужен для подключения поля.
- `src/components/EmployeeForm.tsx:13` - `handleSubmit` оборачивает submit-логику.
- `src/components/EmployeeForm.tsx:14` - из `formState` берутся `errors`.
- `src/components/EmployeeForm.tsx:17` - `Stack as="form"` делает контейнер настоящей HTML-формой.
- `src/components/EmployeeForm.tsx:19` - `onSubmit={handleSubmit((data) => submitter(data))}` связывает submit формы и внешний callback.
- `src/components/EmployeeForm.tsx:23-30` - `SimpleGrid` раскладывает поля по колонкам в зависимости от ширины экрана.
- `src/components/EmployeeForm.tsx:31` - корень поля отдела, `invalid={!!errors.department}` превращает наличие ошибки в булево значение.
- `src/components/EmployeeForm.tsx:33-46` - блок нативного select.
- `src/components/EmployeeForm.tsx:36` - `register("department", { required: true })` подключает поле и задаёт валидацию.
- `src/components/EmployeeForm.tsx:38-42` - список опций строится из массива `employeesConfig.departments`.
- `src/components/EmployeeForm.tsx:49-53` - поле `fullName`.
- `src/components/EmployeeForm.tsx:51` - поле регистрируется как обязательное.
- `src/components/EmployeeForm.tsx:54-59` - поле даты рождения.
- `src/components/EmployeeForm.tsx:56-57` - задаются `min` и `max`, рассчитанные из допустимого возраста.
- `src/components/EmployeeForm.tsx:60-68` - поле зарплаты.
- `src/components/EmployeeForm.tsx:62-66` - `register("salary", { ... })` указывает обязательность, преобразование в число и диапазон.
- `src/components/EmployeeForm.tsx:63` - `valueAsNumber: true` заставляет библиотеку вернуть число, а не строку.
- `src/components/EmployeeForm.tsx:67` - текст ошибки собирается через шаблонную строку.
- `src/components/EmployeeForm.tsx:70-73` - панель кнопок формы.
- `src/components/EmployeeForm.tsx:71` - кнопка submit.
- `src/components/EmployeeForm.tsx:72` - нативный reset.
- `src/components/EmployeeForm.tsx:78` - экспорт.

### Приёмы и понятия

- `FC<Props>` - типизация функционального компонента.
- `props` - входные параметры компонента.
- `callback` - функция `submitter`, которую компонент вызывает позже.
- `as="form"` - Chakra polymorphic prop, позволяющий рендерить контейнер как настоящий тег `form`.
- `!!value` - двойное отрицание для явного превращения значения в boolean.
- `template string` - строка с подстановками через `${...}`.
- `...register(...)` - `spread`-синтаксис, который раскладывает возвращённые свойства в props инпута.

---

## 16. `src/components/StatisticsLineChart.tsx`

### Роль файла

Универсальный компонент линейного графика для распределений.

### Связи

- используется в возрастной и зарплатной страницах;
- импортирует `useMemo`, `lodash`, Chakra Charts и Recharts.

### Разбор по строкам

- `src/components/StatisticsLineChart.tsx:1` - импорт `FC` и `useMemo`.
- `src/components/StatisticsLineChart.tsx:2` - импорт `lodash`.
- `src/components/StatisticsLineChart.tsx:3` - импорт `Chart` и `useChart`.
- `src/components/StatisticsLineChart.tsx:4` - импорт `VStack` и `Text`.
- `src/components/StatisticsLineChart.tsx:5-12` - импорт примитивов графика из `recharts`.
- `src/components/StatisticsLineChart.tsx:13-18` - описание props: `numbers`, `interval`, `xLine`, `title`.
- `src/components/StatisticsLineChart.tsx:19` - объявление компонента.
- `src/components/StatisticsLineChart.tsx:20-29` - подготовка данных через `useMemo`.
- `src/components/StatisticsLineChart.tsx:21` - `_.countBy(numbers, (num) => Math.floor(num / interval))` раскладывает числа по корзинам.
- `src/components/StatisticsLineChart.tsx:22-27` - объект статистики превращается в массив `{ amount, value }`.
- `src/components/StatisticsLineChart.tsx:24` - деструктуризация пары `[key, value]`.
- `src/components/StatisticsLineChart.tsx:26` - `+key` превращает строковый ключ обратно в число.
- `src/components/StatisticsLineChart.tsx:29` - зависимости мемоизации: `numbers` и `interval`.
- `src/components/StatisticsLineChart.tsx:30-33` - создаётся объект `chart` через `useChart`.
- `src/components/StatisticsLineChart.tsx:32` - описывается одна серия `amount` с цветом `teal.solid`.
- `src/components/StatisticsLineChart.tsx:34-75` - JSX графика.
- `src/components/StatisticsLineChart.tsx:35` - `VStack` центрирует блок.
- `src/components/StatisticsLineChart.tsx:36` - заголовок графика.
- `src/components/StatisticsLineChart.tsx:37-41` - `Chart.Root` задаёт размеры и контекст графика.
- `src/components/StatisticsLineChart.tsx:42` - `LineChart data={chart.data} responsive` начинает реальный график.
- `src/components/StatisticsLineChart.tsx:43` - сетка графика.
- `src/components/StatisticsLineChart.tsx:44-49` - настройка оси X.
- `src/components/StatisticsLineChart.tsx:46` - `dataKey={chart.key("value")}` связывает ось X с полем `value`.
- `src/components/StatisticsLineChart.tsx:50-56` - настройка оси Y.
- `src/components/StatisticsLineChart.tsx:57-61` - tooltip.
- `src/components/StatisticsLineChart.tsx:62-71` - рендер линий по данным `chart.series`.
- `src/components/StatisticsLineChart.tsx:64` - `key={item.name}` для React-списка серий.
- `src/components/StatisticsLineChart.tsx:66` - `dataKey={chart.key(item.name)}` привязывает линию к полю данных.
- `src/components/StatisticsLineChart.tsx:80` - экспорт.

### Приёмы и понятия

- `универсальный компонент` - не знает, что за числа пришли, только визуализирует их.

- `useMemo` - оптимизация пересчёта.

- `countBy` - способ строить распределение частот.

- `+key` - короткое преобразование строки в число.

- `series.map(...)` - ещё один пример декларативного рендера списка.
  
  ## 17. `src/components/DepartmentsTable.tsx`

### Роль файла

Таблица агрегированной статистики по отделам.

### Связи

- используется в `DepartmentStatisticsPage`;
- получает `departmentsInfo` через props.

### Разбор по строкам

- `src/components/DepartmentsTable.tsx:1` - импорт `FC`.
- `src/components/DepartmentsTable.tsx:2` - импорт `Table` из Chakra.
- `src/components/DepartmentsTable.tsx:2` - рядом находится комментарий автора, напоминающий, что полки таблицы берутся именно из Chakra.
- `src/components/DepartmentsTable.tsx:3` - импорт типа `DepartmentInfo`.
- `src/components/DepartmentsTable.tsx:5-7` - описание props.
- `src/components/DepartmentsTable.tsx:9` - объявление компонента с деструктуризацией `departmentsInfo`.
- `src/components/DepartmentsTable.tsx:10-35` - JSX таблицы.
- `src/components/DepartmentsTable.tsx:12` - корень таблицы с размером `md` и вариантом `line`.
- `src/components/DepartmentsTable.tsx:14-21` - заголовок таблицы.
- `src/components/DepartmentsTable.tsx:16-19` - четыре колонки: отдел, число сотрудников, средняя зарплата, средний возраст.
- `src/components/DepartmentsTable.tsx:23-31` - тело таблицы.
- `src/components/DepartmentsTable.tsx:24` - проход по массиву `departmentsInfo`.
- `src/components/DepartmentsTable.tsx:25` - `key={info.department}`.
- `src/components/DepartmentsTable.tsx:26-29` - вывод значений объекта статистики.
- `src/components/DepartmentsTable.tsx:38` - экспорт.

### Приёмы и понятия

- компонент полностью `презентационный`: он не считает статистику, а только показывает полученные данные.
- `map` + `key` здесь работают точно так же, как в обычной таблице сотрудников.

---

## 18. `src/components/ui/provider.tsx`

### Роль файла

Тонкая обёртка над Chakra Provider и провайдером темы.

### Связи

- используется в `main.tsx`;
- импортирует `ColorModeProvider`.

### Разбор по строкам

- `src/components/ui/provider.tsx:1` - строка `"use client"` помечает модуль как клиентский.
- `src/components/ui/provider.tsx:3` - импорт `ChakraProvider` и `defaultSystem`.
- `src/components/ui/provider.tsx:4-7` - импорт `ColorModeProvider` и его типов.
- `src/components/ui/provider.tsx:9` - объявление функции `Provider(props: ColorModeProviderProps)`.
- `src/components/ui/provider.tsx:11` - внешний Chakra Provider получает `value={defaultSystem}`.
- `src/components/ui/provider.tsx:12` - внутрь передаются все `props` в `ColorModeProvider` через spread.
- `src/components/ui/provider.tsx:15` - экспорт функции.

### Приёмы и понятия

- `"use client"` встречается в экосистемах, где важно отделять серверные и клиентские модули.
- `...props` - spread props. Все полученные свойства пробрасываются дальше.
- файл маленький, но полезный: он скрывает низкоуровневую настройку UI-инфраструктуры.

---

## 19. `src/components/ui/color-mode.tsx`

### Роль файла

Это набор инструментов для работы со светлой и тёмной темой.

### Связи

- `ColorModeProvider` используется в `provider.tsx`;
- `ColorModeButton` используется в `AppBar.tsx`.

### Разбор по строкам

- `src/components/ui/color-mode.tsx:1` - `"use client"`.
- `src/components/ui/color-mode.tsx:3-4` - импорт типов и компонентов Chakra.
- `src/components/ui/color-mode.tsx:5-6` - импорт `ThemeProvider`, `useTheme` и его типов из `next-themes`.
- `src/components/ui/color-mode.tsx:7` - импорт React namespace.
- `src/components/ui/color-mode.tsx:8` - импорт иконок луны и солнца.
- `src/components/ui/color-mode.tsx:10` - `interface ColorModeProviderProps extends ThemeProviderProps {}`.
- `src/components/ui/color-mode.tsx:12-16` - `ColorModeProvider` просто рендерит `ThemeProvider` с нужными props.
- `src/components/ui/color-mode.tsx:18` - объявляется `type ColorMode = "light" | "dark"`.
- `src/components/ui/color-mode.tsx:20-24` - интерфейс `UseColorModeReturn` описывает, что вернёт хук.
- `src/components/ui/color-mode.tsx:26` - объявление `useColorMode`.
- `src/components/ui/color-mode.tsx:27` - из `useTheme()` берутся `resolvedTheme`, `setTheme`, `forcedTheme`.
- `src/components/ui/color-mode.tsx:28` - вычисляется итоговый `colorMode`.
- `src/components/ui/color-mode.tsx:29-31` - функция `toggleColorMode` меняет тему на противоположную через тернарник.
- `src/components/ui/color-mode.tsx:32-36` - хук возвращает объект с текущим режимом и функциями управления.
- `src/components/ui/color-mode.tsx:33` - `colorMode as ColorMode` - type assertion, явное приведение типа.
- `src/components/ui/color-mode.tsx:39-42` - `useColorModeValue(light, dark)` возвращает одно из двух значений по текущей теме.
- `src/components/ui/color-mode.tsx:44-47` - `ColorModeIcon()` показывает луну или солнце.
- `src/components/ui/color-mode.tsx:49` - интерфейс для props кнопки через `Omit<IconButtonProps, "aria-label">`.
- `src/components/ui/color-mode.tsx:51-76` - создание `ColorModeButton` через `React.forwardRef`.
- `src/components/ui/color-mode.tsx:55` - из хука берётся `toggleColorMode`.
- `src/components/ui/color-mode.tsx:57` - `ClientOnly` нужен, чтобы не рендерить тему некорректно до гидрации.
- `src/components/ui/color-mode.tsx:57` - `fallback={<Skeleton boxSize="9" />}` показывает заглушку.
- `src/components/ui/color-mode.tsx:58-73` - настраивается `IconButton`.
- `src/components/ui/color-mode.tsx:59` - по клику вызывается `toggleColorMode`.
- `src/components/ui/color-mode.tsx:61` - задаётся `aria-label` для доступности.
- `src/components/ui/color-mode.tsx:64` - все дополнительные props пробрасываются через spread.
- `src/components/ui/color-mode.tsx:65-70` - через `css` задаётся размер иконки.
- `src/components/ui/color-mode.tsx:72` - внутрь вставляется `ColorModeIcon`.
- `src/components/ui/color-mode.tsx:78-92` - компонент `LightMode` через `forwardRef` принудительно оборачивает детей в светлую тему.
- `src/components/ui/color-mode.tsx:94-108` - аналогично `DarkMode` для тёмной темы.

### Приёмы и понятия

- `union type` - тип `"light" | "dark"`.
- `interface extends ...` - расширение существующего типа.
- `Omit<T, K>` - убрать одно поле из существующего типа.
- `forwardRef` - способ передать `ref` дальше внутрь компонента.
- `type assertion` - `as ColorMode`.
- `ClientOnly` - защита от проблем, когда тема на клиенте и сервере может сначала не совпадать.
- `aria-label` - важная часть доступности.

### Что полезно заметить

- этот файл почти полностью служебный и, скорее всего, был взят из шаблона Chakra.
- именно из-за шаблонного характера тут и возникают некоторые lint-предупреждения.

---

## 20. `src/components/ui/toaster.tsx`

### Роль файла

Инфраструктура всплывающих уведомлений.

### Связи

- пока напрямую в основных страницах проекта не используется;
- может быть подключена позже для сообщений об успехе и ошибках.

### Разбор по строкам

- `src/components/ui/toaster.tsx:1` - `"use client"`.
- `src/components/ui/toaster.tsx:3-10` - импорт Chakra-частей для toast-системы.
- `src/components/ui/toaster.tsx:12-15` - создаётся singleton `toaster` через `createToaster`.
- `src/components/ui/toaster.tsx:13` - позиция уведомлений `bottom-end`.
- `src/components/ui/toaster.tsx:14` - `pauseOnPageIdle: true` приостанавливает таймеры, когда страница бездействует.
- `src/components/ui/toaster.tsx:17` - объявляется компонент `Toaster`.
- `src/components/ui/toaster.tsx:19` - всё рендерится через `Portal`.
- `src/components/ui/toaster.tsx:20` - `ChakraToaster` получает созданный `toaster`.
- `src/components/ui/toaster.tsx:21-39` - функция-ребёнок получает `toast` и рисует конкретное уведомление.
- `src/components/ui/toaster.tsx:23-27` - если toast в состоянии `loading`, показывается spinner, иначе стандартный индикатор.
- `src/components/ui/toaster.tsx:28-33` - блок с заголовком и описанием.
- `src/components/ui/toaster.tsx:29` - заголовок показывается только если он есть.
- `src/components/ui/toaster.tsx:30-32` - описание тоже выводится условно.
- `src/components/ui/toaster.tsx:34-36` - условная кнопка действия.
- `src/components/ui/toaster.tsx:37` - условная кнопка закрытия.
- `src/components/ui/toaster.tsx:43` - экспорт.

### Приёмы и понятия

- `singleton` - один разделяемый объект `toaster` на всё приложение.
- `function as child` - когда внутрь компонента передают функцию, которая получает данные и возвращает JSX.
- условный рендер здесь используется много раз подряд.

---

## 21. `src/components/ui/tooltip.tsx`

### Роль файла

Обёртка над Chakra Tooltip для единообразного API внутри проекта.

### Связи

- сейчас в видимых компонентах проекта не используется;
- служит готовой утилитой для будущих подсказок.

### Разбор по строкам

- `src/components/ui/tooltip.tsx:1` - импорт `Tooltip as ChakraTooltip` и `Portal`.
- `src/components/ui/tooltip.tsx:2` - импорт React namespace.
- `src/components/ui/tooltip.tsx:4-11` - объявление интерфейса `TooltipProps`.
- `src/components/ui/tooltip.tsx:4` - `extends ChakraTooltip.RootProps` означает, что компонент умеет всё, что умеет стандартный Chakra tooltip, плюс свои поля.
- `src/components/ui/tooltip.tsx:5-10` - добавлены свои удобные props: `showArrow`, `portalled`, `portalRef`, `content`, `contentProps`, `disabled`.
- `src/components/ui/tooltip.tsx:13-46` - компонент создаётся через `React.forwardRef`.
- `src/components/ui/tooltip.tsx:15-24` - деструктуризация props.
- `src/components/ui/tooltip.tsx:19` - `portalled = true` задаёт значение по умолчанию.
- `src/components/ui/tooltip.tsx:26` - если `disabled`, компонент просто возвращает `children` без tooltip.
- `src/components/ui/tooltip.tsx:29` - `ChakraTooltip.Root {...rest}` принимает остальные стандартные props.
- `src/components/ui/tooltip.tsx:30` - триггером подсказки становятся `children`.
- `src/components/ui/tooltip.tsx:31` - `Portal disabled={!portalled} container={portalRef}` делает портал настраиваемым.
- `src/components/ui/tooltip.tsx:33` - контент tooltip получает `ref` и дополнительные props.
- `src/components/ui/tooltip.tsx:34-38` - стрелка рендерится только если `showArrow` истинен.
- `src/components/ui/tooltip.tsx:39` - основной контент tooltip.

### Приёмы и понятия

- `значение по умолчанию` в деструктуризации: `portalled = true`.
- `children` - стандартный React-prop для вложенного содержимого.
- `...rest` - сбор остаточных props.
- `forwardRef` здесь нужен, чтобы внешний код мог получить доступ к DOM/элементу контента.

---

## 22. `src/models/AuthData.ts`

### Роль файла

Типы для данных логина и данных пользователя.

### Связи

- используется в `AuthService.ts` и `AuthServiceImpl.ts`.

### Разбор по строкам

- `src/models/AuthData.ts:1-4` - `LoginData` состоит из `email` и `password`.
- `src/models/AuthData.ts:5-8` - `UserData` состоит из `username` и `role`.

### Приёмы и понятия

- это чистые `type alias`, без логики.
- подобные файлы очень полезны: они централизуют форму данных и избавляют от повторения структур по проекту.

---

## 23. `src/models/DepartmentInfo.ts`

### Роль файла

Тип для строки статистики по отделу.

### Связи

- используется в `DepartmentStatisticsPage` и `DepartmentsTable`.

### Разбор по строкам

- `src/models/DepartmentInfo.ts:1-6` - описывается объект с названием отдела, количеством сотрудников, средней зарплатой и средним возрастом.

### Приёмы и понятия

- тип нужен не потому, что без него код не работает, а потому, что с ним понятнее контракты между слоями.

---

## 24. `src/models/Employee.ts`

### Роль файла

Главная модель проекта: сотрудник.

### Связи

- используется почти везде: в форме, API, страницах статистики, списке сотрудников, мутациях.

### Разбор по строкам

- `src/models/Employee.ts:1-8` - тип сотрудника.
- `src/models/Employee.ts:2` - `id?: string` означает необязательный идентификатор.
- `src/models/Employee.ts:3` - полное имя.
- `src/models/Employee.ts:4` - зарплата как число.
- `src/models/Employee.ts:5` - дата рождения строкой.
- `src/models/Employee.ts:6` - отдел.
- `src/models/Employee.ts:7` - необязательный URL аватара.

### Приёмы и понятия

- знак `?` обозначает `optional property`.
- разделение обязательных и необязательных полей помогает одной моделью описывать и создание объекта, и ответ сервера.

---

## 25. `src/models/EmployeeUpdater.ts`

### Роль файла

Тип для сценария обновления сотрудника.

### Связи

- используется в `ApiClient.ts` и `ApiClientImpl.ts`, хотя сама операция пока не реализована.

### Разбор по строкам

- `src/models/EmployeeUpdater.ts:1` - импорт типа `Employee`.
- `src/models/EmployeeUpdater.ts:3-6` - описание объекта обновления.
- `src/models/EmployeeUpdater.ts:4` - `id` говорит, какого сотрудника менять.
- `src/models/EmployeeUpdater.ts:5` - `fields: Partial<Employee>` означает: можно передавать только часть полей сотрудника.

### Приёмы и понятия

- `Partial<T>` - встроенный utility type TypeScript. Он делает все поля типа `T` необязательными.

- это типичный приём для PATCH/UPDATE-запросов.
  
  ## 26. `src/config/employees-config.ts`

### Роль файла

Общий конфиг по допустимым данным сотрудника и интервалам статистики.

### Связи

- используется формой;
- используется страницами возрастной и зарплатной статистики.

### Разбор по строкам

- `src/config/employees-config.ts:1` - объявляется объект `employeesConfig`.
- `src/config/employees-config.ts:2-6` - настройки зарплаты.
- `src/config/employees-config.ts:3` - минимальная зарплата.
- `src/config/employees-config.ts:4` - максимальная зарплата.
- `src/config/employees-config.ts:5` - интервал группировки для графика зарплат.
- `src/config/employees-config.ts:7-11` - настройки возраста.
- `src/config/employees-config.ts:8` - минимальный допустимый возраст.
- `src/config/employees-config.ts:9` - максимальный допустимый возраст.
- `src/config/employees-config.ts:10` - шаг группировки для возрастного графика.
- `src/config/employees-config.ts:12` - массив доступных отделов.
- `src/config/employees-config.ts:14` - экспорт конфига.

### Приёмы и понятия

- это пример `централизации правил`: диапазоны не размазаны по коду, а лежат в одном месте.
- именно из-за этого менять бизнес-рамки удобно и безопаснее.

---

## 27. `src/services/ApiClient.ts`

### Роль файла

Интерфейс контракта API-клиента.

### Связи

- реализуется в `ApiClientImpl.ts`.

### Разбор по строкам

- `src/services/ApiClient.ts:1-3` - импортируются нужные типы.
- `src/services/ApiClient.ts:5` - объявляется `interface ApiClient`.
- `src/services/ApiClient.ts:6` - метод `getEmployees` может принимать `AxiosRequestConfig` и возвращает `Promise<Employee[]>`.
- `src/services/ApiClient.ts:7` - `addEmployee` возвращает `Promise<Employee>`.
- `src/services/ApiClient.ts:8` - `deleteEmployee` пока только описан контрактом.
- `src/services/ApiClient.ts:9` - `updateEmployee` тоже описан контрактом.

### Приёмы и понятия

- `interface` описывает форму объекта-клиента.
- `Promise<T>` означает, что результат будет позже, асинхронно.
- наличие интерфейса позволяет при желании заменить реализацию без переписывания потребителей.

---

## 28. `src/services/ApiClientImpl.ts`

### Роль файла

Реальная реализация API-клиента на `axios`.

### Связи

- используется в `useEmployees` и `AddEmployeePage`;
- реализует интерфейс `ApiClient`.

### Разбор по строкам

- `src/services/ApiClientImpl.ts:1` - импорт `axios` и `AxiosRequestConfig`.
- `src/services/ApiClientImpl.ts:2` - импорт интерфейса `ApiClient`.
- `src/services/ApiClientImpl.ts:3-4` - импорт типов `Employee` и `EmployeeUpdater`.
- `src/services/ApiClientImpl.ts:6-8` - создаётся `axiosInstance` с `baseURL`.
- `src/services/ApiClientImpl.ts:10-13` - объявляется тип `EmployeeResponse`.
- `src/services/ApiClientImpl.ts:10` - `Omit<Employee, "birthdate">` берёт тип `Employee`, но убирает из него поле `birthdate`.
- `src/services/ApiClientImpl.ts:10-13` - затем через `&` добавляются поля `birthDate?` и `birthdate?`.
- `src/services/ApiClientImpl.ts:15` - объявляется функция `normalizeEmployee`.
- `src/services/ApiClientImpl.ts:16-19` - возвращается новый объект сотрудника.
- `src/services/ApiClientImpl.ts:17` - spread `...employee` копирует все поля ответа.
- `src/services/ApiClientImpl.ts:18` - `employee.birthdate ?? employee.birthDate ?? ""` выбирает первое не `null`/`undefined` значение.
- `src/services/ApiClientImpl.ts:22` - объявляется класс `ApiClientJsonServer implements ApiClient`.
- `src/services/ApiClientImpl.ts:23-26` - реализация `getEmployees`.
- `src/services/ApiClientImpl.ts:24` - GET-запрос к `employees`.
- `src/services/ApiClientImpl.ts:25` - каждый элемент ответа нормализуется.
- `src/services/ApiClientImpl.ts:27-31` - реализация `addEmployee`.
- `src/services/ApiClientImpl.ts:28` - собирается `payload`, где дополнительно создаётся `birthDate`.
- `src/services/ApiClientImpl.ts:29` - POST-запрос.
- `src/services/ApiClientImpl.ts:30` - ответ снова нормализуется.
- `src/services/ApiClientImpl.ts:32-37` - методы удаления и обновления пока не реализованы, они бросают ошибку.
- `src/services/ApiClientImpl.ts:40` - создаётся готовый экземпляр `apiClient`.
- `src/services/ApiClientImpl.ts:41` - экспорт.

### Приёмы и понятия

- `Omit<T, K>` - убрать поле из типа.
- `&` в типах - `intersection type`, объединение требований нескольких типов.
- `??` - `nullish coalescing`, выбор первого определённого значения.
- `implements ApiClient` - класс обязан соответствовать контракту интерфейса.
- `async/await` делает асинхронный код более читаемым.

### Что полезно заметить

- файл выполняет важную задачу `нормализации` формата сервера.
- `deleteEmployee` и `updateEmployee` пока только заглушки.

---

## 29. `src/services/AuthService.ts`

### Роль файла

Интерфейс сервиса аутентификации.

### Связи

- реализуется в `AuthServiceImpl.ts`.

### Разбор по строкам

- `src/services/AuthService.ts:1` - импорт типов логина и пользователя.
- `src/services/AuthService.ts:3` - объявление интерфейса.
- `src/services/AuthService.ts:4` - `login` принимает `LoginData` и возвращает `Promise<UserData>`.
- `src/services/AuthService.ts:5` - `logout` возвращает `Promise<void>`.

### Приёмы и понятия

- `void` здесь означает: метод ничего полезного не возвращает, только факт завершения.

---

## 30. `src/services/AuthServiceImpl.ts`

### Роль файла

Простейшая заглушка сервиса авторизации. Она не ходит на настоящий сервер, а сравнивает логин и пароль с объектом в памяти.

### Связи

- реализует `AuthService`;
- использует типы из `AuthData`.

### Разбор по строкам

- `src/services/AuthServiceImpl.ts:1` - импорт `AxiosError`.
- `src/services/AuthServiceImpl.ts:2` - импорт типов `LoginData` и `UserData`.
- `src/services/AuthServiceImpl.ts:3` - импорт интерфейса `AuthService`.
- `src/services/AuthServiceImpl.ts:4` - объявляется объект `DUMMY_LOGIN_USERS`.
- `src/services/AuthServiceImpl.ts:5-14` - внутри захардкожены два пользователя.
- `src/services/AuthServiceImpl.ts:16` - класс `AuthServiceDummy implements AuthService`.
- `src/services/AuthServiceImpl.ts:17` - объявление асинхронного метода `login`.
- `src/services/AuthServiceImpl.ts:18` - поиск пользователя по email.
- `src/services/AuthServiceImpl.ts:19-21` - если пользователя нет или пароль не совпал, бросается ошибка.
- `src/services/AuthServiceImpl.ts:22` - если всё хорошо, возвращается объект только с `username` и `role`.
- `src/services/AuthServiceImpl.ts:25-27` - `logout()` просто возвращает `Promise.resolve()`.
- `src/services/AuthServiceImpl.ts:30` - создаётся экземпляр `authService`.
- `src/services/AuthServiceImpl.ts:31` - экспорт.

### Приёмы и понятия

- `dummy service` - временная/учебная реализация вместо реального сервера.
- `throw new AxiosError(...)` - ошибка приводится к типу, похожему на сетевую.
- `Promise.resolve()` - быстрое создание уже успешно завершённого промиса.

### Что полезно заметить

- этот сервис пока не встроен в основной UI проекта, но заготовка под авторизацию уже есть.

---

## 31. `src/services/hooks/useEmployees.ts`

### Роль файла

Кастомный хук для загрузки списка сотрудников через React Query.

### Связи

- используется в `Employees`, `AgeStatisticsPage`, `SalaryStatisticsPage`, `DepartmentStatisticsPage`.

### Разбор по строкам

- `src/services/hooks/useEmployees.ts:1` - импорт `AxiosError` и `AxiosRequestConfig`.
- `src/services/hooks/useEmployees.ts:2` - импорт типа `Employee`.
- `src/services/hooks/useEmployees.ts:3` - импорт `useQuery`.
- `src/services/hooks/useEmployees.ts:4` - импорт `apiClient`.
- `src/services/hooks/useEmployees.ts:6-7` - объявление функции и типа её возвращаемого объекта.
- `src/services/hooks/useEmployees.ts:8` - создаётся массив `queryKey` с базовым значением `['employees']`.
- `src/services/hooks/useEmployees.ts:9` - если есть `config`, он добавляется в `queryKey`.
- `src/services/hooks/useEmployees.ts:10-14` - запуск `useQuery<Employee[], AxiosError>({...})`.
- `src/services/hooks/useEmployees.ts:11` - `queryKey` говорит React Query, в какой ячейке кеша хранить ответ.
- `src/services/hooks/useEmployees.ts:12` - `queryFn` описывает, как получать данные.
- `src/services/hooks/useEmployees.ts:13` - `staleTime: 3600_000` делает данные свежими в течение часа.
- `src/services/hooks/useEmployees.ts:15` - наружу возвращается нормализованный объект, где `employees` всегда массив, даже если данных ещё нет.

### Приёмы и понятия

- `custom hook` скрывает повторяемую логику загрузки.
- `queryKey` - имя записи в кеше.
- `result.data || []` - безопасный fallback на пустой массив.
- `config && queryKey.push(config)` - короткая запись условного действия.

### Что полезно заметить

- код читабельный, но здесь сейчас есть lint-замечания: `any[]` и выражение `config && ...`.

---

## 32. `src/services/hooks/useEmployeesMutation.ts`

### Роль файла

Универсальный кастомный хук для мутаций, связанных с сотрудниками.

### Связи

- используется в `AddEmployeePage`.

### Разбор по строкам

- `src/services/hooks/useEmployeesMutation.ts:1-6` - импорт нужных частей React Query.
- `src/services/hooks/useEmployeesMutation.ts:7` - импорт `AxiosError`.
- `src/services/hooks/useEmployeesMutation.ts:9-11` - объявление дженерик-функции с параметрами типов `TData` и `TVariables`.
- `src/services/hooks/useEmployeesMutation.ts:10` - входной параметр `mutateFn` имеет тип `MutationFunction<TData, TVariables>`.
- `src/services/hooks/useEmployeesMutation.ts:11` - функция возвращает `UseMutationResult<...>`.
- `src/services/hooks/useEmployeesMutation.ts:12` - берётся `queryClient`.
- `src/services/hooks/useEmployeesMutation.ts:13-19` - создаётся мутация.
- `src/services/hooks/useEmployeesMutation.ts:14` - `mutationFn: mutateFn` использует переданную функцию как тело мутации.
- `src/services/hooks/useEmployeesMutation.ts:15-18` - после успеха инвалидируется кеш `employees`.
- `src/services/hooks/useEmployeesMutation.ts:20-22` - если в результате мутации есть ошибка, она выбрасывается наружу.
- `src/services/hooks/useEmployeesMutation.ts:23` - возврат объекта мутации.

### Приёмы и понятия

- `дженерики` делают хук универсальным.
- `invalidateQueries` сообщает React Query, что кеш устарел.
- выброс `res.error` наружу меняет модель обработки ошибок: ошибка не просто хранится в объекте, а превращается в исключение.

### Что полезно заметить

- идея хорошая, но тип `any` в возвращаемом результате сейчас ловится линтером.

---

## 33. `src/utils/date_functions.ts`

### Роль файла

Утилиты для работы с возрастом и датами.

### Связи

- `getAge` используется в возрастной статистике и статистике по отделам;
- `getIsoDateFromAge` используется в форме.

### Разбор по строкам

- `src/utils/date_functions.ts:1` - объявляется функция `getAge`.
- `src/utils/date_functions.ts:2-3` - текущий год минус год рождения.
- `src/utils/date_functions.ts:5` - объявляется функция `getIsoDateFromAge`.
- `src/utils/date_functions.ts:6` - создаётся объект `Date` с текущей датой.
- `src/utils/date_functions.ts:7` - год сдвигается назад на `age`.
- `src/utils/date_functions.ts:8` - день ставится на первое число.
- `src/utils/date_functions.ts:9` - месяц ставится на январь.
- `src/utils/date_functions.ts:10` - дата переводится в ISO-строку и обрезается до формата `YYYY-MM-DD`.

### Приёмы и понятия

- `utility function` - маленькая переиспользуемая функция без UI.
- `toISOString().substring(0, 10)` - распространённый приём получения строки для `<input type="date">`.

### Что полезно заметить

- `getAge` считает возраст упрощённо, без учёта месяца и дня.

---

## 34. Как все файлы связываются вместе

Если пройти путь одного сценария, связь файлов станет совсем прозрачной.

### Сценарий: открыть список сотрудников

1. `src/main.tsx` поднимает провайдеры и роутер.
2. `src/router/routes.tsx` выбирает `LayoutPage` и `HomePage`.
3. `src/components/pages/HomePage.tsx` вставляет `Employees`.
4. `src/components/Employees.tsx` вызывает `useEmployees`.
5. `src/services/hooks/useEmployees.ts` вызывает `apiClient.getEmployees`.
6. `src/services/ApiClientImpl.ts` идёт на сервер, нормализует ответ и возвращает сотрудников.
7. `Employees.tsx` рисует таблицу.

### Сценарий: добавить сотрудника

1. роутер открывает `AddEmployeePage`.
2. `AddEmployeePage` создаёт мутацию через `useEmployeesMutation`.
3. `AddEmployeePage` передаёт `submitter` в `EmployeeForm`.
4. `EmployeeForm` собирает и валидирует данные.
5. после submit вызывается callback страницы.
6. мутация вызывает `apiClient.addEmployee`.
7. `useEmployeesMutation` инвалидирует кеш сотрудников.
8. страница делает `Navigate` домой.

### Сценарий: открыть статистику по отделам

1. роутер открывает `DepartmentStatisticsPage`.
2. страница получает `employees` через `useEmployees`.
3. функция `getDepartmentsInfo` группирует и агрегирует данные.
4. `DepartmentsTable` показывает готовый массив `DepartmentInfo[]`.

---

## 35. Какие языковые приёмы реально встречаются в этом коде

Список именно по текущему проекту:

- `props` - например `EmployeeForm`, `DepartmentsTable`, `StatisticsLineChart`;
- `callbacks` - например `submitter`, `onOpenChange`, `handleSubmit((data) => ...)`;
- `тернарники` - например в `StatisticsSelector` и `color-mode`;
- `условный рендер через &&` - например `Spinner`, `Navigate`, части toast;
- `деструктуризация` - повсюду в props и результатах хуков;
- `spread` - `...props`, `...employee`, `...register(...)`, `...rest`;
- `generic types` - `useEmployeesMutation<TData, TVariables>`;
- `utility types` - `Omit`, `Partial`;
- `union types` - `"light" | "dark"`;
- `optional properties` - `id?`, `avatar?`, `birthDate?`;
- `nullish coalescing` - `??` в `normalizeEmployee`;
- `non-null assertion` - `!` в `main.tsx`;
- `forwardRef` - в `color-mode.tsx` и `tooltip.tsx`;
- `Portal` - в меню, tooltip и toaster;
- `useMemo` - в графике и статистике по отделам;
- `async/await` - в сервисах.

---

## 36. Порядок чтения проекта, если учиться по нему

Лучший порядок такой:

1. `src/models/Employee.ts`
2. `src/config/employees-config.ts`
3. `src/main.tsx`
4. `src/router/routes.tsx`
5. `src/components/pages/LayoutPage.tsx`
6. `src/components/pages/HomePage.tsx`
7. `src/components/Employees.tsx`
8. `src/services/hooks/useEmployees.ts`
9. `src/services/ApiClientImpl.ts`
10. `src/components/pages/AddEmployeePage.tsx`
11. `src/components/EmployeeForm.tsx`
12. `src/components/pages/AgeStatisticsPage.tsx`
13. `src/components/pages/SalaryStatisticsPage.tsx`
14. `src/components/StatisticsLineChart.tsx`
15. `src/components/pages/DepartmentStatisticsPage.tsx`
16. `src/components/DepartmentsTable.tsx`

И уже потом смотреть служебные UI-файлы `components/ui/*`.

---

## 37. Короткий вывод

Если смотреть на `src` целиком, проект обучает сразу нескольким важным вещам:

- как разбивать приложение на слои;
- как не смешивать UI и запросы к серверу;
- как типизировать данные;
- как использовать React Router, React Query и react-hook-form вместе;
- как строить переиспользуемые компоненты и утилиты;
- как выносить правила в конфиг и вычисления в функции.

Если нужен ещё более жёсткий формат, следующий шаг уже совсем механический: можно сделать третий файл, где рядом с каждым файлом будет вставлен сам исходник с нумерацией строк и комментариями прямо после каждой строки.
