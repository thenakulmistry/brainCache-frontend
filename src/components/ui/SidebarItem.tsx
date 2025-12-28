interface SidebarItemProps {
    title: string,
    icon: React.ReactElement,
    onClick?: () => void,
    active?: boolean,
}

export const SidebarItem = (props: SidebarItemProps) => {
    return (
        <div className={`flex items-center gap-4 px-5 py-3 text-lg rounded-2xl transition-all duration-200
            ${props.active
                ? "bg-white/20 text-white font-bold shadow-lg border-l-4 border-indigo-500"
                : "text-gray-300 hover:bg-white/10 hover:scale-[1.08]"
            }`}
            onClick={props.onClick} >
            <div className={`${props.active ? "text-indigo-400" : ""}`}>
                {props.icon}
            </div>
            {props.title}
        </div>
    )
}