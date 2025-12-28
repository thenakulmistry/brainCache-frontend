import { memo, useState, useRef } from "react"
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { useContentStore } from "../../store/contentStore";
import { LoadingIcon } from "../icons/LoadingIcon";
import { useDebouncedEffect } from "../../hooks/useDebounce";

interface CardProps {
    _id: string,
    type: "youtube" | "twitter" | "link",
    title: string,
    link: string,
    tags?: string[],
    readOnly?: boolean,
    onClick?: () => void,
}

declare global {
    interface Window {
        twttr: any;
    }
}

const typeIcons: Record<string, React.ReactElement> = {
    "youtube": <YoutubeIcon size="sm" />,
    "twitter": <TwitterIcon size="sm" />,
    "link": <LinkIcon size="sm" />,
}

const getYoutubeEmbedUrl = (url: string) => {
    try{
        if(url.includes("youtu.be")){
            const id = url.split("youtu.be/")[1].split("?")[0];
            return `https://www.youtube.com/embed/${id}`;
        }
        if(url.includes("watch?v=")){
            const id = url.split("watch?v=")[1].split("&")[0];
            return `https://www.youtube.com/embed/${id}`;
        }
        return url;
    } catch(e){
        return url;
    }
}

export const Card = memo((props: CardProps) => {
    const { _id, type, title, link, tags, readOnly, onClick } = props;
    const deleteContent = useContentStore((state) => state.deleteContent);
    const twitterRef = useRef<HTMLDivElement>(null);
    const [isTweetLoading, setIsTweetLoading] = useState(false);

    const hadleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteContent(_id);
    }

    useDebouncedEffect(() => {
        if (type !== "twitter") return;
        
        const currentRef = twitterRef.current;
        if (!currentRef) return;

        // Reset state
        currentRef.innerHTML = ""; 
        setIsTweetLoading(true);

        const tweetId = link.replace("x.com", "twitter.com").split("/").pop()?.split("?")[0];
        if (!tweetId) return;

        let isCancelled = false;

        const loadTweet = async () => {
            // Wait for window.twttr to be available
            if (!window.twttr) {
                await new Promise<void>((resolve) => {
                    const script = document.createElement("script");
                    script.src = "https://platform.twitter.com/widgets.js";
                    script.async = true;
                    script.onload = () => resolve();
                    document.body.appendChild(script);
                });
            }

            // Wait for widgets to be ready
            if (!window.twttr.widgets) {
                await new Promise<void>((resolve) => {
                    const interval = setInterval(() => {
                        if (window.twttr.widgets) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 50);
                });
            }

            if (isCancelled) return;

            try {
                const widget = await window.twttr.widgets.createTweet(
                    tweetId,
                    currentRef,
                    {
                        theme: 'dark',
                        dnt: true,
                        align: 'center'
                    }
                );

                if (isCancelled) {
                    if (currentRef) currentRef.innerHTML = "";
                    return;
                }

                // Fallback if widget creation failed (e.g. invalid ID or rate limit)
                if (!widget && currentRef) {
                    const fallbackLink = document.createElement('a');
                    fallbackLink.href = link;
                    fallbackLink.target = "_blank";
                    fallbackLink.rel = "noopener noreferrer";
                    fallbackLink.textContent = "View Tweet on Twitter";
                    fallbackLink.className = "text-gray-400 hover:text-indigo-400 transition-colors";
                    currentRef.appendChild(fallbackLink);
                }

            } catch (e) {
                console.error("Error loading tweet", e);
                if (!isCancelled && currentRef) {
                    const fallbackLink = document.createElement('a');
                    fallbackLink.href = link;
                    fallbackLink.target = "_blank";
                    fallbackLink.rel = "noopener noreferrer";
                    fallbackLink.textContent = "View Tweet on Twitter";
                    fallbackLink.className = "text-gray-400 hover:text-indigo-400 transition-colors";
                    currentRef.appendChild(fallbackLink);
                }
            } finally {
                if (!isCancelled) setIsTweetLoading(false);
            }
        };

        loadTweet();

        return () => {
            isCancelled = true;
            if (currentRef) currentRef.innerHTML = "";
        }
    }, [type, link], 100);

    const baseClasses = "flex flex-col rounded-lg p-4 bg-white/10 backdrop-blur-md border-white/20 shadow-sm hover:shadow-md break-inside-avoid mb-4 transition-all duration-300";

    const tagClasses = "text-sm mr-2 text-indigo-200 bg-indigo-900/40 px-2 py-1 rounded-full border-white/10";

    const classes = `${baseClasses}`;
    return (
        <div className={classes} onClick={onClick}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-gray-200">
                    {typeIcons[type]}
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                </div>
                {!readOnly && (
                    <div onClick={hadleDelete} className="flex gap-5 text-gray-200 hover:bg-white/10 rounded-md p-1 cursor-pointer">
                        <DeleteIcon size="sm" />
                    </div>
                )}
            </div>
            <div>
                {type === "youtube" ? (
                    <iframe className="w-full aspect-video rounded-lg" 
                    src={getYoutubeEmbedUrl(link)} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen>
                    </iframe>
                ) : type === "twitter" ? (
                    <div className="min-h-37.5 flex justify-center items-center text-gray-400 w-full relative">
                        {isTweetLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <LoadingIcon />
                            </div>
                        )}
                        <div ref={twitterRef} className="w-full flex justify-center"></div>
                    </div>
                ) : (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 block break-all hover:text-indigo-400 transition-colors"
                    > {link}</a>
                )}
            </div>
            {tags && (
                <div className="flex mt-2">
                    {tags.map((tag, index) => (
                        <span key={index} className={tagClasses}>#{tag}</span>
                    ))}
                </div>
            )}
        </div>
    )
});
