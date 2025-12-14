// HomeNavbar.tsx
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// import { useNavigate } from 'react-router-dom';
import { UseScroll } from '../hooks/UseScroll';
import { handleLogout as logout } from '../hooks/HandleLogin';
import { FaBell } from 'react-icons/fa';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser } from '../hooks/HandleLogin';

// const navigation = [
//   { name: 'Dashboard', to: '/Home', current: false },
//   { name: 'Layanan Kami', to: '#', current: false },
//   { name: 'Informasi Publik', to: '#', current: false },
// ];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

type HomeNavbarProps = {
  userName: string | null;
  expanded?: boolean;
};

const HomeNavbar = ({ userName, expanded }: HomeNavbarProps) => {
  const isScrolled = UseScroll(); 
  const user = getCurrentUser();
  const avatarUrl = user.avatarUrl;
  
  const handleLogout = async () => {
    try {
      logout();
      toast.success(
                    <div>
                      <strong>Selamat!</strong>
                      <div>Anda berhasil Logout!</div>
                    </div>
                  );
      setTimeout(() => {
        window.location.href = '/Login';
      }, 1000); 
    } catch (error) {
       toast.success(
                    <div>
                      <strong>Mohon maaf!</strong>
                      <div>Terjadi kesalahan saat Logout!</div>
                    </div>
                  );
    }
  };


  // const navigate = useNavigate();
  // const handleProfileClick = () => {
  //   navigate('/Profil'); 
  // };

  const formatUserName = (name: string | null) => {
    if (!name) return 'Akun'; 
    
    const nameParts = name.split(' '); 
    const firstName = nameParts[0]; 
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''; 
    
    return nameParts.length > 2 ? `${firstName} ${lastName}` : name; 
  };

  return (
    <Disclosure as="nav" className={`${expanded ? 'ml-[210px] w-[calc(100dvw-210px)]' : 'ml-[80px] w-[calc(100dvw-80px)]'} ${isScrolled ? 'bg-farmdarkestbrown/65 backdrop-blur-md backdrop-saturate-150 border-b border-white/20 shadow-lg ring-1 ring-white/10' : 'bg-transparent'} transition duration-300 fixed z-50`}>
      {({ open }) => (
        <>
          <div className="mx-auto min-w-screen px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 w-[100vw] items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {/* {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : isScrolled ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        >
                        {item.name}
                      </Link>
                    ))} */}
                  </div>
                </div>
              </div>

              ;

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 mr-5 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                {/* Notification Bell */}
                <button className="relative ml-3 mr-3 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
                  <FaBell className="text-white w-5 h-5" />
                  {/* Optional: badge for unread notifications */}
                  <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500 ring-1 ring-white"></span>
                </button>

                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="hover:text-white hover:bg-gray-700 border-2 border-kemenkeuyellow rounded-full px-3 py-2 text-sm font-medium text-white flex items-center space-x-2">
                      <span className="sr-only">Open user menu</span>

                      {/* Avatar */}
                      <img
                        src={avatarUrl || '/assets/img/userDefault.png'}
                        alt="User Avatar"
                        className="h-8 w-8 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/assets/img/userDefault.png';
                        }}
                      />

                      {/* Username */}
                      <span className={`${isScrolled ? 'text-white hover:text-gray-200' : ''} font-bold text-sm`}>
                        {formatUserName(userName)}
                      </span>
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white/90 rounded-lg shadow-left-bottom-light border border-gray-400 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1" role="none">
                        {/* <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleProfileClick}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-left'
                              )}
                            >
                              Profil
                            </button>
                          )}
                        </Menu.Item> */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-left'
                              )}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default HomeNavbar;
