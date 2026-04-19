// React-Query-Hooks gegen /api/v1/*.
// Wir bleiben auf Client-Side — Server-Components können die Routes direkt per fetch ansprechen.

import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  InitResponse,
  ArticleListResponse,
  ArticleDetailResponse,
  PriceResponse,
  InquiryInput,
  InquiryCreatedResponse,
} from "./konfigurator-types";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data === "object" && data && "error" in data
      ? String((data as { error: unknown }).error)
      : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export function useInit() {
  return useQuery({
    queryKey: ["konfigurator", "init"],
    queryFn: () => getJson<InitResponse>("/api/v1/init"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useArticles(params: {
  w: number | null;
  h: number | null;
  groupExternalId: number | null;
  brandExternalIds?: number[];
}) {
  const { w, h, groupExternalId, brandExternalIds } = params;
  const enabled = Boolean(w && h && groupExternalId);

  return useQuery({
    enabled,
    queryKey: ["konfigurator", "articles", w, h, groupExternalId, brandExternalIds],
    queryFn: () => {
      const query = new URLSearchParams();
      if (w) query.set("w", String(w));
      if (h) query.set("h", String(h));
      if (groupExternalId) query.set("group", String(groupExternalId));
      for (const b of brandExternalIds ?? []) query.append("brand[]", String(b));
      return getJson<ArticleListResponse>(`/api/v1/articles?${query.toString()}`);
    },
  });
}

export function useArticle(
  slug: string | null,
  price?: { w: number | null; h: number | null; groupExternalId: number | null }
) {
  const enabled = Boolean(slug);
  const query = new URLSearchParams();
  if (price?.w) query.set("w", String(price.w));
  if (price?.h) query.set("h", String(price.h));
  if (price?.groupExternalId) query.set("group", String(price.groupExternalId));
  const qs = query.toString();

  return useQuery({
    enabled,
    queryKey: ["konfigurator", "article", slug, price?.w, price?.h, price?.groupExternalId],
    queryFn: () =>
      getJson<ArticleDetailResponse>(
        `/api/v1/articles/${slug}${qs ? `?${qs}` : ""}`
      ),
  });
}

export function usePrice(params: {
  articleSlug: string | null;
  w: number | null;
  h: number | null;
  groupExternalId: number | null;
}) {
  const { articleSlug, w, h, groupExternalId } = params;
  const enabled = Boolean(articleSlug && w && h && groupExternalId);

  return useQuery({
    enabled,
    queryKey: ["konfigurator", "price", articleSlug, w, h, groupExternalId],
    queryFn: () =>
      getJson<PriceResponse>(
        `/api/v1/articles/${articleSlug}/price?w=${w}&h=${h}&group=${groupExternalId}`
      ),
  });
}

export function useInquiryMutation() {
  return useMutation({
    mutationFn: (input: InquiryInput) =>
      postJson<InquiryCreatedResponse>("/api/v1/inquiries", input),
  });
}
