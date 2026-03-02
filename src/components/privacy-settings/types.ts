export interface CookieInfo {
  name: string;
  value: string;
  category: string;
  purpose: string;
  duration: string;
  source: string;
  gdprBasis: string;
  type?: "cookie" | "localStorage" | "sessionStorage";
}

export interface ConsentStatus {
  necessary?: boolean;
  analytics?: boolean;
  marketing?: boolean;
  preferences?: boolean;
  performance?: boolean;
  targeting?: boolean;
  functionality?: boolean;
  [key: string]: boolean | undefined;
}

export interface GroupedCookies {
  category: string;
  items: CookieInfo[];
  description: string;
}
