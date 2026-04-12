import { lionTvApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function listEmailTemplates(params = {}) {
  const response = await lionTvApi.get('/email-templates/v1', { params });
  return unwrap(response);
}

export async function getEmailTemplate(templateId) {
  const response = await lionTvApi.get(`/email-templates/v1/${templateId}`);
  return unwrap(response);
}

export async function createEmailTemplate(payload) {
  const response = await lionTvApi.post('/email-templates/v1', payload);
  return unwrap(response);
}

export async function updateEmailTemplate(templateId, payload) {
  const response = await lionTvApi.put(`/email-templates/v1/${templateId}`, payload);
  return unwrap(response);
}

export async function updateEmailTemplateStatus(templateId, active) {
  const response = await lionTvApi.patch(`/email-templates/v1/${templateId}/status`, { active });
  return unwrap(response);
}

export async function deleteEmailTemplate(templateId) {
  const response = await lionTvApi.delete(`/email-templates/v1/${templateId}`);
  return unwrap(response);
}

export async function listEmailCampaigns(params = {}) {
  const response = await lionTvApi.get('/email-campaigns/v1', { params });
  return unwrap(response);
}

export async function getEmailCampaign(campaignId) {
  const response = await lionTvApi.get(`/email-campaigns/v1/${campaignId}`);
  return unwrap(response);
}

export async function createEmailCampaign(payload) {
  const response = await lionTvApi.post('/email-campaigns/v1', payload);
  return unwrap(response);
}

export async function updateEmailCampaign(campaignId, payload) {
  const response = await lionTvApi.put(`/email-campaigns/v1/${campaignId}`, payload);
  return unwrap(response);
}

export async function previewEmailCampaign(payload) {
  const response = await lionTvApi.post('/email-campaigns/v1/preview', payload);
  return unwrap(response);
}

export async function sendEmailCampaignTest(payload) {
  const response = await lionTvApi.post('/email-campaigns/v1/test-email', payload);
  return unwrap(response);
}

export async function searchEmailCampaignCustomers(payload) {
  const response = await lionTvApi.post('/email-campaigns/v1/audience/customers/search', payload);
  return unwrap(response);
}

export async function queueEmailCampaign(campaignId) {
  const response = await lionTvApi.post(`/email-campaigns/v1/${campaignId}/queue`);
  return unwrap(response);
}

export async function cancelEmailCampaign(campaignId) {
  const response = await lionTvApi.post(`/email-campaigns/v1/${campaignId}/cancel`);
  return unwrap(response);
}

export async function listEmailCampaignRecipients(campaignId, params = {}) {
  const response = await lionTvApi.get(`/email-campaigns/v1/${campaignId}/recipients`, { params });
  return unwrap(response);
}
