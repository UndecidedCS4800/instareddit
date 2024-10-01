import { Link, LinkProps } from "react-router-dom"

export const Card = ({children, ...props}: Omit<LinkProps, "className">) => {

    return (
        <Link {...props} className="">
            {children}
        </Link>
    )
}