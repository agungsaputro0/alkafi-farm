import AppShell from "../shell/Appshell";
import LandingLayouts from "../templates/Landing";
import { Helmet } from "react-helmet";  

const appName = import.meta.env.VITE_APP_NAME;  

const Welcome = () => {
    return (
        <AppShell>
            <div className="min-h-screen-default">
                <Helmet>
                    <title>{appName}</title>
                </Helmet>
                <LandingLayouts 
                    layoutTitle="Alkafi Farm"  
                    layoutSubtitle="Gathering Moments, Growing Dreams"  
                    layoutMessage="Menghadirkan sapi, kambing, dan domba yang sehat dari peternakan kami, dengan produk daging segar berkualitas tinggi, aman, dan bergizi untuk keluarga Anda."
                />
            </div>
        </AppShell>
    );
};

export default Welcome;
