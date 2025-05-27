// pages/admin/index.tsx
import { GetServerSideProps } from 'next';
import { withSessionSsr } from '../../lib/auth';

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    // Cast req to any or the appropriate type to access session
    const admin = (req as any).session?.admin;

    if (!admin || !admin.isLoggedIn) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

    return {
      redirect: {
        destination: '/admin/dashboard',
        permanent: false,
      },
    };
  }
);

// Ce composant ne sera jamais rendu car la redirection se produit côté serveur
const AdminIndexPage = () => null;
export default AdminIndexPage;