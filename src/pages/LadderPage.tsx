import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LadderSimulator } from '@/components/LadderSimulator';

export function LadderPage() {
  return (
    <div className="mx-auto flex max-w-[70ch] flex-col gap-5">
      <div>
        <Link to="/automation" className="btn">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>
      <h1>Ladder simulator</h1>
      <LadderSimulator />
    </div>
  );
}

