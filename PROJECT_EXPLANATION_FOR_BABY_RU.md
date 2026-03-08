# Проект `employees-fe` с разбором "для младенца"

## 1. Что это вообще за проект

Если совсем по-простому, этот проект показывает список сотрудников и умеет:

1. открыть главную страницу со списком сотрудников;
2. открыть страницу добавления нового сотрудника;
3. показать статистику по возрастам;
4. показать статистику по зарплатам;
5. показать статистику по отделам.

Это фронтенд-приложение на `React + TypeScript + Vite`.

`Фронтенд` означает: это та часть программы, которую видит пользователь в браузере.

`React` означает: интерфейс собирается из маленьких кусочков, которые называются `компоненты`.

`TypeScript` означает: поверх JavaScript добавлены типы, чтобы раньше ловить ошибки и яснее описывать данные.

`Vite` означает: инструмент, который быстро запускает проект в разработке и собирает его в продакшен.

---

## 2. Что видно по зависимостям

Смотри `package.json`.

Главные строки:

- `package.json:7-10` - команды проекта (`dev`, `build`, `lint`, `preview`);
- `package.json:13-27` - основные библиотеки приложения;
- `package.json:29-41` - инструменты для разработки.

Самое важное:

- `react`, `react-dom` - основа интерфейса;
- `react-router-dom` - переключение страниц без перезагрузки браузера;
- `@tanstack/react-query` - получение данных с сервера и кеширование;
- `axios` - HTTP-запросы;
- `react-hook-form` - работа с формами;
- `@chakra-ui/react` - готовые UI-компоненты;
- `@chakra-ui/charts` и `recharts` - графики;
- `lodash` - удобные функции для группировки, округления, подсчета;
- `zustand` - библиотека для состояния, но в текущем коде не используется.

Важно: в проекте `zustand` установлен (`package.json:27`), но в `src` он сейчас не применяется. Поэтому если под вашим словом `pecnfys` имелся в виду `zustand`, то ответ такой: библиотека подключена, но в текущей реализации она не задействована.

Если под `pecnfys` вы имели в виду `props`, то `props` здесь используются активно, и ниже я их отдельно разберу.

---

## 3. Карта проекта простыми словами

### Корень проекта

- `package.json` - список библиотек и команд.
- `index.html` - HTML-страница, куда React вставляет приложение.
- `src` - весь основной код.

### Папка `src`

- `main.tsx` - точка входа;
- `router/routes.tsx` - таблица маршрутов;
- `components` - визуальные блоки интерфейса;
- `components/pages` - страницы;
- `services` - работа с сервером и данными;
- `services/hooks` - собственные React-хуки;
- `models` - типы данных;
- `config` - настройки проекта;
- `utils` - вспомогательные функции.

---

## 4. Как приложение стартует

Главный файл: `src/main.tsx`

Ключевые строки:

- `src/main.tsx:9` - React находит DOM-элемент `root`;
- `src/main.tsx:9-16` - в этот элемент рендерится всё приложение;
- `src/main.tsx:10` - `StrictMode` включает дополнительные проверки в разработке;
- `src/main.tsx:11` - `ChakraProvider` даёт доступ к UI-системе;
- `src/main.tsx:12` - `QueryClientProvider` даёт React Query доступ к кешу запросов;
- `src/main.tsx:13` - `RouterProvider` включает роутинг.

### Совсем детская аналогия

Представь дом:

- `StrictMode` - строгий взрослый, который смотрит, нет ли подозрительного поведения;
- `ChakraProvider` - коробка с готовыми красивыми деталями интерфейса;
- `QueryClientProvider` - холодильник, где лежат уже загруженные данные;
- `RouterProvider` - указатель, какая комната сейчас открыта.

### Что здесь важно технически

Приложение обёрнуто в несколько `provider`-слоёв.

`Provider` - это способ дать всем дочерним компонентам общий доступ к чему-то важному:

- к теме оформления;
- к кешу запросов;
- к роутеру.

Файл `src/components/ui/provider.tsx` на строках `9-14` показывает, как Chakra-провайдер оборачивает `ColorModeProvider`.

---

## 5. Как устроены маршруты

Файл: `src/router/routes.tsx`

Ключевые строки:

- `src/router/routes.tsx:8-28` - создаётся дерево маршрутов;
- `src/router/routes.tsx:10-11` - корневой путь `/` использует `LayoutPage`;
- `src/router/routes.tsx:13` - домашняя страница;
- `src/router/routes.tsx:14` - страница добавления сотрудника;
- `src/router/routes.tsx:16-24` - вложенные страницы статистики.

### Что такое роутинг

`Роутинг` - это правило: какой компонент показывать по какому адресу.

Примеры:

- `/` -> список сотрудников;
- `/add` -> форма добавления;
- `/statistics/age` -> статистика по возрасту;
- `/statistics/salary` -> статистика по зарплатам;
- `/statistics/department` -> статистика по отделам.

### Что такое вложенные маршруты

`LayoutPage` - это общий каркас.

Он показывает общие части интерфейса, а внутрь вставляет конкретную страницу через `Outlet`.

Это видно в `src/components/pages/LayoutPage.tsx`:

- `src/components/pages/LayoutPage.tsx:8` - сверху всегда рисуется `AppBar`;
- `src/components/pages/LayoutPage.tsx:10` - `Outlet` подставляет активную страницу.

То есть схема такая:

1. пользователь идёт на какой-то URL;
2. роутер ищет подходящий маршрут;
3. общий каркас остаётся одним и тем же;
4. внутри каркаса меняется только содержимое страницы.

---

## 6. Главный экран

Страница `src/components/pages/HomePage.tsx` очень маленькая:

- `src/components/pages/HomePage.tsx:4` - она просто рендерит компонент `Employees`.

Это хороший пример `декомпозиции`.

### Что такое декомпозиция

`Декомпозиция` - это разбиение большой задачи на маленькие части.

Вместо того чтобы держать всю логику в одном огромном файле, автор проекта разделил её:

- страница отвечает за уровень страницы;
- компонент `Employees` отвечает за таблицу сотрудников;
- хук `useEmployees` отвечает за загрузку сотрудников;
- `ApiClientImpl` отвечает за настоящий запрос на сервер.

Это как не строить весь дом одной гигантской кирпичной глыбой, а собрать его из комнат, стен, окон и дверей.

---

## 7. Навигация сверху

Файл: `src/components/AppBar.tsx`

Ключевые строки:

- `src/components/AppBar.tsx:8-12` - вся верхняя панель;
- `src/components/AppBar.tsx:9` - ссылка домой;
- `src/components/AppBar.tsx:10` - ссылка на форму;
- `src/components/AppBar.tsx:11` - выпадающий список статистики;
- `src/components/AppBar.tsx:12` - кнопка смены темы.

### Что здесь происходит

`AppBar` - это обычный React-компонент без своей сложной логики.

Он просто собирает более мелкие куски:

- ссылки `NavLink`;
- `StatisticsSelector`;
- `ColorModeButton`.

Это снова декомпозиция: одна панель состоит из подпанелей.

---

## 8. Выпадающий список статистики

Файл: `src/components/StatisticsSelector.tsx`

Ключевые строки:

- `src/components/StatisticsSelector.tsx:7` - локальное состояние `open`;
- `src/components/StatisticsSelector.tsx:8` - получение текущего адреса через `useLocation`;
- `src/components/StatisticsSelector.tsx:11` - связь открытости меню с состоянием;
- `src/components/StatisticsSelector.tsx:13` - условное выделение кнопки жирным;
- `src/components/StatisticsSelector.tsx:15` - условный выбор стрелки вверх или вниз;
- `src/components/StatisticsSelector.tsx:21-29` - пункты меню.

### Что такое состояние (`state`)

`State` - это изменяемая память компонента.

Здесь:

- `open = false` -> меню закрыто;
- `open = true` -> меню открыто.

Строка `7`:

```tsx
const [open, setOpen] = useState<boolean>(false)
```

означает:

- `open` - текущее значение;
- `setOpen` - функция, которая это значение меняет.

### Что такое тернарник

`Тернарный оператор` - это короткая запись условия.

Форма:

```ts
условие ? если_да : если_нет
```

В проекте есть два хороших примера.

Пример 1, `src/components/StatisticsSelector.tsx:13`:

```tsx
fontWeight={location.pathname.includes("statistics") ? "bold" : "normal"}
```

Перевод:

- если адрес содержит `statistics`, сделать текст жирным;
- иначе оставить обычным.

Пример 2, `src/components/StatisticsSelector.tsx:15`:

```tsx
{open ? <FaChevronUp></FaChevronUp> : <FaChevronDown></FaChevronDown>}
```

Перевод:

- если меню открыто, показываем стрелку вверх;
- иначе стрелку вниз.

### Что такое коллбэк

`Callback` - это функция, которую мы передаём куда-то, чтобы она была вызвана позже.

Пример, `src/components/StatisticsSelector.tsx:11`:

```tsx
onOpenChange={(e) => setOpen(e.open)}
```

Здесь функция `(e) => setOpen(e.open)` не выполняется сразу. Chakra вызовет её потом, когда меню откроется или закроется.

То есть:

1. компонент меню сообщает событие;
2. callback получает событие `e`;
3. из `e.open` берётся новое значение;
4. вызывается `setOpen`.

---

## 9. Таблица сотрудников

Файл: `src/components/Employees.tsx`

Ключевые строки:

- `src/components/Employees.tsx:5` - получение данных через `useEmployees`;
- `src/components/Employees.tsx:8` - условный показ спиннера;
- `src/components/Employees.tsx:10-38` - таблица;
- `src/components/Employees.tsx:22-35` - обход массива сотрудников;
- `src/components/Employees.tsx:23` - ключ строки таблицы;
- `src/components/Employees.tsx:25-28` - аватар;
- `src/components/Employees.tsx:30-33` - поля сотрудника.

### Что делает `useEmployees`

Компонент сам не знает, как сходить на сервер.

Он говорит: "дай мне сотрудников".

Эту задачу он передаёт кастомному хуку:

```tsx
const { employees, isLoading } = useEmployees();
```

Это значит:

- `employees` - массив сотрудников;
- `isLoading` - индикатор загрузки.

### Что такое деструктуризация

Строка `5` использует `деструктуризацию`.

Вместо:

```ts
const result = useEmployees();
const employees = result.employees;
const isLoading = result.isLoading;
```

используется короткая форма:

```ts
const { employees, isLoading } = useEmployees();
```

Это просто удобный способ вытащить свойства из объекта.

### Что такое `&&` в JSX

Строка `src/components/Employees.tsx:8`:

```tsx
{isLoading && <Spinner></Spinner>}
```

Это ещё один способ условного рендера.

Перевод:

- если `isLoading` истинно, показать `<Spinner>`;
- если ложно, ничего не показывать.

Это не тернарник.

Это `короткое логическое условие`.

### Что делает `.map()`

Строки `22-35`:

```tsx
{employees.map((empl) => (
  <Table.Row key={empl.id}>
```

`map` означает:

1. взять массив;
2. пройтись по каждому элементу;
3. для каждого элемента вернуть новый JSX;
4. в итоге получить набор строк таблицы.

### Что такое параметризация

`Параметризация` - это когда один и тот же механизм работает по разным входным данным.

Примеры в этом компоненте:

- `Avatar.Root size={{sm:"sm", lg: "lg"}}` - компонент параметризуется размером;
- `Table.Root size={{base: "sm", sm: "md", lg: "lg"}}` - одна и та же таблица ведёт себя по-разному на разных экранах;
- `width={{base:"95vw", md: "80vw"}}` - ширина зависит от брейкпоинта.

Идея простая: не писать три таблицы для трёх экранов, а дать одной таблице параметры.

---

## 10. Модель данных сотрудника

Файл: `src/models/Employee.ts`

Строки `1-8`:

```ts
export type Employee = {
    id?: string,
    fullName: string,
    salary: number,
    birthdate: string,
    department: string,
    avatar?: string
}
```

### Что тут важно

- `type Employee` - описание формы объекта;
- `fullName`, `salary`, `birthdate`, `department` - обязательные поля;
- `id?` и `avatar?` - необязательные поля.

### Что значит знак `?`

`id?: string` означает:

- поле может быть строкой;
- а может вообще отсутствовать.

Это полезно, потому что:

- при создании нового сотрудника `id` ещё может не быть;
- после получения с сервера `id` обычно появляется.

---

## 11. Форма добавления сотрудника

Файл: `src/components/EmployeeForm.tsx`

Ключевые строки:

- `src/components/EmployeeForm.tsx:7-9` - описание `props`;
- `src/components/EmployeeForm.tsx:10` - компонент получает `submitter`;
- `src/components/EmployeeForm.tsx:11-15` - подключение `react-hook-form`;
- `src/components/EmployeeForm.tsx:19` - что делать при отправке;
- `src/components/EmployeeForm.tsx:31-68` - поля формы;
- `src/components/EmployeeForm.tsx:36` - регистрация поля `department`;
- `src/components/EmployeeForm.tsx:38-42` - генерация вариантов отделов;
- `src/components/EmployeeForm.tsx:56-57` - ограничения по дате;
- `src/components/EmployeeForm.tsx:62-66` - валидация зарплаты;
- `src/components/EmployeeForm.tsx:71-72` - кнопки `Save` и `Reset`.

### Что такое `props`

Очень вероятно, что под вашим `pecnfys` вы имели в виду именно `props`.

`Props` - это входные данные компонента.

Компонент как функция:

- снаружи ему что-то передали;
- внутри он этим пользуется.

Здесь:

```ts
type Props = {
  submitter: (empl: Employee) => void;
};
```

Это означает:

- компонент ждёт одно свойство;
- это свойство называется `submitter`;
- это функция;
- она принимает `Employee`;
- ничего не возвращает (`void`).

Строка `src/components/EmployeeForm.tsx:10`:

```tsx
const EmployeeForm: FC<Props> = ({ submitter }) => {
```

означает:

- компонент типизирован типом `Props`;
- из props сразу вытащили `submitter`.

### Почему это важно

Форма не знает, куда отправлять данные.

Она знает только одно:

"Когда пользователь нажмёт Save, я вызову функцию `submitter` и передам туда объект сотрудника".

Это очень хорошая декомпозиция:

- `EmployeeForm` отвечает за сбор данных;
- страница выше решает, что делать с этими данными.

### Что делает `react-hook-form`

Строки `11-15`:

```tsx
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<Employee>();
```

Это значит:

- `register` подключает конкретное поле к форме;
- `handleSubmit` готовит отправку формы;
- `errors` хранит ошибки валидации.

### Что делает `register`

Пример, `src/components/EmployeeForm.tsx:36`:

```tsx
{...register("department", { required: true })}
```

Перевод:

- это поле называется `department`;
- оно обязательно;
- библиотека сама будет следить за его значением.

### Коллбэк при отправке формы

Строка `src/components/EmployeeForm.tsx:19`:

```tsx
onSubmit={handleSubmit((data) => submitter(data))}
```

Здесь сразу несколько идей.

1. `onSubmit` - ожидает функцию.
2. `handleSubmit(...)` - оборачивает вашу функцию логикой формы.
3. `(data) => submitter(data)` - callback, который вызовется только после успешной валидации.

То есть поток такой:

1. пользователь жмёт `Save`;
2. `react-hook-form` собирает данные;
3. проверяет правила;
4. если всё хорошо, вызывает callback;
5. callback отдаёт `data` наружу через `submitter`.

### Валидация

Примеры:

- `src/components/EmployeeForm.tsx:36` - `department` обязателен;
- `src/components/EmployeeForm.tsx:51` - `fullName` обязателен;
- `src/components/EmployeeForm.tsx:56` - `birthdate` обязателен;
- `src/components/EmployeeForm.tsx:63-64` - зарплата ограничена минимумом и максимумом.

Конфиг для этих ограничений лежит в `src/config/employees-config.ts`:

- `src/config/employees-config.ts:2-5` - настройки зарплаты;
- `src/config/employees-config.ts:7-10` - настройки возраста;
- `src/config/employees-config.ts:12` - список отделов.

Это пример правильной параметризации:

- правила не захардкожены по всему проекту;
- они вынесены в отдельный конфиг;
- несколько компонентов могут использовать один и тот же набор настроек.

---

## 12. Страница добавления сотрудника

Файл: `src/components/pages/AddEmployeePage.tsx`

Ключевые строки:

- `src/components/pages/AddEmployeePage.tsx:9-11` - настройка мутации;
- `src/components/pages/AddEmployeePage.tsx:12` - локальное состояние для навигации;
- `src/components/pages/AddEmployeePage.tsx:15` - условный переход домой;
- `src/components/pages/AddEmployeePage.tsx:16` - передача callback в форму.

### Что такое мутация

В React Query `query` обычно означает "получить данные", а `mutation` означает "изменить данные":

- добавить;
- удалить;
- обновить.

Строки `9-11`:

```tsx
const mutation = useEmployeesMutation<Employee, Employee>((empl) =>
  apiClient.addEmployee(empl),
);
```

означают:

- мы создаём механизм изменения данных;
- в качестве действия даём функцию "добавь сотрудника".

### Где здесь коллбэк

Строка `16`:

```tsx
<EmployeeForm submitter={(empl) => {mutation.mutate(empl); setHomeNavigate(true)}} />
```

Это важнейший callback.

`EmployeeForm` не знает про API. Она просто вызовет `submitter`.

А уже страница решает:

1. вызвать `mutation.mutate(empl)`;
2. переключить флаг навигации;
3. отправить пользователя на главную.

### Что такое условный рендер через `&&`

Строка `15`:

```tsx
{isHomeNavigate && <Navigate to="/" />}
```

Перевод:

- если флаг `isHomeNavigate` истинен, выполнить перенаправление;
- иначе ничего не вставлять в JSX.

---

## 13. Работа с сервером

Главный файл: `src/services/ApiClientImpl.ts`

Ключевые строки:

- `src/services/ApiClientImpl.ts:6-8` - создание `axios`-клиента;
- `src/services/ApiClientImpl.ts:10-13` - описание серверного ответа;
- `src/services/ApiClientImpl.ts:15-20` - нормализация данных;
- `src/services/ApiClientImpl.ts:23-26` - получение сотрудников;
- `src/services/ApiClientImpl.ts:27-30` - добавление сотрудника;
- `src/services/ApiClientImpl.ts:32-36` - заготовки под удаление и обновление.

### Что делает `axios.create`

Строки `6-8`:

```ts
const axiosInstance = axios.create({
    baseURL: "http://localhost:3001/"
})
```

Это создаёт готовый HTTP-клиент с базовым адресом сервера.

Теперь не нужно каждый раз писать полный URL.

### Что такое нормализация данных

Очень важный кусок: `src/services/ApiClientImpl.ts:15-20`.

```ts
function normalizeEmployee(employee: EmployeeResponse): Employee {
    return {
        ...employee,
        birthdate: employee.birthdate ?? employee.birthDate ?? "",
    }
}
```

Смысл:

- сервер может вернуть `birthDate`;
- или может вернуть `birthdate`;
- фронтенд хочет всегда работать с одним именем: `birthdate`.

Поэтому данные приводятся к одной форме.

Это называется `нормализация`.

### Зачем это хорошо

Вместо хаоса:

- в одном месте `birthDate`,
- в другом `birthdate`,
- в третьем ошибка,

приложение говорит:

"Внутри фронтенда мы договорились использовать только `birthdate`".

Это делает код устойчивее.

### Что делает `getEmployees`

Строки `23-26`:

1. отправляют GET-запрос на `employees`;
2. получают массив;
3. каждый элемент пропускают через `normalizeEmployee`;
4. возвращают уже удобный массив сотрудников.

### Что делает `addEmployee`

Строки `27-30`:

1. берут объект сотрудника;
2. формируют `payload`;
3. специально добавляют `birthDate: empl.birthdate`;
4. отправляют POST-запрос;
5. ответ снова нормализуют.

Это важно: при отправке проект подстраивается под формат сервера, а внутри фронта хранит единый формат.

---

## 14. Получение данных через React Query

Файл: `src/services/hooks/useEmployees.ts`

Ключевые строки:

- `src/services/hooks/useEmployees.ts:6-7` - тип возвращаемого значения;
- `src/services/hooks/useEmployees.ts:8-9` - формирование `queryKey`;
- `src/services/hooks/useEmployees.ts:10-14` - вызов `useQuery`;
- `src/services/hooks/useEmployees.ts:15` - нормализованный возврат результатов.

### Что такое кастомный хук

`Custom hook` - это ваша собственная функция, которая использует React-хуки внутри и прячет повторяющуюся логику.

`useEmployees` говорит:

"Если кому-то в приложении нужны сотрудники, пусть он вызывает меня, а я уже сам схожу в API, положу результат в кеш и верну удобный объект".

### Что такое `queryKey`

Строки `8-9`:

```ts
const queryKey: any[] = ["employees"];
config && queryKey.push(config)
```

`queryKey` - это имя ячейки кеша.

Если очень грубо:

- React Query кладёт ответ в коробку;
- на коробке написано имя;
- имя здесь - `["employees"]`.

Если есть дополнительный `config`, он тоже включается в имя коробки.

### Что делает `useQuery`

Строки `10-14`:

```ts
const result = useQuery<Employee[], AxiosError>({
    queryKey,
    queryFn: () => apiClient.getEmployees(config),
    staleTime: 3600_000
})
```

Это значит:

- данные имеют тип `Employee[]`;
- ошибка имеет тип `AxiosError`;
- брать данные нужно через `apiClient.getEmployees(config)`;
- считать данные свежими 1 час.

### Что такое параметризация здесь

`useEmployees(config?)` - параметризованный хук.

Один и тот же хук может работать:

- без параметров;
- с конфигом `axios`;
- с другим `queryKey`.

То есть механизм один, а входные параметры разные.

---

## 15. Изменение данных через React Query

Файл: `src/services/hooks/useEmployeesMutation.ts`

Ключевые строки:

- `src/services/hooks/useEmployeesMutation.ts:9-11` - дженерик-функция;
- `src/services/hooks/useEmployeesMutation.ts:13-19` - создание мутации;
- `src/services/hooks/useEmployeesMutation.ts:15-18` - инвалидирование кеша;
- `src/services/hooks/useEmployeesMutation.ts:20-22` - проброс ошибки;
- `src/services/hooks/useEmployeesMutation.ts:23` - возврат результата.

### Что такое дженерики

Строка `9`:

```ts
export default function useEmployeesMutation<TData, TVariables>(
```

`TData` и `TVariables` - это `дженерики`.

Они означают:

- функция универсальная;
- заранее неизвестно, какие конкретно типы будут подставлены;
- эти типы можно передать снаружи.

Это как форма для печенья:

- сама форма одна;
- тесто можно подставить разное.

В `AddEmployeePage` подставляется:

- `TData = Employee`;
- `TVariables = Employee`.

### Что такое инвалидирование кеша

Строки `15-18`:

```ts
onSuccess: () =>
  client.invalidateQueries({
    queryKey: ["employees"],
  }),
```

Это означает:

- после успешного изменения данных React Query помечает кеш `employees` устаревшим;
- при следующем обращении данные перезапросятся.

По-человечески:

1. добавили нового сотрудника;
2. старый список сотрудников уже может быть неактуален;
3. надо заново получить список.

---

## 16. Статистика по возрасту и зарплате

Файлы:

- `src/components/pages/AgeStatisticsPage.tsx`
- `src/components/pages/SalaryStatisticsPage.tsx`
- `src/components/StatisticsLineChart.tsx`

### Страница возраста

В `src/components/pages/AgeStatisticsPage.tsx`:

- `src/components/pages/AgeStatisticsPage.tsx:7` - получаем сотрудников;
- `src/components/pages/AgeStatisticsPage.tsx:10` - превращаем сотрудников в массив чисел возрастов.

Код:

```tsx
employees.map(empl => getAge(empl.birthdate))
```

Это значит:

- взять каждого сотрудника;
- посчитать его возраст;
- сделать массив чисел.

### Страница зарплаты

В `src/components/pages/SalaryStatisticsPage.tsx`:

- `src/components/pages/SalaryStatisticsPage.tsx:9` - превращаем сотрудников в массив зарплат.

Код:

```tsx
employees.map(empl => empl.salary)
```

Это ещё один пример параметризации и переиспользования:

- страница возраста и страница зарплаты почти одинаковые;
- отличается только то, какие числа они передают в общий компонент графика.

### Общий график `StatisticsLineChart`

Файл: `src/components/StatisticsLineChart.tsx`

Ключевые строки:

- `src/components/StatisticsLineChart.tsx:13-18` - `props` компонента;
- `src/components/StatisticsLineChart.tsx:20-29` - подготовка данных;
- `src/components/StatisticsLineChart.tsx:30-33` - настройка графика;
- `src/components/StatisticsLineChart.tsx:42-72` - отрисовка графика.

### Почему это хороший компонент

Он не знает, откуда пришли числа.

Ему всё равно:

- это возраста;
- это зарплаты;
- это ещё что-то.

Ему дают параметры:

- `numbers`;
- `interval`;
- `xLine`;
- `title`.

И он работает.

Это очень хороший пример `параметризации` и `переиспользования`.

### Что делает `useMemo`

Строки `20-29`:

```tsx
const data: { amount: number; value: number }[] = useMemo(() => {
  const objStat = _.countBy(numbers, (num) => Math.floor(num / interval));
  const data = Object.entries(objStat).map(([key, value]) => ({
    amount: value,
    value: +key * interval + interval,
  }));
  return data;
}, [numbers, interval]);
```

`useMemo` - это способ не пересчитывать что-то тяжёлое без необходимости.

Перевод:

- если `numbers` и `interval` не изменились, старый результат можно переиспользовать;
- если изменились, надо пересчитать.

### Что делает `_.countBy`

`countBy` группирует числа по корзинам.

Например, если интервал `5000`, то зарплаты:

- `5200`,
- `6700`,
- `9800`

могут попасть в соответствующие диапазоны.

### Что происходит в `.map(([key, value]) => ...)`

Это преобразование объекта статистики в массив объектов, который понятен графику.

Графику нужен не абстрактный объект, а массив вида:

```ts
[
  { value: 5000, amount: 3 },
  { value: 10000, amount: 7 }
]
```

---

## 17. Статистика по отделам

Файл: `src/components/pages/DepartmentStatisticsPage.tsx`

Ключевые строки:

- `src/components/pages/DepartmentStatisticsPage.tsx:15-23` - функция подготовки данных;
- `src/components/pages/DepartmentStatisticsPage.tsx:16` - группировка по отделу;
- `src/components/pages/DepartmentStatisticsPage.tsx:17-22` - сбор объекта статистики по каждому отделу;
- `src/components/pages/DepartmentStatisticsPage.tsx:27` - мемоизация результата;
- `src/components/pages/DepartmentStatisticsPage.tsx:34` - передача данных в таблицу.

### Зачем вынесена функция `getDepartmentsInfo`

Это опять декомпозиция.

Вместо того чтобы засунуть длинную обработку данных прямо внутрь JSX, автор вынес вычисление отдельно:

```ts
function getDepartmentsInfo(employees: Employee[]): DepartmentInfo[]
```

Плюсы:

- легче читать;
- легче тестировать;
- легче переиспользовать;
- JSX остаётся чище.

### Что делает `_.groupBy`

Строка `16`:

```ts
const groupObj = _.groupBy(employees, 'department')
```

Это значит:

- взять всех сотрудников;
- разложить их по коробкам по названию отдела.

Например:

- `QA` -> [сотрудник1, сотрудник2];
- `Development` -> [сотрудник3, сотрудник4, сотрудник5].

### Что делает `Object.entries(...).map(...)`

Строка `17` и дальше:

- `Object.entries(groupObj)` превращает объект в массив пар;
- каждая пара выглядит как `[название_отдела, массив_сотрудников]`;
- `.map(...)` превращает каждую пару в объект `DepartmentInfo`.

### Что считается в статистике

Строки `18-21`:

- `department` - название отдела;
- `nEmployees` - количество людей;
- `avgSalary` - средняя зарплата;
- `avgAge` - средний возраст.

### Что делает `useMemo` здесь

Строка `27`:

```tsx
const data: DepartmentInfo[] = useMemo(() => getDepartmentsInfo(employees), [employees])
```

Перевод:

- если массив сотрудников не менялся, не надо заново пересчитывать статистику;
- если менялся, пересчитываем.

---

## 18. Таблица по отделам

Файл: `src/components/DepartmentsTable.tsx`

Ключевые строки:

- `src/components/DepartmentsTable.tsx:5-7` - `props`;
- `src/components/DepartmentsTable.tsx:9` - получение `departmentsInfo`;
- `src/components/DepartmentsTable.tsx:14-21` - заголовок таблицы;
- `src/components/DepartmentsTable.tsx:23-31` - строки таблицы.

### Почему это отдельный компонент

Потому что страница статистики по отделам должна отвечать за логику страницы, а не за каждую HTML-ячейку.

Получается разделение обязанностей:

- `DepartmentStatisticsPage` готовит данные;
- `DepartmentsTable` показывает данные.

Это очень здоровый подход.

---

## 19. Утилиты дат

Файл: `src/utils/date_functions.ts`

Ключевые строки:

- `src/utils/date_functions.ts:1-4` - вычисление возраста;
- `src/utils/date_functions.ts:5-10` - получение даты на основе возраста.

### Что делает `getAge`

```ts
export function getAge(birthDate: string): number {
    return new Date().getFullYear()
      - new Date(birthDate).getFullYear()
}
```

Очень грубое объяснение:

- берём текущий год;
- вычитаем год рождения.

Важно: это упрощённый возраст, без точного учёта месяца и дня.

### Что делает `getIsoDateFromAge`

Эта функция используется в форме для ограничения даты рождения:

- `src/components/EmployeeForm.tsx:57` - минимальная дата;
- `src/components/EmployeeForm.tsx:57` - максимальная дата.

То есть конфиг говорит:

- сотруднику должно быть от 20 до 75 лет;

а утилита помогает превратить это в даты для поля `<input type="date">`.

---

## 20. Поток данных от начала до конца

### Сценарий 1. Пользователь открывает главную страницу

1. `src/main.tsx:9-16` запускает приложение.
2. `src/router/routes.tsx:10-13` выбирает домашний маршрут.
3. `src/components/pages/LayoutPage.tsx:8-10` рисует общий каркас.
4. `src/components/pages/HomePage.tsx:4` вставляет `Employees`.
5. `src/components/Employees.tsx:5` вызывает `useEmployees`.
6. `src/services/hooks/useEmployees.ts:10-14` запускает `useQuery`.
7. `src/services/ApiClientImpl.ts:23-25` делает запрос на сервер.
8. `Employees` получает массив и рисует таблицу.

### Сценарий 2. Пользователь добавляет сотрудника

1. Пользователь открывает `/add`.
2. `src/router/routes.tsx:14` выбирает `AddEmployeePage`.
3. `src/components/pages/AddEmployeePage.tsx:16` передаёт форме callback `submitter`.
4. `src/components/EmployeeForm.tsx:19` вызывает этот callback после успешной валидации.
5. `src/components/pages/AddEmployeePage.tsx:16` запускает `mutation.mutate(empl)`.
6. `src/services/ApiClientImpl.ts:27-30` отправляет POST-запрос.
7. `src/services/hooks/useEmployeesMutation.ts:15-18` инвалидирует кеш `employees`.
8. `src/components/pages/AddEmployeePage.tsx:15` делает переход на `/`.
9. Главная страница получает обновлённый список.

### Сценарий 3. Пользователь открывает статистику

1. Выбирается одна из страниц статистики.
2. Страница получает список сотрудников через `useEmployees`.
3. Дальше происходят вычисления:
   - возраст;
   - зарплата;
   - или группировка по отделам.
4. Готовые данные передаются в график или таблицу.

---

## 21. Главные понятия из проекта простым языком

### Компонент

Компонент - это кусок интерфейса с логикой.

Примеры:

- `Employees`;
- `EmployeeForm`;
- `AppBar`;
- `StatisticsLineChart`.

### Страница

Страница - это компонент уровня маршрута.

Примеры:

- `HomePage`;
- `AddEmployeePage`;
- `AgeStatisticsPage`.

### Props

Входные данные компонента.

Примеры:

- `EmployeeForm` получает `submitter`;
- `StatisticsLineChart` получает `numbers`, `interval`, `xLine`, `title`;
- `DepartmentsTable` получает `departmentsInfo`.

### State

Внутренняя изменяемая память компонента.

Примеры:

- `open` в `StatisticsSelector`;
- `isHomeNavigate` в `AddEmployeePage`.

### Hook

Специальная React-функция для состояния, эффектов и другой логики.

Примеры:

- `useState`;
- `useMemo`;
- `useLocation`;
- `useQuery`.

### Custom Hook

Ваш собственный хук поверх других хуков.

Примеры:

- `useEmployees`;
- `useEmployeesMutation`.

### Callback

Функция, которую передали, чтобы кто-то вызвал её позже.

Примеры:

- `onOpenChange={(e) => setOpen(e.open)}`;
- `submitter={(empl) => {mutation.mutate(empl); setHomeNavigate(true)}}`;
- `handleSubmit((data) => submitter(data))`.

### Тернарник

Короткий `if/else`.

Пример:

```tsx
open ? <FaChevronUp /> : <FaChevronDown />
```

### Декомпозиция

Разбиение большой задачи на маленькие части.

Примеры:

- страница `HomePage` отдельно, таблица `Employees` отдельно;
- логика запросов вынесена в `services/hooks`;
- преобразование статистики по отделам вынесено в функцию `getDepartmentsInfo`.

### Параметризация

Когда один и тот же код ведёт себя по-разному в зависимости от переданных параметров.

Примеры:

- `StatisticsLineChart` работает и для возрастов, и для зарплат;
- `useEmployees(config?)` может принимать конфиг запроса;
- Chakra-компоненты принимают разные размеры и responsive-значения;
- валидация формы берёт числа из `employeesConfig`.

### Мемоизация

Сохранение результата вычисления, чтобы не делать одну и ту же работу заново.

Примеры:

- `useMemo` в `StatisticsLineChart`;
- `useMemo` в `DepartmentStatisticsPage`.

### Дженерики

Способ писать универсальный код с параметрами типов.

Пример:

- `useEmployeesMutation<TData, TVariables>`.

### Нормализация

Приведение данных к единому формату.

Пример:

- `birthDate` и `birthdate` приводятся к одному полю `birthdate`.

### Инвалидация кеша

Сообщение системе: "старые данные больше не надёжны, сходи за новыми".

Пример:

- `invalidateQueries({ queryKey: ["employees"] })`.

---

## 22. Почему проект в целом написан разумно

Вот сильные стороны текущей структуры:

1. есть разделение на страницы, компоненты, сервисы, модели и утилиты;
2. форма не смешана с прямой работой по API;
3. статистический график переиспользуется;
4. правила валидации вынесены в конфиг;
5. есть нормализация ответа сервера;
6. React Query используется правильно по базовой идее: загрузка отдельно, мутация отдельно, кеш инвалидируется.

---

## 23. Где у проекта точки роста

Ниже не критика ради критики, а технически честный разбор.

### 1. `new QueryClient()` создаётся прямо внутри JSX

Смотри `src/main.tsx:12`.

Так можно, но обычно `QueryClient` создают один раз вне рендера:

```ts
const queryClient = new QueryClient();
```

И потом уже передают его в `QueryClientProvider`.

Почему:

- так понятнее;
- не создаётся впечатление, что клиент может пересоздаваться на каждом рендере.

### 2. В `AddEmployeePage` переход домой происходит сразу

Смотри `src/components/pages/AddEmployeePage.tsx:16`.

Сейчас код делает:

1. `mutation.mutate(empl)`;
2. сразу `setHomeNavigate(true)`.

То есть переход случается, не дожидаясь подтверждения от сервера.

Более надёжно было бы переходить в `onSuccess`.

### 3. `getAge` считает возраст грубо

Смотри `src/utils/date_functions.ts:1-4`.

Сейчас учитывается только разница годов, без месяца и дня.

Для учебного проекта это нормально, но для точной бизнес-логики недостаточно.

### 4. `zustand` пока лишний

Он есть в `package.json:27`, но в коде не используется.

Значит сейчас:

- либо библиотеку можно убрать;
- либо позже она планируется для глобального состояния.

---

## 24. Если объяснить проект одной фразой

Это учебный фронтенд на React, где:

- данные сотрудников приходят с сервера через `axios` и `React Query`,
- страницы переключаются через `react-router-dom`,
- форма собирается через `react-hook-form`,
- статистика строится через переиспользуемые компоненты,
- а структура проекта показывает хорошие базовые приёмы: декомпозицию, параметризацию, коллбэки, условный рендер и типизацию.

---

## 25. Самая короткая "детская" модель проекта

Представь большой шкаф с карточками сотрудников.

- `router` решает, какую дверцу шкафа открыть;
- `AppBar` - это ручки и кнопки сверху;
- `useEmployees` - это работник, который приносит карточки со склада;
- `ApiClientImpl` - это курьер до сервера;
- `EmployeeForm` - это бланк для добавления новой карточки;
- `StatisticsLineChart` и `DepartmentsTable` - это способы красиво пересчитать и показать карточки;
- `models` - это правила, как должна выглядеть правильная карточка;
- `config` - это заранее заданные рамки, например допустимая зарплата и возраст.

Если нужно, следующий логичный шаг - сделать ещё один файл такого же уровня, но уже с разбором "строка за строкой" каждого файла `src` без пропусков.
