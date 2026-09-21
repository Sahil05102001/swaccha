export interface PolicySettings {
  title: string;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const DEFAULT_POLICY_SETTINGS: PolicySettings = {
  title: "",
  content: "",
  createdAt: null,
  updatedAt: null,
};