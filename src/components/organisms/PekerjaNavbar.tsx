import { Disclosure } from '@headlessui/react';
import { UseScroll } from '../hooks/UseScroll';
import { Link, useLocation } from 'react-router-dom';
import useIsMobile from '../hooks/UseIsMobile';

const rightNav = [
  { name: 'Portal', to: '/Portal', variant: 'outline' },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const PekerjaNavbar = () => {
  const isScrolled = UseScroll();
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <Disclosure
      as="nav"
      className={`fixed w-full py-1 z-50 transition duration-500 ${
        isScrolled
          ? 'backdrop-blur-xl bg-kemenkeuyellow/60 border-b border-white/20 shadow-md'
          : 'backdrop-blur-lg bg-kemenkeuyellow/60'
      }`}
    >
      {() => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`relative flex h-16 items-center ${
                isMobile ? 'justify-center' : 'justify-between'
              }`}
            >
              {/* LOGO */}
             <Link to="/" className="flex items-center mt-[-3px] space-x-2">
                  <img
                    src="/assets/img/alkafi-farm-icon.png" 
                    alt="Alkafi Farm Logo"
                    className="h-10 w-10"
                  />
                  <div className="flex font-spring flex-col leading-tight text-farmdarkestbrown">
                    <span className="text-[1.4em] font-bold">
                      Alkafi Farm
                    </span>
                    <small className="text-[0.7em]">
                      Gathering Moments, Growing Dreams
                    </small>
                  </div>
               </Link>

              {/* MAIN NAV CENTER */}
              <div className="hidden smweb:flex absolute left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-4 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-inner">
                </div>
              </div>

              {/* RIGHT NAV */}
              <div className="hidden smweb:flex items-center">
                 <div className="flex items-center px-2 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-inner">
                {rightNav.map((item) => {
                  const isActive =
                    location.pathname.toLowerCase() === item.to.toLowerCase();
                  const baseStyle =
                    'relative w-[140px] text-center px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300';

                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={classNames(
                        baseStyle,
                        isActive ? 'text-white' : 'text-farmdarkbrown',
                        isActive && item.variant === 'outline'
                          ? 'border-white bg-white/10 bg-gradient-to-r from-farmdarkbrown to-farmbrown'
                          : '',
                        isActive && item.variant === 'filled'
                          ? 'brightness-110'
                          : ''
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default PekerjaNavbar;
