
export enum DocTheme {
  RRHH_MODEL_1 = 'RRHH - Modelo Tipo A',
  RRHH_MODEL_2 = 'RRHH - Modelo Tipo B',
  REQUIREMENT = 'Requerimiento Oficial',
  SANCTION = 'Acuerdo de Sanción',
  CITATION = 'Citación / Notificación',
  OTHER = 'Otros Documentos'
}

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
}

export interface ProcessedDocument {
  id: string;
  fileName: string;
  timestamp: string;
  theme: DocTheme;
  fields: ExtractedField[];
  summary: string;
  imageUrl: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export interface RedistributionRule {
  theme: DocTheme;
  targetAccount: string;
  enabled: boolean;
}

export type AppTab = 'dashboard' | 'extract' | 'history' | 'redistribution';
