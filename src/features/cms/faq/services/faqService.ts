import {
  getCmsDocument,
  saveCmsDocument,
} from "../../core/cmsService";

import type { FaqSettings } from "../types/faq";
import { DEFAULT_FAQ_SETTINGS } from "../types/faq";

const DOCUMENT_ID = "faq";

export function getFaqSettings(): Promise<FaqSettings> {
  return getCmsDocument(
    DOCUMENT_ID,
    DEFAULT_FAQ_SETTINGS,
  );
}

export function saveFaqSettings(
  settings: FaqSettings,
): Promise<void> {
  return saveCmsDocument(
    DOCUMENT_ID,
    settings,
  );
}