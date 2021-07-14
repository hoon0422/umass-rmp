export const HOME_PATH = '/' as const;
export const AUTH_PATH = '/auth' as const;
export const AUTH_SIGN_OUT_PATH = '/auth/sign-out' as const;
export const SECTION_PATH = '/section/:sectionId' as const;
export const NOT_FOUND_PATH = '/notfound' as const;

export const getHomePath = () => HOME_PATH;
export const getAuthPath = () => AUTH_PATH;
export const getAuthSignOutPath = () => AUTH_SIGN_OUT_PATH;
export const getSectionPath = (sectionId: number) =>
  SECTION_PATH.replace(':sectionId', `${sectionId}`);
export const getNotFoundPath = () => NOT_FOUND_PATH;
