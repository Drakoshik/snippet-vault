import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
} from 'axios';

interface CustomAxiosInstance extends AxiosInstance {
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const apiClient: CustomAxiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
}) as CustomAxiosInstance;


apiClient.interceptors.response.use(
    <T>(response: AxiosResponse<T>): T => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
