import MainPanel from '../atoms/MainPanel';
import { useFetchBankSampahByUser } from '../hooks/HandleBankSampah';
import ProfilePanel from '../atoms/ProfilPanel';

const BankSampahView = () => {
  const banksampah = useFetchBankSampahByUser();

  console.log(banksampah);
  return (
    <section>
      <div className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: '80px' }}>
        <MainPanel>
          <ProfilePanel />
        </MainPanel>
      </div>
    </section>
  );
};

export default BankSampahView;
