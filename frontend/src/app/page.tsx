'use client'

import { useState, useEffect } from 'react'

interface LinkResponse {
  code: string
  original_url: string
  short_url: string
  clicks: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Home() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<LinkResponse | null>(null)
  const [links, setLinks] = useState<LinkResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { fetchLinks() }, [])

  const fetchLinks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/links`)
      const data = await res.json()
      setLinks(data)
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${API_URL}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_url: url }),
      })
      if (!res.ok) throw new Error('Fehler')
      const data: LinkResponse = await res.json()
      setResult(data)
      setUrl('')
      fetchLinks()
    } catch {
      setError('Verbindung zum Backend fehlgeschlagen.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0f0f0', padding: '0' }}>
      <div style={{ borderBottom: '1px solid #1e1e1e', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#c8ff00' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#666' }}>url-shortener.homelab.local</span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#444' }}>DevOps Capstone v1.0</span>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-2px', marginBottom: '8px' }}>
            URL<br /><span style={{ color: '#c8ff00' }}>SHORTENER</span>
          </h1>
          <p style={{ fontFamily: 'monospace', fontSize: '13px', color: '#555', marginTop: '16px' }}>
            Eingabe → Verarbeitung → Ausgabe
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="url" value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://sehr-langer-link.de/mit/vielen/unterseiten"
              required
              style={{ flex: 1, background: '#111', border: '1px solid #2a2a2a', padding: '12px 16px', fontFamily: 'monospace', fontSize: '13px', color: '#f0f0f0', outline: 'none' }}
            />
            <button type="submit" disabled={loading}
              style={{ background: '#c8ff00', color: '#0a0a0a', fontWeight: '700', padding: '12px 24px', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              {loading ? '...' : 'KÜRZEN'}
            </button>
          </div>
          {error && <p style={{ marginTop: '8px', color: '#f87171', fontFamily: 'monospace', fontSize: '12px' }}>{error}</p>}
        </form>

        {result && (
          <div style={{ marginBottom: '40px', border: '1px solid #c8ff00', padding: '16px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#666', marginBottom: '8px' }}>ERGEBNIS</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'monospace', color: '#c8ff00', fontSize: '14px', flex: 1 }}>{result.short_url}</span>
              <button onClick={() => copyToClipboard(result.short_url)}
                style={{ fontFamily: 'monospace', fontSize: '11px', border: '1px solid #2a2a2a', padding: '4px 12px', background: 'transparent', color: '#f0f0f0', cursor: 'pointer' }}>
                {copied ? 'KOPIERT!' : 'KOPIEREN'}
              </button>
            </div>
          </div>
        )}

        {links.length > 0 && (
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#444', marginBottom: '12px' }}>LETZTE LINKS ({links.length})</p>
            <div style={{ border: '1px solid #1e1e1e' }}>
              {links.map((link) => (
                <div key={link.code} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 16px', borderBottom: '1px solid #1e1e1e' }}>
                  <span style={{ fontFamily: 'monospace', color: '#c8ff00', fontSize: '12px', minWidth: '80px' }}>/{link.code}</span>
                  <span style={{ fontFamily: 'monospace', color: '#555', fontSize: '12px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.original_url}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#333' }}>{link.clicks} Klicks</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
