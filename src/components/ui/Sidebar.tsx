import { useContentStore } from "../../store/contentStore"
import { LinkIcon } from "../icons/LinkIcon"
import { TwitterIcon } from "../icons/TwitterIcon"
import { YoutubeIcon } from "../icons/YoutubeIcon"
import { SidebarItem } from "./SidebarItem"
import { HamburgerIcon } from "../icons/HamburgerIcon"
import { useNavigate } from "react-router-dom"
import { LogoutIcon } from "../icons/LogoutIcon"
import { CrossIcon } from "../icons/CrossIcon"

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    const filter = useContentStore((state) => state.filter);
    const setFilter = useContentStore((state) => state.setFilter);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    }
    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            ></div>
            <div className={`h-screen w-76 fixed top-0 left-0 flex flex-col justify-between border-r border-white/20 p-8 bg-white/5 backdrop-blur-xl z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="md:hidden mb-8 flex gap-3 items-center flex-row-reverse text-gray-300 hover:text-white cursor-pointer" onClick={onClose}>    
                    <CrossIcon size="lg" />
                    Close
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-12 text-white ml-4">Brain Cache</h1>
                    
                    <div className="flex flex-col gap-2">
                        <SidebarItem title="All" icon={<HamburgerIcon size="md" />} onClick={() => setFilter("all")} active={filter === "all"} />
                        <SidebarItem title="YouTube" icon={<YoutubeIcon size="md" />} onClick={() => setFilter("youtube")} active={filter === "youtube"} />
                        <SidebarItem title="Twitter" icon={<TwitterIcon size="md" />} onClick={() => setFilter("twitter")} active={filter === "twitter"} />
                        <SidebarItem title="Links" icon={<LinkIcon size="md" />} onClick={() => setFilter("link")} active={filter === "link"} />
                    </div>
                </div>
                <SidebarItem title="Logout" icon={<LogoutIcon size="md" />} onClick={handleLogout} />
            </div>
        </>
    )
}