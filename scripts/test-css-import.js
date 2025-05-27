// A simple script to check if the CSS imports are valid
console.log('Starting CSS import test...');

try {
  console.log('Checking _app.tsx for global CSS imports...');
  const fs = require('fs');
  
  // Read _app.tsx file
  const appContent = fs.readFileSync('/home/fadel/Workspaces/sondages-repas/pages/_app.tsx', 'utf8');
  
  // Check for global CSS imports
  if (appContent.includes("import \"../components/ui/FormStyles.css\"")) {
    console.log('✅ FormStyles.css is correctly imported in _app.tsx');
  } else {
    console.error('❌ FormStyles.css import not found in _app.tsx');
  }
  
  // Check if EnhancedSurveyForm.tsx has direct CSS import
  const formContent = fs.readFileSync('/home/fadel/Workspaces/sondages-repas/components/ui/EnhancedSurveyForm.tsx', 'utf8');
  if (!formContent.includes("import './FormStyles.css'")) {
    console.log('✅ EnhancedSurveyForm.tsx no longer has direct CSS import');
  } else {
    console.error('❌ EnhancedSurveyForm.tsx still has direct CSS import');
  }
  
  // Check if SurveyForm.tsx has direct CSS import
  const surveyFormContent = fs.readFileSync('/home/fadel/Workspaces/sondages-repas/components/ui/SurveyForm.tsx', 'utf8');
  if (!surveyFormContent.includes("import './FormStyles.css'")) {
    console.log('✅ SurveyForm.tsx no longer has direct CSS import');
  } else {
    console.error('❌ SurveyForm.tsx still has direct CSS import');
  }
  
  console.log('CSS import test completed successfully');
} catch (error) {
  console.error('Error during CSS import test:', error);
}
