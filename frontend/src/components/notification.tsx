import { createContext, useContext, useReducer } from "react"
import { ClientNotification } from "../schema"

const notificationContext = createContext<ClientNotification[]>([])
const notificationDispatchContext = createContext<React.Dispatch<ClientNotificationAction>>(() => null)

export const useNotifications = () => {
    return useContext(notificationContext)
}

export const useNotificationDispatch = () => {
    return useContext(notificationDispatchContext)
}

type PushAction = {
    type: "push"
    payload: ClientNotification
}

type PopFrontAction = {
    type: "popFront"
}

type ClientNotificationAction = PushAction | PopFrontAction

export const ClientNotificationProvider = ( {children}: {children: React.ReactNode}) => {
    const [notifications, dispatch] = useReducer(reducer, [])

    return (
        <notificationContext.Provider value={notifications}>
            <notificationDispatchContext.Provider value={dispatch}>
                {children}
            </notificationDispatchContext.Provider>
        </notificationContext.Provider>
    )
}

const reducer = (state: ClientNotification[], action: ClientNotificationAction) => {
    switch (action.type) {
        case "push":
            return state.concat(action.payload)
        case "popFront":
            return state.slice(1)
    }
}