import HomeTemplate from "../../templates/HomeTemplate";
import HomeShell from "../../shell/HomeShell";
import DownloadReport from "../../molecules/DownloadReport";
const DownloadReportPage = () => {
    return (
             <HomeShell>
                <HomeTemplate>
                    <DownloadReport />
                </HomeTemplate>
            </HomeShell>
    )
}

export default DownloadReportPage;