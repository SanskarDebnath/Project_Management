export const AUTH_STORAGE_KEY = 'management_auth_token';
export const USER_STORAGE_KEY = 'management_user_session';
export const THEME_STORAGE_KEY = 'management_theme_settings';
export const ACTIVE_ROLE_KEY = 'management_active_role';

export enum ManagementRole {
  CHECKER = 'CHECKER', // Department Officer / Initiator
  APPROVER = 'APPROVER', // Chief Executive / Financial Approver
}

export const WORKFLOW_STATUS = {
  SUBMITTED: 'SUBMITTED',
  CHECKER_VERIFIED: 'CHECKER_VERIFIED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};
