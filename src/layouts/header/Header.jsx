import './Header.scss';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import useRouteInformation from '../../hooks/useRouteInformation';
import StorageService from '../../services/storageService';
import { signOut } from '../../features/auth/services/authService';
import { useAuth } from '../../context/AuthContext';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../../features/profile/profileSlice';
import { useSelector } from 'react-redux';
import { apiStatusConditions } from '../../Utils/constants';
import Popup from '../../components/Popup/Popup';
const Header = ({ onMobileMenuToggle }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false);
  const { navigate, pathname, location } = useRouteInformation();
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  const handleLogout = async () => {
    setShowUserMenu(false);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  useEffect(() => {
    dispatch(fetchProfile());
  }, []);

  const handleNavigateToChPass = useCallback(() => {
    setShowUserMenu(false);
    navigate(`/change-password?ref=${pathname + location.search}`);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 bg-white border-b"
      style={{ borderColor: 'var(--border-light)' }}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={onMobileMenuToggle}
          >
            <Icon icon="mdi:menu" className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          </button>

          {/* Search Bar */}
          {/* <div className="hidden md:flex items-center flex-1 max-w-lg">
            <div className="relative w-full">
              <Icon
                icon="mdi:magnify"
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-light)' }}
              />

              <input
                type="text"
                placeholder="Search in HRMS"
                className="w-full pl-10 pr-16 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-primary)',
                }}
              />

              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded border"
                style={{
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-light)',
                }}
              >
                Ctrl + /
              </span>
            </div>
          </div> */}
        </div>

        <div className="flex items-center space-x-3">
          {/* <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Icon
              icon="mdi:magnify"
              className="w-5 h-5"
              style={{ color: 'var(--text-secondary)' }}
            />
          </button> */}
          {/*
          <button className="hidden sm:block p-2 rounded-lg hover:bg-gray-100">
            <Icon
              icon="mdi:view-grid-outline"
              className="w-5 h-5"
              style={{ color: 'var(--text-secondary)' }}
            />
          </button> */}

          {/* <button className="hidden sm:block p-2 rounded-lg hover:bg-gray-100">
            <Icon
              icon="mdi:fullscreen"
              className="w-5 h-5"
              style={{ color: 'var(--text-secondary)' }}
            />
          </button> */}
          {/*
          <button className="hidden sm:block p-2 rounded-lg hover:bg-gray-100">
            <Icon
              icon="mdi:help-circle-outline"
              className="w-5 h-5"
              style={{ color: 'var(--text-secondary)' }}
            />
          </button> */}

          {/* <button className="hidden sm:block p-2 rounded-lg hover:bg-gray-100">
            <Icon
              icon="mdi:cog-outline"
              className="w-5 h-5"
              style={{ color: 'var(--text-secondary)' }}
            />
          </button> */}

          {/* <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Icon
              icon="mdi:bell-outline"
              className="w-5 h-5"
              style={{ color: 'var(--text-secondary)' }}
            />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--status-red)' }}
            />
          </button>*/}

          <div className="relative">
            <button
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                src={
                  apiStatusConditions.success(profile)
                    ? profile?.data?.data?.logoUrl
                    : `https://placehold.co/600x400?text=${
                        apiStatusConditions.failure(profile)
                          ? 'failed to fetch the logo'
                          : 'fetching logo...'
                      }`
                }
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <Icon
                icon="mdi:chevron-down"
                className="w-4 h-4 hidden sm:block"
                style={{ color: 'var(--text-secondary)' }}
              />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div
                className="absolute z-150 right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border overflow-hidden"
                style={{ borderColor: 'var(--border-light)' }}
              >
                <div className="p-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="flex items-center space-x-3">
                    <img
                      src={profile?.data?.data?.logoUrl}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {profile?.data?.data?.companyName}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Admin
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                    <Icon
                      icon="mdi:account-outline"
                      className="w-5 h-5"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                    <span style={{ color: 'var(--text-primary)' }}>My Profile</span>
                  </button>

                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    onClick={handleNavigateToChPass}
                  >
                    <Icon
                      icon="mdi:password-outline"
                      className="w-5 h-5"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                    <span style={{ color: 'var(--text-primary)' }}>Change Password</span>
                  </button>
                </div>

                <div className="border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    onClick={() => setOpenLogoutPopup(true)}
                  >
                    <Icon
                      icon="mdi:logout"
                      className="w-5 h-5"
                      style={{ color: 'var(--status-red)' }}
                    />
                    <span style={{ color: 'var(--status-red)' }}>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Popup
        open={openLogoutPopup}
        header="Confirm Logout"
        onClose={() => setOpenLogoutPopup(false)}
        footer={
          <>
            <button className="px-4 py-2 border rounded" onClick={() => setOpenLogoutPopup(false)}>
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={async () => {
                setOpenLogoutPopup(false);
                await handleLogout();
              }}
            >
              Logout
            </button>
          </>
        }
      >
        Are you sure you want to logout?
      </Popup>
    </header>
  );
};

export default Header;
