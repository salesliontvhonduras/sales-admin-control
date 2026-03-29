import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      menu: {
        dashboard: 'Dashboard',
        pages: 'Pages',
        pagesCaption: 'Pages',
        authentication: 'Authentication',
        login: 'Login',
        register: 'Register',
        sms: 'SMS',
        smsManagement: 'SMS Management',
        utilities: 'Utilities',
        typography: 'Typography',
        color: 'Color',
        shadow: 'Shadow',
        liontv: 'Lion TV',
        liontvDashboard: 'Lion TV Tracking',
        demos: 'Lion TV Demos',
        subscriptions: 'Subscriptions',
        invoices: 'Invoices',
        businessPurchases: 'Business Purchases',
        customers: 'Customers',
        potentialCustomers: 'Potential Customers',
        paymentCommitments: 'Payment Commitments',
        crm: 'Customer CRM',
        lines: 'Lines',
        licenses: 'Licenses',
        sample: 'Sample Page',
        docs: 'Documentation'
      },
      auth: {
        hi: 'Hi, Welcome Back',
        enterCredentials: 'Enter your credentials to continue',
        signIn: 'Sign In',
        email: 'Email Address',
        password: 'Password',
        keepLogged: 'Keep me logged in',
        forgot: 'Forgot Password?',
        noAccount: "Don't have an account?",
        otpTitle: 'Two-step verification',
        otpInstruction: 'Enter the code we sent to {{dest}}.',
        codeLabel: 'Verification code',
        resend: 'Resend code',
        confirm: 'Confirm',
        sending: 'Signing in...',
        verifying: 'Verifying...',
        sendingCode: 'Sending...',
        verifyingCode: 'Verifying...',
        backToCreds: 'Back to credentials',
        sendToken: 'Send token',
        resetPass: 'Change password',
        sendingToken: 'Sending...',
        savingPass: 'Saving...',
        sendAnother: 'Send to another email',
        recoverTitle: 'Recover password',
        recoverSubtitle: 'We will send a token to your email.',
        login: 'Back to login',
        firstName: 'First Name',
        lastName: 'Last Name',
        serial: 'Serial Code',
        register: 'Sign up with Email address',
        passwordStrength: 'Password strength',
        registerBtn: 'Create account'
      },
      messages: {
        welcome: 'Welcome back! 👋',
        invalidCreds: 'Invalid credentials',
        codeInfo: 'Enter the code we sent to finish signing in.',
        codeSent: 'If the email exists, we sent a recovery token.',
        passUpdated: 'Password updated. You can log in now.',
        fillTokenPass: 'Complete token and new password.',
        enterEmail: 'Enter your email.',
        enterCode: 'Enter the code you received.',
        resendOk: 'We have resent the code.'
      },
      actions: {
        language: 'Language',
        english: 'English',
        spanish: 'Español',
        refresh: 'Refresh',
        add: 'Add',
        newInvoice: 'New invoice',
        newCustomer: 'New customer',
        edit: 'Edit',
        delete: 'Delete'
      },
      invoices: {
        title: 'Invoices',
        summary: {
          total: '{{count}} invoices',
          paid: 'Status: PAID {{count}}',
          pending: 'Status: PENDING {{count}}'
        },
        filters: { status: 'Status', all: 'All' },
        search: 'Search (id, customer, status, method)',
        edit: 'Edit invoice',
        dialogSubtitle: 'Enter payment and assignment data.',
        headers: {
          id: 'ID',
          customer: 'Customer',
          service: 'Service',
          package: 'Package',
          service: 'Service',
          bank: 'Bank',
          method: 'Method',
          status: 'Status',
          payment: 'Payment',
          discount: 'Discount',
          paymentDate: 'Payment date',
          actions: 'Actions'
        },
        badge: { new: 'New', edit: 'Edit' },
        table: { loading: 'Loading invoices...', emptyTitle: 'No invoices yet.', emptyText: 'Create your first invoice to see it here.' },
        form: {
          sections: {
            assignment: 'Assignment',
            assignmentHelper: 'Customer, service, package and bank (if needed).',
            payment: 'Payment',
            paymentHelper: 'Amounts and payment date.',
            method: 'Method & status',
            methodHelper: 'Payment method, status and notes.'
          },
          customer: 'Customer',
          service: 'Service',
          package: 'Package',
          bank: 'Bank',
          paymentMethod: 'Payment method',
          status: 'Status',
          paymentDate: 'Payment date',
          amountPaid: 'Amount paid',
          amountDiscount: 'Discount',
          notes: 'Notes',
          placeholderSelect: 'Select an option',
          helperCustomer: 'Associated customer',
          helperService: 'Service for this invoice',
          helperPackage: 'Package assigned',
          helperBank: 'Bank used for transfer',
          helperLoading: 'Loading...',
          buttons: {
            clear: 'Clear',
            create: 'Create',
            creating: 'Creating...',
            save: 'Save changes',
            saving: 'Saving...',
            delete: 'Delete',
            deleting: 'Deleting...',
            cancel: 'Cancel'
          },
          tips: {
            new: 'Verify package and service before saving. Bank is only required for transfers.',
            edit: 'If you change the payment method, check the bank field.'
          },
          states: { paid: 'Paid', pending: 'Pending' },
          paymentMethods: {
            bank: 'Bank Transfer',
            paypal: 'Paypal',
            ecommerce: 'Ecommerce',
            link: 'Payment link',
            debit: 'Automatic debit'
          }
        },
        messages: {
          required: 'Please complete required fields.',
          needBank: 'Select a bank for Bank Transfer payments.',
          created: 'Invoice created successfully.',
          updated: 'Invoice updated successfully.',
          deleted: 'Invoice deleted successfully.'
        },
        delete: {
          title: 'Delete invoice',
          body: 'Delete invoice {{id}}? This action cannot be undone.'
        }
      },
      subscriptions: {
        title: 'Subscriptions',
        search: 'Search (customer, line, package, status)',
        filters: { status: 'Status', all: 'All' },
        headers: {
          id: 'ID',
          customer: 'Customer',
          line: 'Line',
          package: 'Package',
          status: 'Status',
          amount: 'Amount',
          start: 'Start',
          renewal: 'Renewal',
          autopay: 'Auto pay',
          actions: 'Actions'
        }
      },
      licenses: {
        title: 'Licenses',
        search: 'Search (MAC, device key, customer, status)',
        filters: { status: 'Status', payment: 'Payment', all: 'All' },
        paid: { paid: 'Paid', pending: 'Pending' },
        headers: {
          id: 'ID',
          mac: 'MAC',
          deviceKey: 'Device key',
          name: 'Name',
          customer: 'Customer',
          status: 'Status',
          paid: 'Paid',
          app: 'App',
          price: 'Price',
          created: 'Created',
          expire: 'Expire',
          period: 'Period',
          type: 'Type',
          ownerSince: 'Owner since',
          actions: 'Actions'
        },
        form: {
          deviceKey: 'Device key',
          deviceKeyHelper: 'Optional key for this device',
          paid: 'Payment status',
          paidHelper: 'Track if this license was already paid'
        }
      },
      demos: {
        title: 'Lion TV demos',
        listTitle: 'Demo list',
        search: 'Search (phone, user, package, app)',
        headers: {
          phone: 'Phone',
          country: 'Country code',
          package: 'Package',
          app: 'App',
          status: 'Status',
          created: 'Created',
          expires: 'Expires'
        },
        summary: { total: '{{count}} demos', packages: 'Demo packages: {{count}}', countries: 'Countries: {{count}}' },
        new: 'New demo',
        infoTitle: 'Demo data',
        infoSubtitle: 'Fill required fields; dates are assigned by backend.',
        table: { empty: 'No demos found.', loading: 'Loading...' }
      },
      lines: {
        title: 'Lines',
        listTitle: 'Line list',
        summary: { total: '{{count}} lines', active: 'Active: {{count}}', expired: 'Expired: {{count}}' },
        search: 'Search (user, package, IP, status)',
        filters: { status: 'Status', all: 'All' },
        status: { active: 'Active', expired: 'Expired', inactive: 'Inactive', trial: 'Trial' },
        headers: {
          user: 'User',
          password: 'Password',
          package: 'Package',
          status: 'Status',
          max: 'Max connections',
          type: 'Type',
          created: 'Created',
          expires: 'Expires',
          owner: 'Owner',
          lastIp: 'Last IP',
          lastWatch: 'Last watched',
          actions: 'Actions'
        },
        detail: {
          title: 'Line detail',
          user: 'User',
          password: 'Password',
          package: 'Package',
          id: 'ID',
          owner: 'Owner',
          created: 'Created',
          expires: 'Expires',
          lastIp: 'Last IP',
          lastStream: 'Last stream',
          type: 'Type',
          notes: 'Notes',
          lastStreamLabel: 'Last stream',
          close: 'Close'
        },
        table: { empty: 'No lines found.', loading: 'Loading...' }
      },
      customers: {
        title: 'Customers',
        search: 'Search (name, email, phone, channel, status)',
        headers: {
          customer: 'Customer',
          email: 'Email',
          phone: 'Phone',
          gender: 'Gender',
          status: 'Status',
          opening: 'Opening',
          closing: 'Closing',
          referred: 'Referred',
          channel: 'Channel'
        },
        badge: { new: 'New', edit: 'Edit' },
        tips: {
          new: 'Review channel and gender; they help segment campaigns and reports.',
          edit: 'If you change email or phone, ensure the channel stays consistent.'
        },
        form: {
          sections: {
            identification: 'Identification',
            identificationHelper: 'Name, gender, status and channel.',
            contact: 'Contact',
            contactHelper: 'How to reach this customer.',
            dates: 'Dates',
            datesHelper: 'Opening and closing control (optional).',
            referred: 'Referred',
            referredHelper: 'Mark if the customer is referred and by whom.'
          },
          name: 'Full name',
          gender: 'Gender',
          status: 'Status',
          channel: 'Channel',
          email: 'Email',
          phone: 'Phone',
          opening: 'Opening date',
          closing: 'Closing date',
          referredToggle: 'Is referred',
          referredBy: 'Referred by',
          placeholderSelect: 'Select a customer',
          noReferrers: 'No customers available',
          helperOff: 'Enable "Is referred" to select.',
          helperNone: 'No customers to refer yet.',
          helperPick: 'Choose from existing customers.',
          helperLoading: 'Loading customers...',
          createTitle: 'New customer',
          createSubtitle: 'Register a customer with basic info and key dates.',
          editTitle: 'Edit customer',
          editSubtitle: 'Update only the fields you need; then save the changes.',
          deleteTitle: 'Delete customer',
          deleteSubtitle: 'This action cannot be undone.',
          deleteBody: 'Are you sure you want to delete {{name}}?',
          buttons: {
            clear: 'Clear',
            create: 'Create',
            creating: 'Creating...',
            save: 'Save changes',
            saving: 'Saving...',
            delete: 'Delete',
            deleting: 'Deleting...',
            cancel: 'Cancel'
          },
          states: { yes: 'Yes', no: 'No', male: 'Male', female: 'Female', active: 'Active', inactive: 'Inactive' }
        },
        table: {
          loading: 'Loading customers...',
          emptyTitle: 'No customers yet.',
          emptyText: 'Create your first customer to see it here.'
        },
        messages: {
          required: 'Please complete the required fields.',
          created: 'Customer created successfully.',
          updated: 'Customer updated successfully.',
          deleted: 'Customer deleted successfully.'
        }
      },
      crm: {
        title: 'Customer CRM',
        search: { label: 'Search customer', placeholder: 'Name, email or user' },
        actions: { retry: 'Retry', selectFirstCustomer: 'Select first customer' },
        empty: {
          title: 'Pick a customer to see their 360° view',
          subtitle: 'You will find their subscriptions, billing, licenses and key metrics.'
        },
        emptyRecords: {
          title: 'This customer has no operational records yet',
          subtitle: 'We did not find subscriptions, invoices, licenses, or managed accounts for this customer.'
        },
        stats: {
          billed: 'Total billed',
          invoices: 'Invoices: {{val}}',
          subscriptions: 'Subscriptions',
          subscriptionsActive: 'Active: {{val}}',
          licenses: 'Licenses',
          licensesActive: 'Active: {{val}}',
          managedAccounts: 'Managed Accounts',
          managedAccountsActive: 'Active: {{val}}',
          nextRenewal: 'Next renewal',
          nextManagedExpiration: 'Next account expiration',
          managedAccountsAlias: 'Based on managed aliases',
          none: 'Not defined',
          closest: 'Closest date',
          lastPayment: 'Last payment',
          noPayments: 'No payments',
          lastInvoice: 'Last invoice date',
          referredBy: 'Referred by',
          noRef: 'No reference',
          opening: 'Opening: {{date}}'
        },
        contact: { call: 'Call', email: 'Email' },
        tables: {
          subscriptions: { title: 'All subscriptions', desc: 'Full view of lines, packages, billing and dates for the customer.' },
          licenses: { title: 'All licenses', desc: 'License detail: app, type, validity and status.' },
          managedAccounts: {
            title: 'Managed accounts',
            desc: 'Complete view of aliases, providers, expiration, status, and distribution settings.'
          },
          invoices: { title: 'All invoices', desc: 'Full billing history in Lempiras with method and status.' }
        },
        headers: {
          line: 'Line',
          renewal: 'Renewal',
          method: 'Method',
          package: 'Package',
          status: 'Status',
          start: 'Start',
          date: 'Date',
          total: 'Total',
          billing: 'Billing',
          mac: 'MAC',
          app: 'App',
          type: 'Type',
          expire: 'Expire',
          accountCode: 'Account',
          alias: 'Alias',
          provider: 'Provider',
          distribution: 'Distribution'
        },
        timeline: {
          title: 'Customer 360 timeline',
          subtitle: 'Unified timeline with commercial and operational events for the selected customer.',
          filters: {
            all: 'All',
            expirations: 'Expirations',
            payments: 'Payments',
            activity: 'Activity'
          },
          empty: {
            title: 'No events for this filter',
            subtitle: 'Try changing the filter or refreshing data to update the timeline.'
          },
          actions: {
            resetFilter: 'Show all'
          },
          events: {
            customerOpened: {
              title: 'Customer created',
              subtitle: 'Customer onboarding date'
            },
            subscriptionStart: { title: 'Subscription started' },
            subscriptionRenewal: { title: 'Scheduled renewal' },
            invoicePayment: { title: 'Invoice movement' },
            licenseCreated: { title: 'License created' },
            licenseExpiration: { title: 'License expiration' },
            managedAccountExpiration: { title: 'Managed account expiration' },
            managedAccountEmail: { title: 'Last inbound email received' }
          }
        },
        modules: {
          title: 'Detailed modules',
          subtitle: 'Open dedicated submodules with context, icons and colors for each entity.',
          subscriptions: 'View subscriptions',
          invoices: 'View billing',
          licenses: 'View licenses',
          managedAccounts: 'View managed accounts'
        },
        detail: {
          subscription: 'Subscription detail',
          managedAccount: 'Managed account detail',
          invoice: 'Invoice detail',
          license: 'License detail',
          helper: 'Enriched view with icons and descriptions.',
          summary: {
            subscription: 'Subscription summary',
            managedAccount: 'Managed account summary',
            license: 'License summary',
            invoice: 'Invoice summary',
            subscriptionHelper: 'See line, package, dates and auto-pay state of the selected subscription.',
            managedAccountHelper: 'See alias, provider, expiration, and distribution settings of the selected managed account.',
            licenseHelper: 'Key license info: app, type, cycle, validity and current owner.',
            invoiceHelper: 'Amount paid in Lps, method, bank and notes for the selected invoice.'
          }
        },
        subscription: {
          block: {
            line: { title: 'Line & charge', helper: 'Line identifier and related amounts.' },
            dates: { title: 'Dates & billing', helper: 'Current cycle and next renewal.' },
            status: { title: 'Status & package', helper: 'Status, package and auto payment.' }
          },
          line: 'Line: {{line}}',
          user: 'User: {{user}}',
          amount: 'Amount: {{amount}}',
          discount: 'Discount: {{discount}}',
          start: 'Start: {{date}}',
          renewal: 'Renewal: {{date}}',
          billing: 'Billing: {{billing}}',
          package: 'Package: {{pkg}}',
          autoPay: 'Auto pay: {{val}}'
        },
        license: {
          block: {
            app: { title: 'App & plan', helper: 'Selected license overview.' },
            details: { title: 'License details', helper: 'Status, dates and owner.' }
          },
          app: 'App: {{app}}',
          deviceKey: 'Device key: {{value}}',
          type: 'Type: {{type}}',
          price: 'Price: {{price}}',
          period: 'Period: {{period}}',
          mac: 'MAC: {{mac}}',
          name: 'Name: {{name}}',
          paid: 'Payment: {{status}}',
          created: 'Created: {{date}}',
          expires: 'Expires: {{date}}',
          ownerSince: 'Owner since: {{date}}'
        },
        invoice: {
          block: {
            amount: { title: 'Charge & status', helper: 'Total amount and payment method.' },
            info: { title: 'Invoice info', helper: 'Service, package, bank and notes.' }
          },
          totalPaid: 'Total paid: {{amount}}',
          discount: 'Discount: {{discount}}',
          method: 'Method: {{method}}',
          status: 'Status: {{status}}',
          date: 'Date: {{date}}',
          service: 'Service: {{service}}',
          package: 'Package: {{pkg}}',
          bank: 'Bank: {{bank}}',
          notes: 'Notes: {{notes}}',
          noNotes: 'No notes'
        },
        datasets: {
          customers: 'Loaded customers: {{count}}',
          managedAccounts: 'Managed accounts: {{count}}',
          label: 'Datasets: {{state}}',
          loading: 'Loading...',
          ready: 'Ready'
        },
        bulk: {
          selected: 'Selected: {{count}}',
          visible: 'Visible: {{count}}',
          selectVisible: 'Select visible',
          unselectVisible: 'Unselect visible',
          clearSelection: 'Clear selection',
          copyIds: 'Copy IDs',
          exportCsv: 'Export CSV',
          emptySelection: 'Select at least one record.',
          copySuccess: 'IDs copied to clipboard.',
          copyFailed: 'Could not copy to clipboard.',
          emptyExport: 'No records available for export.',
          exportSuccess: 'Export completed ({{count}} records).',
          id: 'ID'
        },
        errors: {
          load: 'Could not load information.',
          banks: 'Could not load banks.',
          services: 'Could not load services.',
          partialData: 'Some data sources failed. Retry to complete the 360 view.'
        },
        table: { detail: 'Detail', empty: 'No data', emptyHelp: 'No records were found for this customer in this module.' }
      },
      common: { close: 'Close', yes: 'Yes', no: 'No' },
      sms: {
        title: 'SMS Management',
        enqueue: 'Enqueue SMS',
        history: 'SMS history',
        chips: { ready: '{{count}} numbers ready', total: '{{count}} records' },
        search: 'Search (phone, message, external)',
        filters: { from: 'From', to: 'To', status: 'Status', all: 'All' },
        headers: { phone: 'Phone', message: 'Message', status: 'Status', scheduled: 'Scheduled', detail: 'Detail' },
        table: { empty: 'No SMS found.', loading: 'Loading...' },
        mobile: { scheduled: 'Scheduled', view: 'View detail' },
        detail: {
          title: 'SMS detail',
          phone: 'Phone',
          created: 'Created',
          priority: 'Priority',
          message: 'Message',
          scheduled: 'Scheduled',
          sent: 'Sent',
          externalId: 'External Id',
          user: 'User',
          source: 'Source',
          retries: 'Retries',
          failReason: 'Fail reason',
          none: 'No data',
          close: 'Close'
        },
        form: {
          numbers: 'Destination numbers',
          numbersPlaceholder: 'Ex: 51999999999, 51888888888',
          numbersHelper: 'Separate each number with a comma.',
          message: 'Message',
          messagePlaceholder: 'Max 160 characters',
          messageHelper: '{{count}}/{{max}} (no accents or emojis)',
          schedule: 'Schedule send',
          priority: 'Priority',
          priorityHelper: '0 by default',
          externalId: 'External Id',
          sourceSystem: 'Source system',
          chips: {
            numbers: '{{count}} numbers',
            chars: '{{count}}/{{max}} chars',
            scheduled: 'Scheduled: {{value}}',
            immediate: 'Immediate send',
            cost: 'Estimated cost: {{cost}}'
          },
          actions: { clear: 'Clear', send: 'Enqueue SMS', sending: 'Sending...' }
        }
      }
    }
  },
  es: {
    translation: {
      menu: {
        dashboard: 'Tablero',
        pages: 'Páginas',
        pagesCaption: 'Páginas',
        authentication: 'Autenticación',
        login: 'Iniciar sesión',
        register: 'Registrarse',
        sms: 'SMS',
        smsManagement: 'Gestión de SMS',
        utilities: 'Utilidades',
        typography: 'Tipografía',
        color: 'Color',
        shadow: 'Sombra',
        liontv: 'Lion TV',
        liontvDashboard: 'Seguimiento Lion TV',
        demos: 'Demos Lion TV',
        subscriptions: 'Suscripciones',
        invoices: 'Facturas',
        businessPurchases: 'Compras negocio',
        customers: 'Clientes',
        potentialCustomers: 'Prospectos',
        paymentCommitments: 'Compromisos de pago',
        crm: 'CRM Clientes',
        lines: 'Líneas',
        licenses: 'Licencias',
        sample: 'Página de ejemplo',
        docs: 'Documentación'
      },
      auth: {
        hi: 'Hola, bienvenido',
        enterCredentials: 'Ingresa tus credenciales para continuar',
        signIn: 'Iniciar sesión',
        email: 'Correo electrónico',
        password: 'Contraseña',
        keepLogged: 'Mantener sesión iniciada',
        forgot: '¿Olvidaste tu contraseña?',
        noAccount: '¿No tienes cuenta?',
        otpTitle: 'Verificación en dos pasos',
        otpInstruction: 'Ingresa el código enviado a {{dest}}.',
        codeLabel: 'Código de verificación',
        resend: 'Reenviar código',
        confirm: 'Confirmar',
        sending: 'Ingresando...',
        verifying: 'Verificando...',
        sendingCode: 'Enviando...',
        verifyingCode: 'Verificando...',
        backToCreds: 'Volver a credenciales',
        sendToken: 'Enviar token',
        resetPass: 'Cambiar contraseña',
        sendingToken: 'Enviando...',
        savingPass: 'Guardando...',
        sendAnother: 'Enviar a otro correo',
        recoverTitle: 'Recuperar contraseña',
        recoverSubtitle: 'Te enviaremos un token a tu correo.',
        login: 'Volver a iniciar sesión',
        firstName: 'Nombre',
        lastName: 'Apellido',
        serial: 'Código serial',
        register: 'Regístrate con correo',
        passwordStrength: 'Fortaleza de la contraseña',
        registerBtn: 'Crear cuenta'
      },
      messages: {
        welcome: '¡Bienvenido de nuevo! 👋',
        invalidCreds: 'Credenciales inválidas',
        codeInfo: 'Ingresa el código que enviamos para completar el acceso.',
        codeSent: 'Si el correo existe, enviamos un token de recuperación.',
        passUpdated: 'Contraseña actualizada. Ahora puedes iniciar sesión.',
        fillTokenPass: 'Completa token y nueva contraseña.',
        enterEmail: 'Ingresa tu correo.',
        enterCode: 'Ingresa el código que recibiste.',
        resendOk: 'Hemos reenviado el código.'
      },
      actions: {
        language: 'Idioma',
        english: 'Inglés',
        spanish: 'Español',
        refresh: 'Recargar',
        add: 'Agregar',
        newInvoice: 'Nueva factura',
        newCustomer: 'Nuevo cliente',
        edit: 'Editar',
        delete: 'Eliminar'
      },
      invoices: {
        title: 'Facturas',
        summary: {
          total: '{{count}} facturas',
          paid: 'Estado: PAGADAS {{count}}',
          pending: 'Estado: PENDIENTES {{count}}'
        },
        filters: { status: 'Estado', all: 'Todos' },
        search: 'Buscar (id, cliente, estado, método)',
        edit: 'Editar factura',
        dialogSubtitle: 'Ingresa los datos de pago y asignación.',
        headers: {
          id: 'ID',
          customer: 'Cliente',
          service: 'Servicio',
          package: 'Paquete',
          bank: 'Banco',
          method: 'Método',
          status: 'Estado',
          payment: 'Pago',
          discount: 'Descuento',
          paymentDate: 'Fecha pago',
          actions: 'Acciones'
        },
        badge: { new: 'Nueva', edit: 'Editar' },
        table: { loading: 'Cargando facturas...', emptyTitle: 'No hay facturas.', emptyText: 'Crea tu primera factura para verla aquí.' },
        form: {
          sections: {
            assignment: 'Asignación',
            assignmentHelper: 'Cliente, servicio, paquete y banco (si aplica).',
            payment: 'Pago',
            paymentHelper: 'Montos y fecha de pago.',
            method: 'Método y estado',
            methodHelper: 'Forma de pago, estado y notas.'
          },
          customer: 'Cliente',
          service: 'Servicio',
          package: 'Paquete',
          bank: 'Banco',
          paymentMethod: 'Método de pago',
          status: 'Estado',
          paymentDate: 'Fecha de pago',
          amountPaid: 'Monto pagado',
          amountDiscount: 'Descuento',
          notes: 'Notas',
          placeholderSelect: 'Selecciona una opción',
          helperCustomer: 'Cliente asociado',
          helperService: 'Servicio de esta factura',
          helperPackage: 'Paquete asignado',
          helperBank: 'Banco usado en la transferencia',
          helperLoading: 'Cargando...',
          buttons: {
            clear: 'Limpiar',
            create: 'Crear',
            creating: 'Creando...',
            save: 'Guardar cambios',
            saving: 'Guardando...',
            delete: 'Eliminar',
            deleting: 'Eliminando...',
            cancel: 'Cancelar'
          },
          tips: {
            new: 'Revisa paquete y servicio antes de guardar. Banco sólo es requerido para transferencias.',
            edit: 'Si cambias el método de pago, revisa el banco.'
          },
          states: { paid: 'Pagada', pending: 'Pendiente' },
          paymentMethods: {
            bank: 'Transferencia bancaria',
            paypal: 'Paypal',
            ecommerce: 'Ecommerce',
            link: 'Link de pago',
            debit: 'Débito automático'
          }
        },
        messages: {
          required: 'Completa los campos requeridos.',
          needBank: 'Selecciona un banco para pagos por transferencia.',
          created: 'Factura creada correctamente.',
          updated: 'Factura actualizada correctamente.',
          deleted: 'Factura eliminada correctamente.'
        },
        delete: {
          title: 'Eliminar factura',
          body: '¿Eliminar la factura {{id}}? Esta acción no se puede deshacer.'
        }
      },
      subscriptions: {
        title: 'Suscripciones',
        search: 'Buscar (cliente, línea, paquete, estado)',
        filters: { status: 'Estado', all: 'Todos' },
        headers: {
          id: 'ID',
          customer: 'Cliente',
          line: 'Línea',
          package: 'Paquete',
          status: 'Estado',
          amount: 'Monto',
          start: 'Inicio',
          renewal: 'Renovación',
          autopay: 'Débito automático',
          actions: 'Acciones'
        }
      },
      licenses: {
        title: 'Licencias',
        search: 'Buscar (MAC, device key, cliente, estado)',
        filters: { status: 'Estado', payment: 'Pago', all: 'Todos' },
        paid: { paid: 'Pagada', pending: 'Pendiente' },
        headers: {
          id: 'ID',
          mac: 'MAC',
          deviceKey: 'Device key',
          name: 'Nombre',
          customer: 'Cliente',
          status: 'Estado',
          paid: 'Pagada',
          app: 'App',
          price: 'Precio',
          created: 'Creada',
          expire: 'Expira',
          period: 'Periodo',
          type: 'Tipo',
          ownerSince: 'Desde',
          actions: 'Acciones'
        },
        form: {
          deviceKey: 'Device key',
          deviceKeyHelper: 'Llave opcional para este dispositivo',
          paid: 'Estado de pago',
          paidHelper: 'Indica si esta licencia ya fue pagada'
        }
      },
      demos: {
        title: 'Demos Lion TV',
        listTitle: 'Listado de demos',
        search: 'Buscar (celular, usuario, paquete, app)',
        headers: {
          phone: 'Celular',
          country: 'Código país',
          package: 'Paquete',
          app: 'App',
          status: 'Estado',
          created: 'Creado',
          expires: 'Expira'
        },
        summary: { total: '{{count}} demos', packages: 'Paquetes demo: {{count}}', countries: 'Países: {{count}}' },
        new: 'Nueva demo',
        infoTitle: 'Datos de la demo',
        infoSubtitle: 'Completa los campos requeridos; las fechas se asignan automáticamente.',
        table: { empty: 'No hay demos registradas.', loading: 'Cargando...' }
      },
      lines: {
        title: 'Líneas',
        listTitle: 'Listado de líneas',
        summary: { total: '{{count}} líneas', active: 'Activas: {{count}}', expired: 'Expiradas: {{count}}' },
        search: 'Buscar (usuario, paquete, IP, estado)',
        filters: { status: 'Estado', all: 'Todos' },
        status: { active: 'Activa', expired: 'Expirada', inactive: 'Inactiva', trial: 'Prueba' },
        headers: {
          user: 'Usuario',
          password: 'Contraseña',
          package: 'Paquete',
          status: 'Estado',
          max: 'Conexiones máx.',
          type: 'Tipo',
          created: 'Creado',
          expires: 'Expira',
          owner: 'Dueño',
          lastIp: 'Última IP',
          lastWatch: 'Última vista',
          actions: 'Acciones'
        },
        detail: {
          title: 'Detalle de línea',
          user: 'Usuario',
          password: 'Contraseña',
          package: 'Paquete',
          id: 'ID',
          owner: 'Propietario',
          created: 'Creada',
          expires: 'Expira',
          lastIp: 'Última IP',
          lastStream: 'Último stream',
          type: 'Tipo',
          notes: 'Notas',
          lastStreamLabel: 'Último stream',
          close: 'Cerrar'
        },
        table: { empty: 'No hay líneas registradas.', loading: 'Cargando...' }
      },
      customers: {
        title: 'Clientes',
        search: 'Buscar (nombre, correo, teléfono, canal, estado)',
        headers: {
          customer: 'Cliente',
          email: 'Correo',
          phone: 'Teléfono',
          gender: 'Género',
          status: 'Estado',
          opening: 'Apertura',
          closing: 'Cierre',
          referred: 'Referido',
          channel: 'Canal'
        },
        badge: { new: 'Alta', edit: 'Edición' },
        tips: {
          new: 'Revisa el canal y el género; ayudan a segmentar campañas y reportes.',
          edit: 'Si cambias el correo o teléfono, valida que el canal se mantenga coherente.'
        },
        form: {
          sections: {
            identification: 'Identificación',
            identificationHelper: 'Nombre, género, estado y canal.',
            contact: 'Contacto',
            contactHelper: 'Cómo comunicarnos con el cliente.',
            dates: 'Fechas',
            datesHelper: 'Control de apertura y cierre (opcional).',
            referred: 'Referido',
            referredHelper: 'Marca si el cliente viene referido y quién lo recomendó.'
          },
          name: 'Nombre completo',
          gender: 'Género',
          status: 'Estado',
          channel: 'Canal',
          email: 'Correo',
          phone: 'Teléfono',
          opening: 'Fecha de apertura',
          closing: 'Fecha de cierre',
          referredToggle: 'Es referido',
          referredBy: 'Referido por',
          placeholderSelect: 'Selecciona un cliente',
          noReferrers: 'No hay clientes disponibles',
          helperOff: 'Activa "Es referido" para seleccionar.',
          helperNone: 'No hay clientes para referir aún.',
          helperPick: 'Escoge entre los clientes existentes.',
          helperLoading: 'Cargando clientes...',
          createTitle: 'Nuevo cliente',
          createSubtitle: 'Registra un cliente con la información básica y fechas clave.',
          editTitle: 'Editar cliente',
          editSubtitle: 'Modifica sólo los campos necesarios; guarda los cambios para aplicarlos.',
          deleteTitle: 'Eliminar cliente',
          deleteSubtitle: 'Esta acción no se puede deshacer.',
          deleteBody: '¿Estás seguro de eliminar a {{name}}?',
          buttons: {
            clear: 'Limpiar',
            create: 'Crear',
            creating: 'Creando...',
            save: 'Guardar cambios',
            saving: 'Guardando...',
            delete: 'Eliminar',
            deleting: 'Eliminando...',
            cancel: 'Cancelar'
          },
          states: { yes: 'Sí', no: 'No', male: 'Masculino', female: 'Femenino', active: 'Activo', inactive: 'Inactivo' }
        },
        table: {
          loading: 'Cargando clientes...',
          emptyTitle: 'No hay clientes registrados.',
          emptyText: 'Crea tu primer cliente para verlo aquí.'
        },
        messages: {
          required: 'Completa los campos requeridos.',
          created: 'Cliente creado correctamente.',
          updated: 'Cliente actualizado correctamente.',
          deleted: 'Cliente eliminado correctamente.'
        }
      },
      crm: {
        title: 'CRM Clientes',
        search: { label: 'Buscar cliente', placeholder: 'Nombre, correo o usuario' },
        actions: { retry: 'Reintentar', selectFirstCustomer: 'Seleccionar primer cliente' },
        empty: {
          title: 'Selecciona un cliente para ver su panorama 360°',
          subtitle: 'Encontrarás sus suscripciones, facturación, licencias y métricas clave.'
        },
        emptyRecords: {
          title: 'Este cliente aún no tiene movimientos',
          subtitle: 'No encontramos suscripciones, facturas, licencias ni managed accounts para este cliente.'
        },
        stats: {
          billed: 'Total facturado',
          invoices: 'Facturas: {{val}}',
          subscriptions: 'Suscripciones',
          subscriptionsActive: 'Activas: {{val}}',
          licenses: 'Licencias',
          licensesActive: 'Activas: {{val}}',
          managedAccounts: 'Managed Accounts',
          managedAccountsActive: 'Activas: {{val}}',
          nextRenewal: 'Próxima renovación',
          nextManagedExpiration: 'Próx. vencimiento account',
          managedAccountsAlias: 'Basado en alias gestionados',
          none: 'Sin definir',
          closest: 'Fecha más cercana',
          lastPayment: 'Último pago',
          noPayments: 'No hay pagos',
          lastInvoice: 'Fecha de la última factura',
          referredBy: 'Referido por',
          noRef: 'Sin referencia',
          opening: 'Alta: {{date}}'
        },
        contact: { call: 'Llamar', email: 'Email' },
        tables: {
          subscriptions: { title: 'Todas las suscripciones', desc: 'Vista completa de líneas, paquetes, billing y fechas del cliente.' },
          licenses: { title: 'Todas las licencias', desc: 'Detalle de licencias: app, tipo, vigencia y estado actual.' },
          managedAccounts: {
            title: 'Cuentas gestionadas',
            desc: 'Vista completa de aliases, provider, vigencia, estado y configuración de distribución.'
          },
          invoices: { title: 'Todas las facturas', desc: 'Historial completo de facturación en Lempiras con método y estado.' }
        },
        headers: {
          line: 'Línea',
          renewal: 'Renovación',
          method: 'Método',
          package: 'Paquete',
          status: 'Estado',
          start: 'Inicio',
          date: 'Fecha',
          total: 'Total',
          billing: 'Billing',
          mac: 'MAC',
          app: 'App',
          type: 'Tipo',
          expire: 'Expira',
          accountCode: 'Account',
          alias: 'Alias',
          provider: 'Provider',
          distribution: 'Distribución'
        },
        timeline: {
          title: 'Timeline 360 del cliente',
          subtitle: 'Cronología unificada con eventos comerciales y operativos del cliente seleccionado.',
          filters: {
            all: 'Todo',
            expirations: 'Vencimientos',
            payments: 'Pagos',
            activity: 'Actividad'
          },
          empty: {
            title: 'No hay eventos para este filtro',
            subtitle: 'Prueba cambiar el filtro o recargar datos para actualizar la cronología.'
          },
          actions: {
            resetFilter: 'Ver todo'
          },
          events: {
            customerOpened: {
              title: 'Cliente creado',
              subtitle: 'Fecha de alta del cliente'
            },
            subscriptionStart: { title: 'Suscripción iniciada' },
            subscriptionRenewal: { title: 'Renovación programada' },
            invoicePayment: { title: 'Movimiento de factura' },
            licenseCreated: { title: 'Licencia creada' },
            licenseExpiration: { title: 'Vencimiento de licencia' },
            managedAccountExpiration: { title: 'Vencimiento de managed account' },
            managedAccountEmail: { title: 'Último correo recibido' }
          }
        },
        modules: {
          title: 'Módulos detallados',
          subtitle: 'Abre submódulos dedicados con contexto, iconos y colores para identificar cada entidad.',
          subscriptions: 'Ver suscripciones',
          invoices: 'Ver facturación',
          licenses: 'Ver licencias',
          managedAccounts: 'Ver managed accounts'
        },
        detail: {
          subscription: 'Detalle de suscripción',
          managedAccount: 'Detalle de managed account',
          invoice: 'Detalle de factura',
          license: 'Detalle de licencia',
          helper: 'Visualización enriquecida con íconos y descripciones.',
          summary: {
            subscription: 'Resumen de la suscripción',
            managedAccount: 'Resumen de la cuenta gestionada',
            license: 'Resumen de la licencia',
            invoice: 'Resumen de la factura',
            subscriptionHelper: 'Visualiza línea, paquete, fechas y estado de pago automático de la suscripción seleccionada.',
            managedAccountHelper: 'Visualiza alias, proveedor, vigencia y reglas de distribución de la cuenta gestionada seleccionada.',
            licenseHelper: 'Información clave de la licencia: aplicación, tipo, ciclo, vigencia y propietario actual.',
            invoiceHelper: 'Monto pagado en Lps, método, banco y notas relevantes para la factura elegida.'
          }
        },
        subscription: {
          block: {
            line: { title: 'Línea y cobro', helper: 'Identificador de línea y montos asociados.' },
            dates: { title: 'Fechas y billing', helper: 'Ciclo actual y próxima renovación.' },
            status: { title: 'Estado y paquete', helper: 'Estado, paquete y pago automático.' }
          },
          line: 'Línea: {{line}}',
          user: 'Usuario: {{user}}',
          amount: 'Monto: {{amount}}',
          discount: 'Descuento: {{discount}}',
          start: 'Inicio: {{date}}',
          renewal: 'Renovación: {{date}}',
          billing: 'Billing: {{billing}}',
          package: 'Paquete: {{pkg}}',
          autoPay: 'Pago automático: {{val}}'
        },
        license: {
          block: {
            app: { title: 'Aplicación y plan', helper: 'Resumen de la licencia seleccionada.' },
            details: { title: 'Detalles de licencia', helper: 'Estado, fechas y propietario.' }
          },
          app: 'Aplicación: {{app}}',
          deviceKey: 'Device key: {{value}}',
          type: 'Tipo: {{type}}',
          price: 'Precio: {{price}}',
          period: 'Periodo: {{period}}',
          mac: 'MAC: {{mac}}',
          name: 'Nombre: {{name}}',
          paid: 'Pago: {{status}}',
          created: 'Creada: {{date}}',
          expires: 'Expira: {{date}}',
          ownerSince: 'Propietario desde: {{date}}'
        },
        invoice: {
          block: {
            amount: { title: 'Cobro y estado', helper: 'Importe total y método de pago.' },
            info: { title: 'Información de factura', helper: 'Servicio, paquete, banco y notas.' }
          },
          totalPaid: 'Total pagado: {{amount}}',
          discount: 'Descuento: {{discount}}',
          method: 'Método: {{method}}',
          status: 'Estado: {{status}}',
          date: 'Fecha: {{date}}',
          service: 'Servicio: {{service}}',
          package: 'Paquete: {{pkg}}',
          bank: 'Banco: {{bank}}',
          notes: 'Notas: {{notes}}',
          noNotes: 'Sin notas'
        },
        datasets: {
          customers: 'Clientes cargados: {{count}}',
          managedAccounts: 'Managed accounts: {{count}}',
          label: 'Datasets: {{state}}',
          loading: 'Cargando...',
          ready: 'Listos'
        },
        bulk: {
          selected: 'Seleccionados: {{count}}',
          visible: 'Visibles: {{count}}',
          selectVisible: 'Seleccionar visibles',
          unselectVisible: 'Deseleccionar visibles',
          clearSelection: 'Limpiar selección',
          copyIds: 'Copiar IDs',
          exportCsv: 'Exportar CSV',
          emptySelection: 'Selecciona al menos un registro.',
          copySuccess: 'IDs copiados al portapapeles.',
          copyFailed: 'No se pudo copiar al portapapeles.',
          emptyExport: 'No hay registros para exportar.',
          exportSuccess: 'Exportación completada ({{count}} registros).',
          id: 'ID'
        },
        errors: {
          load: 'No se pudo cargar la información.',
          banks: 'No se pudieron cargar los bancos.',
          services: 'No se pudieron cargar los servicios.',
          partialData: 'Algunas fuentes fallaron. Puedes reintentar para completar la vista 360.'
        },
        table: { detail: 'Detalle', empty: 'No hay datos', emptyHelp: 'No hay registros para este cliente en este módulo.' }
      },
      common: { close: 'Cerrar', yes: 'Sí', no: 'No' },
      sms: {
        title: 'Gestión de SMS',
        enqueue: 'Encolar SMS',
        history: 'Historial de SMS',
        chips: { ready: '{{count}} números listos', total: '{{count}} registros' },
        search: 'Buscar (teléfono, mensaje, external)',
        filters: { from: 'Desde', to: 'Hasta', status: 'Estado', all: 'Todos' },
        headers: { phone: 'Teléfono', message: 'Mensaje', status: 'Estado', scheduled: 'Programado', detail: 'Detalle' },
        table: { empty: 'No hay SMS registrados.', loading: 'Cargando...' },
        mobile: { scheduled: 'Programado', view: 'Ver detalle' },
        detail: {
          title: 'Detalle del SMS',
          phone: 'Teléfono',
          created: 'Creado',
          priority: 'Prioridad',
          message: 'Mensaje',
          scheduled: 'Programado',
          sent: 'Enviado',
          externalId: 'External Id',
          user: 'Usuario',
          source: 'Source',
          retries: 'Reintentos',
          failReason: 'Motivo de falla',
          none: 'Sin datos',
          close: 'Cerrar'
        },
        form: {
          numbers: 'Números destino',
          numbersPlaceholder: 'Ej: 51999999999, 51888888888',
          numbersHelper: 'Separa por coma cada número.',
          message: 'Mensaje',
          messagePlaceholder: 'Máx 160 caracteres',
          messageHelper: '{{count}}/{{max}} (sin acentos ni emojis)',
          schedule: 'Programar envío',
          priority: 'Prioridad',
          priorityHelper: '0 por defecto',
          externalId: 'External Id',
          sourceSystem: 'Source system',
          chips: {
            numbers: '{{count}} números',
            chars: '{{count}}/{{max}} chars',
            scheduled: 'Programado: {{value}}',
            immediate: 'Envío inmediato',
            cost: 'Costo estimado: {{cost}}'
          },
          actions: { clear: 'Limpiar', send: 'Encolar SMS', sending: 'Enviando...' }
        }
      }
    }
  }
};

const storedLng = typeof window !== 'undefined' ? localStorage.getItem('lng') : null;

i18n.use(initReactI18next).init({
  resources,
  lng: storedLng || 'es',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
