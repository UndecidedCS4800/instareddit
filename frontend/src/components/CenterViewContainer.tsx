interface CenterViewportProps {
    children?: React.ReactNode
}
export const CenterViewContainer = ({ children }: CenterViewportProps) => {
    return (
        <main className="flex h-full w-full justify-center">
            {children}
        </main>
    )
}