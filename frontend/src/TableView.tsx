import React from "react";
import { useEffect, useState } from "react"

interface TableViewProps<T> {
    getter: () => Promise<T[]>,
    renderItem: (item: T) => React.ReactNode
}
export function TableView<T>({getter, renderItem }: TableViewProps<T>) {
    const [loading, isLoading] = useState(false)
    const [data, setData] = useState<T[] | null>(null)

    useEffect(() => {
        const getData = async () => {
            isLoading(true)
            const d = await getter()
            setData(d)
            isLoading(false)
        }
        getData()
    }, []);

    if (loading) {
        return <div>Loading</div>
    }
    return (
        <div>
            <p>Data</p>
            {data?.map(renderItem)}
        </div>
    )
}