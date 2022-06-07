export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  password: string;
  token: string;
}

const storage = localStorage;

const set = (key: string, value: string) => storage.setItem(key, value);
const clr = (key: string) => storage.removeItem(key);
const get = (key: string): string | null => storage.getItem(key);

const USER = "12dea96fec20593566ab75692c9949596833adc9";
const NX_PG = "8615a7d48c4b1b46dfa390ae7f0dc68297b0b8e6";

export const getUserProfile = (): UserProfile | null => (get(USER) ? JSON.parse(get(USER)!) : null);

export const getToken = (): string => (getUserProfile() ? getUserProfile()!.token : "");

export const setUserProfile = (userProfile: UserProfile) => set(USER, JSON.stringify(userProfile));
export const clearUserProfile = () => clr(USER);
export const isLoggedIn = () => getUserProfile() !== null;

export const setNextPage = (value: string) => set(NX_PG, value);
export const clearNextPage = () => clr(NX_PG);
export const getNextPage = () => get(NX_PG);
