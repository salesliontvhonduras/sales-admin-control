import { m3uCatalogApi } from 'utils/api';

const CATALOG_BASE_PATH = '/api/v1/catalog';
const BASE_SOURCE_PATH = '/api/v1/base-source';
const BASE_CATALOG_PATH = '/api/v1/base-catalog';
const CATEGORIES_BASE_PATH = '/api/v1/categories';
const LINE_SOURCES_BASE_PATH = '/api/v1/line-sources';
const PLAYLIST_BASE_PATH = '/api/v1/m3u';

function buildConfig(accessToken, extra = {}) {
  const headers = { ...(extra.headers || {}) };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return {
    ...extra,
    headers,
    skipAuthRedirect: true
  };
}

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null;
}

function normalizeCatalogItem(item = {}) {
  return {
    id: item.id ?? null,
    lineId: item.lineId ?? item.line_id ?? '',
    username: item.username ?? '',
    rawTitle: item.rawTitle ?? item.raw_title ?? '',
    tvgName: item.tvgName ?? item.tvg_name ?? '',
    tvgLogo: item.tvgLogo ?? item.tvg_logo ?? '',
    groupTitle: item.groupTitle ?? item.group_title ?? '',
    streamUrl: item.streamUrl ?? item.stream_url ?? '',
    detectedType: item.detectedType ?? item.detected_type ?? 'UNKNOWN',
    canonicalTitle: item.canonicalTitle ?? item.canonical_title ?? '',
    releaseYear: item.releaseYear ?? item.release_year ?? null,
    season: item.season ?? null,
    episode: item.episode ?? null,
    language: item.language ?? '',
    titleKey: item.titleKey ?? item.title_key ?? '',
    matchKey: item.matchKey ?? item.match_key ?? '',
    hashKey: item.hashKey ?? item.hash_key ?? '',
    active: item.active !== undefined ? Boolean(item.active) : true,
    primaryCategoryId: item.primaryCategoryId ?? item.primary_category_id ?? null,
    primaryCategoryName: item.primaryCategoryName ?? item.primary_category_name ?? '',
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null
  };
}

function normalizeBaseCatalogItem(item = {}) {
  return {
    id: item.id ?? null,
    rawTitle: item.rawTitle ?? item.raw_title ?? '',
    tvgName: item.tvgName ?? item.tvg_name ?? '',
    tvgLogo: item.tvgLogo ?? item.tvg_logo ?? '',
    groupTitle: item.groupTitle ?? item.group_title ?? '',
    streamUrl: item.streamUrl ?? item.stream_url ?? '',
    detectedType: item.detectedType ?? item.detected_type ?? 'UNKNOWN',
    canonicalTitle: item.canonicalTitle ?? item.canonical_title ?? '',
    releaseYear: item.releaseYear ?? item.release_year ?? null,
    season: item.season ?? null,
    episode: item.episode ?? null,
    language: item.language ?? '',
    titleKey: item.titleKey ?? item.title_key ?? '',
    matchKey: item.matchKey ?? item.match_key ?? '',
    hashKey: item.hashKey ?? item.hash_key ?? '',
    active: item.active !== undefined ? Boolean(item.active) : true,
    primaryCategoryId: item.primaryCategoryId ?? item.primary_category_id ?? null,
    primaryCategoryName: item.primaryCategoryName ?? item.primary_category_name ?? '',
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null
  };
}

function normalizeCategory(item = {}) {
  return {
    id: item.id ?? null,
    name: item.name ?? '',
    slug: item.slug ?? '',
    active: item.active !== undefined ? Boolean(item.active) : true,
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null
  };
}

function normalizeLineSource(item = {}) {
  return {
    id: item.id ?? null,
    lineId: item.lineId ?? item.line_id ?? '',
    username: item.username ?? '',
    sourcePlaylistUrl: item.sourcePlaylistUrl ?? item.source_playlist_url ?? '',
    sourceProviderName: item.sourceProviderName ?? item.source_provider_name ?? '',
    cacheTtlMinutes: item.cacheTtlMinutes ?? item.cache_ttl_minutes ?? 30,
    active: item.active !== undefined ? Boolean(item.active) : true,
    lastDownloadedAt: item.lastDownloadedAt ?? item.last_downloaded_at ?? null,
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null
  };
}

function normalizeLineOption(item = {}) {
  return {
    lineId: item.lineId ?? item.line_id ?? '',
    username: item.username ?? '',
    provider: item.provider ?? '',
    token: item.token ?? ''
  };
}

function normalizeBaseSource(item = {}) {
  return {
    id: item.id ?? null,
    sourcePlaylistUrl: item.sourcePlaylistUrl ?? item.source_playlist_url ?? '',
    sourceProviderName: item.sourceProviderName ?? item.source_provider_name ?? '',
    cacheTtlMinutes: item.cacheTtlMinutes ?? item.cache_ttl_minutes ?? 180,
    active: item.active !== undefined ? Boolean(item.active) : true,
    lastDownloadedAt: item.lastDownloadedAt ?? item.last_downloaded_at ?? null,
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null
  };
}

export async function getBaseSource({ accessToken } = {}) {
  const response = await m3uCatalogApi.get(BASE_SOURCE_PATH, buildConfig(accessToken));
  return normalizeBaseSource(unwrap(response) || {});
}

export async function upsertBaseSource({ accessToken, payload } = {}) {
  const response = await m3uCatalogApi.put(BASE_SOURCE_PATH, payload || {}, buildConfig(accessToken));
  return normalizeBaseSource(unwrap(response) || {});
}

export async function importBaseCatalog({ accessToken } = {}) {
  const response = await m3uCatalogApi.post(`${BASE_CATALOG_PATH}/import`, {}, buildConfig(accessToken));
  return unwrap(response);
}

export async function listBaseCatalogItems({
  accessToken,
  detectedType = '',
  active,
  query = '',
  page = 0,
  size = 25
} = {}) {
  const params = { page, size };
  if (detectedType) params.detectedType = detectedType;
  if (query) params.q = query;
  if (active !== undefined && active !== null && String(active).length > 0) params.active = active;

  const response = await m3uCatalogApi.get(`${BASE_CATALOG_PATH}/items`, buildConfig(accessToken, { params }));
  const payload = unwrap(response) || {};

  return {
    items: Array.isArray(payload.items) ? payload.items.map(normalizeBaseCatalogItem) : [],
    page: Number(payload.page ?? page),
    size: Number(payload.size ?? size),
    totalItems: Number(payload.totalItems ?? 0),
    totalPages: Number(payload.totalPages ?? 0)
  };
}

export async function getBaseCatalogItem({ accessToken, id } = {}) {
  const response = await m3uCatalogApi.get(`${BASE_CATALOG_PATH}/items/${id}`, buildConfig(accessToken));
  return normalizeBaseCatalogItem(unwrap(response) || {});
}

export async function assignBaseCatalogItemCategory({ accessToken, id, payload } = {}) {
  const response = await m3uCatalogApi.patch(`${BASE_CATALOG_PATH}/items/${id}/assign-category`, payload || {}, buildConfig(accessToken));
  return normalizeBaseCatalogItem(unwrap(response) || {});
}

export async function importCatalogByToken({ accessToken, token } = {}) {
  const safeToken = String(token || '').trim();
  if (!safeToken) {
    throw new Error('token is required');
  }

  const response = await m3uCatalogApi.post(
    `${CATALOG_BASE_PATH}/import/token/${encodeURIComponent(safeToken)}`,
    {},
    buildConfig(accessToken)
  );
  return unwrap(response);
}

export async function listCatalogItems({
  accessToken,
  lineId = '',
  username = '',
  detectedType = '',
  active,
  query = '',
  page = 0,
  size = 25
} = {}) {
  const params = { page, size };
  if (lineId) params.lineId = lineId;
  if (username) params.username = username;
  if (detectedType) params.detectedType = detectedType;
  if (query) params.q = query;
  if (active !== undefined && active !== null && String(active).length > 0) params.active = active;

  const response = await m3uCatalogApi.get(`${CATALOG_BASE_PATH}/items`, buildConfig(accessToken, { params }));
  const payload = unwrap(response) || {};

  return {
    items: Array.isArray(payload.items) ? payload.items.map(normalizeCatalogItem) : [],
    page: Number(payload.page ?? page),
    size: Number(payload.size ?? size),
    totalItems: Number(payload.totalItems ?? 0),
    totalPages: Number(payload.totalPages ?? 0)
  };
}

export async function getCatalogItem({ accessToken, id } = {}) {
  const response = await m3uCatalogApi.get(`${CATALOG_BASE_PATH}/items/${id}`, buildConfig(accessToken));
  return normalizeCatalogItem(unwrap(response) || {});
}

export async function assignCatalogItemCategory({ accessToken, id, payload } = {}) {
  const response = await m3uCatalogApi.patch(`${CATALOG_BASE_PATH}/items/${id}/assign-category`, payload || {}, buildConfig(accessToken));
  return normalizeCatalogItem(unwrap(response) || {});
}

export async function listCategories({ accessToken } = {}) {
  const response = await m3uCatalogApi.get(CATEGORIES_BASE_PATH, buildConfig(accessToken));
  const payload = unwrap(response);
  return Array.isArray(payload) ? payload.map(normalizeCategory) : [];
}

export async function createCategory({ accessToken, payload } = {}) {
  const response = await m3uCatalogApi.post(CATEGORIES_BASE_PATH, payload || {}, buildConfig(accessToken));
  return normalizeCategory(unwrap(response) || {});
}

export async function listLineOptions({ accessToken } = {}) {
  const response = await m3uCatalogApi.get(`${LINE_SOURCES_BASE_PATH}/line-options`, buildConfig(accessToken));
  const raw = unwrap(response) ?? [];
  const list = Array.isArray(raw) ? raw : [];

  const sorted = list.sort((a, b) => {
    const aLineId = String(a.lineId ?? a.line_id ?? '').toLowerCase();
    const bLineId = String(b.lineId ?? b.line_id ?? '').toLowerCase();
    const lineIdCompare = aLineId.localeCompare(bLineId);
    if (lineIdCompare !== 0) return lineIdCompare;

    const aName = String(a.username ?? '').toLowerCase();
    const bName = String(b.username ?? '').toLowerCase();
    return aName.localeCompare(bName);
  });

  return sorted.map((item) =>
    normalizeLineOption({
      lineId: item.lineId ?? item.line_id ?? item.id ?? '',
      username: item.username ?? '',
      provider: item.provider ?? '',
      token: item.token ?? ''
    })
  );
}

export async function listLineSources({ accessToken, lineId = '', username = '', active } = {}) {
  const params = {};
  if (lineId) params.lineId = String(lineId).trim();
  if (username) params.username = String(username).trim();
  if (active !== undefined && active !== null && String(active).length > 0) params.active = active;

  const response = await m3uCatalogApi.get(LINE_SOURCES_BASE_PATH, buildConfig(accessToken, { params }));
  const payload = unwrap(response);
  return Array.isArray(payload) ? payload.map(normalizeLineSource) : [];
}

export async function getLineSourceByLine({ accessToken, lineId, username } = {}) {
  const safeLineId = String(lineId || '').trim();
  const safeUsername = String(username || '').trim();
  if (!safeLineId || !safeUsername) {
    throw new Error('lineId and username are required');
  }

  const response = await m3uCatalogApi.get(
    `${LINE_SOURCES_BASE_PATH}/by-line`,
    buildConfig(accessToken, { params: { lineId: safeLineId, username: safeUsername } })
  );
  return normalizeLineSource(unwrap(response) || {});
}

export async function upsertLineSource({ accessToken, payload } = {}) {
  const response = await m3uCatalogApi.put(LINE_SOURCES_BASE_PATH, payload || {}, buildConfig(accessToken));
  return normalizeLineSource(unwrap(response) || {});
}

export async function downloadM3uByToken({ accessToken, token } = {}) {
  const safeToken = String(token || '').trim();
  if (!safeToken) {
    throw new Error('token is required');
  }

  const response = await m3uCatalogApi.get(
    `${PLAYLIST_BASE_PATH}/token/${encodeURIComponent(safeToken)}`,
    buildConfig(accessToken, {
      responseType: 'blob',
      headers: { Accept: 'application/x-mpegURL,text/plain,*/*' }
    })
  );

  return {
    blob: response.data,
    contentDisposition: response.headers?.['content-disposition'] || ''
  };
}
