import { create } from 'zustand';
import axios from 'axios';
import { BACKEND_URL } from '../config';

interface Content {
    _id: string;
    type: "youtube" | "twitter" | "link";
    link: string;
    title: string;
    tags: string[];
}

interface ContentState {
    contents: Content[];
    filter: "all" | "youtube" | "twitter" | "link";
    refresh: () => Promise<void>;
    addContent: (content: {title: string; link: string; type: string; tags?: string[]}) => Promise<void>;
    deleteContent: (id: string) => Promise<void>;
    shareBrain: () => Promise<string | null>;
    setFilter: (filter: ContentState["filter"]) => void;
}

export const useContentStore = create<ContentState>((set) => ({
    contents: [],
    filter: "all",
    refresh: async () => {
        try{
            const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
                headers: {
                    Authorization: localStorage.getItem("token") || ""
                }
            });
            set({ contents: response.data.contents });
        } catch (error) {
            console.error("Failed to refresh contents", error);
        }
    },
    addContent: async (content) => {
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/content`, content, {
                headers: {
                    Authorization: localStorage.getItem("token") || ""
                }
            });
            set((state) => ({
                contents: [...state.contents, response.data.content]
            }));
        } catch (error) {
            console.error("Failed to add content", error);
        }
    },
    deleteContent: async (id: string) => {
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/content/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token") || ""
                }
            });
            set((state) => ({
                contents: state.contents.filter(content => content._id !== id)
            }));
        } catch (error) {
            console.error("Failed to delete content", error);
        }
    },
    shareBrain: async () => {
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                share: true
            }, {
                headers: {
                    Authorization: localStorage.getItem("token") || ""
                }
            });
            return response.data.hash;
        } catch (error) {
            console.error("Failed to share brain", error);
            return null;
        }
    },
    setFilter: (filter) => set({ filter }),
}))