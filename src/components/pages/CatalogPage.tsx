import LoginTemplate from "../templates/LoginTemplate";
import AuthShell from "../shell/AuthShell";
import Catalog from "../molecules/Catalog";

const CatalogPage = () => {
    return (
        <AuthShell>
            <LoginTemplate>
                <Catalog />
            </LoginTemplate>
        </AuthShell>
    )
}

export default CatalogPage;