import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...rest }) => {
    const baseStyle = 'py-2 px-4 rounded text-white focus:outline-none';
    const variantStyle =
        variant === 'primary'
            ? 'bg-blue-500 hover:bg-[#f472b6]'
            : 'bg-gray-500 hover:bg-[#f9a8d4]';
    return (
        <button className={`${baseStyle} ${variantStyle} ${className}`} {...rest}>
            {children}
    </button>
    );
};

export default Button;
