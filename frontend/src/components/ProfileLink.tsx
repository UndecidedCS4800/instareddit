import { Link, LinkProps } from "react-router-dom"

type ProfileLinkProps = {
    user: string,
} & Omit<LinkProps, "to">;

const ProfileLink = ({user, ...props}: ProfileLinkProps) => {
    return (
        <Link className={props.className} to={`/user/${user}`} >{props.children}</Link>
    )
}

export default ProfileLink;