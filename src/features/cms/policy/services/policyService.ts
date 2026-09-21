import {
  getCmsDocument,
  saveCmsDocument,
} from "../../core/cmsService";

import {
  DEFAULT_POLICY_SETTINGS,
  type PolicySettings,
} from "../types/policy";

export function getPolicy(
  documentId: string,
): Promise<PolicySettings> {
  return getCmsDocument(
    documentId,
    DEFAULT_POLICY_SETTINGS,
  );
}

export function savePolicy(
  documentId: string,
  data: PolicySettings,
): Promise<void> {
  return saveCmsDocument(
    documentId,
    data,
  );
}