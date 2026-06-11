import { lionTvApi } from 'utils/api';

export function unwrapCustomerCollection(response) {
  const payload = response?.data?.data ?? response?.data ?? {};
  const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
  return {
    data: Array.isArray(raw) ? raw : [],
    total: Number(payload.total ?? (Array.isArray(raw) ? raw.length : 0))
  };
}

export function getCustomerOptionId(option) {
  return option?.customerId ?? option?.id ?? option?.customer_id ?? null;
}

export function normalizeCustomerOption(item = {}) {
  const id = getCustomerOptionId(item);
  const fullName = item.customerFullname ?? item.fullName ?? item.customer_fullname ?? item.name ?? item.displayName ?? '';
  const mail = item.customerMail ?? item.mail ?? item.email ?? item.customer_mail ?? '';
  const phone = item.customerPhone ?? item.phone ?? item.customer_phone ?? '';
  const status = item.customerStatus ?? item.status ?? item.customer_status ?? '';

  return {
    ...item,
    id,
    customerId: id,
    customerFullname: fullName,
    fullName,
    customerMail: mail,
    mail,
    email: mail,
    customerPhone: phone,
    phone,
    customerStatus: status,
    status,
    label: fullName || mail || phone || (id != null ? `#${id}` : '')
  };
}

export function getCustomerOptionLabel(option) {
  if (!option) return '';
  return option.label || option.customerFullname || option.fullName || option.customerMail || option.mail || option.customerPhone || option.phone || '';
}

export async function listCustomerOptions({ search = '', index = 0, size = 25, headers, signal } = {}) {
  const response = await lionTvApi.get('/customers/v1', {
    headers,
    params: {
      index,
      size,
      ...(search ? { search } : {})
    },
    signal,
    skipAuthRedirect: true
  });
  const payload = unwrapCustomerCollection(response);
  return {
    data: payload.data.map(normalizeCustomerOption),
    total: payload.total
  };
}

export async function getCustomerOption(customerId, { headers, signal } = {}) {
  if (!customerId) return null;
  const response = await lionTvApi.get(`/customers/v1/${customerId}`, {
    headers,
    signal,
    skipAuthRedirect: true
  });
  const payload = response?.data?.data ?? response?.data ?? null;
  return payload ? normalizeCustomerOption(payload) : null;
}
