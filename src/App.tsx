import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { AppProvider } from '@/context/AppContext';

const OverviewPage = lazy(() => import('@/pages/OverviewPage').then((m) => ({ default: m.OverviewPage })));
const RoadmapPage = lazy(() => import('@/pages/RoadmapPage').then((m) => ({ default: m.RoadmapPage })));
const InstrumentationHubPage = lazy(() =>
  import('@/pages/InstrumentationHubPage').then((m) => ({ default: m.InstrumentationHubPage })),
);
const InstrumentDetailPage = lazy(() =>
  import('@/pages/InstrumentDetailPage').then((m) => ({ default: m.InstrumentDetailPage })),
);
const ElectronicsPage = lazy(() =>
  import('@/pages/ElectronicsPage').then((m) => ({ default: m.ElectronicsPage })),
);
const AutomationPage = lazy(() =>
  import('@/pages/AutomationPage').then((m) => ({ default: m.AutomationPage })),
);
const ApplicationsPage = lazy(() =>
  import('@/pages/ApplicationsPage').then((m) => ({ default: m.ApplicationsPage })),
);
const InterviewPrepPage = lazy(() =>
  import('@/pages/InterviewPrepPage').then((m) => ({ default: m.InterviewPrepPage })),
);
const ToolboxPage = lazy(() => import('@/pages/ToolboxPage').then((m) => ({ default: m.ToolboxPage })));
const InstrumentLabPage = lazy(() =>
  import('@/pages/InstrumentLabPage').then((m) => ({ default: m.InstrumentLabPage })),
);

function PageLoader() {
  return (
    <div className="mx-auto max-w-[1440px] glass p-8 text-center text-sm text-[var(--st-on-var)]">
      Loading engineering module…
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/instrumentation" element={<InstrumentationHubPage />} />
              <Route path="/instrumentation/:category" element={<InstrumentationHubPage />} />
              <Route path="/instrumentation/:category/:slug" element={<InstrumentDetailPage />} />
              <Route path="/lab" element={<InstrumentLabPage />} />
              <Route path="/lab/:instrumentId" element={<InstrumentLabPage />} />
              <Route path="/electronics" element={<ElectronicsPage />} />
              <Route path="/automation" element={<AutomationPage />} />
              <Route path="/automation/:section" element={<AutomationPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/interview" element={<InterviewPrepPage />} />
              <Route path="/toolbox" element={<ToolboxPage />} />
              <Route path="/toolbox/:toolId" element={<ToolboxPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
