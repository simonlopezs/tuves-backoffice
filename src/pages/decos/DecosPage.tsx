import { Outlet } from "react-router-dom"
import { NavTabs } from "../../components/NavTabs"

const tabs = [
    {
        label: 'Requeridos',
        path: 'required'
    },
    {
        label: 'Opcionales',
        path: 'optional'
    },
]

export const Decos = () => {
    return (
        <>
            <NavTabs tabs={tabs} />
            <Outlet />
        </>
    )

}
