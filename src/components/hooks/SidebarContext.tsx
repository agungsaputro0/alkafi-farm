import { createContext, useContext } from "react";

type SidebarContextType = {
  expanded: boolean;
};

const SidebarContext = createContext<SidebarContextType>({ expanded: false });

export const useSidebar = () => useContext(SidebarContext);

export default SidebarContext;
