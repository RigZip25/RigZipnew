import { useEffect, useMemo, useState } from 'react';

interface Rig {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'idle' | 'maintenance';
}

type ApiState = 'loading' | 'ready' | 'error';

const statusColor: Record<Rig['status'], string> = {
  active: '#16a34a',
  idle: '#ca8a04',
  maintenance: '#dc2626',
};

export default function App() {
  const [rigs, setRigs] = useState<Rig[]>([]);
  const [apiState, setApiState] = useState<ApiState>('loading');
  const [health, setHealth] = useState<string>('checking…');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<Rig['status']>('idle');

  async function loadRigs() {
    setApiState('loading');
    try {
      const [healthRes, rigsRes] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/rigs'),
      ]);
      const healthJson = await healthRes.json();
      const rigsJson: Rig[] = await rigsRes.json();
      setHealth(`${healthJson.service} · ${healthJson.status}`);
      setRigs(rigsJson);
      setApiState('ready');
    } catch {
      setApiState('error');
      setHealth('unreachable');
    }
  }

  useEffect(() => {
    void loadRigs();
  }, []);

  async function addRig(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim() === '') return;
    const res = await fetch('/api/rigs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location, status }),
    });
    if (res.ok) {
      const created: Rig = await res.json();
      setRigs((prev) => [...prev, created]);
      setName('');
      setLocation('');
      setStatus('idle');
    }
  }

  const activeCount = useMemo(
    () => rigs.filter((r) => r.status === 'active').length,
    [rigs],
  );

  return (
    <main className="app">
      <header className="app__header">
        <h1>RigZip</h1>
        <span className={`badge badge--${apiState}`}>API: {health}</span>
      </header>

      <section className="stats">
        <div className="stat">
          <span className="stat__value">{rigs.length}</span>
          <span className="stat__label">Total rigs</span>
        </div>
        <div className="stat">
          <span className="stat__value">{activeCount}</span>
          <span className="stat__label">Active</span>
        </div>
      </section>

      <section className="panel">
        <h2>Fleet</h2>
        {apiState === 'error' ? (
          <p className="error">Could not reach the API. Is the server running?</p>
        ) : (
          <ul className="rig-list">
            {rigs.map((rig) => (
              <li key={rig.id} className="rig">
                <span className="rig__name">{rig.name}</span>
                <span className="rig__location">{rig.location}</span>
                <span className="rig__status" style={{ color: statusColor[rig.status] }}>
                  ● {rig.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <h2>Register a rig</h2>
        <form className="form" onSubmit={addRig}>
          <input
            aria-label="Rig name"
            placeholder="Rig name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            aria-label="Location"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select
            aria-label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Rig['status'])}
          >
            <option value="active">active</option>
            <option value="idle">idle</option>
            <option value="maintenance">maintenance</option>
          </select>
          <button type="submit">Add rig</button>
        </form>
      </section>
    </main>
  );
}
