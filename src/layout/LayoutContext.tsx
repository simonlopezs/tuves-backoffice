import { createContext, useContext } from "react";

export type DrawerContent = JSX.Element | null

interface LayoutContextValue {
    drawerContent: DrawerContent;
    setDrawerContent: (content: DrawerContent) => void;
    closeDrawer: () => void;
}

const defaultValue: LayoutContextValue = {
    drawerContent: null,
    setDrawerContent: () => { },
    closeDrawer: () => { },
};

const LayoutContext = createContext<LayoutContextValue>(defaultValue)
export const useLayoutContext = () => useContext(LayoutContext)
export const LayoutProvider = LayoutContext.Provider