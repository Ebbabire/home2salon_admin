import type { IAppSettings } from "@/types"
import { apiFetch } from "./api"

export async function getAppSettings(): Promise<IAppSettings> {
  return apiFetch<IAppSettings>("/settings")
}

export async function updateAppSettings(
  payload: Pick<IAppSettings, "advance_payment_percentage">
): Promise<IAppSettings> {
  return apiFetch<IAppSettings>("/settings/admin/advance-percentage", {
    method: "PATCH",
    body: { percentage: payload.advance_payment_percentage },
  })
}
