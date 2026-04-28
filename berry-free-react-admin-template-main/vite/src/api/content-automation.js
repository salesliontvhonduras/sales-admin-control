import { contentAutomationApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function getContentAutomationTomorrowEvents(config = {}) {
  const response = await contentAutomationApi.get('/api/content-automation/events/tomorrow', config);
  return unwrap(response);
}

export async function generateContentAutomationTomorrow(config = {}) {
  const response = await contentAutomationApi.post('/api/content-automation/generate/tomorrow', null, config);
  return unwrap(response);
}

export async function generateContentAutomationByDate(payload, config = {}) {
  const normalizedPayload =
    typeof payload === 'string'
      ? { date: payload }
      : {
          date: payload?.date,
          resellerUsername: payload?.resellerUsername || null
        };
  const response = await contentAutomationApi.post(
    '/api/content-automation/generate',
    normalizedPayload,
    config
  );
  return unwrap(response);
}

export async function getContentAutomationPostsByDate(date, config = {}) {
  const response = await contentAutomationApi.get('/api/content-automation/posts', {
    ...config,
    params: {
      ...(config?.params || {}),
      date
    }
  });
  return unwrap(response);
}

export async function approveContentAutomationPost(postId, config = {}) {
  const response = await contentAutomationApi.post(`/api/content-automation/posts/${postId}/approve`, null, config);
  return unwrap(response);
}

export async function publishContentAutomationPost(postId, config = {}) {
  const response = await contentAutomationApi.post(`/api/content-automation/posts/${postId}/publish`, null, config);
  return unwrap(response);
}

export async function regenerateContentAutomationImage(postId, config = {}) {
  const response = await contentAutomationApi.post(`/api/content-automation/posts/${postId}/regenerate-image`, null, config);
  return unwrap(response);
}

export async function regenerateContentAutomationCaptions(postId, config = {}) {
  const response = await contentAutomationApi.post(`/api/content-automation/posts/${postId}/regenerate-captions`, null, config);
  return unwrap(response);
}

export async function getContentAutomationSafePreview(postId, config = {}) {
  const response = await contentAutomationApi.get(`/api/content-automation/posts/${postId}/safe-preview`, config);
  return unwrap(response);
}

export async function getContentAutomationPreviewImageBlob(postId, config = {}) {
  const response = await contentAutomationApi.get(`/api/content-automation/posts/${postId}/preview-image`, {
    ...config,
    responseType: 'blob'
  });
  return response?.data ?? null;
}

export async function getContentAutomationPostEvents(postId, config = {}) {
  const response = await contentAutomationApi.get(`/api/content-automation/posts/${postId}/events`, config);
  return unwrap(response);
}

export async function updateContentAutomationPostSelectedEvents(postId, eventIds, config = {}) {
  const response = await contentAutomationApi.post(
    `/api/content-automation/posts/${postId}/selected-events`,
    { eventIds: Array.isArray(eventIds) ? eventIds : [] },
    config
  );
  return unwrap(response);
}
