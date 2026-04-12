import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

import CatalogCrudPage from './CatalogCrudPage';
import { createBank, deleteBank, listBanks, updateBank } from 'api/catalog-admin';

export default function BanksCatalogAdmin() {
  const { t } = useTranslation();

  return (
    <CatalogCrudPage
      title={t('catalogAdmin.bank.title')}
      subtitle={t('catalogAdmin.bank.subtitle')}
      helperText={t('catalogAdmin.bank.helperText')}
      entityLabel={t('catalogAdmin.bank.entityLabel')}
      createLabel={t('catalogAdmin.bank.createLabel')}
      searchPlaceholder={t('catalogAdmin.bank.searchPlaceholder')}
      api={{ list: listBanks, create: createBank, update: updateBank, remove: deleteBank }}
      idField="id"
      titleField="bank"
      subtitleField={(row) => `${t('common.id')} ${row.id}`}
      searchFields={['bank', 'id']}
      statusField="status"
      fields={[
        { name: 'bank', label: t('catalogAdmin.bank.fields.bank'), type: 'text', required: true, fullWidth: true },
        { name: 'status', label: t('catalogAdmin.bank.fields.status'), type: 'switch', defaultValue: true }
      ]}
      columns={[
        { key: 'id', label: t('common.id') },
        { key: 'bank', label: t('catalogAdmin.bank.fields.bank') },
        {
          key: 'status',
          label: t('common.status'),
          render: (row) => (
            <Chip size="small" color={row.status ? 'success' : 'default'} label={row.status ? t('common.active') : t('common.inactive')} />
          )
        }
      ]}
      summaryFields={[
        { label: t('common.id'), key: 'id' },
        { label: t('common.status'), render: (row) => (row.status ? t('common.active') : t('common.inactive')) }
      ]}
      metricCards={(rows) => {
        const active = rows.filter((row) => row.status).length;
        return [
          {
            title: `${t('common.total')} ${t('catalogAdmin.bank.title').toLowerCase()}`,
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
