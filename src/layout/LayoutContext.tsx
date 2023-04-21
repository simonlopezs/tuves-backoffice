import { createContext, useContext } from "react";
import { SnackbarContent } from "./Layout";

export type DrawerContent = JSX.Element | null

interface LayoutContextValue {
    drawerContent: DrawerContent;
    setDrawerContent: (content: DrawerContent) => void;
    closeDrawer: () => void;
    isLoading: boolean;
    load: () => void;
    stopLoad: () => void;
    showSnackbar: (content: SnackbarContent) => void
}

const defaultValue: LayoutContextValue = {
    drawerContent: null,
    setDrawerContent: () => { },
    closeDrawer: () => { },
    isLoading: false,
    load: () => { },
    stopLoad: () => { },
    showSnackbar: () => { }
};

const LayoutContext = createContext<LayoutContextValue>(defaultValue)
export const useLayoutContext = () => useContext(LayoutContext)
export const LayoutProvider = LayoutContext.Provider