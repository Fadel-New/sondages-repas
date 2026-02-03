// pages/index.tsx
import Layout from '../components/Layout';
import EnhancedSurveyForm from '../components/ui/EnhancedSurveyForm';

const HomePage = () => {
  return (
    <Layout 
      title="Sondage Easy Meal - Ghana (Achimota)" 
      description="Participez au sondage Easy Meal destiné aux étudiants à Achimota (Accra) pour améliorer l'accès à des repas pratiques, sains et abordables."
      imageUrl="/images/repas-social.jpeg"
    >
      <EnhancedSurveyForm />
    </Layout>
  );
};

export default HomePage;
