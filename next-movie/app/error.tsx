"use client";

import { RefreshCw, Film } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="empty-state"><p className="eyebrow">A BRIEF INTERMISSION</p><div className="empty-icon"><Film size={32} /></div><h2>The films are taking a little longer.</h2><p>We couldn’t connect to the movie service. Give it another try in a moment.</p><button type="button" className="button button-primary" onClick={reset}><RefreshCw size={16} /> Try again</button></div>;
}
