import HomeTemplate from "../../templates/HomeTemplate";
import HomeShell from "../../shell/HomeShell";
import TambahKatalogProduk from "../../molecules/TambahKatalog";
const TambahKatalog = () => {
    return (
             <HomeShell>
                <HomeTemplate>
                    <TambahKatalogProduk />
                </HomeTemplate>
            </HomeShell>
    )
}

export default TambahKatalog;