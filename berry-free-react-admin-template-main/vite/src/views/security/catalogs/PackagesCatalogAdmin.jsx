import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

import CatalogCrudPage from './CatalogCrudPage';
import { createPackageCatalog, deletePackageCatalog, listPackagesCatalog, updatePackageCatalog } from 'api/catalog-admin';

export default function PackagesCatalogAdmin() {
  const { t } = useTranslation();

  return (
    <CatalogCrudPage
      title={t('catalogAdmin.package.title')}
      subtitle={t('catalogAdmin.package.subtitle')}
      helperText={t('catalogAdmin.package.helperText')}
      entityLabel={t('catalogAdmin.package.entityLabel')}
      createLabel={t('catalogAdmin.package.createLabel')}
      searchPlaceholder={t('catalogAdmin.package.searchPlaceholder')}
      api={{
        list: listPackagesCatalog,
        create: createPackageCatalog,
        update: updatePackageCatalog,
        remove: deletePackageCatalog
      }}
      idField="packageId"
      titleField="name"
      subtitleField={(row) => `${t('common.id')} ${row.packageId}${row.type ? ` · ${row.type}` : ''}`}
      searchFields={['packageId', 'name', 'type', 'trialCredits', 'officialCredits']}
      dialogMaxWidth="lg"
      fields={[
        { name: 'packageId', label: t('catalogAdmin.package.fields.packageId'), type: 'number', required: true, disabledOnEdit: true },
        { name: 'name', label: t('catalogAdmin.package.fields.name'), type: 'text', required: true },
        { name: 'type', label: t('catalogAdmin.package.fields.type'), type: 'text' },
        { name: 'ord', label: t('catalogAdmin.package.fields.ord'), type: 'number' },
        { name: 'roleCount', label: t('catalogAdmin.package.fields.roleCount'), type: 'number' },
        { name: 'bouquetCount', label: t('catalogAdmin.package.fields.bouquetCount'), type: 'number' },
        { name: 'trialCredits', label: t('catalogAdmin.package.fields.trialCredits'), type: 'text' },
        { name: 'trialDuration', label: t('catalogAdmin.package.fields.trialDuration'), type: 'number' },
        { name: 'trialDurationIn', label: t('catalogAdmin.package.fields.trialDurationIn'), type: 'text' },
        { name: 'officialCredits', label: t('catalogAdmin.package.fields.officialCredits'), type: 'text' },
        { name: 'officialDuration', label: t('catalogAdmin.package.fields.officialDuration'), type: 'number' },
        { name: 'officialDurationIn', label: t('catalogAdmin.package.fields.officialDurationIn'), type: 'text' },
        { name: 'isTrial', label: t('catalogAdmin.package.fields.isTrial'), type: 'switch', defaultValue: false },
        { name: 'isOfficial', label: t('catalogAdmin.package.fields.isOfficial'), type: 'switch', defaultValue: false },
        { name: 'isp', label: t('catalogAdmin.package.fields.isp'), type: 'switch', defaultValue: false },
        { name: 'stb', label: t('catalogAdmin.package.fields.stb'), type: 'switch', defaultValue: false },
        { name: 'canRestream', label: t('catalogAdmin.package.fields.canRestream'), type: 'switch', defaultValue: false },
        { name: 'adminLocked', label: t('catalogAdmin.package.fields.adminLocked'), type: 'switch', defaultValue: false }
      ]}
      columns={[
        { key: 'packageId', label: t('common.id') },
        { key: 'name', label: t('catalogAdmin.package.fields.name') },
        { key: 'type', label: t('catalogAdmin.package.fields.type') },
        { key: 'ord', label: t('catalogAdmin.package.fields.ord') },
        { key: 'trialCredits', label: t('catalogAdmin.package.fields.trialCredits') },
        { key: 'officialCredits', label: t('catalogAdmin.package.fields.officialCredits') },
        {
          key: 'flags',
          label: t('catalogAdmin.package.fields.flags'),
          render: (row) => (
            <>
              {row.isTrial ? <Chip size="small" color="info" label={t('catalogAdmin.package.fields.trial')} sx={{ mr: 0.5, mb: 0.5 }} /> : null}
              {row.isOfficial ? <Chip size="small" color="success" label={t('catalogAdmin.package.fields.official')} sx={{ mr: 0.5, mb: 0.5 }} /> : null}
              {row.adminLocked ? <Chip size="small" color="warning" label={t('catalogAdmin.package.fields.locked')} sx={{ mr: 0.5, mb: 0.5 }} /> : null}
            </>
          )
        }
      ]}
      summaryFields={[
        { label: t('common.id'), key: 'packageId' },
        { label: t('catalogAdmin.package.fields.type'), key: 'type' },
        { label: t('catalogAdmin.package.fields.ord'), key: 'ord' },
        { label: t('catalogAdmin.package.fields.trial'), render: (row) => (row.isTrial ? t('common.yes') : t('common.no')) },
        { label: t('catalogAdmin.package.fields.official'), render: (row) => (row.isOfficial ? t('common.yes') : t('common.no')) },
        { label: t('catalogAdmin.package.fields.locked'), render: (row) => (row.adminLocked ? t('common.yes') : t('common.no')) }
      ]}
      metricCards={(rows) => [
        {
          title: `${t('common.total')} ${t('catalogAdmin.package.title').toLowerCase()}`,
          value: rows.length,
          helper: t('catalogAdmin.metrics.localCatalog'),
          color: 'primary'
        },
        {
          title: t('catalogAdmin.package.fields.isTrial'),
          value: rows.filter((row) => row.isTrial).length,
          helper: t('catalogAdmin.metrics.trialEnabled'),
          color: 'info'
        },
        {
          title: t('catalogAdmin.package.fields.isOfficial'),
          value: rows.filter((row) => row.isOfficial).length,
          helper: t('catalogAdmin.metrics.officialEnabled'),
          color: 'success'
        },
        {
          title: t('catalogAdmin.package.fields.adminLocked'),
          value: rows.filter((row) => row.adminLocked).length,
          helper: t('catalogAdmin.metrics.adminLocked'),
          color: 'warning'
        }
      ]}
    />
  );
}
