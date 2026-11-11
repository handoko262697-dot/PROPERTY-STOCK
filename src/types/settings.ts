export interface AppSettings {
  salesName: string;
  salesPhone: string;
  salesWhatsapp: string;
  agencyName: string;
  lastUpdated?: string;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  salesName: 'Handoko (Marketing KYAN Property)',
  salesPhone: '0812-8899-7711',
  salesWhatsapp: '6281288997711',
  agencyName: 'KYAN CONTRACTOR & AGENCY PROPERTY',
};
