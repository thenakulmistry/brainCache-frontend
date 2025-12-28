import type React from "react"
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { useContentStore } from "../../store/contentStore";

interface CardProps {
    _id: string,
    type: "youtube" | "twitter" | "link",
    title: string,
    link: string,
    tags?: string[],
    readOnly?: boolean,
    onClick?: () => void,
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

export const Card = (props: CardProps) => {
    const { _id, type, title, link, tags, readOnly, onClick } = props;
    const deleteContent = useContentStore((state) => state.deleteContent);

    const hadleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteContent(_id);
    }

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
                    <blockquote className="twitter-tweet">
                        <a href={link.replace("x.com", "twitter.com")}></a> 
                    </blockquote>
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
}
