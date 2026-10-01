"use client";

import { useCallback, useEffect, useState } from "react";
import { useClient } from "sanity";

interface DraftDoc {
  _id: string;
  _type: string;
  title?: string;
}

// Friendly names for the one-per-site page documents.
const PAGE_TITLES: Record<string, string> = {
  siteSettings: "Home Page",
  bio: "About",
  actorPage: "Actor Page",
  directorPage: "Director Page",
  resumePage: "Resume Page",
  contactPage: "Contact Page",
  footerSettings: "Footer",
  actingGallery: "Photo Gallery",
  project: "Production",
  video: "Video",
};

function label(doc: DraftDoc) {
  const kind = PAGE_TITLES[doc._type] ?? doc._type;
  return doc.title ? `${kind} — ${doc.title}` : kind;
}

const btn: React.CSSProperties = {
  padding: "10px 18px",
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 4,
  border: "1px solid transparent",
  cursor: "pointer",
};

// Studio tool that publishes every unpublished change in one click, instead
// of opening each page and publishing it separately.
export function PublishAllTool() {
  const client = useClient({ apiVersion: "2026-07-01" });
  const [drafts, setDrafts] = useState<DraftDoc[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const result = await client.fetch<DraftDoc[]>(
        `*[_id in path("drafts.**")]{_id, _type, title}`
      );
      setDrafts(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load drafts.");
      setDrafts([]);
    }
  }, [client]);

  useEffect(() => {
    load();
  }, [load]);

  const publishAll = useCallback(async () => {
    if (!drafts || drafts.length === 0) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      // Fetch full draft bodies, then for each: replace the published
      // document with the draft's content and remove the draft. This is
      // exactly what the per-document Publish button does.
      const full = await client.fetch<Record<string, unknown>[]>(
        `*[_id in path("drafts.**")]`
      );
      const tx = full.reduce((acc, doc) => {
        const draftId = doc._id as string;
        const publishedId = draftId.replace(/^drafts\./, "");
        const { _id, _rev, _createdAt, _updatedAt, ...rest } = doc as Record<string, unknown> & {
          _id: string;
        };
        void _id;
        void _rev;
        void _createdAt;
        void _updatedAt;
        return acc
          .createOrReplace({ ...rest, _id: publishedId } as never)
          .delete(draftId);
      }, client.transaction());

      await tx.commit();
      setMessage(
        `Published ${full.length} change${full.length === 1 ? "" : "s"}. The website updates within about a minute.`
      );
      await load();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong while publishing."
      );
    } finally {
      setBusy(false);
    }
  }, [client, drafts, load]);

  const count = drafts?.length ?? 0;

  return (
    <div style={{ padding: 32, maxWidth: 680, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Publish All</h1>
      <p style={{ color: "#6b7280", margin: "0 0 24px", lineHeight: 1.5 }}>
        Publishes every unpublished change across the whole site at once, so you
        don&rsquo;t have to open each page and publish it separately.
      </p>

      {drafts === null && <p style={{ color: "#6b7280" }}>Checking for changes…</p>}

      {drafts !== null && count === 0 && (
        <div
          style={{
            padding: 16,
            borderRadius: 6,
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
          }}
        >
          Everything is published — there are no pending changes.
        </div>
      )}

      {drafts !== null && count > 0 && (
        <>
          <p style={{ fontWeight: 600, margin: "0 0 8px" }}>
            {count} unpublished change{count === 1 ? "" : "s"}:
          </p>
          <ul style={{ margin: "0 0 24px", paddingLeft: 20, lineHeight: 1.8 }}>
            {drafts.map((d) => (
              <li key={d._id}>{label(d)}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={publishAll}
            disabled={busy}
            style={{
              ...btn,
              background: busy ? "#9ca3af" : "#2276fc",
              color: "white",
              cursor: busy ? "wait" : "pointer",
            }}
          >
            {busy ? "Publishing…" : `Publish all ${count} change${count === 1 ? "" : "s"}`}
          </button>
        </>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          type="button"
          onClick={load}
          disabled={busy}
          style={{ ...btn, background: "transparent", borderColor: "#d1d5db", color: "#374151" }}
        >
          Refresh
        </button>
      </div>

      {message && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 6,
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
          }}
        >
          {message}
        </div>
      )}
      {error && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 6,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
