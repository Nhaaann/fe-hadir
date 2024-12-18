import axios, { AxiosInstance } from "axios";
import { env } from "process";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

export const axiosClientRefresh: AxiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

export interface BaseResponsePagination {
  status: string;
  message: string;
  pagination: {
    page: number;
    limit: number;
    pageSize: number;
    total: number;
  };
}

export interface BaseResponseSucess{
  status:string;
  message: string;
  data?:any;
}
