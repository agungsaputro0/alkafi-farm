import LoginTemplate from "../templates/LoginTemplate";
import AuthShell from "../shell/AuthShell";
import ForgetPasswordForm from "../molecules/ForgetPasswordForm";

const ForgotPasswordPage = () => {
    return (
        <AuthShell>
            <LoginTemplate>
                <ForgetPasswordForm />
            </LoginTemplate>
        </AuthShell>
    )
}

export default ForgotPasswordPage;