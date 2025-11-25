import ResendActivationForm from "../molecules/ResendActivationForm";
import LoginTemplate from "../templates/LoginTemplate";
import AuthShell from "../shell/AuthShell";

const ResendActivationPage = () => {
    return (
        <AuthShell>
            <LoginTemplate>
                <ResendActivationForm />
            </LoginTemplate>
        </AuthShell>
    )
}

export default ResendActivationPage;