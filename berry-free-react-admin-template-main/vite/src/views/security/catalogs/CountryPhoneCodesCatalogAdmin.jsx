import CatalogCrudPage from './CatalogCrudPage';
import {
  createCountryPhoneCode,
  deleteCountryPhoneCode,
  listCountryPhoneCodes,
  updateCountryPhoneCode
} from 'api/catalog-admin';

export default function CountryPhoneCodesCatalogAdmin() {
  return (
    <CatalogCrudPage
      title="Códigos telefónicos"
      subtitle="Administra el catálogo global de prefijos telefónicos por país."
      helperText="Este catálogo se usa para formularios y normalización de contactos."
      entityLabel="código telefónico"
      createLabel="Nuevo código"
      searchPlaceholder="Buscar por país, continente o prefijo"
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
        { name: 'phoneCode', label: 'Código', type: 'number', required: true },
        { name: 'country', label: 'País', type: 'text', required: true },
        { name: 'continent', label: 'Continente', type: 'text', required: true }
      ]}
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'phoneCode', label: 'Código', render: (row) => `+${row.phoneCode}` },
        { key: 'country', label: 'País' },
        { key: 'continent', label: 'Continente' }
      ]}
      summaryFields={[
        { label: 'ID', key: 'id' },
        { label: 'Código', render: (row) => `+${row.phoneCode}` },
        { label: 'Continente', key: 'continent' }
      ]}
      metricCards={(rows) => {
        const continents = new Set(rows.map((row) => row.continent).filter(Boolean));
        return [
          { title: 'Total códigos', value: rows.length, helper: 'Registros del catálogo', color: 'primary' },
          { title: 'Continentes', value: continents.size, helper: 'Cobertura registrada', color: 'info' }
        ];
      }}
    />
  );
}
