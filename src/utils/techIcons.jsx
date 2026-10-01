import {
  SiHtml5, SiJavascript, SiReact, SiTailwindcss, SiAxios, SiFramer, SiLucide, SiMui, SiRedux,
  SiSharp, SiDotnet, SiJsonwebtokens, SiGoogle, SiMysql, SiIonic, SiCapacitor, SiGit, SiGithub,
  SiPostman, SiFirebase, SiVite, SiThreedotjs,
} from 'react-icons/si';
import { DiCss3, DiMsqlServer, DiVisualstudio } from 'react-icons/di';
import { VscVscode } from 'react-icons/vsc';
import { Network, Boxes, Filter, Database, ShieldCheck, Radio, BookOpenText, Layers, Server } from 'lucide-react';
import { useSelector } from 'react-redux';

/**
 * Icon registry. Skills reference an icon by key (see data/skills.js).
 * `color`      -> brand colour in light mode
 * `darkColor`  -> optional brand colour override in dark mode (for near-black logos)
 * Brands that have no official mark in the icon packs fall back to a lucide glyph.
 */
export const techIcons = {
  html5: { Icon: SiHtml5, color: '#E34F26' },
  css3: { Icon: DiCss3, color: '#1572B6', darkColor: '#33A9DC' },
  javascript: { Icon: SiJavascript, color: '#C9A800', darkColor: '#F7DF1E' },
  react: { Icon: SiReact, color: '#0E9DB8', darkColor: '#61DAFB' },
  tailwind: { Icon: SiTailwindcss, color: '#0891B2', darkColor: '#38BDF8' },
  axios: { Icon: SiAxios, color: '#5A29E4', darkColor: '#9B7BFF' },
  framer: { Icon: SiFramer, color: '#0055FF', darkColor: '#4D8BFF' },
  lucide: { Icon: SiLucide, color: '#F56565' },
  mui: { Icon: SiMui, color: '#007FFF' },
  redux: { Icon: SiRedux, color: '#764ABC', darkColor: '#A98AE8' },
  vite: { Icon: SiVite, color: '#646CFF' },
  three: { Icon: SiThreedotjs, color: '#111827', darkColor: '#E5E7EB' },

  csharp: { Icon: SiSharp, color: '#68217A', darkColor: '#B98BD1' },
  dotnet: { Icon: SiDotnet, color: '#512BD4', darkColor: '#9A83F0' },
  rest: { Icon: Network, color: '#0E7490', darkColor: '#22D3EE' },
  di: { Icon: Boxes, color: '#4338CA', darkColor: '#818CF8' },
  linq: { Icon: Filter, color: '#7C3AED', darkColor: '#A78BFA' },
  efcore: { Icon: Database, color: '#512BD4', darkColor: '#9A83F0' },
  jwt: { Icon: SiJsonwebtokens, color: '#D63AFF' },
  google: { Icon: SiGoogle, color: '#4285F4' },
  rbac: { Icon: ShieldCheck, color: '#059669', darkColor: '#34D399' },
  signalr: { Icon: Radio, color: '#512BD4', darkColor: '#9A83F0' },

  mysql: { Icon: SiMysql, color: '#00758F', darkColor: '#3AA8C4' },
  sqlserver: { Icon: DiMsqlServer, color: '#CC2927', darkColor: '#F26B69' },

  ionic: { Icon: SiIonic, color: '#3880FF' },
  capacitor: { Icon: SiCapacitor, color: '#119EFF' },

  git: { Icon: SiGit, color: '#F05032' },
  github: { Icon: SiGithub, color: '#181717', darkColor: '#F0F6FC' },
  visualstudio: { Icon: DiVisualstudio, color: '#5C2D91', darkColor: '#A97BDB' },
  vscode: { Icon: VscVscode, color: '#007ACC', darkColor: '#3AA0F0' },
  postman: { Icon: SiPostman, color: '#FF6C37' },
  firebase: { Icon: SiFirebase, color: '#E69500', darkColor: '#FFCA28' },
  scalar: { Icon: BookOpenText, color: '#0E7490', darkColor: '#22D3EE' },

  fallback: { Icon: Layers, color: '#4338CA', darkColor: '#818CF8' },
  server: { Icon: Server, color: '#4338CA', darkColor: '#818CF8' },
};

export function useTechColor(key) {
  const theme = useSelector((s) => s.theme.mode);
  const entry = techIcons[key] || techIcons.fallback;
  return theme === 'dark' ? entry.darkColor || entry.color : entry.color;
}

export function TechIcon({ name, size = 28, className = '', title }) {
  const entry = techIcons[name] || techIcons.fallback;
  const color = useTechColor(name);
  const { Icon } = entry;
  return <Icon size={size} color={color} className={className} aria-hidden={title ? undefined : true} title={title} focusable="false" />;
}
