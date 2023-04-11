import { Layout } from "./layout/Layout";
import { Outlet, useNavigate } from "react-router-dom";
import { SessionContext } from "./App";
import { useContext, useEffect } from "react";


export const Main = () => {
    const { currentUser } = useContext(SessionContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser === null) {
            navigate('/login')
        }
    }, [currentUser])

    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}
