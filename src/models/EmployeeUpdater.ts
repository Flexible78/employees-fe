import { type Employee } from "./Employee";

export type EmployeeUpdater= {
    id: string;
    fields: Partial<Employee>
}