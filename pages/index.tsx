// pages/index.tsx
import Layout from '../components/Layout';
import EnhancedSurveyForm from '../components/ui/EnhancedSurveyForm';

const HomePage = () => {
  return (
    <Layout 
      title="Sondage - Solutions Repas au Bénin" 
      description="Participez à notre sondage sur les habitudes alimentaires au Bénin pour contribuer au développement de solutions de repas pratiques, sains et abordables adaptées à vos besoins."
      imageUrl="/images/repas-social.jpeg"
    >
      <EnhancedSurveyForm />
    </Layout>
  );
};

export default HomePage;