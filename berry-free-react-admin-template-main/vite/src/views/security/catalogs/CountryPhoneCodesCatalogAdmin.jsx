import { useTranslation } from 'react-i18next';

import CatalogCrudPage from './CatalogCrudPage';
import {
  createCountryPhoneCode,
  deleteCountryPhoneCode,
  listCountryPhoneCodes,
  updateCountryPhoneCode
} from 'api/catalog-admin';

export default function CountryPhoneCodesCatalogAdmin() {
  const { t } = useTranslation();

  return (
    <CatalogCrudPage
      title={t('catalogAdmin.countryPhoneCode.title')}
      subtitle={t('catalogAdmin.countryPhoneCode.subtitle')}
      helperText={t('catalogAdmin.countryPhoneCode.helperText')}
      entityLabel={t('catalogAdmin.countryPhoneCode.entityLabel')}
      createLabel={t('catalogAdmin.countryPhoneCode.createLabel')}
      searchPlaceholder={t('catalogAdmin.countryPhoneCode.searchPlaceholder')}
      api={{
        list: listCountryPhoneCodes,
        create: createCountryPhoneCode,
        update: updateCountryPhoneCode,
        remove: deleteCountryPhoneCode
      }}
      idField="id"
      titleField="country"
      subtitleField={(row) => `+${row.phoneCode}`}
      searchFields={['country', 'continent', 'phoneCode', 'id']}
      fields={[
        { name: 'phoneCode', label: t('catalogAdmin.countryPhoneCode.fields.phoneCode'), type: 'number', required: true },
        { name: 'country', label: t('catalogAdmin.countryPhoneCode.fields.country'), type: 'text', required: true },
        { name: 'continent', label: t('catalogAdmin.countryPhoneCode.fields.continent'), type: 'text', required: true }
      ]}
      columns={[
        { key: 'id', label: t('common.id') },
        { key: 'phoneCode', label: t('catalogAdmin.countryPhoneCode.fields.phoneCode'), render: (row) => `+${row.phoneCode}` },
        { key: 'country', label: t('catalogAdmin.countryPhoneCode.fields.country') },
        { key: 'continent', label: t('catalogAdmin.countryPhoneCode.fields.continent') }
      ]}
      summaryFields={[
        { label: t('common.id'), key: 'id' },
        { label: t('catalogAdmin.countryPhoneCode.fields.phoneCode'), render: (row) => `+${row.phoneCode}` },
        { label: t('catalogAdmin.countryPhoneCode.fields.continent'), key: 'continent' }
      ]}
      metricCards={(rows) => {
        const continents = new Set(rows.map((row) => row.continent).filter(Boolean));
        return [
          {
            title: `${t('common.total')} ${t('catalogAdmin.countryPhoneCode.title').toLowerCase()}`,
            value: rows.length,
            helper: t('catalogAdmin.metrics.totalRegistered', { entity: t('catalogAdmin.countryPhoneCode.entityLabel') }),
            color: 'primary'
          },
          { title: t('catalogAdmin.countryPhoneCode.fields.continent'), value: continents.size, helper: t('catalogAdmin.metrics.coverage'), color: 'info' }
        ];
      }}
    />
  );
}
