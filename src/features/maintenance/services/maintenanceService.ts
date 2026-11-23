import {
  getCmsDocument,
  saveCmsDocument,
} from "@/features/cms/core/cmsService";

import {
  DEFAULT_MAINTENANCE,
  MAINTENANCE_DOC_ID,
  type MaintenanceSettings,
} from "../types/maintenance";

export function getMaintenance(): Promise<MaintenanceSettings> {
  return getCmsDocument(MAINTENANCE_DOC_ID, DEFAULT_MAINTENANCE);
}

export function saveMaintenance(data: MaintenanceSettings): Promise<void> {
  return saveCmsDocument(MAINTENANCE_DOC_ID, data);
}