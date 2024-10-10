const Pane = ({children, ...props}: React.HTMLProps<HTMLDivElement>) => {
    return (
        <div {...props}>
            {children}
        </div>
    )
};

export default Pane;