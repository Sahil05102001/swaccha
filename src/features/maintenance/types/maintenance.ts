export const MAINTENANCE_DOC_ID = "maintenance";

export interface MaintenanceSettings {
  enabled: boolean;
  title: string;
  /** Why the store is down. Supports **bold** and [links](https://…). */
  reason: string;
  /** Expected reopening time, stored as an ISO string. */
  endsAt: string | null;
  showCountdown: boolean;
  showContact: boolean;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const DEFAULT_MAINTENANCE: MaintenanceSettings = {
  enabled: false,
  title: "We'll be back soon",
  reason:
    "We're making some improvements to the store. Thank you for your patience.",
  endsAt: null,
  showCountdown: true,
  showContact: true,
  contactEmail: "",
  contactPhone: "",
  whatsapp: "",
  createdAt: null,
  updatedAt: null,
};