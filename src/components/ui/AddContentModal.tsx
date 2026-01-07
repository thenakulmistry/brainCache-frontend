import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import React, { useRef, useState } from "react";
import { Select } from "./Select";
import { useAddContent } from "../../hooks/useContentQueries";
import { toast } from "./Toast";

const ContentType = {
    YOUTUBE: "youtube",
    TWITTER: "twitter",
    LINK: "link"
}

type ContentType = (typeof ContentType)[keyof typeof ContentType];

const contentTypeOptions = [
    { label: "YouTube", value: ContentType.YOUTUBE },
    { label: "Twitter", value: ContentType.TWITTER },
    { label: "Link", value: ContentType.LINK },
];

export function AddContentModal({open, onClose}: {open: boolean, onClose: () => void}) {

    const titleref = useRef<HTMLInputElement>(null);
    const linkref = useRef<HTMLInputElement>(null);
    const[type, setType] = useState<ContentType>(ContentType.LINK);

    const { mutate: addContent } = useAddContent();

    async function addContentHandler(e: React.FormEvent) {
        e.preventDefault();
        const title = titleref.current?.value;
        const link = linkref.current?.value;
        if(!title || !link){
            toast.error("Please provide both title and link");
            return;
        }
        addContent({ title, link, type }, {
            onSuccess: () => {
                onClose();
            },
            onError: (error: any) => {
                const message = error.response?.data?.message;
                if(message){
                    toast.error(message);
                    return;
                }
                toast.error("Failed to add content. Please try again.");
            }
        })

    }

    return(
        <div>
            {open && <div className="w-screen h-screen fixed top-0 left-0 bg-slate-900/60 flex items-center justify-center z-50">
                <form onSubmit={addContentHandler} className="bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl flex flex-col items-center justify-center gap-5 p-6 w-96 shadow-2xl">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-white font-semibold">Add Content</h2>
                        <div onClick={onClose} className="hover:bg-white/10 rounded-md p-1 text-white">
                            <CrossIcon size="md" />
                        </div>
                    </div>
                    <Input placeholder="Title" ref={titleref}/>
                    <Input placeholder="Content URL" ref={linkref} />
                    <Select options={contentTypeOptions} value={type} onChange={(val) => setType(val as ContentType)} label="Type" />
                    <Button variant="primary" size="md" label="Add Content" fullWidth={true} />
                </form>
            </div>}
        </div>
    )
}