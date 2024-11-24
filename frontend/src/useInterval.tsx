import { useEffect } from "react";

const useInterval = (f: () => Promise<void>, interval: number) => {
    useEffect(() => {
        const id = setInterval(f, interval)

        return () => clearInterval(id)
    }, [])
}

export default useInterval;