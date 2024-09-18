import { useEffect, useState } from "react"

interface TableViewProps<T> {
    getter: () => Promise<T[]>,
    renderItem: (item: T) => React.ReactNode
}
export function TableView<T>({ getter, renderItem }: TableViewProps<T>) {
    const [loading, isLoading] = useState(false)
    const [data, setData] = useState<T[] | null>(null)

    useEffect(() => {
        let ignore = false;
        const getData = async () => {
            if (!ignore) {
                isLoading(true)
                const d = await getter()
                setData(d)
                isLoading(false)
            }
        }
        getData()
        return () => {
            ignore = true
        }
    }, [getter]);

    if (loading) {
        return <div>Loading</div>
    }


    return (
        <div>
            {data?.map(renderItem)}
        </div>
    )
}