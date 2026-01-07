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
    headers: {
        Authorization: localStorage.getItem("token") || ""
    },
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

export function shareBrain(){
    return api.post('/brain/share', { share: true });
}