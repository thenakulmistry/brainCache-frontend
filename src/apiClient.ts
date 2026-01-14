import axios from 'axios';
import { BACKEND_URL } from './config';

export interface Content {
    _id: string;
    type: "youtube" | "twitter" | "link";
    link: string;
    title: string;
    tags: string[];
}

export const api = axios.create({
    baseURL: `${BACKEND_URL}/api/v1`,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = token;
    }
    return config;
})

export async function fetchContents(): Promise<Content[]> {
    const response = await api.get('/content');
    return response.data.contents;
}

export function addContent(content: {title: string; link: string; type: string; tags?: string[]}) {
    return api.post('/content', content);
}

export function deleteContent(id: string) {
    return api.delete(`/content/${id}`);
}

export async function shareBrain(): Promise<string> {
    const response = await api.post<{ hash: string }>('/brain/share', { share: true });
    return response.data.hash;
}