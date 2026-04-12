import Chip from '@mui/material/Chip';

import CatalogCrudPage from './CatalogCrudPage';
import { createService, deleteService, listServices, updateService } from 'api/catalog-admin';

export default function ServicesCatalogAdmin() {
  return (
    <CatalogCrudPage
      title="Servicios"
      subtitle="Administra el catálogo de servicios usado por clientes, facturas y CRM."
      helperText="Los nombres de servicio se consumen en varios módulos comerciales."
      entityLabel="servicio"
      createLabel="Nuevo servicio"
      searchPlaceholder="Buscar por nombre de servicio"
      api={{ list: listServices, create: createService, update: updateService, remove: deleteService }}
      idField="serviceId"
      titleField="serviceName"
      subtitleField={(row) => `ID ${row.serviceId}`}
      searchFields={['serviceName', 'serviceId']}
      statusField="status"
      fields={[
        { name: 'serviceName', label: 'Servicio', type: 'text', required: true, fullWidth: true },
        { name: 'status', label: 'Activo', type: 'switch', defaultValue: true }
      ]}
      columns={[
        { key: 'serviceId', label: 'ID' },
        { key: 'serviceName', label: 'Servicio' },
        {
          key: 'status',
          label: 'Estado',
          render: (row) => <Chip size="small" color={row.status ? 'success' : 'default'} label={row.status ? 'Activo' : 'Inactivo'} />
        }
      ]}
      summaryFields={[
        { label: 'ID', key: 'serviceId' },
        { label: 'Estado', render: (row) => (row.status ? 'Activo' : 'Inactivo') }
      ]}
      metricCards={(rows) => {
        const active = rows.filter((row) => row.status).length;
        return [
          { title: 'Total servicios', value: rows.length, helper: 'Catálogo total', color: 'primary' },
          { title: 'Activos', value: active, helper: 'Disponibles para venta', color: 'success' },
          { title: 'Inactivos', value: rows.length - active, helper: 'Ocultos en operación', color: 'default' }
        ];
      }}
    />
  );
}
