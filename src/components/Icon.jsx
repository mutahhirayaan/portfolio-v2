import { Monitor, Server, Layers, ShieldCheck, Database, Radio, Smartphone, TabletSmartphone } from 'lucide-react';

const map = { Monitor, Server, Layers, ShieldCheck, Database, Radio, Smartphone, TabletSmartphone };

export default function Icon({ name, ...props }) {
  const C = map[name] || Layers;
  return <C aria-hidden="true" {...props} />;
}
