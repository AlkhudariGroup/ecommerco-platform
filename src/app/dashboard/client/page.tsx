
'use client';

import { useState } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function ClientDashboard() {
  const saveCreds = useMutation(api.woocommerce.saveCredentials);
  const searchProducts = useAction(api.woocommerce_actions.searchProducts);
  const setSystemRole = useMutation(api.agents.setSystemRole);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [secret, setSecret] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [kbItems, setKbItems] = useState<string[]>([]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMsg('');
    try {
      await saveCreds({ url, key, secret });
      await onValidate();
    } catch {
      setStatus('error');
    }
  };
  // Use action hook for validation
  const validate = useAction(api.woocommerce.validateCredentials);
  const onValidate = async () => {
    setStatus('saving');
    setErrorMsg('');
    try {
      const result = await validate({ url, key, secret }) as any;
      if (result?.ok) {
        setStatus('saved');
        setOpen(false);
        setUrl('');
        setKey('');
        setSecret('');
      } else {
        setStatus('error');
        setErrorMsg(result?.message || `WooCommerce error ${result?.status || ''}`);
      }
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.message || 'Validation failed');
    }
  };

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    try {
      const data = await searchProducts({ query: q, perPage: 10 });
      setResults(data as any[]);
    } finally {
      setSearching(false);
    }
  };

  const applySalPartsRole = async () => {
    const role =
      'You are an AI sales assistant for an auto spare parts store. Your name is "SalParts AI Assistant". You work for the online store https://salparts.com. Help customers find auto spare parts, check prices and availability, suggest alternatives, and guide purchase. Main tasks: search products by name or part number, tell price, check stock, suggest compatible alternatives, help choose correct part, guide to purchase. Identity: If asked who you are, reply "I am SalParts AI Assistant. I help you find auto spare parts, check prices, and choose the correct parts for your vehicle." If asked if human, reply "I am an AI assistant helping the SalParts store." Product questions: query WooCommerce /wp-json/wc/v3/products by name, SKU or part number and answer with name, price, availability, short description. If unavailable, suggest alternatives with brand, price, stock and compatibility. If user doesn\'t know the part, ask for brand, model, year, engine size. Always keep answers clear, short, helpful, friendly and professional. Never guess prices; prioritize real data. If not found, say "I could not find this part in our catalog. Please provide the part number or vehicle details."';
    await setSystemRole({ role, name: 'SalParts AI Assistant' });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">AI Agent Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Agent Name</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="My Store Agent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Personality</label>
                <select className="w-full p-2 border rounded">
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Humorous</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Recent Conversations</h2>
            <p className="text-gray-500">No conversations yet.</p>
          </div>
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Product Search</h2>
            </div>
            <form onSubmit={onSearch} className="flex gap-2">
              <input
                className="flex-1 p-2 border rounded"
                placeholder="Search by name, part number, or SKU"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded disabled:opacity-60"
                disabled={searching || !q}
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </form>
            <div className="mt-4 space-y-3">
              {results.map((p) => (
                <div key={p.id} className="border rounded p-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-600">SKU: {p.sku || 'N/A'}</div>
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: p.short_description || '' }} />
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{p.price ? `${p.price} AED` : 'Price N/A'}</div>
                    <div className="text-sm">{p.stock_status === 'instock' ? 'In stock' : p.stock_status}</div>
                    {p.permalink && (
                      <a
                        href={p.permalink}
                        target="_blank"
                        className="inline-block mt-2 px-3 py-1 bg-purple-600 text-white rounded"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {results.length === 0 && <div className="text-sm text-gray-500">No results</div>}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">WooCommerce Integration</h2>
            {!open && (
              <button
                onClick={() => setOpen(true)}
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                Connect Store
              </button>
            )}
            {open && (
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Store URL</label>
                  <input
                    required
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yourstore.com"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Consumer Key</label>
                  <input
                    required
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Consumer Secret</label>
                  <input
                    required
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-60"
                    disabled={status === 'saving'}
                  >
                    {status === 'saving' ? 'Saving...' : 'Save & Connect'}
                  </button>
                  <button
                    type="button"
                    onClick={onValidate}
                    className="px-4 py-2 border rounded"
                    disabled={status === 'saving'}
                  >
                    Test Connection
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setStatus('idle');
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                </div>
                {status === 'saved' && <p className="text-green-600 text-sm">Connected successfully.</p>}
                {status === 'error' && (
                  <p className="text-red-600 text-sm">
                    Failed to connect{errorMsg ? `: ${errorMsg}` : '.'}
                  </p>
                )}
              </form>
            )}
          </div>
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Agent Role</h2>
            <button
              onClick={applySalPartsRole}
              className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800"
            >
              Apply SalParts AI Assistant Role
            </button>
          </div>
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Voice Agent</h2>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Enable voice agent</div>
              <button
                onClick={() => setVoiceEnabled((v) => !v)}
                className={`px-3 py-1 rounded ${voiceEnabled ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              >
                {voiceEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Knowledge Base</h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  className="flex-1 p-2 border rounded"
                  placeholder="Add a URL or title"
                  onKeyDown={(e) => {
                    const v = (e.target as HTMLInputElement).value.trim();
                    if (e.key === 'Enter' && v) {
                      setKbItems((list) => [...list, v]);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  className="px-3 py-2 bg-slate-900 text-white rounded"
                  onClick={() => {
                    const el = document.querySelector<HTMLInputElement>('input[placeholder="Add a URL or title"]');
                    const v = el?.value.trim();
                    if (v) {
                      setKbItems((list) => [...list, v]);
                      if (el) el.value = '';
                    }
                  }}
                >
                  Add
                </button>
              </div>
              <ul className="list-disc pl-5 text-sm">
                {kbItems.map((it, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>{it}</span>
                    <button
                      className="text-red-600"
                      onClick={() => setKbItems((list) => list.filter((_, idx) => idx !== i))}
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {kbItems.length === 0 && <li className="text-gray-500">No items</li>}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-bold mb-4">Performance</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Messages</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between">
                <span>Orders Checked</span>
                <span className="font-bold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
