export const Card = ({children, ...props}: Omit<React.HTMLProps<HTMLDivElement>, "className">) => {

    return (
        <div {...props} className="">
            {children}
        </div>
    )
}