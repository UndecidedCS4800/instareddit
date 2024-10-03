import { useState } from "react"
import { FeedNav } from "./FeedNav"
import { CommunityFeed } from "./CommunityFeed"

export type FeedViews = "recent" | "community"

const getView = (s: FeedViews): React.ReactNode => {
    switch (s) {
        case "recent":
            // implement me
            return (<div>not implemented (yet)</div>)
        case "community":
            return <CommunityFeed />
    }
}

export const CenterPane = () => {
    const [view, setView] = useState<"recent" | "community">("recent")

    const setViewHandler = (s: FeedViews) => {
        switch (s) {
            case "recent":
                setView("recent")
                break;
            case "community":
                setView("community")
                break;
        }
    }

    const v = getView(view)

    return (
        <div id="centerpane" className='h-full basis-8/12'>
            <FeedNav viewSetter={setViewHandler} activeView={view} />
            <div>
                {v}
            </div>
        </div>
    )
}