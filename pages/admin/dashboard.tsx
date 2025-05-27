// pages/admin/dashboard.tsx
import AdminDashboardPage from '../../admin/dashboard'; // Chemin relatif ajusté
import { GetServerSideProps } from 'next';
import { withSessionSsr } from '../../lib/auth';

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const admin = req.session?.admin;

    if (!admin || !admin.isLoggedIn) {
      return {
        redirect: {
          destination: '/admin/login?redirected=true', // Ajout d'un query param pour info
          permanent: false,
        },
      };
    }

    return {
      props: { admin }, // Passez les données de l'admin à la page si nécessaire
    };
  }
);

export default AdminDashboardPage;