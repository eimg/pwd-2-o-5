import Link from "next/link";
import { ArrowUpRight, Film } from "lucide-react";

export default function NotFound() {
  return <div className="empty-state not-found"><p className="eyebrow">SCENE NOT FOUND / 404</p><div className="empty-icon"><Film size={36} /></div><h1>This story took a different turn.</h1><p>The page you’re looking for isn’t here. Let’s find you something worth watching.</p><Link href="/" className="button button-primary">Back to discover <ArrowUpRight size={18} /></Link></div>;
}
