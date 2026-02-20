import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Simple API base URL
const API_URL = 'http://localhost:3000/api';

function App() {
  const [view, setView] = useState('home'); // home, dashboard, community, workflow
  const [tab, setTab] = useState('games'); // games, players, developers, tournaments
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  // Lists for dropdowns
  const [allPlayers, setAllPlayers] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [allDevs, setAllDevs] = useState([]);

  useEffect(() => {
    if (view !== 'home') {
      loadData();
    }
  }, [view, tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/${tab}`);
      setItems(res.data);

      // Load extra data for selects
      const pRes = await axios.get(`${API_URL}/players`);
      const gRes = await axios.get(`${API_URL}/games`);
      const dRes = await axios.get(`${API_URL}/developers`);
      setAllPlayers(pRes.data);
      setAllGames(gRes.data);
      setAllDevs(dRes.data);
    } catch (err) {
      console.log('Error loading data');
    }
    setLoading(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    try {
      // Basic formatting
      const data = { ...formData };
      if (data.age) data.age = Number(data.age);
      if (data.rating) data.rating = Number(data.rating);
      if (data.hourlyRate) data.hourlyRate = Number(data.hourlyRate);
      if (data.experienceYears) data.experienceYears = Number(data.experienceYears);

      if (editId) {
        await axios.patch(`${API_URL}/${tab}/${editId}`, data);
        setMsg('Successfully updated!');
      } else {
        const url = tab === 'tournaments' ? `${API_URL}/tournaments/register` : `${API_URL}/${tab}`;
        await axios.post(url, data);
        setMsg('Successfully added!');
      }
      setMsgType('success');
      setFormData({});
      setEditId(null);
      loadData();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error occurred');
      setMsgType('error');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`${API_URL}/${tab}/${id}`);
      setMsg('Deleted!');
      setMsgType('success');
      loadData();
    } catch (err) {
      setMsg('Delete failed');
      setMsgType('error');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const onEdit = (item) => {
    setEditId(item._id);
    const data = { ...item };
    if (tab === 'tournaments') {
      data.playerId = item.playerId?._id || item.playerId;
      data.gameId = item.gameId?._id || item.gameId;
      data.developerId = item.developerId?._id || item.developerId;
    }
    setFormData(data);
  };

  // Main Home Page
  if (view === 'home') {
    return (
      <div className="app-container">
        <header>
          <h1>Game Management Tool</h1>
        </header>
        <div className="dashboard-grid">
          <button className="dash-btn" onClick={() => { setView('dashboard'); setTab('games'); }}>Go to Games Dashboard</button>
          <button className="dash-btn" onClick={() => { setView('community'); setTab('players'); }}>View Community</button>
          <button className="dash-btn" onClick={() => setView('workflow')}>Manage Workflow</button>
        </div>
      </div>
    );
  }

  // Dashboard/Community View
  if (view !== 'workflow') {
    return (
      <div className="app-container">
        <header>
          <button className="back-btn" onClick={() => setView('home')}>Back to Home</button>
          <h2>{view === 'dashboard' ? 'Games List' : 'Players List'}</h2>
        </header>
        <div className="grid">
          {items.map(item => (
            <div key={item._id} className="card">
              <h4>{item.title || item.name}</h4>
              <p>{item.genre || item.email}</p>
              <div className="badge">{item.rating ? `Rating: ${item.rating}` : (item.membershipLevel || 'Member')}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Workflow View
  return (
    <div className="app-container">
      <header>
        <button className="back-btn" onClick={() => setView('home')}>Back to Home</button>
        <h2>Workflow Section</h2>
      </header>

      <div className="workflow-tabs">
        <button className={tab === 'games' ? 'active' : ''} onClick={() => setTab('games')}>Games</button>
        <button className={tab === 'players' ? 'active' : ''} onClick={() => setTab('players')}>Players</button>
        <button className={tab === 'developers' ? 'active' : ''} onClick={() => setTab('developers')}>Developers</button>
        <button className={tab === 'tournaments' ? 'active' : ''} onClick={() => setTab('tournaments')}>Tournaments</button>
      </div>

      {msg && <div className={`message message-${msgType}`}>{msg}</div>}

      <div className="workflow-container">
        <div className="workflow-side">
          <h3>Items List</h3>
          <div className="management-list">
            {items.map(i => (
              <div key={i._id} className="management-item">
                <span>{i.title || i.name || `Record ${i._id.substring(0, 5)}`}</span>
                <div>
                  <button onClick={() => onEdit(i)}>Edit</button>
                  <button onClick={() => onDelete(i._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="workflow-side">
          <h3>{editId ? 'Edit Entry' : 'Add New Entry'}</h3>
          <form onSubmit={onSave}>
            {tab === 'games' && (
              <>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <select value={formData.genre || ''} onChange={e => setFormData({ ...formData, genre: e.target.value })} required>
                    <option value="">-- Choose Genre --</option>
                    <option value="RPG">RPG</option>
                    <option value="FPS">FPS</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Simulation">Simulation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Rating (0-10)</label>
                  <input type="number" value={formData.rating || ''} onChange={e => setFormData({ ...formData, rating: e.target.value })} />
                </div>
              </>
            )}

            {tab === 'players' && (
              <>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" value={formData.age || ''} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Membership</label>
                  <select value={formData.membershipLevel || 'free'} onChange={e => setFormData({ ...formData, membershipLevel: e.target.value })}>
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>
              </>
            )}

            {tab === 'developers' && (
              <>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Hourly Rate</label>
                  <input type="number" value={formData.hourlyRate || ''} onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Years of Exp</label>
                  <input type="number" value={formData.experienceYears || ''} onChange={e => setFormData({ ...formData, experienceYears: e.target.value })} />
                </div>
              </>
            )}

            {tab === 'tournaments' && (
              <>
                <div className="form-group">
                  <label>Player</label>
                  <select value={formData.playerId || ''} onChange={e => setFormData({ ...formData, playerId: e.target.value })} required>
                    <option value="">-- Choose Player --</option>
                    {allPlayers.map(p => <option key={p._id} value={p._id}>{p.name} ({p.membershipLevel})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Game</label>
                  <select value={formData.gameId || ''} onChange={e => setFormData({ ...formData, gameId: e.target.value })} required>
                    <option value="">-- Choose Game --</option>
                    {allGames.map(g => <option key={g._id} value={g._id}>{g.title}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Developer Host</label>
                  <select value={formData.developerId || ''} onChange={e => setFormData({ ...formData, developerId: e.target.value })} required>
                    <option value="">-- Choose Dev --</option>
                    {allDevs.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={formData.tournamentDate?.split('T')[0] || ''} onChange={e => setFormData({ ...formData, tournamentDate: e.target.value })} required />
                </div>
              </>
            )}

            <button type="submit" className="btn-primary">Save Changes</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setFormData({}); }}>Cancel</button>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
