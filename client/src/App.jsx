import { useState, useEffect } from 'react';
import axios from 'axios';
import { Gamepad2, Users, Code2, Trophy, Plus, Trash2, Edit2, ArrowLeft, LayoutDashboard, Fingerprint, Settings2 } from 'lucide-react';
import './App.css';

const API_BASE = 'http://localhost:3000/api';

function App() {
  const [appView, setAppView] = useState('home'); // home, dashboard, community, workflow
  const [activeTab, setActiveTab] = useState('games'); // for lists and workflow selection
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
      if (editingId) {
        await axios.put(`${API_BASE}/${activeTab}/${editingId}`, formData);
        setMessage({ text: 'Updated successfully!', type: 'success' });
      } else {
        const endpoint = activeTab === 'tournaments' ? 'tournaments/register' : activeTab;
        await axios.post(`${API_BASE}/${endpoint}`, formData);
        setMessage({ text: 'Added successfully!', type: 'success' });
      }
      setFormData({});
      setEditingId(null);
      fetchData();
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Operation failed', type: 'error' });
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
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Delete failed', type: 'error' });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData(item);
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'games':
        return (
          <>
            <div className="form-group"><label>Title</label><input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div>
            <div className="form-group"><label>Genre</label><input type="text" value={formData.genre || ''} onChange={e => setFormData({ ...formData, genre: e.target.value })} required /></div>
            <div className="form-group"><label>Rating</label><input type="number" value={formData.rating || ''} onChange={e => setFormData({ ...formData, rating: e.target.value })} required /></div>
          </>
        );
      case 'players':
        return (
          <>
            <div className="form-group"><label>Name</label><input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
            <div className="form-group"><label>Membership</label><select value={formData.membershipLevel || ''} onChange={e => setFormData({ ...formData, membershipLevel: e.target.value })} required><option value="">Select</option><option value="regular">Regular</option><option value="premium">Premium</option><option value="elite">Elite</option></select></div>
          </>
        );
      case 'developers':
        return (
          <>
            <div className="form-group"><label>Name</label><input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div className="form-group"><label>Hourly Rate</label><input type="number" value={formData.hourlyRate || ''} onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })} required /></div>
          </>
        );
      case 'tournaments':
        return (
          <>
            <div className="form-group">
              <label>Player</label>
              <select value={formData.playerId || ''} onChange={e => setFormData({ ...formData, playerId: e.target.value })} required>
                <option value="">Select Player</option>
                {extraData.players.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
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
              <label>Date</label>
              <input type="date" value={formData.tournamentDate ? formData.tournamentDate.split('T')[0] : ''} onChange={e => setFormData({ ...formData, tournamentDate: e.target.value })} required />
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
            <button className={activeTab === 'games' ? 'active' : ''} onClick={() => { setActiveTab('games'); setFormData({}); setEditingId(null); }}>Games</button>
            <button className={activeTab === 'players' ? 'active' : ''} onClick={() => { setActiveTab('players'); setFormData({}); setEditingId(null); }}>Players</button>
            <button className={activeTab === 'developers' ? 'active' : ''} onClick={() => { setActiveTab('developers'); setFormData({}); setEditingId(null); }}>Developers</button>
            <button className={activeTab === 'tournaments' ? 'active' : ''} onClick={() => { setActiveTab('tournaments'); setFormData({}); setEditingId(null); }}>Tournaments</button>
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
              {message.text && <div style={{ color: message.type === 'success' ? '#4ade80' : '#f87171', marginBottom: '1rem' }}>{message.text}</div>}
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
          {data.map(item => (
            <div key={item._id} className="card">
              <h3>{item.title || item.name}</h3>
              <p>{item.genre || item.email || (item.gameId?.title ? `Game: ${item.gameId.title}` : '')}</p>
              <span className="badge badge-purple">{item.rating || item.membershipLevel || item.status || (item.hourlyRate ? `$${item.hourlyRate}/hr` : '')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
