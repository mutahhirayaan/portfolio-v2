import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Snackbar, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, ThemeProvider, Typography, createTheme,
} from '@mui/material';
import { LogOut, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { logout } from '../../store/authSlice';
import { adminService } from '../../services/adminService';
import { signOutFirebase } from '../../services/authService';
import { env } from '../../config/env';
import { useSeo } from '../../hooks/useSeo';

const empty = { title: '', slug: '', category: 'Full Stack', description: '', github: '', liveDemo: '', image: '', technologies: '' };

function Stat({ label, value }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 4, flex: '1 1 160px' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h4" fontWeight={800}>{value ?? '–'}</Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  useSeo({ title: 'Admin dashboard', path: '/admin' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((s) => s.theme.mode);
  const { user, preview } = useSelector((s) => s.auth);
  const theme = useMemo(() => createTheme({
    palette: { mode, primary: { main: mode === 'dark' ? '#22d3ee' : '#0e7490' }, secondary: { main: '#7c3aed' }, background: { default: mode === 'dark' ? '#060b18' : '#f4f8ff', paper: mode === 'dark' ? '#0c1428' : '#ffffff' } },
    shape: { borderRadius: 14 },
    typography: { fontFamily: '"Manrope Variable", system-ui, sans-serif' },
  }), [mode]);

  const [tab, setTab] = useState(0);
  const [data, setData] = useState({ stats: null, projects: [], skills: [], messages: [] });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [edit, setEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [stats, projects, skills, messages] = await Promise.all([adminService.stats(), adminService.projects(), adminService.skills(), adminService.messages()]);
      setData({ stats, projects, skills, messages });
    } catch (e) { setToast({ severity: 'error', text: e.message }); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ minHeight: '100vh', pt: { xs: 12, md: 14 }, pb: 8, px: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <div>
            <Typography variant="h4" fontWeight={800}>Admin dashboard</Typography>
            <Typography color="text.secondary">Signed in as {user?.email}{preview ? ' (preview mode)' : ''}</Typography>
          </div>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={Link} to="/" variant="outlined">View site</Button>
            <Button startIcon={<LogOut size={16} />} variant="contained" onClick={async () => { await signOutFirebase(); dispatch(logout()); navigate('/admin/login'); }}>Sign out</Button>
          </Box>
        </Box>

        {!env.apiEnabled && env.firebase.enabled && <Alert severity="info" sx={{ mb: 3 }}>Firebase mode: visitors, project views aur contact messages live hain. Projects aur skills code se edit hote hain (src/data).</Alert>}
        {!env.apiEnabled && !env.firebase.enabled && <Alert severity="info" sx={{ mb: 3 }}>Backend connect nahi hai, isliye dashboard read-only hai aur built-in data dikha raha hai.</Alert>}

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" sx={{ mb: 3 }}>
          {['Overview', 'Projects', 'Skills', 'Messages', 'Resume'].map((t) => <Tab key={t} label={t} />)}
        </Tabs>

        {loading ? <Box sx={{ display: 'grid', placeItems: 'center', py: 10 }}><CircularProgress /></Box> : (
          <>
            {tab === 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Stat label="Total visitors" value={data.stats?.visitors} />
                <Stat label="Project views" value={data.stats?.projectViews} />
                <Stat label="Contact messages" value={data.stats?.messages ?? data.messages.length} />
                <Stat label="Projects" value={data.stats?.projects ?? data.projects.length} />
                <Stat label="Skills" value={data.stats?.skills ?? data.skills.length} />
              </Box>
            )}

            {tab === 1 && (
              <>
                <Button startIcon={<Plus size={16} />} variant="contained" sx={{ mb: 2 }} onClick={() => setEdit({ ...empty })}>Create project</Button>
                <Card variant="outlined" sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead><TableRow><TableCell>Title</TableCell><TableCell>Category</TableCell><TableCell>Technologies</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                    <TableBody>
                      {data.projects.map((p) => (
                        <TableRow key={p.id} hover>
                          <TableCell sx={{ fontWeight: 700 }}>{p.title}</TableCell>
                          <TableCell><Chip size="small" label={p.category} /></TableCell>
                          <TableCell sx={{ maxWidth: 320 }}>{p.technologies?.join(', ')}</TableCell>
                          <TableCell align="right">
                            <IconButton aria-label={`Edit ${p.title}`} onClick={() => setEdit({ ...p, _exists: true, technologies: (p.technologies || []).join(', ') })}><Pencil size={16} /></IconButton>
                            <IconButton aria-label={`Delete ${p.title}`} color="error" onClick={() => window.confirm(`Delete ${p.title}?`) && act(() => adminService.deleteProject(p.id), 'Project deleted')}><Trash2 size={16} /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </>
            )}

            {tab === 2 && (
              <Card variant="outlined" sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Category</TableCell><TableCell>Description</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                  <TableBody>
                    {data.skills.map((s) => (
                      <TableRow key={s.id ?? s.name} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{s.name}</TableCell>
                        <TableCell><Chip size="small" label={s.category} /></TableCell>
                        <TableCell sx={{ maxWidth: 420 }}>{s.description}</TableCell>
                        <TableCell align="right"><IconButton aria-label={`Delete ${s.name}`} color="error" onClick={() => window.confirm(`Delete ${s.name}?`) && act(() => adminService.deleteSkill(s.id), 'Skill deleted')}><Trash2 size={16} /></IconButton></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {tab === 3 && (
              data.messages.length === 0 ? <Typography color="text.secondary">No messages yet.</Typography> : (
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {data.messages.map((m) => (
                    <Card key={m.id} variant="outlined"><CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                        <Typography fontWeight={700}>{m.name} · {m.email}</Typography>
                        <IconButton aria-label={`Delete message from ${m.name}`} color="error" size="small" onClick={() => window.confirm('Delete this message?') && act(() => adminService.deleteMessage(m.id), 'Message deleted')}><Trash2 size={16} /></IconButton>
                      </Box>
                      {m.createdAt && <Typography variant="caption" color="text.secondary">{new Date(m.createdAt).toLocaleString()}</Typography>}
                      {m.subject && <Typography variant="body2" color="text.secondary">{m.subject}</Typography>}
                      <Typography sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{m.message}</Typography>
                    </CardContent></Card>
                  ))}
                </Box>
              )
            )}

            {tab === 4 && (
              <Card variant="outlined"><CardContent sx={{ display: 'grid', gap: 2, maxWidth: 480 }}>
                <Typography fontWeight={700}>Replace resume PDF</Typography>
                <Button component="label" variant="outlined" startIcon={<Upload size={16} />}>
                  {resumeFile ? resumeFile.name : 'Choose PDF'}
                  <input hidden type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
                </Button>
                <Button variant="contained" disabled={!resumeFile} onClick={() => act(() => adminService.uploadResume(resumeFile), 'Resume updated')}>Upload</Button>
              </CardContent></Card>
            )}
          </>
        )}

        <Dialog open={Boolean(edit)} onClose={() => setEdit(null)} fullWidth maxWidth="sm">
          <DialogTitle>{edit?._exists ? 'Edit project' : 'Create project'}</DialogTitle>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEdit(null)}>Cancel</Button>
            <Button variant="contained" onClick={saveProject} disabled={saving || !edit?.title}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={Boolean(toast)} autoHideDuration={4500} onClose={() => setToast(null)}>
          {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)} variant="filled">{toast.text}</Alert> : undefined}
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
