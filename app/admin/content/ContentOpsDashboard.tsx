'use client';

import { useMemo, useState } from 'react';

type ManifestItem = {
  id: string;
  title: string;
  publicPath: string;
  previewPath: string;
  contentType: string;
  contentTypeLabel: string;
  track: string;
  status: string;
  scheduledAt: string;
  riskLevel: string;
  audience: string;
  atomIds: string[];
  validationPassed: boolean;
  validationWarnings: string[];
  operatorInstruction: string;
};

type Manifest = {
  repo: { manifestEditUrl: string };
  items: ManifestItem[];
};

type Props = {
  manifest: Manifest;
};

function statusLabel(status: string) {
  return status.replaceAll('_', ' ');
}

export function ContentOpsDashboard({ manifest }: Props) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState('scheduledAt-asc');

  const counts = useMemo(() => {
    return manifest.items.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }, [manifest.items]);

  const types = useMemo(() => {
    return Array.from(new Set(manifest.items.map((item) => item.contentType)));
  }, [manifest.items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const [sortField, sortDirection] = sort.split('-');
    return manifest.items
      .filter((item) => status === 'all' || item.status === status)
      .filter((item) => type === 'all' || item.contentType === type)
      .filter((item) => !from || item.scheduledAt >= from)
      .filter((item) => !to || item.scheduledAt <= to)
      .filter((item) => {
        if (!q) return true;
        return [item.id, item.title, item.publicPath, item.audience, item.track, item.status]
          .some((value) => String(value || '').toLowerCase().includes(q));
      })
      .sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortField] || '');
        const bv = String((b as Record<string, unknown>)[sortField] || '');
        return sortDirection === 'desc' ? bv.localeCompare(av) : av.localeCompare(bv);
      });
  }, [from, manifest.items, query, sort, status, to, type]);

  return (
    <div className="admin-control-stack">
      <div className="admin-stats">
        <article className="admin-card"><strong>{manifest.items.length}</strong><div className="small-note">Total manifest items</div></article>
        <article className="admin-card"><strong>{counts.approved || 0}</strong><div className="small-note">Approved through 12/31/26</div></article>
        <article className="admin-card"><strong>{counts.ready_for_approval || 0}</strong><div className="small-note">Waiting review</div></article>
        <article className="admin-card"><strong>{counts.revoked || 0}</strong><div className="small-note">Revoked</div></article>
      </div>

      <section className="soft-panel">
        <h2>Owner controls</h2>
        <p className="small-note">
          This is a static GitHub-backed admin surface. Approve, reject, or revoke by editing the
          content calendar status in GitHub. The current 2026 backlog is intentionally approved.
        </p>
        <div className="button-row">
          <a className="button primary" href={manifest.repo.manifestEditUrl} rel="noopener noreferrer" target="_blank">
            Edit Content Calendar in GitHub
          </a>
          <button className="button secondary" type="button" onClick={() => setStatus('approved')}>Show Approved</button>
          <button className="button secondary" type="button" onClick={() => setStatus('ready_for_approval')}>Needs Review</button>
          <button className="button secondary" type="button" onClick={() => setStatus('all')}>Show All</button>
        </div>
      </section>

      <section className="admin-filters soft-panel" aria-label="Content filters">
        <h2>Filter content</h2>
        <div className="admin-filter-grid">
          <label>Search<input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Title, audience, slug, status" /></label>
          <label>Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="ready_for_approval">Ready for approval</option>
              <option value="published">Published</option>
              <option value="revoked">Revoked</option>
            </select>
          </label>
          <label>Type
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="all">All types</option>
              {types.map((contentType) => <option key={contentType} value={contentType}>{contentType.replaceAll('_', ' ')}</option>)}
            </select>
          </label>
          <label>From<input value={from} onChange={(event) => setFrom(event.target.value)} type="date" /></label>
          <label>To<input value={to} onChange={(event) => setTo(event.target.value)} type="date" /></label>
          <label>Sort
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="scheduledAt-asc">Date: oldest first</option>
              <option value="scheduledAt-desc">Date: newest first</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
              <option value="status-asc">Status</option>
            </select>
          </label>
        </div>
        <p className="small-note">Showing {filtered.length} of {manifest.items.length} items.</p>
      </section>

      <section>
        <h2>Content operations table</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Content</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Validation</th>
                <th>Operator instruction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <div className="small-note">{item.publicPath}</div>
                    <div className="small-note">Audience: {item.audience}</div>
                  </td>
                  <td>{item.contentTypeLabel}<div className="small-note">{item.riskLevel} risk</div></td>
                  <td><span className="status-pill">{statusLabel(item.status)}</span></td>
                  <td>{item.scheduledAt}</td>
                  <td>
                    {item.validationPassed ? 'Passed' : 'Needs review'}
                    <div className="small-note">Atoms: {item.atomIds.length}</div>
                    {item.validationWarnings.length ? <div className="small-note">{item.validationWarnings[0]}</div> : null}
                  </td>
                  <td className="small-note">{item.operatorInstruction}</td>
                  <td>
                    <div className="button-column">
                      <a className="button secondary" href={item.previewPath} target="_blank" rel="noopener noreferrer">Preview</a>
                      <a className="button secondary" href={item.publicPath} target="_blank" rel="noopener noreferrer">Live</a>
                      <a className="button primary" href={manifest.repo.manifestEditUrl} target="_blank" rel="noopener noreferrer">Edit</a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
