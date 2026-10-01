import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, InputAdornment, LinearProgress, Snackbar, TextField, ThemeProvider, Tooltip, Typography, createTheme,
} from '@mui/material';
import {
  ExternalLink, Eye, FileText, FolderKanban, Github, LayoutDashboard, LogOut, Mail, Pencil, Plus, Search, Sparkles, Trash2, Upload, Users,
} from 'lucide-react';
import { logout } from '../../store/authSlice';
import { adminService } from '../../services/adminService';
import { signOutFirebase } from '../../services/authService';
import { env } from '../../config/env';
import { useSeo } from '../../hooks/useSeo';

const empty = { title: '', slug: '', category: 'Full Stack', description: '', github: '', liveDemo: '', image: '', technologies: '' };
const NAV = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Skills', icon: Sparkles },
  { label: 'Messages', icon: Mail },
  { label: 'Resume', icon: FileText },
];
const hue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
const ago = (d) => {
  if (!d) return '';
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
};

function Panel({ children, sx }) {
  return (
    <Box sx={{ borderRadius: 5, p: 2.5, border: 1, borderColor: 'divider', bgcolor: 'background.paper', ...sx }}>{children}</Box>
  );
}

function Stat({ label, value, icon: Icon, accent }) {
  return (
    <Panel sx={{ flex: '1 1 170px', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', right: -24, top: -24, width: 96, height: 96, borderRadius: '50%', background: accent, opacity: 0.18, filter: 'blur(6px)' }} />
      <Box sx={{ width: 38, height: 38, borderRadius: 3, display: 'grid', placeItems: 'center', background: accent, color: '#fff', mb: 1.5 }}><Icon size={18} /></Box>
      <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1 }}>{value ?? '–'}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{label}</Typography>
    </Panel>
  );
}

function Empty({ icon: Icon, title, hint, action }) {
  return (
    <Panel sx={{ textAlign: 'center', py: 8 }}>
      <Box sx={{ width: 56, height: 56, borderRadius: 4, mx: 'auto', mb: 2, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', color: 'primary.main' }}><Icon size={26} /></Box>
      <Typography fontWeight={800}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: action ? 2 : 0 }}>{hint}</Typography>
      {action}
    </Panel>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <TextField
      size="small" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment>, sx: { borderRadius: 99 } }}
      sx={{ minWidth: { xs: '100%', sm: 280 } }}
    />
  );
}

export default function Dashboard() {
  useSeo({ title: 'Admin dashboard', path: '/admin' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((s) => s.theme.mode);
  const { user, preview } = useSelector((s) => s.auth);
  const dark = mode === 'dark';
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: dark ? '#22d3ee' : '#0e7490' },
      secondary: { main: '#7c3aed' },
      background: { default: dark ? '#060b18' : '#f4f8ff', paper: dark ? '#0c1428' : '#ffffff' },
      divider: dark ? 'rgba(148,163,184,.16)' : 'rgba(15,23,42,.10)',
    },
    shape: { borderRadius: 14 },
    typography: { fontFamily: '"Manrope Variable", system-ui, sans-serif', button: { textTransform: 'none', fontWeight: 700 } },
  }), [mode, dark]);

  const [tab, setTab] = useState(0);
  const [data, setData] = useState({ stats: null, projects: [], skills: [], messages: [] });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [edit, setEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [openMsg, setOpenMsg] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [stats, projects, skills, messages] = await Promise.all([adminService.stats(), adminService.projects(), adminService.skills(), adminService.messages()]);
      setData({ stats, projects, skills, messages });
    } catch (e) { setToast({ severity: 'error', text: e.message }); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setQ(''); setCat('All'); }, [tab]);

  const act = async (fn, ok) => {
    try { await fn(); setToast({ severity: 'success', text: ok }); await load(); return true; }
    catch (e) { setToast({ severity: 'error', text: e.message }); return false; }
  };

  const saveProject = async () => {
    setSaving(true);
    const payload = { ...edit, technologies: typeof edit.technologies === 'string' ? edit.technologies.split(',').map((t) => t.trim()).filter(Boolean) : edit.technologies };
    const ok = await act(() => adminService.saveProject(payload), 'Project saved');
    setSaving(false);
    if (ok) setEdit(null);
  };

  const upload = async (file) => {
    if (!file) return;
    try { const res = await adminService.uploadImage(file); setEdit((p) => ({ ...p, image: res.url || res.path })); }
    catch (e) { setToast({ severity: 'error', text: e.message }); }
  };

  const pickResume = (f) => {
    if (f && f.type !== 'application/pdf') { setToast({ severity: 'error', text: 'Only PDF files can be used as a resume.' }); return; }
    setResumeFile(f || null);
  };

  const s = data.stats;
  const msgCount = s?.messages ?? data.messages.length;
  const projCount = s?.projects ?? data.projects.length;
  const skillCount = s?.skills ?? data.skills.length;
  const visitors = s?.visitors; const views = s?.projectViews;
  const engagement = visitors && views != null ? Math.min(100, Math.round((views / Math.max(visitors, 1)) * 100)) : null;

  const categories = ['All', ...new Set(data.projects.map((p) => p.category).filter(Boolean))];
  const projects = data.projects.filter((p) => (cat === 'All' || p.category === cat)
    && `${p.title} ${(p.technologies || []).join(' ')}`.toLowerCase().includes(q.toLowerCase()));
  const messages = data.messages.filter((m) => `${m.name} ${m.email} ${m.subject || ''} ${m.message}`.toLowerCase().includes(q.toLowerCase()));
  const skillGroups = data.skills
    .filter((k) => `${k.name} ${k.category} ${k.description || ''}`.toLowerCase().includes(q.toLowerCase()))
    .reduce((acc, k) => { (acc[k.category || 'Other'] ||= []).push(k); return acc; }, {});
  const selectedMsg = messages.find((m) => m.id === openMsg) || messages[0];

  const signOut = async () => { await signOutFirebase(); dispatch(logout()); navigate('/admin/login'); };
  const firstName = (user?.name || user?.email || 'there').split(/[ @]/)[0];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Box sx={{
        minHeight: '100vh', pt: { xs: 11, md: 13 }, pb: 8, px: { xs: 2, md: 5 }, maxWidth: 1280, mx: 'auto',
        '@media (prefers-reduced-motion: no-preference)': { '& .rise': { animation: 'rise .5s ease both' } },
        '@keyframes rise': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
      }}>
        {/* Header */}
        <Box className="rise" sx={{
          borderRadius: 6, p: { xs: 3, md: 4 }, mb: 3, color: '#fff', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(120deg,#0e7490 0%,#4f46e5 55%,#7c3aed 100%)',
        }}>
          <Box sx={{ position: 'absolute', right: -60, bottom: -80, width: 260, height: 260, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.12)' }} />
          <Box sx={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={800}>{greeting()}, {firstName}</Typography>
              <Typography sx={{ opacity: 0.85, mt: 0.5 }}>
                {msgCount ? `You have ${msgCount} contact message${msgCount === 1 ? '' : 's'} and ${projCount} project${projCount === 1 ? '' : 's'} live.` : 'Your portfolio is live. New messages will show up here.'}
                {preview ? ' (preview mode)' : ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button component={Link} to="/" variant="contained" startIcon={<ExternalLink size={16} />} sx={{ bgcolor: 'rgba(255,255,255,.18)', color: '#fff', backdropFilter: 'blur(6px)', '&:hover': { bgcolor: 'rgba(255,255,255,.28)' } }}>View site</Button>
              <Button variant="contained" startIcon={<LogOut size={16} />} onClick={signOut} sx={{ bgcolor: '#fff', color: '#312e81', '&:hover': { bgcolor: '#e0e7ff' } }}>Sign out</Button>
            </Box>
          </Box>
        </Box>

        {!env.apiEnabled && env.firebase.enabled && <Alert severity="info" sx={{ mb: 3, borderRadius: 4 }}>Firebase mode: visitors, project views and contact messages are live. Projects and skills are edited in code (src/data).</Alert>}
        {!env.apiEnabled && !env.firebase.enabled && <Alert severity="info" sx={{ mb: 3, borderRadius: 4 }}>No backend connected, so the dashboard is read-only and shows built-in data.</Alert>}

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start' }}>
          {/* Navigation */}
          <Box component="nav" aria-label="Dashboard sections" sx={{
            display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 0.5, p: 0.75, borderRadius: 5, border: 1, borderColor: 'divider', bgcolor: 'background.paper',
            width: { xs: '100%', md: 220 }, flexShrink: 0, overflowX: 'auto', position: { md: 'sticky' }, top: { md: 100 },
          }}>
            {NAV.map(({ label, icon: Icon }, i) => {
              const active = tab === i;
              const badge = label === 'Messages' ? msgCount : label === 'Projects' ? projCount : label === 'Skills' ? skillCount : null;
              return (
                <Button key={label} onClick={() => setTab(i)} startIcon={<Icon size={17} />} aria-current={active ? 'page' : undefined}
                  sx={{
                    justifyContent: 'flex-start', borderRadius: 4, px: 1.75, py: 1.1, whiteSpace: 'nowrap', flex: { xs: '0 0 auto', md: 'initial' },
                    color: active ? '#fff' : 'text.secondary',
                    background: active ? 'linear-gradient(120deg,#0e7490,#7c3aed)' : 'transparent',
                    '&:hover': { background: active ? 'linear-gradient(120deg,#0e7490,#7c3aed)' : undefined, bgcolor: active ? undefined : 'action.hover' },
                  }}>
                  <Box sx={{ flex: 1, textAlign: 'left' }}>{label}</Box>
                  {badge ? <Box component="span" sx={{ ml: 1.5, fontSize: 12, px: 0.9, borderRadius: 9, bgcolor: active ? 'rgba(255,255,255,.25)' : 'action.selected' }}>{badge}</Box> : null}
                </Button>
              );
            })}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            {loading ? <Box sx={{ display: 'grid', placeItems: 'center', py: 12 }}><CircularProgress /></Box> : (
              <>
                {tab === 0 && (
                  <Box sx={{ display: 'grid', gap: 2.5 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Stat label="Total visitors" value={visitors} icon={Users} accent="linear-gradient(135deg,#06b6d4,#0e7490)" />
                      <Stat label="Project views" value={views} icon={Eye} accent="linear-gradient(135deg,#8b5cf6,#6d28d9)" />
                      <Stat label="Messages" value={msgCount} icon={Mail} accent="linear-gradient(135deg,#f472b6,#be185d)" />
                      <Stat label="Projects" value={projCount} icon={FolderKanban} accent="linear-gradient(135deg,#34d399,#047857)" />
                      <Stat label="Skills" value={skillCount} icon={Sparkles} accent="linear-gradient(135deg,#fbbf24,#b45309)" />
                    </Box>
                    <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' } }}>
                      <Panel>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography fontWeight={800}>Latest messages</Typography>
                          <Button size="small" onClick={() => setTab(3)}>See all</Button>
                        </Box>
                        {data.messages.length === 0 ? <Typography color="text.secondary" variant="body2">No messages yet. When someone uses your contact form, it appears here.</Typography> : data.messages.slice(0, 4).map((m) => (
                          <Box key={m.id} onClick={() => { setOpenMsg(m.id); setTab(3); }} sx={{ display: 'flex', gap: 1.5, py: 1.25, cursor: 'pointer', borderTop: 1, borderColor: 'divider', '&:hover': { bgcolor: 'action.hover' } }}>
                            <Avatar sx={{ bgcolor: `hsl(${hue(m.name)} 65% 45%)`, width: 36, height: 36, fontSize: 14 }}>{(m.name || '?')[0].toUpperCase()}</Avatar>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography fontWeight={700} noWrap>{m.name}</Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>{m.message}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">{ago(m.createdAt)}</Typography>
                          </Box>
                        ))}
                      </Panel>
                      <Box sx={{ display: 'grid', gap: 2.5, alignContent: 'start' }}>
                        <Panel>
                          <Typography fontWeight={800}>Visitor interest</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Project views per visitor</Typography>
                          <Typography variant="h3" fontWeight={800}>{engagement != null ? `${engagement}%` : '–'}</Typography>
                          <LinearProgress variant="determinate" value={engagement ?? 0} sx={{ height: 8, borderRadius: 9, mt: 1.5 }} />
                        </Panel>
                        <Panel>
                          <Typography fontWeight={800} sx={{ mb: 1.5 }}>Quick actions</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Button variant="contained" size="small" startIcon={<Plus size={14} />} onClick={() => { setTab(1); setEdit({ ...empty }); }}>New project</Button>
                            <Button variant="outlined" size="small" startIcon={<Upload size={14} />} onClick={() => setTab(4)}>Update resume</Button>
                          </Box>
                        </Panel>
                      </Box>
                    </Box>
                  </Box>
                )}

                {tab === 1 && (
                  <Box sx={{ display: 'grid', gap: 2.5 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
                      <SearchBox value={q} onChange={setQ} placeholder="Search by title or technology" />
                      <Button startIcon={<Plus size={16} />} variant="contained" onClick={() => setEdit({ ...empty })}>Create project</Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {categories.map((c) => <Chip key={c} label={c} clickable color={cat === c ? 'primary' : 'default'} variant={cat === c ? 'filled' : 'outlined'} onClick={() => setCat(c)} />)}
                    </Box>
                    {projects.length === 0 ? (
                      <Empty icon={FolderKanban} title="No projects found" hint={q || cat !== 'All' ? 'Try a different search or category.' : 'Create your first project to show it on the site.'} />
                    ) : (
                      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', xl: 'repeat(3,1fr)' } }}>
                        {projects.map((p) => (
                          <Panel key={p.id} sx={{ p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ height: 130, background: p.image ? `url(${p.image}) center/cover` : `linear-gradient(135deg,hsl(${hue(p.title)} 70% 45%),hsl(${(hue(p.title) + 60) % 360} 70% 35%))`, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.9)', fontWeight: 800, fontSize: 38 }}>
                              {!p.image && (p.title || '?')[0]}
                            </Box>
                            <Box sx={{ p: 2, display: 'grid', gap: 1, flex: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                <Typography fontWeight={800}>{p.title}</Typography>
                                <Chip size="small" label={p.category} />
                              </Box>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {(p.technologies || []).slice(0, 5).map((t) => <Chip key={t} size="small" variant="outlined" label={t} />)}
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', pt: 0.5 }}>
                                {p.github && <Tooltip title="GitHub"><IconButton size="small" component="a" href={p.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></IconButton></Tooltip>}
                                {p.liveDemo && <Tooltip title="Live demo"><IconButton size="small" component="a" href={p.liveDemo} target="_blank" rel="noreferrer" aria-label="Live demo"><ExternalLink size={16} /></IconButton></Tooltip>}
                                <Box sx={{ flex: 1 }} />
                                <IconButton aria-label={`Edit ${p.title}`} onClick={() => setEdit({ ...p, _exists: true, technologies: (p.technologies || []).join(', ') })}><Pencil size={16} /></IconButton>
                                <IconButton aria-label={`Delete ${p.title}`} color="error" onClick={() => window.confirm(`Delete ${p.title}?`) && act(() => adminService.deleteProject(p.id), 'Project deleted')}><Trash2 size={16} /></IconButton>
                              </Box>
                            </Box>
                          </Panel>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}

                {tab === 2 && (
                  <Box sx={{ display: 'grid', gap: 2.5 }}>
                    <SearchBox value={q} onChange={setQ} placeholder="Search skills" />
                    {Object.keys(skillGroups).length === 0 ? <Empty icon={Sparkles} title="No skills found" hint="Skills come from your data source. Try a different search." /> : Object.entries(skillGroups).map(([group, list]) => (
                      <Panel key={group}>
                        <Typography fontWeight={800} sx={{ mb: 1.5 }}>{group} <Typography component="span" color="text.secondary" variant="body2">({list.length})</Typography></Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {list.map((k) => (
                            <Tooltip key={k.id ?? k.name} title={k.description || ''} arrow>
                              <Chip label={k.name} onDelete={() => window.confirm(`Delete ${k.name}?`) && act(() => adminService.deleteSkill(k.id), 'Skill deleted')}
                                deleteIcon={<Trash2 size={14} aria-label={`Delete ${k.name}`} />}
                                sx={{ bgcolor: `hsl(${hue(group)} 70% 50% / .15)`, fontWeight: 700 }} />
                            </Tooltip>
                          ))}
                        </Box>
                      </Panel>
                    ))}
                  </Box>
                )}

                {tab === 3 && (
                  <Box sx={{ display: 'grid', gap: 2.5 }}>
                    <SearchBox value={q} onChange={setQ} placeholder="Search messages" />
                    {messages.length === 0 ? <Empty icon={Mail} title="No messages yet" hint="When someone uses your contact form, the message appears here." /> : (
                      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '2fr 3fr' }, alignItems: 'start' }}>
                        <Panel sx={{ p: 0, overflow: 'hidden', maxHeight: 560, overflowY: 'auto' }}>
                          {messages.map((m) => {
                            const on = selectedMsg?.id === m.id;
                            return (
                              <Box key={m.id} onClick={() => setOpenMsg(m.id)} sx={{ display: 'flex', gap: 1.5, p: 2, cursor: 'pointer', borderBottom: 1, borderColor: 'divider', bgcolor: on ? 'action.selected' : 'transparent', '&:hover': { bgcolor: 'action.hover' } }}>
                                <Avatar sx={{ bgcolor: `hsl(${hue(m.name)} 65% 45%)`, width: 38, height: 38 }}>{(m.name || '?')[0].toUpperCase()}</Avatar>
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography fontWeight={700} noWrap>{m.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{ago(m.createdAt)}</Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary" noWrap>{m.subject || m.message}</Typography>
                                </Box>
                              </Box>
                            );
                          })}
                        </Panel>
                        {selectedMsg && (
                          <Panel>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2 }}>
                              <Avatar sx={{ bgcolor: `hsl(${hue(selectedMsg.name)} 65% 45%)`, width: 46, height: 46 }}>{(selectedMsg.name || '?')[0].toUpperCase()}</Avatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography fontWeight={800}>{selectedMsg.name}</Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>{selectedMsg.email}{selectedMsg.createdAt ? ` · ${new Date(selectedMsg.createdAt).toLocaleString()}` : ''}</Typography>
                              </Box>
                              <IconButton aria-label={`Delete message from ${selectedMsg.name}`} color="error" onClick={() => window.confirm('Delete this message?') && act(() => adminService.deleteMessage(selectedMsg.id), 'Message deleted')}><Trash2 size={18} /></IconButton>
                            </Box>
                            {selectedMsg.subject && <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>{selectedMsg.subject}</Typography>}
                            <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{selectedMsg.message}</Typography>
                            <Button component="a" href={`mailto:${selectedMsg.email}${selectedMsg.subject ? `?subject=Re: ${encodeURIComponent(selectedMsg.subject)}` : ''}`} variant="contained" startIcon={<Mail size={16} />} sx={{ mt: 3 }}>Reply by email</Button>
                          </Panel>
                        )}
                      </Box>
                    )}
                  </Box>
                )}

                {tab === 4 && (
                  <Panel sx={{ maxWidth: 560 }}>
                    <Typography fontWeight={800}>Replace resume PDF</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>The new file replaces the resume visitors download from your site.</Typography>
                    <Box component="label"
                      onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                      onDrop={(e) => { e.preventDefault(); setDrag(false); pickResume(e.dataTransfer.files?.[0]); }}
                      sx={{ display: 'grid', placeItems: 'center', gap: 1, py: 5, px: 2, textAlign: 'center', cursor: 'pointer', borderRadius: 5, border: '2px dashed', borderColor: drag ? 'primary.main' : 'divider', bgcolor: drag ? 'action.hover' : 'transparent', transition: 'all .2s', '&:focus-within': { borderColor: 'primary.main' } }}>
                      <FileText size={30} />
                      <Typography fontWeight={700}>{resumeFile ? resumeFile.name : 'Drop a PDF here or click to choose'}</Typography>
                      {resumeFile && <Typography variant="caption" color="text.secondary">{(resumeFile.size / 1024).toFixed(0)} KB</Typography>}
                      <input hidden type="file" accept="application/pdf" onChange={(e) => pickResume(e.target.files?.[0])} />
                    </Box>
                    <Button fullWidth variant="contained" sx={{ mt: 2 }} disabled={!resumeFile} startIcon={<Upload size={16} />}
                      onClick={async () => { if (await act(() => adminService.uploadResume(resumeFile), 'Resume updated')) setResumeFile(null); }}>Upload resume</Button>
                  </Panel>
                )}
              </>
            )}
          </Box>
        </Box>

        <Dialog open={Boolean(edit)} onClose={() => setEdit(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 5 } }}>
          <DialogTitle sx={{ fontWeight: 800 }}>{edit?._exists ? 'Edit project' : 'Create project'}</DialogTitle>
          <DialogContent sx={{ display: 'grid', gap: 2, pt: '8px !important' }}>
            {edit && ['title', 'slug', 'category', 'github', 'liveDemo', 'technologies'].map((k) => (
              <TextField key={k} label={k === 'technologies' ? 'Technologies (comma separated)' : k} size="small" value={edit[k] ?? ''} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} />
            ))}
            {edit && <TextField label="description" size="small" multiline minRows={3} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />}
            {edit && (
              <Button component="label" variant="outlined" startIcon={<Upload size={16} />}>
                {edit.image ? 'Replace image' : 'Upload cover image'}
                <input hidden type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
              </Button>
            )}
            {edit?.image && <Box component="img" src={edit.image} alt="Cover preview" sx={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 3 }} />}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setEdit(null)}>Cancel</Button>
            <Button variant="contained" onClick={saveProject} disabled={saving || !edit?.title}>{saving ? 'Saving...' : 'Save project'}</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={Boolean(toast)} autoHideDuration={4500} onClose={() => setToast(null)}>
          {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)} variant="filled">{toast.text}</Alert> : undefined}
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}