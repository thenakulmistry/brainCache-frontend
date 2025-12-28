interface ButtonProps {
    variant: "primary" | "secondary",
    size: "sm" | "md" | "lg",
    label: string,
    startIcon?: React.ReactElement,
    endIcon?: React.ReactElement,
    fullWidth?: boolean,
    onClick?: () => void,
}

export const Button = (props: ButtonProps) => {
    const { variant, size, label, startIcon, endIcon, fullWidth, onClick } = props;

    const baseClasses = "rounded-lg font-semibold flex justify-center items-center hover:shadow-lg";
    const variantClasses = {
        "primary": "bg-btn-primary text-white hover:bg-btn-primary-hover",
        "secondary": "bg-btn-secondary text-btn-secondary-text hover:bg-btn-secondary-hover"
    }
    const sizeClasses = {
        "sm": "px-3 py-1 text-sm",
        "md": "px-4 py-2 text-base",
        "lg": "px-5 py-3 text-lg"
    }
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`;

    return (
        <button className={classes} onClick={onClick}>
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {label}
            {endIcon && <span className="ml-2">{endIcon}</span>}
        </button>
    );
}