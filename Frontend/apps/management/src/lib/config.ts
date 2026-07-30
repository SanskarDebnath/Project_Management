export const BASE_API_URL = (import.meta.env.VITE_BASE_API_URL as string) || 'http://localhost:8000/v1';
export const VITE_BASE_API_URL_WITHOUT_BIDDER = (import.meta.env.VITE_BASE_API_URL_WITHOUT_BIDDER as string) || 'http://localhost:8000/v1/master';
export const AES_SECRET_KEY = (import.meta.env.VITE_SECRET_KEY as string) || 'EnterprisePortalAESSecretKey2026Secure';
export const PORTAL_NAME = (import.meta.env.VITE_PORTAL_NAME as string) || 'Management & Budget Control Portal';
export const DEPARTMENT_NAME = (import.meta.env.VITE_DEPARTMENT_NAME as string) || 'Department of Public Works';
export const GOVERNMENT_NAME = (import.meta.env.VITE_GOVERNMENT_NAME as string) || 'State Portal Authority';
export const EMPLOYEE_URL = (import.meta.env.VITE_EMPLOYEE_URL as string) || 'http://localhost:3000';
