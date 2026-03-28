import type { SearchField } from "./constants"

export function professionalAssignDialogQueryKey(
  searchField: SearchField,
  debouncedSearch: string,
) {
  return ["professionals", "assign-dialog", searchField, debouncedSearch] as const
}
