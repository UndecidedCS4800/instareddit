import { useEffect, useState } from "react"

function TableView<T extends {id: number}>(getter: () => Promise<T>) {
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
    const noId = ({id, ...rest}: T): Omit<T, "id">  => {
       return rest
    }
    return (
        <div>
            <tbody>
                {data?.map(item => (
                    <p key={item.id}>
                        {Object.keys(noId).reduce((acc, c) => `${}`)}
                    </p>
                ))}
            </tbody>
        </div>
    )
}