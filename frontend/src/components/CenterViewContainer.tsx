interface CenterViewportProps {
    children?: React.ReactNode
}
export const CenterViewContainer = ({ children }: CenterViewportProps) => {
    return (
        <main className="">
            {children}
        </main>
    )
}