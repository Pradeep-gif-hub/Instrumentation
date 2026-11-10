import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { AppProvider } from '@/context/AppContext';
import { findCanonicalForTopic } from '@/data/instrumentRegistry';
import { getCanonicalInstrumentUrl, type InstrumentTabKey } from '@/data/navigationTree';

const OverviewPage = lazy(() =>
  import('@/pages/OverviewPage').then((m) => ({ default: m.OverviewPage })),
);
const LearnPage = lazy(() =>
  import('@/pages/LearnPage').then((m) => ({ default: m.LearnPage })),
);
const BrowsePage = lazy(() =>
  import('@/pages/BrowsePage').then((m) => ({ default: m.BrowsePage })),
);
const InstrumentPage = lazy(() =>
  import('@/pages/InstrumentPage').then((m) => ({ default: m.InstrumentPage })),
);
const RoadmapPage = lazy(() =>
  import('@/pages/RoadmapPage').then((m) => ({ default: m.RoadmapPage })),
);
const ElectronicsPage = lazy(() =>
  import('@/pages/ElectronicsPage').then((m) => ({ default: m.ElectronicsPage })),
);
const AutomationPage = lazy(() =>
  import('@/pages/AutomationPage').then((m) => ({ default: m.AutomationPage })),
);
const LadderPage = lazy(() =>
  import('@/pages/LadderPage').then((m) => ({ default: m.LadderPage })),
);
const ApplicationsPage = lazy(() =>
  import('@/pages/ApplicationsPage').then((m) => ({ default: m.ApplicationsPage })),
);
const InterviewPrepPage = lazy(() =>
  import('@/pages/InterviewPrepPage').then((m) => ({ default: m.InterviewPrepPage })),
);
const ToolboxPage = lazy(() =>
  import('@/pages/ToolboxPage').then((m) => ({ default: m.ToolboxPage })),
);

const ALLOWED_TABS = new Set<string>(['simple', 'theory', '3d', 'sim', 'interview']);

function LegacyTopicRedirect() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const [searchParams] = useSearchParams();
  const canonical = findCanonicalForTopic(category, slug);

  if (!canonical) {
    return <Navigate to={`/browse${category ? `?family=${encodeURIComponent(category)}` : ''}`} replace />;
  }

  const rawTab = searchParams.get('tab');
  const rawFocus = searchParams.get('focus');
  const targetTab: InstrumentTabKey =
    rawTab && ALLOWED_TABS.has(rawTab)
      ? (rawTab as InstrumentTabKey)
      : rawFocus === 'sim'
      ? 'sim'
      : 'simple';

  return <Navigate to={getCanonicalInstrumentUrl(canonical.id, targetTab)} replace />;
}

function LegacyLabRedirect() {
  const { instrumentId } = useParams<{ instrumentId: string }>();
  const [searchParams] = useSearchParams();

  if (!instrumentId) {
    return <Navigate to="/browse" replace />;
  }

  const rawTab = searchParams.get('tab');
  const rawFocus = searchParams.get('focus');
  const targetTab: InstrumentTabKey =
    rawTab && ALLOWED_TABS.has(rawTab)
      ? (rawTab as InstrumentTabKey)
      : rawFocus === 'sim'
      ? 'sim'
      : '3d';

  return <Navigate to={getCanonicalInstrumentUrl(instrumentId, targetTab)} replace />;
}

function PageLoader() {
  return (
    <div className="mx-auto max-w-[70ch] glass p-6 text-[16px] text-[var(--st-on-var)]">
      Loading page…
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
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/instrument/:instrumentId" element={<InstrumentPage />} />

              {/* Legacy URL redirects & browse aliases */}
              <Route path="/instrumentation" element={<BrowsePage />} />
              <Route path="/instrumentation/:category" element={<BrowsePage />} />
              <Route path="/instrumentation/:category/:slug" element={<LegacyTopicRedirect />} />
              <Route path="/lab" element={<Navigate to="/browse" replace />} />
              <Route path="/lab/:instrumentId" element={<LegacyLabRedirect />} />

              {/* Core Syllabus & Engineering Modules */}
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/electronics" element={<ElectronicsPage />} />
              <Route path="/automation" element={<AutomationPage />} />
              <Route path="/automation/ladder" element={<LadderPage />} />
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
