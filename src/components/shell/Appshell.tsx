import React from "react";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
// import WhyWasteManagementMatters from "../molecules/WhyWasteManagementMatters";
// import JoinTheMovement from "../molecules/JoinTheMovement";

type AppShellProps = {
   children: React.ReactNode;
}

const AppShell = (props: AppShellProps) => {
    const { children } = props;
    return (
        <main className="flex flex-col min-h-screen-default">
            <Navbar />
            <div className="flex-grow bg-[url('/assets/img/bg-main2.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
                {children}
            </div>
            <Footer />
        </main>
    )
}

export default AppShell;