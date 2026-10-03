import { WatchlistContent } from "@/components/watchlist-content";

export const metadata = { title: "Your watchlist" };

export default function Watchlist() {
  return <><div className="page-heading catalog-heading"><div><p className="eyebrow">A COLLECTION OF POSSIBILITIES</p><h1>Your next <span>movie nights.</span></h1><p>All the stories you want to get lost in. Saved here, ready when you are.</p></div></div><WatchlistContent /></>;
}
