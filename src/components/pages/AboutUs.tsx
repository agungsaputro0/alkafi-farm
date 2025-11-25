import LoginTemplate from "../templates/LoginTemplate";
import AuthShell from "../shell/AuthShell";
import AboutUsContent from "../molecules/AboutUsContent";

const AboutUs = () => {
    return (
        <AuthShell>
            <LoginTemplate>
                <AboutUsContent />
            </LoginTemplate>
        </AuthShell>
    )
}

export default AboutUs;