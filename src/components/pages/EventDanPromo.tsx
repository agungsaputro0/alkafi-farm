import LoginTemplate from "../templates/LoginTemplate";
import AuthShell from "../shell/AuthShell";
import EventPromoPage from "../molecules/EventPromoPage";

const EventDanPromo = () => {
    return (
        <AuthShell>
            <LoginTemplate>
                <EventPromoPage />
            </LoginTemplate>
        </AuthShell>
    )
}

export default EventDanPromo;