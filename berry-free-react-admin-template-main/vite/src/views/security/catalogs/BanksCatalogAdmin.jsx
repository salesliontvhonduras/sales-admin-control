import Chip from '@mui/material/Chip';

import CatalogCrudPage from './CatalogCrudPage';
import { createBank, deleteBank, listBanks, updateBank } from 'api/catalog-admin';

export default function BanksCatalogAdmin() {
  return (
    <CatalogCrudPage
      title="Bancos"
      subtitle="Administra el catálogo de bancos usado por facturas y flujos comerciales."
      helperText="Los cambios aquí impactan los selectores de bancos del sistema."
      entityLabel="banco"
      createLabel="Nuevo banco"
      searchPlaceholder="Buscar por nombre de banco"
      api={{ list: listBanks, create: createBank, update: updateBank, remove: deleteBank }}
      idField="id"
      titleField="bank"
      subtitleField={(row) => `ID ${row.id}`}
      searchFields={['bank', 'id']}
      statusField="status"
      fields={[
        { name: 'bank', label: 'Banco', type: 'text', required: true, fullWidth: true },
        { name: 'status', label: 'Activo', type: 'switch', defaultValue: true }
      ]}
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'bank', label: 'Banco' },
        {
          key: 'status',
          label: 'Estado',
          render: (row) => <Chip size="small" color={row.status ? 'success' : 'default'} label={row.status ? 'Activo' : 'Inactivo'} />
        }
      ]}
      summaryFields={[
        { label: 'ID', key: 'id' },
        { label: 'Estado', render: (row) => (row.status ? 'Activo' : 'Inactivo') }
      ]}
      metricCards={(rows) => {
        const active = rows.filter((row) => row.status).length;
        return [
          { title: 'Total bancos', value: rows.length, helper: 'Catálogo total', color: 'primary' },
          { title: 'Activos', value: active, helper: 'Disponibles para uso', color: 'success' },
          { title: 'Inactivos', value: rows.length - active, helper: 'Ocultos en operación', color: 'default' }
        ];
      }}
    />
  );
}
