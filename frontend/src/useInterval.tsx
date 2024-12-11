import {useEffect, useRef } from "react";

const useInterval = (f: () => Promise<void>, interval: number) => {
    const callback = useRef(f)
    useEffect(() => {
        const id = setInterval(() => callback.current(), interval)

        return () => clearInterval(id)
    }, [interval])
}

export default useInterval;