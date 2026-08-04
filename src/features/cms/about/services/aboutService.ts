import type { AboutSettings } from "../types/about";
import { DEFAULT_ABOUT_SETTINGS } from "../types/about";

import {
  getCmsDocument,
  saveCmsDocument,
} from "../../core/cmsService";

const DOCUMENT_ID = "about";

export function getAboutSettings(): Promise<AboutSettings> {
  return getCmsDocument(
    DOCUMENT_ID,
    DEFAULT_ABOUT_SETTINGS,
  );
}

export function saveAboutSettings(
  settings: AboutSettings,
): Promise<void> {
  return saveCmsDocument(
    DOCUMENT_ID,
    settings,
  );
}