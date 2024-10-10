interface CenterViewportProps {
    children?: React.ReactNode
}
export const CenterViewContainer = ({ children }: CenterViewportProps) => {
    return (
        <main className="flex w-full justify-center">
            {children}
        </main>
    )
}