import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

import CatalogCrudPage from './CatalogCrudPage';
import { createLicenseApp, deleteLicenseApp, listLicenseApps, updateLicenseApp } from 'api/catalog-admin';

function normalizeLicenseAppCode(value) {
  return String(value ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+/, '');
}

export default function LicenseAppsCatalogAdmin() {
  const { t } = useTranslation();

  return (
    <CatalogCrudPage
      title={t('catalogAdmin.licenseApp.title')}
      subtitle={t('catalogAdmin.licenseApp.subtitle')}
      helperText={t('catalogAdmin.licenseApp.helperText')}
      entityLabel={t('catalogAdmin.licenseApp.entityLabel')}
      createLabel={t('catalogAdmin.licenseApp.createLabel')}
      searchPlaceholder={t('catalogAdmin.licenseApp.searchPlaceholder')}
      api={{ list: listLicenseApps, create: createLicenseApp, update: updateLicenseApp, remove: deleteLicenseApp }}
      idField="licenseAppId"
      titleField="licenseAppName"
      subtitleField={(row) => `${t('common.id')} ${row.licenseAppId} · ${row.licenseAppCode || '-'}`}
      searchFields={['licenseAppCode', 'licenseAppName', 'licenseAppId']}
      statusField="status"
      fields={[
        {
          name: 'licenseAppCode',
          label: t('catalogAdmin.licenseApp.fields.licenseAppCode'),
          type: 'text',
          required: true,
          fullWidth: true,
          disabledOnEdit: true,
          helperText: t('catalogAdmin.licenseApp.fields.licenseAppCodeHelper'),
          normalizeValue: normalizeLicenseAppCode
        },
        { name: 'licenseAppName', label: t('catalogAdmin.licenseApp.fields.licenseAppName'), type: 'text', required: true, fullWidth: true },
        { name: 'status', label: t('catalogAdmin.licenseApp.fields.status'), type: 'switch', defaultValue: true }
      ]}
      columns={[
        { key: 'licenseAppId', label: t('common.id') },
        { key: 'licenseAppCode', label: t('catalogAdmin.licenseApp.fields.licenseAppCode') },
        { key: 'licenseAppName', label: t('catalogAdmin.licenseApp.fields.licenseAppName') },
        {
          key: 'status',
          label: t('common.status'),
          render: (row) => (
            <Chip size="small" color={row.status ? 'success' : 'default'} label={row.status ? t('common.active') : t('common.inactive')} />
          )
        }
      ]}
      summaryFields={[
        { label: t('common.id'), key: 'licenseAppId' },
        { label: t('catalogAdmin.licenseApp.fields.licenseAppCode'), key: 'licenseAppCode' },
        { label: t('common.status'), render: (row) => (row.status ? t('common.active') : t('common.inactive')) }
      ]}
      metricCards={(rows) => {
        const active = rows.filter((row) => row.status).length;
        return [
          {
            title: `${t('common.total')} ${t('catalogAdmin.licenseApp.title').toLowerCase()}`,
            value: rows.length,
            helper: t('catalogAdmin.metrics.totalCatalog'),
            color: 'primary'
          },
          { title: t('common.active'), value: active, helper: t('catalogAdmin.metrics.available'), color: 'success' },
          { title: t('common.inactive'), value: rows.length - active, helper: t('catalogAdmin.metrics.hidden'), color: 'default' }
        ];
      }}
    />
  );
}
