"use client";
import { MenuProvider } from "../context/MenuContext";
export default function MenuProviderWrapper({ children }) {
    return (<MenuProvider>
      {children}
    </MenuProvider>);
}
