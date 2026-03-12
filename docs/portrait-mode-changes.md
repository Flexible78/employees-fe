# Portrait Mode Changes - Overview

## Scope
This document explains the logic that was implemented for portrait mode, the employee card dialog, the sticky Full Name column in the desktop table, and the birthdate fallback logic.

## What Was Added or Modified
1. Portrait mode uses an ellipsis button to open a dialog with an EmployeeCard.
2. EmployeeCard renders avatar, full name, department, salary, and birthdate.
3. Admin users see Edit and Delete actions inside the card.
4. Desktop table has a sticky Full Name column.
5. Birthdate rendering now tolerates multiple key variants and empty values.

## Behavioral Flow
```
[HomePage]
  | usePortrait()
  |-- false --> [Employees]  (desktop table, sticky Full Name)
  `-- true  --> [EmployeesPortrait]
                   |
                   | click ellipsis
                   v
              [DialogShaper]
                   v
              [EmployeeCard]
                   |
                   | role === ADMIN
                   v
         [EditEmployee]  [DeleteEmployee]
```

## Component Wiring Diagram
```
EmployeesPortrait
  -> DialogShaper (trigger = ellipsis button)
       -> EmployeeCard
            -> EditEmployee (ADMIN only)
            -> DeleteEmployee (ADMIN only)

Employees
  -> Table with sticky Full Name column
```

## Birthdate Handling
Birthdate is resolved with fallbacks to avoid empty UI:
- Prefer `birthdate`
- If missing, use `birthDate`
- If missing, use `birthday`
- If all are empty, show `-`
- If value is a valid date, format to YYYY-MM-DD

## Files Changed
- `src/components/EmployeeCard.tsx`
  - Added card UI for portrait mode.
  - Added birthdate resolver with safe formatting.
  - Added admin-only Edit/Delete controls.
- `src/components/EmployeesPortrait.tsx`
  - Ellipsis now opens `DialogShaper` with `EmployeeCard` content.
- `src/components/Employees.tsx`
  - Sticky Full Name column using `position: sticky`.
  - Birthdate column uses a safe resolver.
- `src/components/DialogShaper.tsx`
  - Accepts `trigger` (custom trigger element) or `buttonName`.
  - Supports both controlled and uncontrolled open state.

## Files Removed
- `src/components/Employees.types.ts`
- `src/components/EmployeesPortrait.types.ts`
- `src/components/EmployeeCard.types.ts`
- `src/components/DialogShaper.types.ts`

## Verification Checklist
1. Portrait mode: ellipsis opens a dialog with EmployeeCard.
2. Birthdate is visible in card and desktop table.
3. Admin sees Edit/Delete in the card.
4. Desktop table keeps Full Name visible during horizontal scroll.
