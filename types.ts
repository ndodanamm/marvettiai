
export enum StageId {
  REGISTRATION = 1,
  LOGO = 2,
  PROFILE = 3,
  PLAN = 4,
  COMPLIANCE = 5,
  WEBSITE = 6,
  SOCIAL = 7,
  SEO = 8,
  MARKETING = 9,
  CRM = 10,
  MAINTENANCE = 11,
  REMOTE_ADMIN = 12
}

export interface ClientData {
  firstName: string;
  lastName: string;
  email: string;
  cell: string;
  companyName?: string;
  registrationNumber?: string;
  status: 'PENDING' | 'COMPLETED' | 'ACTIVE';
}

export interface StageInfo {
  id: StageId;
  name: string;
  price: string;
  description: string;
  isUnlocked: boolean;
  status: 'NOT_STARTED' | 'PENDING' | 'COMPLETED';
}

export interface BusinessNiche {
  id: string;
  name: string;
}

export interface Director {
  id: string;
  fullName: string;
  idNumber: string;
  nationality: string;
  email: string;
  cell: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
}

export interface ApplicationState {
  client: ClientData | null;
  currentStage: StageId;
  stages: Record<StageId, StageInfo>;
  isAdminMode: boolean;
  whatsappDraft: string;
  theme: 'light' | 'dark';
}
