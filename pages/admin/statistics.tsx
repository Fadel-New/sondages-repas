// pages/admin/statistics.tsx
import { GetServerSideProps } from 'next';
import { withSessionSsr } from '../../lib/auth';
import StatisticsPage from '../../admin/statistics'; 
 
export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const admin = req.session?.admin;

    if (!admin || !admin.isLoggedIn) {
      return {
        redirect: {
          destination: '/admin/login?redirected=true',
          permanent: false,
        },
      };
    }

    return {
      props: { admin },
    };
  }
);

export default StatisticsPage;
