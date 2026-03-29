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
        docs: 'Documentation',
        security: 'Security',
        userAccess: 'Users & Access',
        userAccessCaption: 'Roles and permissions'
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
      businessPurchases: {
        title: 'Business Purchases',
        subtitle: 'Register business purchases and operational payments.',
        searchTitle: 'Search purchases',
        search: 'Search by code, item, provider, reference',
        loading: 'Loading purchases...',
        helper: 'Validate amounts and dates before saving.',
        tip: 'Purchase code, type, category, item and purchase date are required.',
        actions: {
          new: 'New purchase',
          edit: 'Edit purchase',
          create: 'Create',
          save: 'Save changes',
          saving: 'Saving...',
          delete: 'Delete',
          deleting: 'Deleting...',
          clear: 'Clear',
          cancel: 'Cancel'
        },
        badge: {
          new: 'New',
          edit: 'Edit'
        },
        summary: {
          total: '{{count}} purchases',
          paid: 'Paid: {{count}}',
          pending: 'Pending: {{count}} · Recurring: {{recurring}}',
          totalAmount: 'Total: L {{amount}}'
        },
        empty: {
          title: 'No purchases yet',
          description: 'Create your first purchase record to see it here.'
        },
        filters: {
          all: 'All',
          category: 'Category',
          type: 'Type',
          status: 'Status',
          clear: 'Clear',
          searchChip: 'Search: {{value}}',
          categoryChip: 'Category: {{value}}',
          typeChip: 'Type: {{value}}',
          statusChip: 'Status: {{value}}'
        },
        headers: {
          code: 'Code',
          item: 'Item',
          type: 'Type',
          category: 'Category',
          amount: 'Amount',
          date: 'Purchase date',
          method: 'Method',
          status: 'Status',
          actions: 'Actions'
        },
        labels: {
          paidAt: 'Paid',
          due: 'Due'
        },
        sections: {
          classification: 'Classification',
          classificationHelper: 'Identify the purchase and accounting context.',
          item: 'Item detail',
          itemHelper: 'Provider, item, quantities and description.',
          payment: 'Payment and dates',
          paymentHelper: 'Amounts, currency and payment evidence.',
          recurring: 'Recurrence',
          recurringHelper: 'Set whether this purchase repeats over time.'
        },
        form: {
          purchaseCode: 'Purchase code',
          purchaseType: 'Purchase type',
          category: 'Category',
          providerName: 'Provider name',
          itemName: 'Item name',
          description: 'Description',
          quantity: 'Quantity',
          unitCost: 'Unit cost',
          totalAmount: 'Total amount',
          currency: 'Currency',
          exchangeRate: 'Exchange rate',
          purchaseDate: 'Purchase date',
          dueDate: 'Due date',
          paidAt: 'Paid at',
          paymentMethod: 'Payment method',
          paymentReference: 'Payment reference',
          invoiceNumber: 'Invoice number',
          businessArea: 'Business area',
          status: 'Status',
          isRecurring: 'Recurring purchase',
          recurrenceType: 'Recurrence type',
          recurrenceHelper: 'Choose frequency when recurrence is enabled.',
          notes: 'Notes',
          none: 'None'
        },
        delete: {
          title: 'Delete purchase',
          body: 'Delete purchase {{id}}? This action cannot be undone.'
        },
        messages: {
          loadError: 'Could not load purchases.',
          required: 'Complete required fields.',
          created: 'Purchase created.',
          updated: 'Purchase updated.',
          saveError: 'Could not save purchase.',
          deleted: 'Purchase deleted.',
          deleteError: 'Could not delete purchase.'
        },
        enums: {
          purchaseType: {
            VIVO_PLAYER_CREDITS: 'Vivo Player Credits',
            IBO_PLAYER_CREDITS: 'Ibo Player Credits',
            SMART_ONE_CREDITS: 'Smart One Credits',
            PANEL_TITAN_CREDITS: 'Panel Titan Credits',
            LION_TV_CREDITS: 'Lion TV Credits',
            SHOPIFY_PAYMENT: 'Shopify Payment',
            BANRURAL_POS_PAYMENT: 'Banrural POS Payment',
            DOMAIN_PAYMENT: 'Domain Payment',
            DEMO_LICENSE_PAYMENT: 'Demo License Payment',
            HOUSE_MONTHLY_LICENSE: 'House Monthly License',
            OTHER: 'Other'
          },
          category: {
            CREDITS: 'Credits',
            PLATFORM_PAYMENT: 'Platform Payment',
            DOMAIN: 'Domain',
            LICENSE: 'License',
            POS: 'POS',
            OTHER: 'Other'
          },
          currency: {
            HNL: 'HNL',
            USD: 'USD',
            GTQ: 'GTQ',
            EUR: 'EUR'
          },
          paymentMethod: {
            CASH: 'Cash',
            BANK_TRANSFER: 'Bank transfer',
            CARD: 'Card',
            PAYPAL: 'PayPal',
            BANRURAL_POS: 'Banrural POS',
            SHOPIFY: 'Shopify',
            CRYPTO: 'Crypto',
            OTHER: 'Other'
          },
          businessArea: {
            IPTV: 'IPTV',
            WEB: 'Web',
            BILLING: 'Billing',
            MARKETING: 'Marketing',
            OPERATIONS: 'Operations',
            OTHER: 'Other'
          },
          status: {
            PENDING: 'Pending',
            PAID: 'Paid',
            PARTIAL: 'Partial',
            CANCELLED: 'Cancelled'
          },
          recurrence: {
            NONE: 'None',
            MONTHLY: 'Monthly',
            YEARLY: 'Yearly',
            WEEKLY: 'Weekly'
          }
        }
      },
      managedAccounts: {
        title: 'Managed Accounts Control Center',
        actions: {
          refresh: 'Refresh',
          newAccount: 'New',
          newProvider: 'New Provider',
          cancel: 'Cancel',
          saving: 'Saving...',
          saveProvider: 'Save Provider',
          saveAccount: 'Save Account',
          processing: 'Processing...',
          processInbound: 'Process inbound'
        },
        hero: {
          title: 'Operational tracking for accounts, expirations and mail distribution',
          subtitle: 'Unified panel to control providers, alias-based accounts, and inbound flow. Prioritize due/expiring accounts and failed events.',
          chips: {
            due7: 'Due in 7 days: {{count}}',
            expired: 'Expired: {{count}}',
            distributionOn: 'Distribution ON: {{count}}',
            inbound: 'Inbound events: {{count}}'
          }
        },
        tabs: {
          overview: 'Overview',
          accounts: 'Managed Accounts',
          providers: 'Providers',
          inbound: 'Inbound',
          reports: 'Reports'
        },
        metrics: {
          totalAccounts: 'Total Accounts',
          totalAccountsHelper: 'Registered accounts',
          active: 'Active',
          activeHelper: 'ACTIVE status',
          dueToday: 'Due Today',
          dueTodayHelper: 'Immediate action',
          expired: 'Expired',
          expiredHelper: 'Potential churn risk',
          inboundDistributed: 'Inbound Distributed',
          failedCount: 'Failed: {{count}}',
          inboundUnresolved: 'Inbound Unresolved',
          inboundUnresolvedHelper: 'Without resolved alias',
          dueIn30: 'Due in 30 Days',
          dueIn30Helper: 'Includes accounts due today',
          total: 'Total',
          distributed: 'Distributed',
          failed: 'Failed',
          unresolved: 'Unresolved',
          inboundTotal: 'Inbound Total',
          sent: 'Sent'
        },
        overview: {
          expiringTitle: 'Accounts with near expiration',
          expiringSubtitle: 'Next 30 days, sorted by criticality'
        },
        table: {
          id: 'ID',
          account: 'Account',
          accountName: 'Account',
          alias: 'Alias',
          provider: 'Provider',
          customer: 'Customer',
          expiration: 'Expiration',
          status: 'Status',
          distribution: 'Distribution',
          lastEmail: 'Last email',
          createdBy: 'Created by',
          actions: 'Actions'
        },
        statusValues: {
          ACTIVE: 'ACTIVE',
          INACTIVE: 'INACTIVE',
          SUSPENDED: 'SUSPENDED',
          EXPIRED: 'EXPIRED',
          PENDING: 'PENDING',
          CANCELLED: 'CANCELLED',
          RECEIVED: 'RECEIVED',
          ALIAS_RESOLVED: 'ALIAS_RESOLVED',
          ACCOUNT_MATCHED: 'ACCOUNT_MATCHED',
          PROCESSED: 'PROCESSED',
          DISTRIBUTED: 'DISTRIBUTED',
          FAILED: 'FAILED',
          IGNORED: 'IGNORED',
          SENT: 'SENT'
        },
        options: {
          all: 'All',
          on: 'ON',
          off: 'OFF',
          expired: 'Expired',
          dueToday: 'Due today',
          next7Days: 'Next 7 days',
          next30Days: 'Next 30 days',
          noDate: 'No date',
          unresolved: 'UNRESOLVED',
          unassigned: 'UNASSIGNED'
        },
        empty: {
          noExpiring: 'No accounts due within 30 days',
          noAccounts: 'No accounts for selected filters',
          noProviders: 'No providers for selected filters',
          noEvents: 'No events for selected filters',
          noData: 'No data'
        },
        expiration: {
          noDate: 'No date',
          expiredAgo: 'Expired {{days}}d ago',
          today: 'Due today',
          inDays: 'Due in {{days}}d'
        },
        filters: {
          searchAccount: 'Search account',
          expiration: 'Expiration',
          searchProvider: 'Search provider',
          searchEvent: 'Search event'
        },
        inbound: {
          processTitle: 'Process Inbound',
          processSubtitle: 'Manual process for tests or specific reprocessing',
          mailbox: 'Mailbox',
          rawMessageId: 'Raw Message ID',
          fromEmail: 'From Email',
          toEmail: 'To Email',
          subject: 'Subject',
          receivedAt: 'Received At',
          rawHeaders: 'Raw Headers',
          bodyPlain: 'Body Plain',
          received: 'Received',
          error: 'Error',
          retryMode: 'Retry Mode',
          retry: 'Retry'
        },
        reports: {
          byProvider: 'Inbound by Provider',
          byAlias: 'Inbound by Alias',
          inbound: 'Inbound'
        },
        provider: {
          newTitle: 'New Provider',
          editTitle: 'Edit Provider',
          subtitle: 'Define the provider that groups aliases and managed accounts.',
          code: 'Code',
          name: 'Name',
          description: 'Description'
        },
        account: {
          newTitle: 'New Managed Account',
          editTitle: 'Edit Managed Account',
          subtitle: 'Configure identity, expiration and alias distribution rules.',
          sectionIdentity: 'Identity and relationship',
          sectionOperation: 'Validity and operation',
          accountCode: 'Account Code',
          displayName: 'Display Name',
          aliasEmail: 'Alias Email',
          principalReference: 'Principal Reference',
          expirationDate: 'Expiration Date',
          renewalDate: 'Renewal Date',
          allowDistribution: 'Allow Distribution',
          notes: 'Notes'
        },
        messages: {
          loadModuleError: 'Could not load managed accounts module.',
          providerRequired: 'Code and Name are required.',
          providerSaved: 'Provider saved.',
          providerSaveError: 'Could not save provider.',
          providerStatusError: 'Could not change provider status.',
          accountRequired: 'Complete required fields.',
          accountSaved: 'Managed account saved.',
          accountSaveError: 'Could not save managed account.',
          accountStatusError: 'Could not change account status.',
          distributionUpdateError: 'Could not update distribution setting.',
          inboundRequired: 'mailboxAccount, rawMessageId, fromEmail and receivedAt are required.',
          inboundProcessed: 'Inbound event processed.',
          inboundProcessError: 'Could not process inbound event.',
          retryExecuted: 'Retry executed successfully.',
          retryError: 'Could not retry distribution.',
          processExecuted: 'Process executed'
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
      userAccess: {
        title: 'User Administration & Access',
        subtitle:
          'Create users and configure effective roles and permissions from a single panel. Signup keeps license/serial consistency with the current flow.',
        actions: {
          refresh: 'Refresh',
          newUser: 'New user',
          access: 'Access',
          status: 'Status',
          cancel: 'Cancel',
          createUser: 'Create user',
          saveAccess: 'Save access',
          confirm: 'Confirm'
        },
        filters: {
          all: 'All',
          active: 'Active',
          inactive: 'Inactive',
          search: 'Search by name or email',
          status: 'Status'
        },
        metrics: {
          usersInPage: 'Users in page',
          filteredTotal: 'Filtered total: {{count}}',
          active: 'Active',
          activeHelper: 'Enabled accounts',
          adminsInPage: 'Admins (page)',
          adminsHelper: 'Primary role contains ADMIN',
          noActiveLicense: 'No active license',
          noActiveLicenseHelper: 'They will not be able to sign in'
        },
        catalog: {
          loaded: 'Catalog loaded:',
          loading: 'loading...',
          ready: '{{roles}} role templates / {{permissions}} permissions'
        },
        listTitle: 'User list',
        table: {
          user: 'User',
          status: 'Status',
          primaryRole: 'Primary role',
          license: 'License',
          permissions: 'Permissions',
          actions: 'Actions',
          localProvider: 'LOCAL',
          createdAt: 'Created: {{value}}',
          expiresAt: 'Expires: {{value}}',
          noRole: 'NO_ROLE',
          morePermissions: '+{{count}} more',
          empty: 'There are no users for the current filters.'
        },
        status: {
          active: 'ACTIVE',
          inactive: 'INACTIVE'
        },
        license: {
          active: 'ACTIVE LICENSE',
          inactive: 'NO ACTIVE LICENSE'
        },
        tooltips: {
          editAccess: 'Edit roles and permissions',
          toggleStatus: 'Enable/Disable'
        },
        form: {
          name: 'Name',
          email: 'Email',
          tempPassword: 'Temporary password',
          serialCode: 'License serial',
          roles: 'Roles',
          extraPermissions: 'Extra permissions'
        },
        dialogs: {
          create: {
            title: 'New user',
            info: 'This signup uses the current serial/license flow, so the user will be ready to authenticate according to their license.'
          },
          access: {
            title: 'Configure access',
            user: 'User: {{name}} ({{email}})'
          },
          status: {
            title: 'Update user status',
            newStatus: 'New status: {{status}}'
          }
        },
        errors: {
          loadCatalog: 'Could not load access catalog.',
          loadUsers: 'Could not load user list.',
          createUser: 'Could not create user.',
          loadUserDetail: 'Could not load user detail.',
          updateAccess: 'Could not update access.',
          updateStatus: 'Could not update status.'
        },
        messages: {
          requiredFields: 'Complete name, email, password and serial.',
          userCreated: 'User created successfully.',
          accessUpdated: 'Access updated.',
          statusUpdated: 'User status updated.'
        },
        pagination: {
          rowsPerPage: 'Rows per page:'
        }
      },
      dashboardDefault: {
        states: {
          loading: 'Loading dashboard...',
          loadError: 'Could not load dashboard.',
          empty: 'There is not enough data to build KPI yet.',
          kpiSubtitle: 'Dashboard with real-time KPI and charts for the LionTV ecosystem.',
          partial: 'Partial data loaded for KPI.'
        },
        sections: {
          executive: 'Executive summary',
          financial: 'Financial KPI',
          operational: 'Operational & risk KPI'
        },
        labels: {
          customers: 'Customers',
          subscriptions: 'Subscriptions',
          invoices: 'Invoices',
          lines: 'Lines',
          licenses: 'Licenses',
          managedAccounts: 'Managed',
          paid: 'Paid',
          pending: 'Pending',
          overdue: 'Overdue'
        },
        series: {
          ok: 'OK',
          riskPending: 'Risk/Pending',
          income: 'Income',
          expenses: 'Expenses',
          records: 'Records',
          pipeline: 'Pipeline'
        },
        categories: {
          subsShort: 'Subs',
          invoices: 'Invoices',
          licenses: 'Licenses',
          commitments: 'Commitments',
          managedShort: 'Managed',
          overdue: 'Overdue',
          today: 'Today',
          oneToSevenDays: '1-7 days',
          eightToThirtyDays: '8-30 days',
          prospects: 'Prospects',
          customers: 'Customers',
          activeCustomers: 'Active Customers',
          activeSubscriptions: 'Active Subs',
          paidInvoices: 'Paid Invoices'
        },
        months: {
          jan: 'Jan',
          feb: 'Feb',
          mar: 'Mar',
          apr: 'Apr',
          may: 'May',
          jun: 'Jun',
          jul: 'Jul',
          aug: 'Aug',
          sep: 'Sep',
          oct: 'Oct',
          nov: 'Nov',
          dec: 'Dec'
        },
        provider: {
          noProvider: 'No provider'
        },
        kpis: {
          executive: {
            customerActive: { title: 'Active customers', helper: '{{total}} total' },
            subscriptionsActive: { title: 'Active subscriptions', helper: '{{total}} total' },
            netIncome: { title: 'Net income', helper: '{{paid}} paid · {{pending}} pending' },
            annualBalance: { title: 'Annual balance', helper: '{{expenses}} expenses' },
            pendingCommitments: { title: 'Pending commitments', helper: '{{total}} commitments' },
            managedActive: { title: 'Active managed', helper: '{{expiring}} expire in 30 days' }
          },
          financial: {
            collectionRate: { title: 'Collection rate', helper: '{{amount}} collected' },
            averageTicket: { title: 'Average ticket', helper: 'Based on {{paid}} paid invoices' },
            pendingAmount: { title: 'Amount pending', helper: '{{overdue}} overdue' },
            discountTotal: { title: 'Discount applied', helper: 'Billing accumulated' },
            cashMonth: { title: 'Current month cash', helper: 'Month purchases {{purchases}}' },
            recoveredCommitments: { title: 'Recovered commitments', helper: '{{paid}} paid' }
          },
          operational: {
            subsExpiring: { title: 'Subs expiring in 7 days', helper: '{{within30}} within 30 days' },
            autoPay: { title: 'Automatic charge', helper: '{{autoPay}}/{{total}} subscriptions' },
            licensesPaid: { title: 'Paid licenses', helper: '{{unpaid}} unpaid' },
            licensesAvailable: { title: 'Available licenses', helper: '{{assigned}} assigned' },
            linePlus: { title: 'Line Plus (LION_PLUS+)', helper: '{{expiring7}} expire in 7 days' },
            prospectConversion: { title: 'Prospect conversion', helper: '{{converted}}/{{total}} converted' }
          }
        },
        charts: {
          portfolio: { title: 'Portfolio by module', helper: 'Record volume by entity' },
          status: { title: 'Operational status by module', helper: 'Comparison between OK and risk/pending' },
          cashflow: { title: 'Monthly trend: income vs expenses', helper: 'Current year consolidated' },
          expiry: { title: 'Upcoming expirations', helper: '30-day risk buckets' },
          commitments: { title: 'Payment commitments', helper: 'Distribution by operational status' },
          providerMix: { title: 'Provider mix', helper: 'Top providers by line/sub volume' },
          funnel: { title: 'Commercial-operational funnel', helper: 'From prospect to collected billing' }
        },
        chips: {
          autoPay: 'Autopay: {{autoPay}}/{{total}}',
          managedActive: 'Managed active: {{active}}/{{total}}',
          prospectsConverted: 'Prospects converted: {{converted}}/{{total}}',
          recovered: 'Recovered: {{amount}}',
          pending: 'Pending: {{amount}}',
          linePlus: 'Line Plus: {{count}}',
          linesExpired: 'Expired lines: {{count}}',
          openProspects: 'Open prospects: {{count}}',
          inactiveCustomers: 'Inactive customers: {{count}}',
          expiredSubs: 'Expired subscriptions: {{count}}',
          expiringLicenses30d: 'Licenses expiring (30d): {{count}}'
        }
      },
      feedCrud: {
        actions: {
          refresh: 'Refresh',
          create: 'Create',
          edit: 'Edit',
          delete: 'Delete',
          saving: 'Saving...',
          saveChanges: 'Save changes',
          deleting: 'Deleting...'
        },
        searchPlaceholder: 'Search (id, payload, date, active)',
        table: {
          published: 'Published at',
          active: 'Active',
          payloadPreview: 'Payload preview',
          created: 'Created',
          updated: 'Updated',
          actions: 'Actions'
        },
        form: {
          payloadJson: 'Payload JSON',
          publishedAt: 'Published at',
          active: 'Active'
        },
        dialogs: {
          createTitle: 'New record',
          editTitle: 'Edit record',
          deleteTitle: 'Delete record',
          deleteBody: 'Delete record ID {{id}}? This action cannot be undone.'
        },
        validation: {
          payloadRequired: 'Payload JSON is required.',
          payloadInvalid: 'Payload JSON is not valid.'
        },
        errors: {
          load: 'Could not load records.',
          save: 'Could not save record.',
          delete: 'Could not delete record.'
        },
        pagination: {
          rowsPerPage: 'Rows per page:'
        }
      },
      feeds: {
        movies: {
          title: 'Movies Feed',
          create: 'New movie feed',
          empty: 'No movie feed records found.',
          created: 'Movie feed record created successfully.',
          updated: 'Movie feed record updated successfully.',
          deleted: 'Movie feed record deleted successfully.'
        },
        series: {
          title: 'Series Feed',
          create: 'New series feed',
          empty: 'No series feed records found.',
          created: 'Series feed record created successfully.',
          updated: 'Series feed record updated successfully.',
          deleted: 'Series feed record deleted successfully.'
        },
        futbol: {
          title: 'Futbol Events Feed',
          create: 'New futbol event',
          empty: 'No futbol event records found.',
          created: 'Futbol event record created successfully.',
          updated: 'Futbol event record updated successfully.',
          deleted: 'Futbol event record deleted successfully.'
        }
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
        docs: 'Documentación',
        security: 'Seguridad',
        userAccess: 'Usuarios y Accesos',
        userAccessCaption: 'Roles y permisos'
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
      businessPurchases: {
        title: 'Compras del negocio',
        subtitle: 'Registra compras del negocio y pagos operativos.',
        searchTitle: 'Buscar compras',
        search: 'Buscar por código, ítem, proveedor o referencia',
        loading: 'Cargando compras...',
        helper: 'Valida montos y fechas antes de guardar.',
        tip: 'Código, tipo, categoría, ítem y fecha de compra son requeridos.',
        actions: {
          new: 'Nueva compra',
          edit: 'Editar compra',
          create: 'Crear',
          save: 'Guardar cambios',
          saving: 'Guardando...',
          delete: 'Eliminar',
          deleting: 'Eliminando...',
          clear: 'Limpiar',
          cancel: 'Cancelar'
        },
        badge: {
          new: 'Nueva',
          edit: 'Edición'
        },
        summary: {
          total: '{{count}} compras',
          paid: 'Pagadas: {{count}}',
          pending: 'Pendientes: {{count}} · Recurrentes: {{recurring}}',
          totalAmount: 'Total: L {{amount}}'
        },
        empty: {
          title: 'No hay compras registradas',
          description: 'Crea tu primera compra para verla aquí.'
        },
        filters: {
          all: 'Todos',
          category: 'Categoría',
          type: 'Tipo',
          status: 'Estado',
          clear: 'Limpiar',
          searchChip: 'Búsqueda: {{value}}',
          categoryChip: 'Categoría: {{value}}',
          typeChip: 'Tipo: {{value}}',
          statusChip: 'Estado: {{value}}'
        },
        headers: {
          code: 'Código',
          item: 'Ítem',
          type: 'Tipo',
          category: 'Categoría',
          amount: 'Monto',
          date: 'Fecha compra',
          method: 'Método',
          status: 'Estado',
          actions: 'Acciones'
        },
        labels: {
          paidAt: 'Pagado',
          due: 'Vence'
        },
        sections: {
          classification: 'Clasificación',
          classificationHelper: 'Identifica la compra y su contexto contable.',
          item: 'Detalle del ítem',
          itemHelper: 'Proveedor, ítem, cantidades y descripción.',
          payment: 'Pago y fechas',
          paymentHelper: 'Montos, moneda y evidencia del pago.',
          recurring: 'Recurrencia',
          recurringHelper: 'Define si la compra se repite en el tiempo.'
        },
        form: {
          purchaseCode: 'Código de compra',
          purchaseType: 'Tipo de compra',
          category: 'Categoría',
          providerName: 'Proveedor',
          itemName: 'Nombre del ítem',
          description: 'Descripción',
          quantity: 'Cantidad',
          unitCost: 'Costo unitario',
          totalAmount: 'Monto total',
          currency: 'Moneda',
          exchangeRate: 'Tipo de cambio',
          purchaseDate: 'Fecha de compra',
          dueDate: 'Fecha de vencimiento',
          paidAt: 'Fecha de pago',
          paymentMethod: 'Método de pago',
          paymentReference: 'Referencia de pago',
          invoiceNumber: 'Número de factura',
          businessArea: 'Área del negocio',
          status: 'Estado',
          isRecurring: 'Compra recurrente',
          recurrenceType: 'Tipo de recurrencia',
          recurrenceHelper: 'Selecciona frecuencia cuando habilites recurrencia.',
          notes: 'Notas',
          none: 'Ninguno'
        },
        delete: {
          title: 'Eliminar compra',
          body: '¿Eliminar la compra {{id}}? Esta acción no se puede deshacer.'
        },
        messages: {
          loadError: 'No se pudieron cargar las compras.',
          required: 'Completa los campos requeridos.',
          created: 'Compra registrada.',
          updated: 'Compra actualizada.',
          saveError: 'No se pudo guardar la compra.',
          deleted: 'Compra eliminada.',
          deleteError: 'No se pudo eliminar la compra.'
        },
        enums: {
          purchaseType: {
            VIVO_PLAYER_CREDITS: 'Créditos Vivo Player',
            IBO_PLAYER_CREDITS: 'Créditos Ibo Player',
            SMART_ONE_CREDITS: 'Créditos Smart One',
            PANEL_TITAN_CREDITS: 'Créditos Panel Titan',
            LION_TV_CREDITS: 'Créditos Lion TV',
            SHOPIFY_PAYMENT: 'Pago Shopify',
            BANRURAL_POS_PAYMENT: 'Pago POS Banrural',
            DOMAIN_PAYMENT: 'Pago de dominio',
            DEMO_LICENSE_PAYMENT: 'Pago licencia demo',
            HOUSE_MONTHLY_LICENSE: 'Licencia mensual House',
            OTHER: 'Otro'
          },
          category: {
            CREDITS: 'Créditos',
            PLATFORM_PAYMENT: 'Pago de plataforma',
            DOMAIN: 'Dominio',
            LICENSE: 'Licencia',
            POS: 'POS',
            OTHER: 'Otro'
          },
          currency: {
            HNL: 'HNL',
            USD: 'USD',
            GTQ: 'GTQ',
            EUR: 'EUR'
          },
          paymentMethod: {
            CASH: 'Efectivo',
            BANK_TRANSFER: 'Transferencia bancaria',
            CARD: 'Tarjeta',
            PAYPAL: 'PayPal',
            BANRURAL_POS: 'POS Banrural',
            SHOPIFY: 'Shopify',
            CRYPTO: 'Cripto',
            OTHER: 'Otro'
          },
          businessArea: {
            IPTV: 'IPTV',
            WEB: 'Web',
            BILLING: 'Facturación',
            MARKETING: 'Marketing',
            OPERATIONS: 'Operaciones',
            OTHER: 'Otro'
          },
          status: {
            PENDING: 'Pendiente',
            PAID: 'Pagado',
            PARTIAL: 'Parcial',
            CANCELLED: 'Cancelado'
          },
          recurrence: {
            NONE: 'Ninguno',
            MONTHLY: 'Mensual',
            YEARLY: 'Anual',
            WEEKLY: 'Semanal'
          }
        }
      },
      managedAccounts: {
        title: 'Centro de control de cuentas gestionadas',
        actions: {
          refresh: 'Refrescar',
          newAccount: 'Nueva cuenta',
          newProvider: 'Nuevo proveedor',
          cancel: 'Cancelar',
          saving: 'Guardando...',
          saveProvider: 'Guardar proveedor',
          saveAccount: 'Guardar cuenta',
          processing: 'Procesando...',
          processInbound: 'Procesar entrada'
        },
        hero: {
          title: 'Monitoreo operativo de cuentas, vencimientos y distribución de correos',
          subtitle:
            'Panel unificado para controlar proveedores, cuentas por alias y flujo de entrada. Prioriza cuentas por vencer y eventos fallidos.',
          chips: {
            due7: 'Vencen en 7 días: {{count}}',
            expired: 'Vencidas: {{count}}',
            distributionOn: 'Distribución activa: {{count}}',
            inbound: 'Eventos de entrada: {{count}}'
          }
        },
        tabs: {
          overview: 'Resumen',
          accounts: 'Cuentas gestionadas',
          providers: 'Proveedores',
          inbound: 'Entradas',
          reports: 'Reportes'
        },
        metrics: {
          totalAccounts: 'Total de cuentas',
          totalAccountsHelper: 'Cuentas registradas',
          active: 'Activas',
          activeHelper: 'Estado ACTIVO',
          dueToday: 'Vencen hoy',
          dueTodayHelper: 'Acción inmediata',
          expired: 'Vencidas',
          expiredHelper: 'Riesgo potencial de pérdida',
          inboundDistributed: 'Entradas distribuidas',
          failedCount: 'Fallidos: {{count}}',
          inboundUnresolved: 'Entradas sin resolver',
          inboundUnresolvedHelper: 'Sin alias resuelto',
          dueIn30: 'Vencen en 30 días',
          dueIn30Helper: 'Incluye las que vencen hoy',
          total: 'Total',
          distributed: 'Distribuido',
          failed: 'Fallido',
          unresolved: 'Sin resolver',
          inboundTotal: 'Total entradas',
          sent: 'Enviado'
        },
        overview: {
          expiringTitle: 'Cuentas con vencimiento cercano',
          expiringSubtitle: 'Próximos 30 días, ordenadas por criticidad'
        },
        table: {
          id: 'ID',
          account: 'Cuenta',
          accountName: 'Cuenta',
          alias: 'Alias',
          provider: 'Proveedor',
          customer: 'Cliente',
          expiration: 'Vencimiento',
          status: 'Estado',
          distribution: 'Distribución',
          lastEmail: 'Último correo',
          createdBy: 'Creado por',
          actions: 'Acciones'
        },
        statusValues: {
          ACTIVE: 'ACTIVE',
          INACTIVE: 'INACTIVE',
          SUSPENDED: 'SUSPENDED',
          EXPIRED: 'EXPIRED',
          PENDING: 'PENDING',
          CANCELLED: 'CANCELLED',
          RECEIVED: 'RECEIVED',
          ALIAS_RESOLVED: 'ALIAS_RESOLVED',
          ACCOUNT_MATCHED: 'ACCOUNT_MATCHED',
          PROCESSED: 'PROCESSED',
          DISTRIBUTED: 'DISTRIBUTED',
          FAILED: 'FAILED',
          IGNORED: 'IGNORED',
          SENT: 'SENT'
        },
        options: {
          all: 'Todos',
          on: 'ON',
          off: 'OFF',
          expired: 'Vencidas',
          dueToday: 'Vence hoy',
          next7Days: 'Próx. 7 días',
          next30Days: 'Próx. 30 días',
          noDate: 'Sin fecha',
          unresolved: 'SIN_RESOLVER',
          unassigned: 'SIN_ASIGNAR'
        },
        empty: {
          noExpiring: 'Sin cuentas por vencer en 30 días',
          noAccounts: 'Sin cuentas para los filtros seleccionados',
          noProviders: 'Sin proveedores para los filtros seleccionados',
          noEvents: 'Sin eventos para los filtros seleccionados',
          noData: 'Sin datos'
        },
        expiration: {
          noDate: 'Sin fecha',
          expiredAgo: 'Vencida hace {{days}}d',
          today: 'Vence hoy',
          inDays: 'Vence en {{days}}d'
        },
        filters: {
          searchAccount: 'Buscar cuenta',
          expiration: 'Vencimiento',
          searchProvider: 'Buscar proveedor',
          searchEvent: 'Buscar evento'
        },
        inbound: {
          processTitle: 'Procesar entrada',
          processSubtitle: 'Proceso manual para pruebas o reprocesos puntuales',
          mailbox: 'Bandeja',
          rawMessageId: 'ID de mensaje bruto',
          fromEmail: 'Correo origen',
          toEmail: 'Correo destino',
          subject: 'Asunto',
          receivedAt: 'Recibido en',
          rawHeaders: 'Encabezados originales',
          bodyPlain: 'Cuerpo en texto',
          received: 'Recibido',
          error: 'Error',
          retryMode: 'Modo de reintento',
          retry: 'Reintentar'
        },
        reports: {
          byProvider: 'Entradas por proveedor',
          byAlias: 'Entradas por alias',
          inbound: 'Entradas'
        },
        provider: {
          newTitle: 'Nuevo proveedor',
          editTitle: 'Editar proveedor',
          subtitle: 'Define el proveedor que agrupa alias y cuentas gestionadas.',
          code: 'Código',
          name: 'Nombre',
          description: 'Descripción'
        },
        account: {
          newTitle: 'Nueva cuenta gestionada',
          editTitle: 'Editar cuenta gestionada',
          subtitle: 'Configura identidad, vencimiento y reglas de distribución del alias.',
          sectionIdentity: 'Identidad y relación',
          sectionOperation: 'Vigencia y operación',
          accountCode: 'Código de cuenta',
          displayName: 'Nombre visible',
          aliasEmail: 'Correo alias',
          principalReference: 'Referencia principal',
          expirationDate: 'Fecha de vencimiento',
          renewalDate: 'Fecha de renovación',
          allowDistribution: 'Permitir distribución',
          notes: 'Notas'
        },
        messages: {
          loadModuleError: 'No se pudo cargar el módulo de cuentas gestionadas.',
          providerRequired: 'Código y nombre son requeridos.',
          providerSaved: 'Proveedor guardado.',
          providerSaveError: 'No se pudo guardar el proveedor.',
          providerStatusError: 'No se pudo cambiar el estado del proveedor.',
          accountRequired: 'Completa campos obligatorios.',
          accountSaved: 'Cuenta gestionada guardada.',
          accountSaveError: 'No se pudo guardar la cuenta gestionada.',
          accountStatusError: 'No se pudo cambiar el estado de la cuenta.',
          distributionUpdateError: 'No se pudo cambiar la configuración de distribución.',
          inboundRequired: 'mailboxAccount, rawMessageId, fromEmail y receivedAt son obligatorios.',
          inboundProcessed: 'Entrada procesada.',
          inboundProcessError: 'No se pudo procesar la entrada.',
          retryExecuted: 'Reintento ejecutado correctamente.',
          retryError: 'No se pudo reintentar la distribución.',
          processExecuted: 'Proceso ejecutado'
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
      userAccess: {
        title: 'Administración de Usuarios y Accesos',
        subtitle:
          'Configura altas de usuarios, roles y permisos efectivos desde un solo panel. El alta usa serial/licencia para mantener coherencia con el flujo actual.',
        actions: {
          refresh: 'Refrescar',
          newUser: 'Nuevo usuario',
          access: 'Accesos',
          status: 'Estado',
          cancel: 'Cancelar',
          createUser: 'Crear usuario',
          saveAccess: 'Guardar accesos',
          confirm: 'Confirmar'
        },
        filters: {
          all: 'Todos',
          active: 'Activos',
          inactive: 'Inactivos',
          search: 'Buscar por nombre o email',
          status: 'Estado'
        },
        metrics: {
          usersInPage: 'Usuarios en página',
          filteredTotal: 'Total filtrado: {{count}}',
          active: 'Activos',
          activeHelper: 'Cuentas habilitadas',
          adminsInPage: 'Admins (página)',
          adminsHelper: 'Rol principal con ADMIN',
          noActiveLicense: 'Sin licencia activa',
          noActiveLicenseHelper: 'No podrán iniciar sesión'
        },
        catalog: {
          loaded: 'Catálogo cargado:',
          loading: 'cargando...',
          ready: '{{roles}} roles plantilla / {{permissions}} permisos'
        },
        listTitle: 'Listado de Usuarios',
        table: {
          user: 'Usuario',
          status: 'Estado',
          primaryRole: 'Rol Principal',
          license: 'Licencia',
          permissions: 'Permisos',
          actions: 'Acciones',
          localProvider: 'LOCAL',
          createdAt: 'Alta: {{value}}',
          expiresAt: 'Expira: {{value}}',
          noRole: 'SIN_ROL',
          morePermissions: '+{{count}} más',
          empty: 'No hay usuarios para los filtros actuales.'
        },
        status: {
          active: 'ACTIVO',
          inactive: 'INACTIVO'
        },
        license: {
          active: 'LICENCIA ACTIVA',
          inactive: 'SIN LICENCIA ACTIVA'
        },
        tooltips: {
          editAccess: 'Editar roles y permisos',
          toggleStatus: 'Activar/Inactivar'
        },
        form: {
          name: 'Nombre',
          email: 'Email',
          tempPassword: 'Password temporal',
          serialCode: 'Serial de licencia',
          roles: 'Roles',
          extraPermissions: 'Permisos extra'
        },
        dialogs: {
          create: {
            title: 'Nuevo Usuario',
            info: 'Este alta usa el flujo actual con serial/licencia, por lo tanto el usuario quedará listo para autenticarse según su licencia.'
          },
          access: {
            title: 'Configurar Accesos',
            user: 'Usuario: {{name}} ({{email}})'
          },
          status: {
            title: 'Actualizar Estado del Usuario',
            newStatus: 'Nuevo estado: {{status}}'
          }
        },
        errors: {
          loadCatalog: 'No se pudo cargar el catálogo de acceso.',
          loadUsers: 'No se pudo cargar el listado de usuarios.',
          createUser: 'No se pudo crear el usuario.',
          loadUserDetail: 'No se pudo cargar el detalle del usuario.',
          updateAccess: 'No se pudo actualizar los accesos.',
          updateStatus: 'No se pudo actualizar el estado.'
        },
        messages: {
          requiredFields: 'Completa nombre, email, password y serial.',
          userCreated: 'Usuario creado correctamente.',
          accessUpdated: 'Accesos actualizados.',
          statusUpdated: 'Estado de usuario actualizado.'
        },
        pagination: {
          rowsPerPage: 'Filas por página:'
        }
      },
      dashboardDefault: {
        states: {
          loading: 'Cargando dashboard...',
          loadError: 'No se pudo cargar el dashboard.',
          empty: 'No hay información para construir los KPI todavía.',
          kpiSubtitle: 'Dashboard con KPI y gráficos en tiempo real del ecosistema LionTV.',
          partial: 'Se cargaron datos parciales para los KPI.'
        },
        sections: {
          executive: 'Resumen ejecutivo',
          financial: 'KPIs financieros',
          operational: 'KPIs operativos y riesgo'
        },
        labels: {
          customers: 'Clientes',
          subscriptions: 'Suscripciones',
          invoices: 'Facturas',
          lines: 'Líneas',
          licenses: 'Licencias',
          managedAccounts: 'Managed',
          paid: 'Pagados',
          pending: 'Pendientes',
          overdue: 'Vencidos'
        },
        series: {
          ok: 'OK',
          riskPending: 'Riesgo/Pendiente',
          income: 'Ingresos',
          expenses: 'Gastos',
          records: 'Registros',
          pipeline: 'Pipeline'
        },
        categories: {
          subsShort: 'Subs',
          invoices: 'Facturas',
          licenses: 'Licencias',
          commitments: 'Compromisos',
          managedShort: 'Managed',
          overdue: 'Vencidos',
          today: 'Hoy',
          oneToSevenDays: '1-7 días',
          eightToThirtyDays: '8-30 días',
          prospects: 'Prospectos',
          customers: 'Clientes',
          activeCustomers: 'Clientes Activos',
          activeSubscriptions: 'Subs Activas',
          paidInvoices: 'Facturas Pagadas'
        },
        months: {
          jan: 'Ene',
          feb: 'Feb',
          mar: 'Mar',
          apr: 'Abr',
          may: 'May',
          jun: 'Jun',
          jul: 'Jul',
          aug: 'Ago',
          sep: 'Sep',
          oct: 'Oct',
          nov: 'Nov',
          dec: 'Dic'
        },
        provider: {
          noProvider: 'Sin proveedor'
        },
        kpis: {
          executive: {
            customerActive: { title: 'Clientes activos', helper: '{{total}} total' },
            subscriptionsActive: { title: 'Subs activas', helper: '{{total}} total' },
            netIncome: { title: 'Ingreso neto', helper: '{{paid}} pagadas · {{pending}} pendientes' },
            annualBalance: { title: 'Balance anual', helper: '{{expenses}} gastos' },
            pendingCommitments: { title: 'Compromisos pendientes', helper: '{{total}} compromisos' },
            managedActive: { title: 'Managed activas', helper: '{{expiring}} vencen en 30 días' }
          },
          financial: {
            collectionRate: { title: 'Tasa de cobranza', helper: '{{amount}} cobrado' },
            averageTicket: { title: 'Ticket promedio', helper: 'sobre {{paid}} facturas pagadas' },
            pendingAmount: { title: 'Monto por cobrar', helper: '{{overdue}} vencidas' },
            discountTotal: { title: 'Descuento aplicado', helper: 'acumulado de facturación' },
            cashMonth: { title: 'Caja mes actual', helper: 'compras mes {{purchases}}' },
            recoveredCommitments: { title: 'Recuperado compromisos', helper: '{{paid}} pagados' }
          },
          operational: {
            subsExpiring: { title: 'Subs vencen 7 días', helper: '{{within30}} dentro de 30 días' },
            autoPay: { title: 'Cobro automático', helper: '{{autoPay}}/{{total}} suscripciones' },
            licensesPaid: { title: 'Licencias pagadas', helper: '{{unpaid}} sin pago' },
            licensesAvailable: { title: 'Licencias disponibles', helper: '{{assigned}} asignadas' },
            linePlus: { title: 'Line Plus (LION_PLUS+)', helper: '{{expiring7}} vencen en 7 días' },
            prospectConversion: { title: 'Conversión prospectos', helper: '{{converted}}/{{total}} convertidos' }
          }
        },
        charts: {
          portfolio: { title: 'Portafolio por módulo', helper: 'Volumen de registros por entidad' },
          status: { title: 'Estado operativo por módulo', helper: 'Comparativo entre OK y riesgo/pendiente' },
          cashflow: { title: 'Tendencia mensual: ingresos vs gastos', helper: 'Año actual consolidado' },
          expiry: { title: 'Vencimientos próximos', helper: 'Buckets de riesgo de 30 días' },
          commitments: { title: 'Compromisos de pago', helper: 'Distribución por estado operativo' },
          providerMix: { title: 'Mix por proveedor', helper: 'Top proveedores por volumen de líneas/subs' },
          funnel: { title: 'Embudo comercial-operativo', helper: 'Del prospecto hasta facturación cobrada' }
        },
        chips: {
          autoPay: 'Autopay: {{autoPay}}/{{total}}',
          managedActive: 'Managed activos: {{active}}/{{total}}',
          prospectsConverted: 'Prospectos convertidos: {{converted}}/{{total}}',
          recovered: 'Recuperado: {{amount}}',
          pending: 'Pendiente: {{amount}}',
          linePlus: 'Line Plus: {{count}}',
          linesExpired: 'Líneas vencidas: {{count}}',
          openProspects: 'Prospectos abiertos: {{count}}',
          inactiveCustomers: 'Clientes inactivos: {{count}}',
          expiredSubs: 'Subs expiradas: {{count}}',
          expiringLicenses30d: 'Licencias por vencer (30d): {{count}}'
        }
      },
      feedCrud: {
        actions: {
          refresh: 'Refrescar',
          create: 'Crear',
          edit: 'Editar',
          delete: 'Eliminar',
          saving: 'Guardando...',
          saveChanges: 'Guardar cambios',
          deleting: 'Eliminando...'
        },
        searchPlaceholder: 'Buscar (id, payload, fecha, activo)',
        table: {
          published: 'Publicado',
          active: 'Activo',
          payloadPreview: 'Vista de payload',
          created: 'Creado',
          updated: 'Actualizado',
          actions: 'Acciones'
        },
        form: {
          payloadJson: 'Payload JSON',
          publishedAt: 'Fecha publicación',
          active: 'Activo'
        },
        dialogs: {
          createTitle: 'Nuevo registro',
          editTitle: 'Editar registro',
          deleteTitle: 'Eliminar registro',
          deleteBody: '¿Eliminar el registro ID {{id}}? Esta acción no se puede deshacer.'
        },
        validation: {
          payloadRequired: 'El payload JSON es requerido.',
          payloadInvalid: 'El payload JSON no es válido.'
        },
        errors: {
          load: 'No se pudo cargar los registros.',
          save: 'No se pudo guardar el registro.',
          delete: 'No se pudo eliminar el registro.'
        },
        pagination: {
          rowsPerPage: 'Filas por página:'
        }
      },
      feeds: {
        movies: {
          title: 'Feed de Películas',
          create: 'Nuevo feed de películas',
          empty: 'No hay registros en el feed de películas.',
          created: 'Registro de feed de películas creado correctamente.',
          updated: 'Registro de feed de películas actualizado correctamente.',
          deleted: 'Registro de feed de películas eliminado correctamente.'
        },
        series: {
          title: 'Feed de Series',
          create: 'Nuevo feed de series',
          empty: 'No hay registros en el feed de series.',
          created: 'Registro de feed de series creado correctamente.',
          updated: 'Registro de feed de series actualizado correctamente.',
          deleted: 'Registro de feed de series eliminado correctamente.'
        },
        futbol: {
          title: 'Feed de Eventos de Fútbol',
          create: 'Nuevo evento de fútbol',
          empty: 'No hay registros en el feed de fútbol.',
          created: 'Registro de evento de fútbol creado correctamente.',
          updated: 'Registro de evento de fútbol actualizado correctamente.',
          deleted: 'Registro de evento de fútbol eliminado correctamente.'
        }
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

const missingWordDictionary = {
  es: {
    active: 'activo',
    inactive: 'inactivo',
    cancelled: 'cancelado',
    pending: 'pendiente',
    paid: 'pagado',
    overdue: 'vencido',
    loading: 'cargando',
    empty: 'vacío',
    error: 'error',
    title: 'título',
    subtitle: 'subtítulo',
    helper: 'ayuda',
    form: 'formulario',
    table: 'tabla',
    actions: 'acciones',
    action: 'acción',
    create: 'crear',
    created: 'creado',
    new: 'nuevo',
    edit: 'editar',
    update: 'actualizar',
    updated: 'actualizado',
    delete: 'eliminar',
    deleting: 'eliminando',
    save: 'guardar',
    saving: 'guardando',
    clear: 'limpiar',
    close: 'cerrar',
    cancel: 'cancelar',
    refresh: 'refrescar',
    status: 'estado',
    search: 'buscar',
    filters: 'filtros',
    filter: 'filtro',
    rows: 'filas',
    row: 'fila',
    page: 'página',
    detail: 'detalle',
    details: 'detalles',
    summary: 'resumen',
    amount: 'monto',
    total: 'total',
    count: 'cantidad',
    customer: 'cliente',
    customers: 'clientes',
    provider: 'proveedor',
    providers: 'proveedores',
    subscription: 'suscripción',
    subscriptions: 'suscripciones',
    invoice: 'factura',
    invoices: 'facturas',
    license: 'licencia',
    licenses: 'licencias',
    line: 'línea',
    lines: 'líneas',
    payment: 'pago',
    commitments: 'compromisos',
    notifications: 'notificaciones',
    send: 'enviar',
    sending: 'enviando',
    email: 'correo',
    whatsapp: 'whatsapp',
    id: 'id'
  }
};

const interpolationCandidateKeys = new Set([
  'count',
  'val',
  'value',
  'total',
  'amount',
  'paid',
  'pending',
  'overdue',
  'active',
  'inactive',
  'id',
  'name',
  'status',
  'date',
  'days',
  'rows',
  'user',
  'email',
  'line',
  'provider',
  'expiring',
  'within30',
  'converted',
  'autoPay',
  'unpaid',
  'assigned',
  'expiring7',
  'purchases',
  'expenses'
]);

const shouldHumanizeMissingKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  if (key.includes('/')) return false;
  if (key.startsWith('http')) return false;
  if (key.startsWith('views/')) return false;
  if (key === 'react-apexcharts' || key === 'web-vitals') return false;
  return true;
};

const humanizeLeaf = (leaf, language) => {
  const tokens = leaf
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const mapped = tokens.map((token) => {
    if (language?.startsWith('es')) {
      return missingWordDictionary.es[token] || token;
    }
    return token;
  });

  const sentence = mapped.join(' ').trim();
  if (!sentence) return leaf;
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

const missingKeyFallback = (key, language, options) => {
  if (!shouldHumanizeMissingKey(key)) return key;

  const leaf = key.split('.').pop() || key;
  let label = humanizeLeaf(leaf, language);

  if (options && typeof options === 'object') {
    const interpolationKeys = Object.keys(options).filter((optKey) => interpolationCandidateKeys.has(optKey));
    if (interpolationKeys.length > 0) {
      const placeholders = interpolationKeys.map((optKey) => `{{${optKey}}}`).join(' · ');
      label = `${label}: ${placeholders}`;
    }
  }

  return label;
};

const storedLng = typeof window !== 'undefined' ? localStorage.getItem('lng') : null;

i18n.use(initReactI18next).init({
  resources,
  lng: storedLng || 'es',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  parseMissingKeyHandler: (key, _defaultValue, options) =>
    missingKeyFallback(key, options?.lng || i18n.language || storedLng || 'es', options),
  returnNull: false,
  returnEmptyString: false
});

export default i18n;
