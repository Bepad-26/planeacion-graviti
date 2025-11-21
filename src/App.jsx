import React, { useState } from 'react';
import Layout from './components/layout/Layout';

import HomeView from './components/views/HomeView';
import PlannerView from './components/views/PlannerView';
import RollCallView from './components/views/RollCallView';
import NotebookView from './components/views/NotebookView';
import EvaluationView from './components/views/EvaluationView';
import AnalyticsView from './components/views/AnalyticsView';
import ResourcesView from './components/views/ResourcesView';
import ActivityPlanner from './components/views/ActivityPlanner';
import ReportsView from './components/views/ReportsView';
import ExamGenerator from './components/views/ExamGenerator';
import SettingsView from './components/views/SettingsView';
import SubscriptionView from './components/views/SubscriptionView';

function App() {
  const [activeView, setActiveView] = useState('home');

  const renderView = () => {
    switch (activeView) {
      case 'home': return <HomeView />;
      case 'planner': return <PlannerView />;
      case 'roll-call': return <RollCallView />;
      case 'notebook': return <NotebookView />;
      case 'evaluation': return <EvaluationView />;
      case 'analytics': return <AnalyticsView />;
      case 'resources': return <ResourcesView />;
      case 'activity-planner': return <ActivityPlanner />;
      case 'reports': return <ReportsView />;
      case 'exam-generator': return <ExamGenerator />;
      case 'settings': return <SettingsView />;
      case 'subscription': return <SubscriptionView />;
      default: return <HomeView />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </Layout>
  );
}

export default App;
