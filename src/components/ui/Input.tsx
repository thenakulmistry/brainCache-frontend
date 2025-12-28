interface InputProps{
    placeholder?: string,
    type?: string,
    value?: string,
    ref?: React.Ref<HTMLInputElement>,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export const Input = (props: InputProps) => {
    return (
        <input {...props} className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all w-full" />
    )
}