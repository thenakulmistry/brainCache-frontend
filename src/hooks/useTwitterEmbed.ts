import { useRef, useState, useEffect } from "react";

declare global {
    interface Window {
        twttr: {
            widgets: {
                createTweet: (
                    tweetId: string,
                    container: HTMLElement,
                    options?: { theme?: string; dnt?: boolean; align?: string }
                ) => Promise<HTMLElement | undefined>;
            };
        };
    }
}

const extractTweetId = (url: string): string | null => {
    const normalized = url.replace("x.com", "twitter.com");
    const id = normalized.split("/").pop()?.split("?")[0];
    return id || null;
};

const waitForTwitterWidgets = (): Promise<void> => {
    if (window.twttr?.widgets) return Promise.resolve();
    
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (window.twttr?.widgets) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
};

interface UseTwitterEmbedOptions {
    theme?: "light" | "dark";
    align?: "left" | "center" | "right";
}

export const useTwitterEmbed = (link: string, options: UseTwitterEmbedOptions = {}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { theme = "dark", align = "center" } = options;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Prevent duplicate loads (handles React StrictMode)
        if (isLoadingRef.current || container.querySelector(".twitter-tweet-rendered")) {
            return;
        }

        const tweetId = extractTweetId(link);
        if (!tweetId) {
            setError("Invalid tweet URL");
            return;
        }

        isLoadingRef.current = true;
        container.innerHTML = "";
        setIsLoading(true);
        setError(null);

        const loadTweet = async () => {
            try {
                await waitForTwitterWidgets();

                const widget = await window.twttr.widgets.createTweet(tweetId, container, {
                    theme,
                    dnt: true,
                    align,
                });

                if (!widget) {
                    setError("Tweet not found or unavailable");
                }
            } catch (e) {
                console.error("Error loading tweet:", e);
                setError("Failed to load tweet");
            } finally {
                setIsLoading(false);
                isLoadingRef.current = false;
            }
        };

        loadTweet();
    }, [link, theme, align]);

    return { containerRef, isLoading, error };
};
