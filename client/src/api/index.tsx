import axios, { AxiosError } from "axios";
import { NavigateFunction } from "react-router";
import { Tournament, User } from "../models";
import * as storage from "../utils/storage";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use(
  (req) => {
    req.headers = { authorization: `token ${storage.getToken()}` };
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const tEndpoint = "/tournaments";

export const getTournaments = () => API.get(tEndpoint);
export const getTournament = (id: string) => API.get(`${tEndpoint}/${id}`);
export const createTournament = (tournament: Tournament) => API.post(tEndpoint, tournament);
export const updateTournament = (id: string, changes: any) => API.patch(`${tEndpoint}`, { id, changes });
export const deleteTournament = (id: string) => API.delete(`${tEndpoint}/${id}`);
export const joinTournament = (id: string, player: string) => API.patch(`${tEndpoint}/addPlayer`, { id, player });
export const unJoinTournament = (id: string, player: string) => API.patch(`${tEndpoint}/delPlayer`, { id, player });
export const getTournamentTree = (id: string) => API.get(`${tEndpoint}/tree/${id}`);
export const setScores = (id: string, gameIdx: string, setter: string, winner: string) =>
  API.patch(`${tEndpoint}/${id}/${gameIdx}/scores`, { setter, winner });
export const confirmScores = (id: string, gameIdx: string, value: boolean) =>
  API.patch(`${tEndpoint}/${id}/${gameIdx}/scores/confirm`, { value });

const uEndpoint = "/users";

export const signIn = (data: { email: string; password: string }) => API.post(`${uEndpoint}/sign-in`, data);
export const signUp = (user: User) => API.post(`${uEndpoint}/sign-up`, user);
export const confirmEmail = (id: string) => API.patch(`${uEndpoint}/confirm-email`, { id });
export const retryConfirm = (id: string) => API.patch(`${uEndpoint}/retry-confirm`, { id });
export const validateLink = (id: string, hash: string) => API.get(`${uEndpoint}/forgot-password?id=${id}&hash=${hash}`);
export const forgotPassword = (email: string) => API.patch(`${uEndpoint}/forgot-password`, { email });
export const resetPassword = (data: { id: string; password: string }) => API.patch(`${uEndpoint}/reset-password`, data);

export interface ServerResponse {
  message: string;
}

export interface ServerError {
  message: string;
  internalCode?: number;
  canRetry?: boolean;
  unAuth?: boolean;
}

export const errorData = (
  error: unknown,
  navigate?: NavigateFunction,
  messageSetter?: (value: React.SetStateAction<string | undefined>) => void
): ServerError | void => {
  if (!axios.isAxiosError(error)) return;

  const serverError = error as AxiosError;
  if (!(serverError && serverError.response)) return;

  let data = { ...(serverError.response.data as ServerError), code: serverError.code };
  if (data.internalCode && navigate) return navigate(`/server-side-error/${data.internalCode}`);
  if (messageSetter) messageSetter(data.message);

  return data;
};
