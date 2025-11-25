import LoginTemplate from "../templates/LoginTemplate";
import AuthShell from "../shell/AuthShell";
import ChangePasswordForm from "../molecules/ChangePasswordForm";

const ChangePasswordPage = () => {
    return (
        <AuthShell>
            <LoginTemplate>
                <ChangePasswordForm />
            </LoginTemplate>
        </AuthShell>
    )
}

export default ChangePasswordPage;