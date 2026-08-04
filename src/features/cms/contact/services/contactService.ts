import {
  getCmsDocument,
  saveCmsDocument,
} from "../../core/cmsService";

import type { ContactSettings } from "../types/contact";
import { DEFAULT_CONTACT_SETTINGS } from "../types/contact";

const DOCUMENT_ID = "contact";

export function getContactSettings(): Promise<ContactSettings> {
  return getCmsDocument(
    DOCUMENT_ID,
    DEFAULT_CONTACT_SETTINGS,
  );
}

export function saveContactSettings(
  settings: ContactSettings,
): Promise<void> {
  return saveCmsDocument(
    DOCUMENT_ID,
    settings,
  );
}