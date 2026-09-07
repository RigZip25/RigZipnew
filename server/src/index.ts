import cors from 'cors';
import express, { type Request, type Response } from 'express';

export interface Rig {
  id: number;
  name: string;
  location: string;
  status: 'active' | 'idle' | 'maintenance';
}

const PORT = Number(process.env.PORT ?? 3001);

let nextId = 4;
const rigs: Rig[] = [
  { id: 1, name: 'Titan-01', location: 'Gulf of Mexico', status: 'active' },
  { id: 2, name: 'Nomad-07', location: 'North Sea', status: 'idle' },
  { id: 3, name: 'Aurora-12', location: 'Permian Basin', status: 'maintenance' },
];

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'rigzip-api', time: new Date().toISOString() });
  });

  app.get('/api/rigs', (_req: Request, res: Response) => {
    res.json(rigs);
  });

  app.post('/api/rigs', (req: Request, res: Response) => {
    const { name, location, status } = req.body ?? {};
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'name is required' });
    }
    const rig: Rig = {
      id: nextId++,
      name: name.trim(),
      location: typeof location === 'string' && location.trim() !== '' ? location.trim() : 'Unknown',
      status: status === 'active' || status === 'idle' || status === 'maintenance' ? status : 'idle',
    };
    rigs.push(rig);
    return res.status(201).json(rig);
  });

  return app;
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[rigzip-api] listening on http://localhost:${PORT}`);
  });
}
