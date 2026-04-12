import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

import CatalogCrudPage from './CatalogCrudPage';
import { createService, deleteService, listServices, updateService } from 'api/catalog-admin';

export default function ServicesCatalogAdmin() {
  const { t } = useTranslation();

  return (
    <CatalogCrudPage
      title={t('catalogAdmin.service.title')}
      subtitle={t('catalogAdmin.service.subtitle')}
      helperText={t('catalogAdmin.service.helperText')}
      entityLabel={t('catalogAdmin.service.entityLabel')}
      createLabel={t('catalogAdmin.service.createLabel')}
      searchPlaceholder={t('catalogAdmin.service.searchPlaceholder')}
      api={{ list: listServices, create: createService, update: updateService, remove: deleteService }}
      idField="serviceId"
      titleField="serviceName"
      subtitleField={(row) => `${t('common.id')} ${row.serviceId}`}
      searchFields={['serviceName', 'serviceId']}
      statusField="status"
      fields={[
        { name: 'serviceName', label: t('catalogAdmin.service.fields.serviceName'), type: 'text', required: true, fullWidth: true },
        { name: 'status', label: t('catalogAdmin.service.fields.status'), type: 'switch', defaultValue: true }
      ]}
      columns={[
        { key: 'serviceId', label: t('common.id') },
        { key: 'serviceName', label: t('catalogAdmin.service.fields.serviceName') },
        {
          key: 'status',
          label: t('common.status'),
          render: (row) => (
            <Chip size="small" color={row.status ? 'success' : 'default'} label={row.status ? t('common.active') : t('common.inactive')} />
          )
        }
      ]}
      summaryFields={[
        { label: t('common.id'), key: 'serviceId' },
        { label: t('common.status'), render: (row) => (row.status ? t('common.active') : t('common.inactive')) }
      ]}
      metricCards={(rows) => {
        const active = rows.filter((row) => row.status).length;
        return [
          {
            title: `${t('common.total')} ${t('catalogAdmin.service.title').toLowerCase()}`,
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
