import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AutomationPage() {
  return (
    <div className="mx-auto flex max-w-[70ch] flex-col gap-5 pt-4">
      <h1>PLC and automation</h1>
      <p className="prose-measure text-[var(--st-on-var)]">
        A programmable logic controller scans field switches from top to bottom and turns motors, timers, and alarms on or off based on ladder rungs.
      </p>
      <div>
        <Link to="/automation/ladder" className="btn primary">
          Open simulator
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
