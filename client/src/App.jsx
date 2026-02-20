import { useState, useEffect } from 'react';
import axios from 'axios';
import { Gamepad2, Users, Code2, Trophy, Plus, Trash2, Edit2, ArrowLeft, LayoutDashboard, Fingerprint, Settings2, ShieldCheck, Mail, Clock, Star } from 'lucide-react';
import './App.css';

const API_BASE = 'http://localhost:3000/api';

const GENRES = ['RPG', 'FPS', 'Puzzle', 'Strategy', 'Simulation'];

function App() {
  const [appView, setAppView] = useState('home'); // home, dashboard, community, workflow
  const [activeTab, setActiveTab] = useState('games');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [extraData, setExtraData] = useState({ players: [], games: [], developers: [] });

  useEffect(() => {
    if (appView !== 'home') {
      fetchData();
    }
  }, [appView, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab;
      const response = await axios.get(`${API_BASE}/${endpoint}`);
      setData(response.data);

      if (activeTab === 'tournaments' || appView === 'workflow') {
        const [p, g, d] = await Promise.all([
          axios.get(`${API_BASE}/players`),
          axios.get(`${API_BASE}/games`),
          axios.get(`${API_BASE}/developers`)
        ]);
        setExtraData({ players: p.data, games: g.data, developers: d.data });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure numeric fields are numbers
      const payload = { ...formData };
      if (payload.age) payload.age = Number(payload.age);
      if (payload.hourlyRate) payload.hourlyRate = Number(payload.hourlyRate);
      if (payload.experienceYears) payload.experienceYears = Number(payload.experienceYears);
      if (payload.rating) payload.rating = Number(payload.rating);

      // Cleanup empty optional strings to avoid validation errors
      Object.keys(payload).forEach(key => {
        if (payload[key] === '') delete payload[key];
      });

      if (editingId) {
        await axios.patch(`${API_BASE}/${activeTab}/${editingId}`, payload);
        setMessage({ text: 'Updated successfully!', type: 'success' });
      } else {
        const endpoint = activeTab === 'tournaments' ? 'tournaments/register' : activeTab;
        await axios.post(`${API_BASE}/${endpoint}`, payload);
        setMessage({ text: 'Added successfully!', type: 'success' });
      }

      setFormData({});
      setEditingId(null);
      fetchData();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: error.response?.data?.error || error.response?.data?.message || 'Operation failed', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await axios.delete(`${API_BASE}/${activeTab}/${id}`);
      if (editingId === id) {
        setEditingId(null);
        setFormData({});
      }
      setMessage({ text: 'Deleted successfully!', type: 'success' });
      fetchData();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Delete failed', type: 'error' });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    const editData = { ...item };
    // Prepare data for form (e.g., extract IDs from populated fields)
    if (activeTab === 'tournaments') {
      editData.playerId = item.playerId?._id || item.playerId;
      editData.gameId = item.gameId?._id || item.gameId;
      editData.developerId = item.developerId?._id || item.developerId;
    }
    setFormData(editData);
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'games':
        return (
          <>
            <div className="form-group"><label>Title</label><input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div>
            <div className="form-group">
              <label>Genre</label>
              <select value={formData.genre || ''} onChange={e => setFormData({ ...formData, genre: e.target.value })} required>
                <option value="">Select Genre</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Rating (0-10)</label><input type="number" min="0" max="10" value={formData.rating || ''} onChange={e => setFormData({ ...formData, rating: e.target.value })} /></div>
            <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={formData.multiplayer || false} onChange={e => setFormData({ ...formData, multiplayer: e.target.checked })} />
              <label>Multiplayer</label>
            </div>
          </>
        );
      case 'players':
        return (
          <>
            <div className="form-group"><label>Name</label><input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
            <div className="form-group"><label>Age</label><input type="number" value={formData.age || ''} onChange={e => setFormData({ ...formData, age: e.target.value })} /></div>
            <div className="form-group">
              <label>Membership Level</label>
              <select value={formData.membershipLevel || 'free'} onChange={e => setFormData({ ...formData, membershipLevel: e.target.value })} required>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="elite">Elite</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={formData.active !== false} onChange={e => setFormData({ ...formData, active: e.target.checked })} />
              <label>Active Account</label>
            </div>
          </>
        );
      case 'developers':
        return (
          <>
            <div className="form-group"><label>Name</label><input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
            <div className="form-group"><label>Hourly Rate ($)</label><input type="number" value={formData.hourlyRate || ''} onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })} required /></div>
            <div className="form-group"><label>Exp Years</label><input type="number" value={formData.experienceYears || ''} onChange={e => setFormData({ ...formData, experienceYears: e.target.value })} /></div>
            <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={formData.available !== false} onChange={e => setFormData({ ...formData, available: e.target.checked })} />
              <label>Available for Hire</label>
            </div>
          </>
        );
      case 'tournaments':
        return (
          <>
            <div className="form-group">
              <label>Player (Premium/Elite required)</label>
              <select value={formData.playerId || ''} onChange={e => setFormData({ ...formData, playerId: e.target.value })} required>
                <option value="">Select Player</option>
                {extraData.players.map(p => <option key={p._id} value={p._id}>{p.name} ({p.membershipLevel})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Game</label>
              <select value={formData.gameId || ''} onChange={e => setFormData({ ...formData, gameId: e.target.value })} required>
                <option value="">Select Game</option>
                {extraData.games.map(g => <option key={g._id} value={g._id}>{g.title}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Developer (Host)</label>
              <select value={formData.developerId || ''} onChange={e => setFormData({ ...formData, developerId: e.target.value })} required>
                <option value="">Select Developer</option>
                {extraData.developers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tournament Date</label>
              <input type="date" value={formData.tournamentDate ? formData.tournamentDate.split('T')[0] : ''} onChange={e => setFormData({ ...formData, tournamentDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            </div>
          </>
        );
      default: return null;
    }
  };

  if (appView === 'home') {
    return (
      <div className="app-container">
        <header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Gamepad2 className="primary-icon" size={32} color="#6366f1" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>GameNexus</h1>
          </div>
        </header>

        <div className="dashboard-grid">
          <button className="dash-btn" onClick={() => { setAppView('dashboard'); setActiveTab('games'); }}>
            <LayoutDashboard size={48} />
            Games Dashboard
          </button>
          <button className="dash-btn" onClick={() => { setAppView('community'); setActiveTab('players'); }}>
            <Users size={48} />
            Community
          </button>
          <button className="dash-btn" onClick={() => setAppView('workflow')}>
            <Settings2 size={48} />
            Workflow
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <button className="back-btn" onClick={() => setAppView('home')}>
          <ArrowLeft size={18} /> Back to Home
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontSize: '1.25rem' }}>{appView.toUpperCase()} MODE</h1>
        </div>
      </header>

      {appView === 'workflow' ? (
        <>
          <div className="workflow-tabs">
            <button className={activeTab === 'games' ? 'active' : ''} onClick={() => { setActiveTab('games'); setFormData({}); setEditingId(null); setMessage({ text: '', type: '' }); }}>Games</button>
            <button className={activeTab === 'players' ? 'active' : ''} onClick={() => { setActiveTab('players'); setFormData({}); setEditingId(null); setMessage({ text: '', type: '' }); }}>Players</button>
            <button className={activeTab === 'developers' ? 'active' : ''} onClick={() => { setActiveTab('developers'); setFormData({}); setEditingId(null); setMessage({ text: '', type: '' }); }}>Developers</button>
            <button className={activeTab === 'tournaments' ? 'active' : ''} onClick={() => { setActiveTab('tournaments'); setFormData({}); setEditingId(null); setMessage({ text: '', type: '' }); }}>Tournaments</button>
          </div>

          <div className="workflow-container">
            <div className="workflow-side">
              <h3 className="form-title">Manage {activeTab}</h3>
              <div className="management-list">
                {loading ? <p>Loading...</p> : data.map(item => (
                  <div key={item._id} className="management-item">
                    <span>{item.title || item.name || `Tournament ${item._id.slice(-4)}`}</span>
                    <div className="action-btns">
                      <button className="icon-btn edit" onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                      <button className="icon-btn delete" onClick={() => handleDelete(item._id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="workflow-side">
              <h3 className="form-title">{editingId ? 'Edit' : 'Add New'} {activeTab}</h3>
              {message.text && (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: message.type === 'success' ? '#4ade80' : '#f87171',
                  border: '1px solid currentColor'
                }}>
                  {message.text}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                {renderForm()}
                <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                  {editingId ? 'Update Information' : 'Add Record'}
                </button>
                {editingId && (
                  <button type="button" className="btn-primary" style={{ background: 'transparent', marginTop: '0.5rem', border: '1px solid var(--border)' }} onClick={() => { setEditingId(null); setFormData({}); }}>
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>
        </>
      ) : (
        <div className="grid">
          {loading ? <p>Loading dashboard...</p> : data.map(item => (
            <div key={item._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{item.title || item.name}</h3>
                {item.membershipLevel && <Star size={16} color={item.membershipLevel === 'elite' ? '#c084fc' : '#60a5fa'} />}
              </div>

              {item.email && <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={12} /> {item.email}</p>}
              {item.genre && <p>Genre: {item.genre}</p>}
              {item.tournamentDate && <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={12} /> {new Date(item.tournamentDate).toLocaleDateString()}</p>}

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${item.membershipLevel === 'elite' ? 'badge-purple' :
                    item.membershipLevel === 'premium' ? 'badge-blue' :
                      item.status === 'registered' ? 'badge-green' : 'badge-green'
                  }`}>
                  {item.membershipLevel || item.status || (item.hourlyRate ? `$${item.hourlyRate}/hr` : (item.rating ? `${item.rating}/10` : 'Active'))}
                </span>
                {item.available !== undefined && (
                  <ShieldCheck size={16} color={item.available ? '#4ade80' : '#94a3b8'} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
