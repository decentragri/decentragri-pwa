import { useEffect } from 'preact/hooks';
import { useThemeStore } from '@context/ThemeContext';
import { useAuthStore } from '@context/AuthContext';
import DashboardHeader from '@components/Dashboard/DashboardHeader';
import SideBar from '@components/IndexOne/SideBar';
import DecentragriLoader from '@components/IndexOne/DecentragriLoader';
import Staking from '@components/Staking/Staking';
import '../pages/Staking.css';

const StakingPage = () => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const loading = useAuthStore((state) => state.loading);
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      window.location.href = '/';
    }
  }, [isLoggedIn, loading]);

  if (loading) {
    return <DecentragriLoader />;
  }


  return (
    <div className="main-wrapper">
      <SideBar />
      <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <DashboardHeader user={userInfo || undefined} />
        <div className="dashboard-content">
          <Staking />
        </div>
      </div>
    </div>
  );
};

export default StakingPage;








