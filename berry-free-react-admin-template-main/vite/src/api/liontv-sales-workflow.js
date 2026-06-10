import { lionTvApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function getSalesWorkflowOptions(config = {}) {
  return unwrap(await lionTvApi.get('/sales-workflow/v1/options', config));
}

export async function lookupSalesWorkflow(query, config = {}) {
  return unwrap(
    await lionTvApi.get('/sales-workflow/v1/lookup', {
      ...config,
      params: { query, ...(config.params || {}) }
    })
  );
}

export async function listSalesWorkflowLines(config = {}) {
  return unwrap(
    await lionTvApi.get('/lines/v1/list-lines', {
      ...config,
      params: {
        index: 0,
        start: 0,
        size: 5000,
        filters: '',
        sorting: '',
        ...(config.params || {})
      }
    })
  );
}

export async function previewActivation(payload, config = {}) {
  return unwrap(await lionTvApi.post('/sales-workflow/v1/activation/preview', payload, config));
}

export async function executeActivation(payload, config = {}) {
  return unwrap(await lionTvApi.post('/sales-workflow/v1/activation/execute', payload, config));
}

export async function previewRenewal(payload, config = {}) {
  return unwrap(await lionTvApi.post('/sales-workflow/v1/renewal/preview', payload, config));
}

export async function executeRenewal(payload, config = {}) {
  return unwrap(await lionTvApi.post('/sales-workflow/v1/renewal/execute', payload, config));
}
