import { contentAutomationApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function getVodPostsCatalog(contentType, config = {}) {
  const response = await contentAutomationApi.get('/api/vod-posts/catalog', {
    ...config,
    params: {
      ...(config?.params || {}),
      contentType
    }
  });
  return unwrap(response);
}

export async function createVodPost(payload, config = {}) {
  const response = await contentAutomationApi.post('/api/vod-posts', payload, config);
  return unwrap(response);
}

export async function getVodPosts(contentType, config = {}) {
  const response = await contentAutomationApi.get('/api/vod-posts', {
    ...config,
    params: {
      ...(config?.params || {}),
      ...(contentType ? { contentType } : {})
    }
  });
  return unwrap(response);
}

export async function getVodPost(postId, config = {}) {
  const response = await contentAutomationApi.get(`/api/vod-posts/${postId}`, config);
  return unwrap(response);
}

export async function updateVodPostSelection(postId, payload, config = {}) {
  const response = await contentAutomationApi.put(`/api/vod-posts/${postId}/selection`, payload, config);
  return unwrap(response);
}

export async function regenerateVodPostImage(postId, config = {}) {
  const payload =
    config && Object.prototype.hasOwnProperty.call(config, 'brandingPayload')
      ? config.brandingPayload
      : null;
  const requestConfig = { ...config };
  delete requestConfig.brandingPayload;
  const response = await contentAutomationApi.post(`/api/vod-posts/${postId}/regenerate-image`, payload, requestConfig);
  return unwrap(response);
}

export async function regenerateVodPostCaptions(postId, config = {}) {
  const payload =
    config && Object.prototype.hasOwnProperty.call(config, 'brandingPayload')
      ? config.brandingPayload
      : null;
  const requestConfig = { ...config };
  delete requestConfig.brandingPayload;
  const response = await contentAutomationApi.post(`/api/vod-posts/${postId}/regenerate-captions`, payload, requestConfig);
  return unwrap(response);
}

export async function getVodPostPreviewImageBlob(postId, config = {}) {
  const response = await contentAutomationApi.get(`/api/vod-posts/${postId}/preview-image`, {
    ...config,
    responseType: 'blob'
  });
  return response?.data ?? null;
}

export async function getVodPostSafePreview(postId, config = {}) {
  const response = await contentAutomationApi.get(`/api/vod-posts/${postId}/safe-preview`, config);
  return unwrap(response);
}

export async function approveVodPost(postId, config = {}) {
  const response = await contentAutomationApi.post(`/api/vod-posts/${postId}/approve`, null, config);
  return unwrap(response);
}

export async function publishVodPost(postId, config = {}) {
  const response = await contentAutomationApi.post(`/api/vod-posts/${postId}/publish`, null, config);
  return unwrap(response);
}
