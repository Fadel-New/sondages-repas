// pages/index.tsx
import Layout from '../components/Layout';
import EnhancedSurveyForm from '../components/ui/EnhancedSurveyForm';

const HomePage = () => {
  return (
    <Layout title="Sondage - Solutions Repas">
      <EnhancedSurveyForm />
    </Layout>
  );
};

export default HomePage;