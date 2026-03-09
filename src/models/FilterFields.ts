import { FiltersStore } from "../state-management/filters-store";
import { NonFunctionProps } from "../utils/util-types";

export type FilterFields = NonFunctionProps<FiltersStore>
export type ActiveFilters = Partial<FilterFields>
