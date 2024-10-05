import { Link, LinkProps } from "react-router-dom"

export const Card = ({children, ...props}: Omit<LinkProps, "className">) => {

    return (
        <Link {...props} className="border border-[#514350] bg-[#342c33] overflow-hidden shadow-lg transition-transform transform hover:scale-105">
            {children}
        </Link>
    )
}