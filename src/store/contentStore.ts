import { create } from 'zustand';

interface ContentState {
    filter: "all" | "youtube" | "twitter" | "link";
    setFilter: (filter: ContentState["filter"]) => void;
}

export const useContentStore = create<ContentState>((set) => ({
    filter: "all",
    setFilter: (filter) => set({ filter }),
}))