import Chip from '@mui/material/Chip';

import CatalogCrudPage from './CatalogCrudPage';
import { createPackageCatalog, deletePackageCatalog, listPackagesCatalog, updatePackageCatalog } from 'api/catalog-admin';

export default function PackagesCatalogAdmin() {
  return (
    <CatalogCrudPage
      title="Paquetes"
      subtitle="Administra el catálogo local de paquetes sincronizados y usados por el panel Lion TV."
      helperText="El identificador del paquete se define manualmente y no debe cambiarse después de creado."
      entityLabel="paquete"
      createLabel="Nuevo paquete"
      searchPlaceholder="Buscar por nombre, id, tipo o créditos"
      api={{
        list: listPackagesCatalog,
        create: createPackageCatalog,
        update: updatePackageCatalog,
        remove: deletePackageCatalog
      }}
      idField="packageId"
      titleField="name"
      subtitleField={(row) => `ID ${row.packageId}${row.type ? ` · ${row.type}` : ''}`}
      searchFields={['packageId', 'name', 'type', 'trialCredits', 'officialCredits']}
      dialogMaxWidth="lg"
      fields={[
        { name: 'packageId', label: 'Package ID', type: 'number', required: true, disabledOnEdit: true },
        { name: 'name', label: 'Nombre', type: 'text', required: true },
        { name: 'type', label: 'Tipo', type: 'text' },
        { name: 'ord', label: 'Orden', type: 'number' },
        { name: 'roleCount', label: 'Role count', type: 'number' },
        { name: 'bouquetCount', label: 'Bouquet count', type: 'number' },
        { name: 'trialCredits', label: 'Trial credits', type: 'text' },
        { name: 'trialDuration', label: 'Trial duration', type: 'number' },
        { name: 'trialDurationIn', label: 'Trial duration unit', type: 'text' },
        { name: 'officialCredits', label: 'Official credits', type: 'text' },
        { name: 'officialDuration', label: 'Official duration', type: 'number' },
        { name: 'officialDurationIn', label: 'Official duration unit', type: 'text' },
        { name: 'isTrial', label: 'Trial enabled', type: 'switch', defaultValue: false },
        { name: 'isOfficial', label: 'Official enabled', type: 'switch', defaultValue: false },
        { name: 'isp', label: 'ISP', type: 'switch', defaultValue: false },
        { name: 'stb', label: 'STB', type: 'switch', defaultValue: false },
        { name: 'canRestream', label: 'Can restream', type: 'switch', defaultValue: false },
        { name: 'adminLocked', label: 'Admin locked', type: 'switch', defaultValue: false }
      ]}
      columns={[
        { key: 'packageId', label: 'ID' },
        { key: 'name', label: 'Nombre' },
        { key: 'type', label: 'Tipo' },
        { key: 'ord', label: 'Orden' },
        { key: 'trialCredits', label: 'Trial credits' },
        { key: 'officialCredits', label: 'Official credits' },
        {
          key: 'flags',
          label: 'Flags',
          render: (row) => (
            <>
              {row.isTrial ? <Chip size="small" color="info" label="Trial" sx={{ mr: 0.5, mb: 0.5 }} /> : null}
              {row.isOfficial ? <Chip size="small" color="success" label="Official" sx={{ mr: 0.5, mb: 0.5 }} /> : null}
              {row.adminLocked ? <Chip size="small" color="warning" label="Locked" sx={{ mr: 0.5, mb: 0.5 }} /> : null}
            </>
          )
        }
      ]}
      summaryFields={[
        { label: 'ID', key: 'packageId' },
        { label: 'Tipo', key: 'type' },
        { label: 'Orden', key: 'ord' },
        { label: 'Trial', render: (row) => (row.isTrial ? 'Sí' : 'No') },
        { label: 'Official', render: (row) => (row.isOfficial ? 'Sí' : 'No') },
        { label: 'Locked', render: (row) => (row.adminLocked ? 'Sí' : 'No') }
      ]}
      metricCards={(rows) => [
        { title: 'Total paquetes', value: rows.length, helper: 'Catálogo local', color: 'primary' },
        { title: 'Trial enabled', value: rows.filter((row) => row.isTrial).length, helper: 'Con prueba habilitada', color: 'info' },
        { title: 'Official enabled', value: rows.filter((row) => row.isOfficial).length, helper: 'Venta oficial habilitada', color: 'success' },
        { title: 'Admin locked', value: rows.filter((row) => row.adminLocked).length, helper: 'Bloqueados para edición', color: 'warning' }
      ]}
    />
  );
}
