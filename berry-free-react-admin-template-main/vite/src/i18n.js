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
        liontvOverview: 'Overview',
        liontvOverviewCaption: 'Daily control and priorities',
        liontvCommercial: 'Customers & Sales',
        liontvCommercialCaption: 'CRM, collections and commercial relationship',
        liontvOperations: 'Technical Operations',
        liontvOperationsCaption: 'Inventory, lines and accounts',
        liontvContent: 'Content & Feed',
        liontvContentCaption: 'Demos and visible catalog',
        demos: 'Lion TV Demos',
        subscriptions: 'Subscriptions',
        invoices: 'Invoices',
        businessPurchases: 'Business Purchases',
        customers: 'Customers',
        potentialCustomers: 'Potential Customers',
        paymentCommitments: 'Payment Commitments',
        crm: 'Customer CRM',
        lines: 'Lines',
        plusLines: 'Plus Lines',
        subscriptionSharing: 'Shared Subscriptions',
        licenses: 'Licenses',
        managedAccounts: 'Managed Accounts',
        moviesFeed: 'Movies Feed',
        seriesFeed: 'Series Feed',
        futbolEventsFeed: 'Futbol Events Feed',
        catalogCuration: 'Catalog Curation',
        sample: 'Sample Page',
        docs: 'Documentation',
        security: 'Security',
        userAccess: 'Users & Access',
        userAccessCaption: 'Roles and permissions',
        panelAuths: 'Panel Integrations',
        panelAuthsCaption: 'Vivo/9xtream credentials by user'
      },
      auth: {
        hi: 'Hi, Welcome Back',
        enterCredentials: 'Enter your credentials to continue',
        logoAriaLabel: 'Application logo',
        signIn: 'Sign In',
        email: 'Email Address',
        password: 'Password',
        togglePasswordVisibility: 'Toggle password visibility',
        keepLogged: 'Keep me logged in',
        forgot: 'Forgot Password?',
        noAccount: "Don't have an account?",
        otpTitle: 'Two-step verification',
        otpInstruction: 'Enter the code we sent to {{dest}}.',
        otpDestinationFallback: 'your device',
        codeLabel: 'Verification code',
        resend: 'Resend code',
        otpResendError: "We couldn't resend the code.",
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
        registerBtn: 'Create account',
        registerSuccess: 'User registered successfully.',
        registerFailed: 'Registration failed.',
        registerUnexpectedError: 'Unexpected error while registering.',
        passwordStrengthLevels: {
          poor: 'Poor',
          weak: 'Weak',
          normal: 'Normal',
          good: 'Good',
          strong: 'Strong'
        },
        googleLogin: {
          failed: 'Could not sign in with Google.',
          unexpectedError: 'Unexpected error while signing in with Google.'
        },
        forgotErrors: {
          sendEmail: 'We could not send the email, please try again later.',
          resetPassword: 'Could not update the password.'
        }
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
        delete: 'Delete',
        clear: 'Clear',
        create: 'Create',
        save: 'Save changes',
        saving: 'Saving...',
        deleting: 'Deleting...',
        sending: 'Sending...',
        cancel: 'Cancel',
        whatsapp: 'WhatsApp'
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
        filters: {
          status: 'Status',
          all: 'All',
          activeLineExpired: 'Active line expired'
        },
        kpi: {
          activeStatus: 'STATUS: ACTIVE {{count}}',
          sharedStatus: 'SHARED {{count}}',
          activeLineExpired: 'ACTIVE LINE EXPIRED {{count}}'
        },
        labels: {
          packageFallback: 'Package {{id}}',
          providerFallback: 'LION_TV',
          activeLineExpiredChip: 'Line active / expired date'
        },
        empty: 'No subscriptions found.',
        sharing: {
          host: 'HOST',
          shared: 'SHARED',
          none: 'Not shared'
        },
        messages: {
          packagesLoadError: 'Could not load packages.',
          linesLoadError: 'Could not load lines.',
          customersLoadError: 'Could not load customers.',
          loadError: 'Could not load subscriptions.',
          customerEmailError: 'Could not fetch customer email.',
          invalidCustomerEmail: 'Update a valid customer email before sending notification.',
          expirationSent: 'Expiration notification sent.',
          reengageSent: 'Reengagement email sent.',
          renewalSent: 'Renewal notification sent.',
          notificationError: 'Could not send notification.',
          required: 'Complete required fields.',
          created: 'Subscription created successfully.',
          updated: 'Subscription updated successfully.',
          deleted: 'Subscription deleted successfully.',
          saveError: 'Could not save subscription.',
          deleteError: 'Could not delete subscription.'
        },
        form: {
          autopayLinkPlaceholder: 'https://...'
        },
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
      subscriptionSharing: {
        title: 'Shared subscriptions monitoring',
        subtitle: 'Visual monitoring based on subscriptions that reuse the same line_id across different customers.',
        kpi: {
          totalSubscriptions: 'Total subscriptions',
          activeSubscriptions: 'Active',
          sharedClusters: 'Shared clusters',
          hosts: 'Hosts',
          sharedSubscriptions: 'Shared subscriptions',
          eligibleSubscriptions: 'Eligible'
        },
        filters: {
          searchPlaceholder: 'Search by subscription, customer, line, status',
          status: 'Sharing role',
          eligible: 'Eligible',
          options: {
            all: 'All',
            host: 'Host',
            shared: 'Shared',
            none: 'None'
          },
          eligibleOptions: {
            all: 'All',
            yes: 'Yes',
            no: 'No'
          }
        },
        sections: {
          sharedClusters: 'Shared clusters (host + beneficiaries)',
          noSharedClusters: 'No shared clusters found with current filters.',
          eligibleNotShared: 'Eligible and not shared',
          noEligible: 'No eligible subscriptions pending share.'
        },
        role: {
          host: 'HOST',
          shared: 'SHARED',
          none: 'NONE'
        },
        card: {
          hostSubscription: 'Host subscription',
          eligible: 'Eligible',
          notEligible: 'Not eligible',
          clusterSize: 'Cluster: {{count}}',
          line: 'Line',
          renewal: 'Renewal',
          capacity: 'Capacity {{activated}} · Usage {{used}} · Available {{available}}',
          term: 'Term {{months}} months',
          status: 'Status',
          beneficiaries: 'Beneficiaries',
          noBeneficiaries: 'No SHARED subscriptions linked to this host.'
        },
        errors: {
          loadError: 'Could not load shared overview.'
        }
      },
      licenses: {
        title: 'Licenses',
        search: 'Search (MAC, device key, customer, subscription, status)',
        actions: {
          server: 'Change server',
          transfer: 'Transfer',
          history: 'History',
          removePlaylists: 'Remove all playlists'
        },
        filters: { status: 'Status', payment: 'Payment', all: 'All' },
        paid: { paid: 'Paid', pending: 'Pending' },
        messages: {
          subscriptionsLoadError: 'Could not load subscriptions.',
          linesLoadError: 'Could not load lines.',
          serversLoadError: 'Could not load servers.',
          loadError: 'Could not load licenses.',
          customersLoadError: 'Could not load customers.',
          required: 'Complete required fields.',
          invalidMac: 'Invalid MAC format. Use AA:BB:CC:DD:EE:FF.',
          created: 'License created.',
          updated: 'License updated.',
          deleted: 'License deleted.',
          saveError: 'Could not save license.',
          deleteError: 'Could not delete license.'
        },
        headers: {
          id: 'ID',
          mac: 'MAC',
          deviceKey: 'Device key',
          name: 'Name',
          customer: 'Customer',
          subscription: 'Subscription',
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
          mac: 'Mac Address',
          macPlaceholder: 'AA:BB:CC:DD:EE:FF',
          macHelper: 'Format: AA:BB:CC:DD:EE:FF',
          deviceKey: 'Device key',
          deviceKeyHelper: 'Optional key for this device',
          subscription: 'Subscription',
          subscriptionNone: 'No related subscription',
          subscriptionSelectCustomer: 'Select a customer first.',
          subscriptionHelper: 'Optional relation to one customer subscription.',
          subscriptionEmpty: 'This customer has no subscriptions available.',
          paid: 'Payment status',
          paidHelper: 'Track if this license was already paid'
        },
        server: {
          updated: 'Server updated.',
          error: 'Could not change server.',
          removeTitle: 'Remove all playlists',
          removeBody: 'This will remove every playlist from this device.',
          removeSubmit: 'Remove playlists',
          removeSuccess: 'All playlists removed from device.',
          removeError: 'Could not remove playlists from device.',
          removeRequired: 'Device MAC is required.',
          removeNotAvailable: 'This action is not available yet in backend.'
        },
        transfer: {
          error: 'Could not transfer license.'
        }
      },
      demos: {
        title: 'Lion TV demos',
        listTitle: 'Demo list',
        search: 'Search (phone, user, package, app)',
        headers: {
          phone: 'Phone',
          email: 'Email',
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
        form: {
          macAddress: 'MAC Address',
          macPlaceholder: 'aa:bb:cc:dd:ee:ff'
        },
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
      plusLines: {
        title: 'Plus Lines Explorer',
        cards: {
          countries: 'Countries with plus lines',
          lines: 'Plus lines',
          activeSubs: 'Active subscriptions',
          unusedLines: 'Unused plus lines',
          inactiveSubs: 'Inactive subscriptions'
        },
        mapTitle: 'Country map',
        pickCountry: 'Pick a country',
        searchLine: 'Search plus line or owner in this country',
        searchLineHelper: 'Filter plus line cards in this country',
        emptyCountry: 'Select a country to view plus lines',
        emptyLines: 'No plus lines in this country',
        usageSummary: 'Active usage: {{active}} · Unused: {{idle}} · Total plus lines: {{total}}',
        unusedTitle: 'Plus lines without active usage',
        unusedSubtitle: 'These lines are created but have no active subscriptions. They can be reused immediately.',
        max: 'Max connections',
        exp: 'Exp',
        unusedChip: 'Ready to reuse',
        noActiveSubscriptions: 'No associated active subscriptions.',
        onlyInactiveSubscriptions: 'It has {{count}} subscription(s) in total, but none active.',
        seeLess: 'Show less',
        seeMore: 'Show more ({{count}})',
        countryItemSummary: '{{lines}} lines · {{active}} active subs · {{unused}} unused lines',
        status: {
          pending: 'Pending',
          cancelled: 'Cancelled'
        },
        chips: {
          unusedLine: 'unused line',
          activeSubs: '{{count}} active',
          inactiveHistorical: '{{count}} inactive history'
        },
        labels: {
          ownerNA: 'No owner'
        },
        semaphore: {
          green: 'Green · {{pct}}%',
          yellow: 'Yellow · {{pct}}%',
          red: 'Red · {{pct}}%'
        },
        subscription: {
          primaryMax: 'Primary line max connections: {{count}}'
        },
        errors: {
          summaryLoad: 'Could not load summary.',
          linesLoad: 'Could not load plus lines.',
          subscriptionsLoad: 'Could not load subscriptions.'
        }
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
        channels: {
          social: 'Social media',
          google: 'Google',
          family: 'Family',
          friends: 'Friends'
        },
        status: {
          ACTIVE: 'ACTIVE',
          INACTIVE: 'INACTIVE',
          BLOCKED: 'BLOCKED',
          SUSPENDED: 'SUSPENDED'
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
          loadError: 'Could not load customers.',
          referersLoadError: 'Could not load referrers.',
          createError: 'Could not create customer.',
          missingCustomerId: 'Could not identify customer.',
          updateError: 'Could not update customer.',
          missingDeleteId: 'Could not identify customer to delete.',
          deleteError: 'Could not delete customer.',
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
      panelAuthAdmin: {
        title: 'Panel Integrations',
        subtitle: 'Manage Vivo Player and 9xtream credentials by system user from a single secure module.',
        actions: {
          refresh: 'Refresh',
          new: 'New integration',
          edit: 'Edit',
          activate: 'Activate',
          deactivate: 'Deactivate',
          delete: 'Delete',
          cancel: 'Cancel',
          save: 'Save changes',
          create: 'Create'
        },
        filters: {
          username: 'System user',
          provider: 'Provider',
          status: 'Status',
          all: 'All',
          active: 'Active',
          inactive: 'Inactive'
        },
        table: {
          user: 'User',
          provider: 'Provider',
          panelUser: 'Panel user',
          apiUrl: 'API URL',
          cmsUrl: 'CMS URL',
          status: 'Status',
          updatedAt: 'Updated',
          actions: 'Actions',
          empty: 'No panel integrations were found with current filters.'
        },
        form: {
          username: 'System user',
          provider: 'Provider',
          usernamePanel: 'Panel user',
          password: 'Panel password',
          passwordOptional: 'Panel password (optional)',
          apiBaseUrl: 'API base URL',
          cmsBaseUrl: 'CMS base URL'
        },
        status: {
          active: 'ACTIVE',
          inactive: 'INACTIVE'
        },
        dialogs: {
          createTitle: 'Create integration',
          editTitle: 'Edit integration',
          deleteTitle: 'Delete integration',
          deleteMessage: 'This action will permanently remove this panel integration.'
        },
        messages: {
          apiMissing: 'VITE_API_VIVO_PLAYER is not configured. Add this environment variable to use this module.',
          requiredFields: 'Complete user, provider and panel user.',
          passwordRequired: 'Password is required when creating an integration.',
          loadError: 'Could not load panel integrations.',
          created: 'Integration created successfully.',
          updated: 'Integration updated successfully.',
          deleted: 'Integration deleted successfully.',
          saveError: 'Could not save integration.',
          deleteError: 'Could not delete integration.',
          statusUpdated: 'Status updated successfully.',
          statusError: 'Could not update status.'
        }
      },
      sidebarRadar: {
        title: 'Operational Radar',
        subtitle: 'Expirations and collections',
        today: 'Today',
        tomorrow: 'Tomorrow',
        next7Days: 'Next 7 days',
        pendingCollection: 'Pending collection',
        invoices: 'Invoices: {{val}}',
        commitments: 'Commitments: {{val}}',
        updatedAt: 'Updated: {{time}}',
        openTracking: 'Open tracking',
        partial: 'Partial radar: some modules did not load.',
        loadError: 'Could not load operational radar.'
      },
      liontvDashboard: {
        loading: 'Loading operational tracking...',
        loadError: 'Could not load tracking module.',
        empty: 'There is not enough data to build alerts yet.',
        partialLoad: 'Partial tracking data loaded.',
        infoBanner: 'Tracking module to avoid missing anything: expirations, pending items, risks and upcoming business events.',
        horizonLabel: 'Alert horizon:',
        daysChip: '{{days}} days',
        criticalOnly: 'Critical only',
        actions: {
          open: 'Open',
          view: 'View',
          openInvoices: 'Open invoices',
          openCommitments: 'Open commitments'
        },
        sections: {
          trackingByDate: 'Tracking by date',
          detailByDate: 'Details by date',
          expiryRadar: 'Expiration radar',
          priorityQueue: 'Prioritized alert queue',
          pendingInvoices: 'Pending invoices',
          pendingCommitments: 'Pending payment commitments'
        },
        metrics: {
          todayAlerts: { title: 'Today alerts', helper: 'due today' },
          tomorrowAlerts: { title: 'Tomorrow alerts', helper: 'due in 1 day' },
          next7Alerts: { title: '7-day alerts', helper: 'from day 2 to day 7' },
          criticalAlerts: { title: 'Critical alerts', helper: '{{count}} due today/1 day' },
          highAlerts: { title: 'High alerts', helper: '{{count}} recently overdue' },
          horizonAlerts: { title: 'Next {{days}} days', helper: '{{count}} within 7 days' },
          pendingInvoices: { title: 'Pending invoices' },
          pendingCommitments: { title: 'Pending commitments' },
          lostCustomers: { title: 'Lost customers', helper: 'overdue > {{days}} days' }
        },
        buckets: {
          today: { title: 'Today details', helper: 'Cases due today' },
          tomorrow: { title: 'Tomorrow details', helper: 'Cases due in 1 day' },
          next7: { title: 'Next 7 days details', helper: 'Cases due between 2 and 7 days' }
        },
        labels: {
          alertsCount: '{{count}} alerts',
          customer: 'Customer',
          status: 'Status',
          appFallback: 'APP',
          planFallback: 'Plan'
        },
        table: {
          priority: 'Priority',
          type: 'Type',
          reference: 'Reference',
          customer: 'Customer',
          targetDate: 'Target date',
          status: 'Status',
          detail: 'Detail',
          action: 'Action',
          id: 'ID',
          pendingAmount: 'Pending amount',
          dueDate: 'Due date',
          promisedDate: 'Promise date'
        },
        messages: {
          noAlertsInBucket: 'No alerts in this block.',
          queueEmpty: 'No alerts in this range. Everything is under control.',
          noPendingInvoices: 'There are no pending invoices.',
          noPendingCommitments: 'There are no pending commitments.',
          operationalRecommendation:
            'Operational recommendation: review critical alerts first and then high alerts. Very old overdue items are moved to lost for commercial follow-up and no longer saturate critical priority.'
        },
        severity: {
          critical: 'Critical',
          high: 'High',
          medium: 'Medium',
          lost: 'Lost',
          low: 'Low'
        },
        due: {
          noDate: 'No date',
          overdueAgo: 'Overdue {{days}}d ago',
          today: 'Due today',
          inDays: 'Due in {{days}}d'
        },
        types: {
          license: 'License',
          subscription: 'Subscription',
          line: 'Line',
          managedAccount: 'Managed Account',
          pendingInvoice: 'Pending invoice',
          paymentCommitment: 'Payment commitment',
          licensePlural: 'Licenses',
          subscriptionPlural: 'Subscriptions',
          linePlural: 'Lines',
          managedAccountPlural: 'Managed Accounts'
        },
        reference: {
          invoice: 'Invoice #{{id}}',
          commitment: 'Commitment #{{id}}'
        },
        radar: {
          overdue: 'Overdue: {{count}}',
          today: 'Today: {{count}}',
          next7: '7 days: {{count}}',
          next30: '30 days: {{count}}',
          noDate: 'No date: {{count}}'
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
        headers: {
          id: 'ID'
        },
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
        import: {
          success: 'Payload imported successfully.',
          error: 'Could not import payload.'
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
          deleted: 'Movie feed record deleted successfully.',
          import: {
            button: 'Import from Alluko',
            title: 'Alluko import',
            helper:
              'Sign in manually in Alluko, copy the Cookie header from an authenticated request, and use it here to fetch the JSON into the payload box.',
            cookieLabel: 'Authenticated Cookie header',
            cookiePlaceholder: 'PHPSESSID=...; xm_simple_security_check=...; saved_access_code=subadmin; ...',
            categoryLabel: 'Category (optional)',
            categoryPlaceholder: 'Leave empty for all',
            fetch: 'Fetch from Alluko',
            fetching: 'Importing...',
            success: 'Payload imported from Alluko.',
            error: 'Could not import from Alluko.'
          }
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
      errorBoundary: {
        404: "Error 404 - This page doesn't exist!",
        401: "Error 401 - You aren't authorized to see this",
        503: 'Error 503 - Looks like our API is down',
        418: 'Error 418 - Contact administrator',
        default: 'Under maintenance'
      },
      pageState: {
        loading: 'Loading data...',
        error: 'Could not load information.',
        retry: 'Retry',
        empty: 'No data available to display.'
      },
      themeMode: {
        light: 'Light',
        dark: 'Dark',
        system: 'System',
        labelPrefix: 'Mode',
        currentPrefix: 'Current'
      },
      profileMenu: {
        greeting: 'Good morning,',
        userFallback: 'User',
        roleFallback: 'Project Admin',
        searchPlaceholder: 'Search profile options',
        changeLanguage: 'Change language',
        current: 'Current',
        colorTheme: 'Color theme',
        accountSettings: 'Account settings',
        changePassword: 'Change password',
        logout: 'Logout',
        messages: {
          logoutSuccess: 'Session closed.',
          fillAllFields: 'Complete all fields.',
          passwordMismatch: 'Passwords do not match.',
          passwordUpdated: 'Password updated.',
          passwordUpdateError: 'Could not update password.'
        },
        passwordDialog: {
          title: 'Change password',
          subtitle: 'Keep your account secure with a strong password.',
          currentPassword: 'Current password',
          newPassword: 'New password',
          newPasswordHelper: 'Use at least 8 characters, with letters, numbers, and symbols.',
          confirmPassword: 'Confirm new password',
          tip: 'Tip: avoid reusing passwords and do not share this change.'
        },
        upgradeCard: {
          title: 'Upgrade your plan',
          subtitleLine1: '70% discount for 1-year',
          subtitleLine2: 'subscriptions.',
          action: 'Go Premium'
        }
      },
      headerSearch: {
        placeholder: 'Global search (type:, status:, due:)',
        dialogTitle: 'Global search',
        kinds: {
          customer: 'Customer',
          subscription: 'Subscription',
          license: 'License',
          line: 'Line',
          account: 'Managed account',
          invoice: 'Invoice',
          commitment: 'Commitment',
          command: 'Command',
          result: 'Result'
        },
        quickCommands: {
          dashboard: { title: 'Go to operational tracking', subtitle: 'KPI, alerts and priorities for the day.' },
          customers: { title: 'Open customers', subtitle: 'Portfolio and customer data management.' },
          subscriptions: { title: 'Open subscriptions', subtitle: 'Plan status and renewals.' },
          invoices: { title: 'Open invoices', subtitle: 'Pending collections and payments.' },
          commitments: { title: 'Open payment commitments', subtitle: 'Promises and collection follow-up.' },
          managedAccounts: { title: 'Open managed accounts', subtitle: 'Aliases, inbox and forwarding.' },
          licenses: { title: 'Open licenses', subtitle: 'License status by customer.' },
          lines: { title: 'Open lines', subtitle: 'Line and expiration control.' }
        },
        labels: {
          customerById: 'Customer #{{id}}',
          customerValue: 'Customer: {{customer}}',
          idValue: 'ID {{id}}',
          noProvider: 'No provider',
          planFallback: 'Plan',
          licenseFallback: 'License',
          result: 'Result'
        },
        reference: {
          invoice: 'Invoice #{{id}}',
          commitment: 'Commitment #{{id}}'
        },
        due: {
          overdue: 'Overdue {{days}}d',
          today: 'Today',
          tomorrow: 'Tomorrow',
          inDays: '{{days}}d'
        },
        summary: {
          results: '{{count}} results',
          todayAlerts: '{{count}} alerts today',
          sync: 'Sync: {{time}}'
        },
        sections: {
          quickActions: 'Quick actions',
          recents: 'Recent',
          todayPending: 'Due today'
        },
        messages: {
          noRecents: 'No recents yet.',
          noTodayDue: 'No due items for today in the current index.',
          noResults: 'No results found.',
          filtersHelp:
            'Use filters: type:customer|subscription|license|line|account|invoice|commitment|command, status:pending|active|expired, due:today|tomorrow|7d|overdue',
          partialData: 'Partial data loaded in global search.',
          loadError: 'Could not load the global index.'
        }
      },
      headerNotifications: {
        title: 'Today alerts',
        partial: 'Partial alerts loaded.',
        loadError: 'Could not load today alerts.',
        updatedAt: 'Updated: {{time}}',
        openTracking: 'View full tracking',
        empty: 'No alerts for today.',
        types: {
          license: 'License',
          subscription: 'Subscription',
          line: 'Line',
          managedAccount: 'Managed account',
          pendingInvoice: 'Pending invoice',
          paymentCommitment: 'Payment commitment'
        },
        labels: {
          appFallback: 'APP',
          planFallback: 'Plan',
          lineFallback: 'line',
          accountCodeFallback: 'ACC',
          customer: 'Customer',
          alert: 'Alert',
          reviewPending: 'Review pending alert.',
          open: 'Open'
        },
        reference: {
          invoice: 'Invoice #{{id}}',
          commitment: 'Commitment #{{id}}'
        },
        alertDetail: {
          dueToday: 'Due today',
          dueTodayAmount: 'Due today · {{amount}}'
        },
        severity: {
          critical: 'Critical',
          high: 'High',
          medium: 'Medium',
          low: 'Low',
          info: 'Info'
        }
      },
      paymentCommitments: {
        title: 'Payment commitments',
        actions: { new: 'New commitment', create: 'Create commitment' },
        filters: {
          title: 'Debt control',
          search: 'Search by customer, status, note or ID',
          status: 'Status',
          all: 'All',
          debtorsOnly: 'Debtors only'
        },
        status: {
          pending: 'Pending',
          partial: 'Partial',
          paid: 'Paid',
          cancelled: 'Cancelled'
        },
        kpi: {
          total: '{{count}} commitments',
          debtors: '{{count}} debtors',
          pendingAmount: 'Pending: {{amount}}',
          overdue: '{{count}} overdue'
        },
        labels: {
          customerId: 'Customer #{{id}}',
          thisCustomer: 'this customer'
        },
        risk: { overdue: 'Overdue', onTime: 'On time' },
        table: {
          headers: {
            id: 'ID',
            customer: 'Customer',
            promisedDate: 'Promised date',
            amountDue: 'Amount due',
            amountPaid: 'Amount paid',
            pendingAmount: 'Pending',
            status: 'Status',
            risk: 'Risk',
            note: 'Note',
            actions: 'Actions'
          },
          emptyTitle: 'No records',
          emptyText: 'No commitments match your current search and filters.',
          rowsPerPage: 'Rows per page'
        },
        dialog: {
          editTitle: 'Edit payment commitment',
          createTitle: 'New payment commitment',
          subtitle: 'Register promise date and track pending balance by customer.'
        },
        form: {
          customer: 'Customer',
          customerHelper: 'Customer linked to this payment commitment.',
          loadingCustomers: 'Loading customers...',
          noCustomers: 'No customers available',
          promisedDate: 'Promised date',
          amountDue: 'Amount due',
          amountPaid: 'Amount paid',
          notes: 'Notes',
          markCancelled: 'Mark as cancelled',
          projectedStatus: 'Projected status',
          pendingBalance: 'Pending balance: {{amount}}',
          statusHint: 'If not cancelled, backend calculates automatically: Pending, Partial or Paid.',
          main: {
            title: 'Main data',
            helper: 'Select customer, date and commitment amounts.'
          },
          tracking: {
            title: 'Control & tracking',
            helper: 'Status is calculated from amounts. You can only force Cancelled.'
          }
        },
        delete: {
          title: 'Delete commitment',
          body: 'Delete commitment #{{id}} for {{customer}}? This action cannot be undone.'
        },
        messages: {
          loadError: 'Could not load payment commitments.',
          customersLoadWarning: 'Could not load customer catalog.',
          selectCustomer: 'Select a customer.',
          selectDate: 'Select the promised payment date.',
          amountDuePositive: 'Amount due must be greater than zero.',
          amountPaidNegative: 'Amount paid cannot be negative.',
          amountPaidGreaterThanDue: 'Amount paid cannot be greater than amount due.',
          created: 'Payment commitment created.',
          updated: 'Payment commitment updated.',
          deleted: 'Payment commitment deleted.',
          saveError: 'Could not save payment commitment.',
          deleteError: 'Could not delete payment commitment.'
        }
      },
      potentialCustomers: {
        title: 'Potential customers',
        subtitle: 'Register and track interested contacts.',
        search: 'Search prospects',
        searchPlaceholder: 'Search by name, email, phone, country',
        filters: { status: 'Status' },
        headers: {
          name: 'Name',
          email: 'Email',
          phone: 'Phone',
          country: 'Country',
          category: 'Category',
          status: 'Status',
          createdAt: 'Created',
          actions: 'Actions'
        },
        kpi: {
          total: 'Total',
          new: 'New',
          contacted: 'Contacted',
          converted: 'Converted'
        },
        actions: {
          new: 'New potential customer',
          edit: 'Edit potential customer',
          markContacted: 'Mark as contacted'
        },
        form: {
          identity: 'Identity',
          identityHelper: 'Primary contact details',
          classification: 'Classification',
          classificationHelper: 'Categorize and set commercial status'
        },
        categories: {
          GENERAL: 'General',
          IPTV: 'IPTV',
          SPORTS_BAR: 'Sports bar',
          BAR_RESTAURANT: 'Bar / restaurant',
          RESTAURANT: 'Restaurant',
          CAFE: 'Cafe',
          BARBERSHOP: 'Barbershop',
          BEAUTY_SALON: 'Beauty salon',
          HOTEL: 'Hotel',
          MOTEL: 'Motel',
          HOSTEL: 'Hostel',
          GYM: 'Gym',
          CLINIC_WAITING_ROOM: 'Clinic waiting room',
          DENTAL_CLINIC: 'Dental clinic',
          AUTO_WORKSHOP: 'Auto workshop',
          CAR_DEALERSHIP: 'Car dealership',
          SUPERMARKET: 'Supermarket',
          CONVENIENCE_STORE: 'Convenience store',
          OFFICE: 'Office',
          CALL_CENTER: 'Call center',
          EVENT_HALL: 'Event hall',
          BILLIARD_CLUB: 'Billiard club',
          NIGHTCLUB: 'Nightclub',
          SOCIAL_MEDIA: 'Social media',
          REFERRAL: 'Referral',
          WEB: 'Web',
          OTHER: 'Other'
        },
        status: {
          NEW: 'New',
          CONTACTED: 'Contacted',
          NEGOTIATION: 'Negotiation',
          CONVERTED: 'Converted',
          LOST: 'Lost'
        },
        empty: 'No potential customers found.',
        emailDefault: 'If empty, nomail@gmail.com will be saved.',
        selectCountry: 'Select country',
        deleteTitle: 'Delete potential customer',
        deleteBody: 'Delete {{name}}?',
        messages: {
          loadError: 'Could not load potential customers.',
          alreadyContacted: 'This prospect is already Contacted.',
          markContactedSuccess: 'Status updated to Contacted.',
          markContactedError: 'Could not update status.',
          invalidWhatsAppPhone: 'This prospect has no valid WhatsApp phone.',
          requiredName: 'Complete the name.',
          created: 'Potential customer created.',
          updated: 'Potential customer updated.',
          deleted: 'Potential customer deleted.',
          saveError: 'Could not save potential customer.',
          deleteError: 'Could not delete potential customer.'
        }
      },
      errorBoundary: {
        404: 'Error 404 - ¡Esta página no existe!',
        401: 'Error 401 - No estás autorizado para ver esto',
        503: 'Error 503 - Parece que nuestra API está caída',
        418: 'Error 418 - Contacta al administrador',
        default: 'En mantenimiento'
      },
      pageState: {
        loading: 'Cargando datos...',
        error: 'No se pudo cargar la información.',
        retry: 'Reintentar',
        empty: 'No hay datos disponibles para mostrar.'
      },
      themeMode: {
        light: 'Claro',
        dark: 'Oscuro',
        system: 'Sistema',
        labelPrefix: 'Modo',
        currentPrefix: 'Actual'
      },
      profileMenu: {
        greeting: 'Buenos días,',
        userFallback: 'Usuario',
        roleFallback: 'Administrador del proyecto',
        searchPlaceholder: 'Buscar opciones del perfil',
        changeLanguage: 'Cambiar idioma',
        current: 'Actual',
        colorTheme: 'Tema de color',
        accountSettings: 'Configuración de cuenta',
        changePassword: 'Cambiar contraseña',
        logout: 'Cerrar sesión',
        messages: {
          logoutSuccess: 'Sesión cerrada.',
          fillAllFields: 'Completa todos los campos.',
          passwordMismatch: 'Las contraseñas no coinciden.',
          passwordUpdated: 'Contraseña actualizada.',
          passwordUpdateError: 'No se pudo actualizar la contraseña.'
        },
        passwordDialog: {
          title: 'Cambiar contraseña',
          subtitle: 'Mantén tu cuenta segura con una contraseña fuerte.',
          currentPassword: 'Contraseña actual',
          newPassword: 'Nueva contraseña',
          newPasswordHelper: 'Usa al menos 8 caracteres, mezcla letras, números y símbolos.',
          confirmPassword: 'Confirmar nueva contraseña',
          tip: 'Consejo: evita reutilizar contraseñas y no compartas este cambio.'
        },
        upgradeCard: {
          title: 'Mejora tu plan',
          subtitleLine1: '70% de descuento en suscripciones',
          subtitleLine2: 'anuales.',
          action: 'Ir a Premium'
        }
      },
      headerSearch: {
        placeholder: 'Búsqueda global (tipo:, estado:, vence:)',
        dialogTitle: 'Búsqueda global',
        kinds: {
          customer: 'Cliente',
          subscription: 'Suscripción',
          license: 'Licencia',
          line: 'Línea',
          account: 'Managed account',
          invoice: 'Factura',
          commitment: 'Compromiso',
          command: 'Comando',
          result: 'Resultado'
        },
        quickCommands: {
          dashboard: { title: 'Ir a seguimiento operativo', subtitle: 'KPI, alertas y prioridades del día.' },
          customers: { title: 'Abrir clientes', subtitle: 'Gestión de cartera y datos del cliente.' },
          subscriptions: { title: 'Abrir suscripciones', subtitle: 'Estado y renovaciones de planes.' },
          invoices: { title: 'Abrir facturas', subtitle: 'Cobros pendientes y pagos.' },
          commitments: { title: 'Abrir compromisos de pago', subtitle: 'Promesas y seguimiento de cobranza.' },
          managedAccounts: { title: 'Abrir managed accounts', subtitle: 'Aliases, bandeja y forwarding.' },
          licenses: { title: 'Abrir licencias', subtitle: 'Estado de licencias por cliente.' },
          lines: { title: 'Abrir líneas', subtitle: 'Control de líneas y expiración.' }
        },
        labels: {
          customerById: 'Cliente #{{id}}',
          customerValue: 'Cliente: {{customer}}',
          idValue: 'ID {{id}}',
          noProvider: 'Sin provider',
          planFallback: 'Plan',
          licenseFallback: 'Licencia',
          result: 'Resultado'
        },
        reference: {
          invoice: 'Factura #{{id}}',
          commitment: 'Compromiso #{{id}}'
        },
        due: {
          overdue: 'Vencido {{days}}d',
          today: 'Hoy',
          tomorrow: 'Mañana',
          inDays: '{{days}}d'
        },
        summary: {
          results: '{{count}} resultados',
          todayAlerts: '{{count}} alertas hoy',
          sync: 'Sync: {{time}}'
        },
        sections: {
          quickActions: 'Acciones rápidas',
          recents: 'Recientes',
          todayPending: 'Pendientes de hoy'
        },
        messages: {
          noRecents: 'Sin recientes todavía.',
          noTodayDue: 'No hay vencimientos de hoy en el índice actual.',
          noResults: 'No se encontraron resultados.',
          filtersHelp:
            'Usa filtros: tipo:cliente|suscripcion|licencia|linea|account|factura|compromiso|comando, estado:pending|active|expired, vence:hoy|manana|7d|vencido',
          partialData: 'Datos parciales cargados en búsqueda global.',
          loadError: 'No se pudo cargar el índice global.'
        }
      },
      headerNotifications: {
        title: 'Alertas de hoy',
        partial: 'Se cargaron alertas parciales.',
        loadError: 'No se pudieron cargar las alertas de hoy.',
        updatedAt: 'Actualizado: {{time}}',
        openTracking: 'Ver seguimiento completo',
        empty: 'No hay alertas para hoy.',
        types: {
          license: 'Licencia',
          subscription: 'Suscripción',
          line: 'Línea',
          managedAccount: 'Managed account',
          pendingInvoice: 'Factura pendiente',
          paymentCommitment: 'Compromiso de pago'
        },
        labels: {
          appFallback: 'APP',
          planFallback: 'Plan',
          lineFallback: 'line',
          accountCodeFallback: 'ACC',
          customer: 'Cliente',
          alert: 'Alerta',
          reviewPending: 'Revisar alerta pendiente.',
          open: 'Abrir'
        },
        reference: {
          invoice: 'Factura #{{id}}',
          commitment: 'Compromiso #{{id}}'
        },
        alertDetail: {
          dueToday: 'Vence hoy',
          dueTodayAmount: 'Vence hoy · {{amount}}'
        },
        severity: {
          critical: 'Crítico',
          high: 'Alto',
          medium: 'Medio',
          low: 'Bajo',
          info: 'Info'
        }
      },
      paymentCommitments: {
        title: 'Compromisos de pago',
        actions: { new: 'Nuevo compromiso', create: 'Crear compromiso' },
        filters: {
          title: 'Control de deuda',
          search: 'Buscar por cliente, estado, nota o ID',
          status: 'Estado',
          all: 'Todos',
          debtorsOnly: 'Solo deudores'
        },
        status: {
          pending: 'Pendiente',
          partial: 'Parcial',
          paid: 'Pagado',
          cancelled: 'Cancelado'
        },
        kpi: {
          total: '{{count}} compromisos',
          debtors: '{{count}} deudores',
          pendingAmount: 'Pendiente: {{amount}}',
          overdue: '{{count}} vencidos'
        },
        labels: {
          customerId: 'Cliente #{{id}}',
          thisCustomer: 'este cliente'
        },
        risk: { overdue: 'Vencido', onTime: 'Al día' },
        table: {
          headers: {
            id: 'ID',
            customer: 'Cliente',
            promisedDate: 'Fecha compromiso',
            amountDue: 'Adeudado',
            amountPaid: 'Pagado',
            pendingAmount: 'Pendiente',
            status: 'Estado',
            risk: 'Riesgo',
            note: 'Nota',
            actions: 'Acciones'
          },
          emptyTitle: 'Sin registros',
          emptyText: 'No hay compromisos que coincidan con tu búsqueda y filtros actuales.',
          rowsPerPage: 'Filas por página'
        },
        dialog: {
          editTitle: 'Editar compromiso de pago',
          createTitle: 'Nuevo compromiso de pago',
          subtitle: 'Registra fecha de compromiso y controla el saldo pendiente por cliente.'
        },
        form: {
          customer: 'Cliente',
          customerHelper: 'Cliente asociado al compromiso de pago.',
          loadingCustomers: 'Cargando clientes...',
          noCustomers: 'No hay clientes disponibles',
          promisedDate: 'Fecha compromiso',
          amountDue: 'Monto adeudado',
          amountPaid: 'Monto pagado',
          notes: 'Notas',
          markCancelled: 'Marcar como cancelado',
          projectedStatus: 'Estado proyectado',
          pendingBalance: 'Saldo pendiente: {{amount}}',
          statusHint: 'Si no está cancelado, el backend calcula automáticamente: Pendiente, Parcial o Pagado.',
          main: {
            title: 'Datos principales',
            helper: 'Selecciona cliente, fecha y montos del compromiso.'
          },
          tracking: {
            title: 'Control y seguimiento',
            helper: 'El estado se calcula por montos. Solo puedes forzar Cancelado.'
          }
        },
        delete: {
          title: 'Eliminar compromiso',
          body: '¿Deseas eliminar el compromiso #{{id}} de {{customer}}? Esta acción no se puede deshacer.'
        },
        messages: {
          loadError: 'No se pudieron cargar los compromisos de pago.',
          customersLoadWarning: 'No se pudo cargar el catálogo de clientes.',
          selectCustomer: 'Selecciona un cliente.',
          selectDate: 'Selecciona la fecha comprometida de pago.',
          amountDuePositive: 'El monto adeudado debe ser mayor que cero.',
          amountPaidNegative: 'El monto pagado no puede ser negativo.',
          amountPaidGreaterThanDue: 'El monto pagado no puede ser mayor que el adeudado.',
          created: 'Compromiso de pago creado.',
          updated: 'Compromiso de pago actualizado.',
          deleted: 'Compromiso de pago eliminado.',
          saveError: 'No se pudo guardar el compromiso de pago.',
          deleteError: 'No se pudo eliminar el compromiso de pago.'
        }
      },
      potentialCustomers: {
        title: 'Clientes potenciales',
        subtitle: 'Registra y da seguimiento a contactos interesados.',
        search: 'Buscar potenciales',
        searchPlaceholder: 'Buscar por nombre, correo, teléfono, país',
        filters: { status: 'Estado' },
        headers: {
          name: 'Nombre',
          email: 'Correo',
          phone: 'Teléfono',
          country: 'País',
          category: 'Categoría',
          status: 'Estado',
          createdAt: 'Creado',
          actions: 'Acciones'
        },
        kpi: {
          total: 'Total',
          new: 'Nuevos',
          contacted: 'Contactados',
          converted: 'Convertidos'
        },
        actions: {
          new: 'Nuevo cliente potencial',
          edit: 'Editar cliente potencial',
          markContacted: 'Marcar como contactado'
        },
        form: {
          identity: 'Identidad',
          identityHelper: 'Datos principales del contacto',
          classification: 'Clasificación',
          classificationHelper: 'Categoriza y define estado comercial'
        },
        categories: {
          GENERAL: 'General',
          IPTV: 'IPTV',
          SPORTS_BAR: 'Sports Bar',
          BAR_RESTAURANT: 'Bar / Restaurant',
          RESTAURANT: 'Restaurant',
          CAFE: 'Cafe',
          BARBERSHOP: 'Barbershop',
          BEAUTY_SALON: 'Beauty Salon',
          HOTEL: 'Hotel',
          MOTEL: 'Motel',
          HOSTEL: 'Hostel',
          GYM: 'Gym',
          CLINIC_WAITING_ROOM: 'Clinic Waiting Room',
          DENTAL_CLINIC: 'Dental Clinic',
          AUTO_WORKSHOP: 'Auto Workshop',
          CAR_DEALERSHIP: 'Car Dealership',
          SUPERMARKET: 'Supermarket',
          CONVENIENCE_STORE: 'Convenience Store',
          OFFICE: 'Office',
          CALL_CENTER: 'Call Center',
          EVENT_HALL: 'Event Hall',
          BILLIARD_CLUB: 'Billiard Club',
          NIGHTCLUB: 'Nightclub',
          SOCIAL_MEDIA: 'Social Media',
          REFERRAL: 'Referral',
          WEB: 'Web',
          OTHER: 'Other'
        },
        status: {
          NEW: 'New',
          CONTACTED: 'Contacted',
          NEGOTIATION: 'Negotiation',
          CONVERTED: 'Converted',
          LOST: 'Lost'
        },
        empty: 'No hay clientes potenciales registrados.',
        emailDefault: 'Si lo dejas vacío se guardará nomail@gmail.com',
        selectCountry: 'Seleccionar país',
        deleteTitle: 'Eliminar cliente potencial',
        deleteBody: '¿Eliminar a {{name}}?',
        messages: {
          loadError: 'No se pudieron cargar los clientes potenciales.',
          alreadyContacted: 'Este prospecto ya está en Contacted.',
          markContactedSuccess: 'Estado actualizado a Contacted.',
          markContactedError: 'No se pudo actualizar el estado.',
          invalidWhatsAppPhone: 'Este prospecto no tiene teléfono válido para WhatsApp.',
          requiredName: 'Completa el nombre.',
          created: 'Cliente potencial creado.',
          updated: 'Cliente potencial actualizado.',
          deleted: 'Cliente potencial eliminado.',
          saveError: 'No se pudo guardar el cliente potencial.',
          deleteError: 'No se pudo eliminar el cliente potencial.'
        }
      },
      catalog: {
        title: 'Global Base Catalog Curation',
        actions: {
          refresh: 'Refresh',
          refreshProviders: 'Refresh providers',
          loading: 'Loading...',
          importing: 'Importing...',
          import: 'Import catalog',
          downloading: 'Downloading...',
          downloadM3u: 'Download M3U',
          testing: 'Testing...',
          fullFlowTest: 'Test full flow',
          clearFilters: 'Clear filters',
          applyFilters: 'Apply filters',
          openCatalog: 'Open base catalog',
          openLineSources: 'Open M3U line sources'
        },
        overview: {
          baseEyebrow: 'Global catalog preparation',
          baseTitle: 'Prepare the master catalog before touching individual lines',
          baseDescription:
            'This screen is the shared preparation layer: save the global source, import the master playlist, classify titles and define the categories that later shape the final M3U grouping.',
          lineEyebrow: 'Per-line Xtream workflow',
          lineTitle: 'Configure, validate and download the final M3U by lineId',
          lineDescription:
            'This screen guides the operator through one line at a time: choose the line, save provider settings, tune the Xtream template and only then run import or download.'
        },
        flow: {
          title: 'Operator flow',
          baseSetupTitle: 'Save global base source',
          baseSetupBody: 'Define the master playlist URL and provider used to curate the shared catalog.',
          baseImportTitle: 'Import the shared catalog',
          baseImportBody: 'Run the base import to populate items that later feed category matching.',
          curateTitle: 'Assign manual categories',
          curateBody: 'Review titles, refine filters and assign categories that should override the final output.',
          lineRunTitle: 'Continue to per-line M3U',
          lineRunBody: 'Move to the per-line screen only after the base catalog feels ready.',
          linePickTitle: 'Choose the line',
          linePickBody: 'Pick the line you want to operate.',
          lineAssignTitle: 'Save line settings',
          lineAssignBody: 'Assign provider and cache TTL for the selected line.',
          templateTitle: 'Tune provider template',
          templateBody: 'Define the common Xtream host, type and output for this provider.',
          runTitle: 'Import and download',
          runBody: 'Run catalog import and download the final M3U by lineId.'
        },
        lineSources: {
          title: 'M3U Per-Line Configuration',
          howItWorks: 'How this module works',
          step1: '1) Select the line by lineId. The selector shows username_encode for easier identification.',
          step2: '2) Assign provider and TTL per line. The source URL is built dynamically from the provider template and current line credentials.',
          step3: '3) Configure the Xtream provider template, then import catalog and/or download the final M3U by lineId.',
          flowSummary:
            'The screen is now separated by operational step, so the user can see what is already configured and what is still blocking the run.',
          readyHint: 'This line is ready for import and final download.',
          pendingHint: 'Finish the pending steps below. The system resolves the real Xtream credentials automatically from the active line.',
          configTitle: 'Per-line source configuration',
          configBody: 'Start by identifying the line visually, then save the provider and cache policy that the backend should use for this line.',
          lineSelect: 'Select line (lineId / usernameEncode)',
          lineSelectHelper: 'This selector uses /api/v1/line-sources/line-options and no longer depends on token.',
          lineSelectPlaceholder: 'Select line...'
        },
        baseHowItWorks: {
          title: 'Recommended flow',
          summary:
            'The operator should feel a clear sequence here: define the shared source, import the catalog, curate categories and only then move to the per-line execution module.',
          step1: '1) Configure one global base URL here and save it.',
          step2: '2) Run "Import base" to populate base catalog and assign manual categories.',
          step3: '3) Per-line provider assignment and lineId tests are configured in the "M3U Line Sources" screen.'
        },
        baseSource: {
          title: 'Global Base M3U Source',
          body: 'Use one shared playlist as the master catalog. This is where global categorization starts, not where per-line playback is configured.',
          url: 'Base playlist URL',
          urlHelper: 'This list is your global master catalog for categorization and override.',
          provider: 'Base provider',
          providerHelper: 'Reference name for the global base source.',
          ttl: 'TTL (min)',
          ttlHelper: 'Reference refresh window for base catalog.',
          active: 'Source active',
          reload: 'Reload',
          save: 'Save base source',
          saving: 'Saving...',
          import: 'Import base',
          importing: 'Importing...',
          loading: 'Loading...',
          lastDownload: 'Last download',
          updatedAt: 'Updated at'
        },
        source: {
          lineId: 'Line ID',
          lineIdHelper: 'Technical identifier of selected line.',
          usernameEncode: 'Visible username',
          usernameEncodeHelper: 'Display value to identify the line; the backend resolves the current technical username internally.',
          provider: 'Assigned provider',
          providerHelper: 'Select the provider whose Xtream template should be used for this line.',
          ttl: 'TTL cache (min)',
          ttlHelper: 'Cache time for final lineId playlist.',
          active: 'Source active',
          load: 'Load configuration',
          loading: 'Loading...',
          save: 'Save configuration',
          saving: 'Saving...',
          lastDownload: 'Last download',
          updatedAt: 'Updated at'
        },
        import: {
          title: 'Operational flow test by lineId',
          body:
            'Use these actions only after the line and the provider template are both saved. This section is intentionally action-focused.',
          lineFlowHelper: 'Import and final download now use /api/v1/catalog/import/line/{lineId} and /api/v1/m3u/line/{lineId}.',
          lineId: 'Selected lineId',
          lineIdHelper: 'Select a line above to operate the complete flow.'
        },
        providerTemplates: {
          title: 'Xtream template per provider',
          body:
            'This template defines the common host and response format for a provider. The line credentials are injected automatically when the flow runs.',
          provider: 'Provider',
          providerHelper: 'The template defines the common Xtream host/base; the backend appends the current line credentials.',
          baseUrl: 'Xtream base URL',
          playlistType: 'Playlist type',
          outputFormat: 'Output',
          active: 'Template active',
          load: 'Load template',
          loading: 'Loading...',
          save: 'Save template',
          saving: 'Saving...',
          updatedAt: 'Updated at'
        },
        filters: {
          title: 'Base catalog filters',
          body:
            'Filter aggressively, review the current page and assign manual categories only where the global catalog really needs guidance.',
          all: 'All',
          type: 'Detected type',
          active: 'Active',
          search: 'Search',
          searchPlaceholder: 'rawTitle, canonicalTitle, groupTitle, tvgName'
        },
        summary: {
          totalItems: 'Total items',
          categories: 'Categories',
          pageAssigned: '{{count}} assigned on this page'
        },
        status: {
          baseSource: 'Base source',
          lastDownload: 'Last download',
          catalogItems: 'Catalog items',
          categories: 'Categories',
          selectedLine: 'Selected line',
          provider: 'Provider',
          template: 'Template',
          actionsReady: 'Actions ready',
          lineSnapshot: 'Line snapshot',
          lineSnapshotEmpty: 'Pick a line to see its current identity and provider hint.',
          prerequisites: 'Run checklist',
          assignedItems: '{{count}} assigned on this page',
          providerUnset: 'Provider not selected',
          templateHelper: 'Save base URL to enable imports.',
          pendingValue: 'Pending',
          readyValue: 'Ready',
          missingValue: 'Missing',
          activeValue: 'Active',
          inactiveValue: 'Inactive'
        },
        hints: {
          dynamicUrl:
            'The source URL is not stored per line. Only the provider and cache rules are saved; the backend builds the real Xtream URL with the active line credentials.',
          categoryImpact: 'Manual categories defined from this base catalog are reused later when the final M3U is generated for each line.',
          baseScope: 'This screen is global. It does not save per-line credentials or provider templates.',
          nextAfterBase: 'The base catalog is ready enough to continue with line-specific M3U work.',
          dynamicPreview: 'Resolved Xtream preview'
        },
        table: {
          title: 'Title',
          type: 'Type',
          groupTitle: 'Original group',
          primaryCategory: 'Manual category',
          noManualCategory: 'No manual assignment',
          active: 'Active',
          updated: 'Updated',
          actions: 'Actions',
          helper:
            'These manual categories are the clearest place to curate the final grouping. Use filters first, then open item detail or assign directly from the table.'
        },
        categories: {
          title: 'Category management',
          body:
            'Categories defined here are the shared language for later M3U grouping. Keep the taxonomy clean and easy to scan.',
          new: 'New category',
          createTitle: 'Create category',
          name: 'Name',
          active: 'Active'
        },
        assign: {
          title: 'Assign manual category',
          item: 'Item',
          category: 'Category',
          clearPrimary: 'Clear primary manual category',
          primary: 'Assign as primary',
          assignedBy: 'Assigned by'
        },
        detail: {
          title: 'Item detail'
        },
        messages: {
          baseSourceLoadError: 'Could not load base source.',
          baseSourceRequired: 'Base URL is required.',
          baseSourceSaved: 'Base source saved successfully.',
          baseSourceSaveError: 'Could not save base source.',
          baseImportSuccess: 'Base import completed.',
          baseImportError: 'Could not import base list.',
          loadItemsError: 'Could not load base catalog.',
          loadCategoriesError: 'Could not load categories.',
          itemDetailError: 'Could not load item detail.',
          assignSuccess: 'Assignment updated.',
          assignError: 'Could not update assignment.',
          categoryNameRequired: 'Category name is required.',
          categoryCreateSuccess: 'Category created successfully.',
          categoryCreateError: 'Could not create category.',
          noItems: 'No items found with current filters.',
          lineOptionsLoadError: 'Could not load active lines.',
          lineRequired: 'Line ID is required.',
          lineSourceNotFound: 'No source config found for selected line.',
          lineSourceLoadError: 'Could not load line source config.',
          lineSourceRequiredFields: 'Line ID and provider are required.',
          lineSourceSaved: 'Line source saved successfully.',
          lineSourceSaveError: 'Could not save line source.',
          providerTemplatesLoadError: 'Could not load Xtream templates.',
          providerTemplateNotFound: 'No template found for selected provider.',
          providerTemplateLoadError: 'Could not load Xtream template.',
          providerTemplateRequiredFields: 'Provider and baseUrl are required.',
          providerTemplateSaved: 'Xtream template saved successfully.',
          providerTemplateSaveError: 'Could not save Xtream template.',
          lineRequiredForImport: 'Select a line to import.',
          importSuccess: 'Import completed.',
          importError: 'Could not import catalog.',
          lineRequiredForDownload: 'Select a line to download playlist.',
          downloadSuccess: 'Playlist downloaded successfully.',
          downloadError: 'Could not download playlist.',
          fullFlowSuccess: 'Full flow OK: import + download.',
          fullFlowError: 'Full flow test failed.'
        }
      },
      common: {
        close: 'Close',
        yes: 'Yes',
        no: 'No',
        cancel: 'Cancel',
        save: 'Save',
        clear: 'Clear',
        create: 'Create',
        creating: 'Creating...',
        saving: 'Saving...',
        saveChanges: 'Save changes',
        deleting: 'Deleting...',
        edit: 'Edit',
        new: 'New',
        selectOption: 'Select an option'
      },
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
        liontvOverview: 'Resumen',
        liontvOverviewCaption: 'Control diario y prioridades',
        liontvCommercial: 'Clientes y Ventas',
        liontvCommercialCaption: 'CRM, cobros y relación comercial',
        liontvOperations: 'Operación Técnica',
        liontvOperationsCaption: 'Inventario, líneas y cuentas',
        liontvContent: 'Contenido y Feed',
        liontvContentCaption: 'Demos y catálogo visible',
        demos: 'Demos Lion TV',
        subscriptions: 'Suscripciones',
        invoices: 'Facturas',
        businessPurchases: 'Compras negocio',
        customers: 'Clientes',
        potentialCustomers: 'Prospectos',
        paymentCommitments: 'Compromisos de pago',
        crm: 'CRM Clientes',
        lines: 'Líneas',
        plusLines: 'Líneas Plus',
        subscriptionSharing: 'Suscripciones compartidas',
        licenses: 'Licencias',
        managedAccounts: 'Managed Accounts',
        moviesFeed: 'Feed de Películas',
        seriesFeed: 'Feed de Series',
        futbolEventsFeed: 'Feed de Eventos de Fútbol',
        catalogCuration: 'Curación de Catálogo',
        sample: 'Página de ejemplo',
        docs: 'Documentación',
        security: 'Seguridad',
        userAccess: 'Usuarios y Accesos',
        userAccessCaption: 'Roles y permisos',
        panelAuths: 'Integraciones de Panel',
        panelAuthsCaption: 'Credenciales Vivo/9xtream por usuario'
      },
      auth: {
        hi: 'Hola, bienvenido',
        enterCredentials: 'Ingresa tus credenciales para continuar',
        logoAriaLabel: 'Logo de la aplicación',
        signIn: 'Iniciar sesión',
        email: 'Correo electrónico',
        password: 'Contraseña',
        togglePasswordVisibility: 'Mostrar u ocultar contraseña',
        keepLogged: 'Mantener sesión iniciada',
        forgot: '¿Olvidaste tu contraseña?',
        noAccount: '¿No tienes cuenta?',
        otpTitle: 'Verificación en dos pasos',
        otpInstruction: 'Ingresa el código enviado a {{dest}}.',
        otpDestinationFallback: 'tu dispositivo',
        codeLabel: 'Código de verificación',
        resend: 'Reenviar código',
        otpResendError: 'No pudimos reenviar el código.',
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
        registerBtn: 'Crear cuenta',
        registerSuccess: 'Usuario registrado correctamente.',
        registerFailed: 'No se pudo completar el registro.',
        registerUnexpectedError: 'Error inesperado al registrar usuario.',
        passwordStrengthLevels: {
          poor: 'Débil',
          weak: 'Baja',
          normal: 'Media',
          good: 'Buena',
          strong: 'Fuerte'
        },
        googleLogin: {
          failed: 'No se pudo iniciar sesión con Google.',
          unexpectedError: 'Error inesperado al iniciar sesión con Google.'
        },
        forgotErrors: {
          sendEmail: 'No pudimos enviar el correo, intenta más tarde.',
          resetPassword: 'No se pudo actualizar la contraseña.'
        }
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
        delete: 'Eliminar',
        clear: 'Limpiar',
        create: 'Crear',
        save: 'Guardar cambios',
        saving: 'Guardando...',
        deleting: 'Eliminando...',
        sending: 'Enviando...',
        cancel: 'Cancelar',
        whatsapp: 'WhatsApp'
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
        filters: {
          status: 'Estado',
          all: 'Todos',
          activeLineExpired: 'Línea activa vencida'
        },
        kpi: {
          activeStatus: 'ESTADO: ACTIVA {{count}}',
          sharedStatus: 'COMPARTIDAS {{count}}',
          activeLineExpired: 'LÍNEA ACTIVA VENCIDA {{count}}'
        },
        labels: {
          packageFallback: 'Paquete {{id}}',
          providerFallback: 'LION_TV',
          activeLineExpiredChip: 'Línea activa / fecha vencida'
        },
        empty: 'No hay suscripciones registradas.',
        sharing: {
          host: 'HOST',
          shared: 'SHARED',
          none: 'No compartida'
        },
        messages: {
          packagesLoadError: 'No se pudieron cargar los paquetes.',
          linesLoadError: 'No se pudieron cargar las líneas.',
          customersLoadError: 'No se pudieron cargar los clientes.',
          loadError: 'No se pudieron cargar las suscripciones.',
          customerEmailError: 'No se pudo obtener el correo del cliente.',
          invalidCustomerEmail: 'Actualiza el correo válido del cliente antes de enviar la notificación.',
          expirationSent: 'Notificación de vencimiento enviada.',
          reengageSent: 'Correo de reenganche enviado.',
          renewalSent: 'Notificación de renovación enviada.',
          notificationError: 'No se pudo enviar la notificación.',
          required: 'Completa los campos requeridos.',
          created: 'Suscripción creada correctamente.',
          updated: 'Suscripción actualizada correctamente.',
          deleted: 'Suscripción eliminada correctamente.',
          saveError: 'No se pudo guardar la suscripción.',
          deleteError: 'No se pudo eliminar la suscripción.'
        },
        form: {
          autopayLinkPlaceholder: 'https://...'
        },
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
      subscriptionSharing: {
        title: 'Seguimiento de suscripciones compartidas',
        subtitle: 'Monitoreo visual basado en suscripciones que reutilizan el mismo line_id entre clientes distintos.',
        kpi: {
          totalSubscriptions: 'Suscripciones totales',
          activeSubscriptions: 'Activas',
          sharedClusters: 'Clústeres compartidos',
          hosts: 'Hosts',
          sharedSubscriptions: 'Suscripciones SHARED',
          eligibleSubscriptions: 'Elegibles'
        },
        filters: {
          searchPlaceholder: 'Buscar por suscripción, cliente, línea o estado',
          status: 'Rol de compartición',
          eligible: 'Elegible',
          options: {
            all: 'Todas',
            host: 'Host',
            shared: 'Shared',
            none: 'Ninguna'
          },
          eligibleOptions: {
            all: 'Todas',
            yes: 'Sí',
            no: 'No'
          }
        },
        sections: {
          sharedClusters: 'Clústeres compartidos (host + beneficiarios)',
          noSharedClusters: 'No se encontraron clústeres compartidos con los filtros actuales.',
          eligibleNotShared: 'Elegibles sin compartir',
          noEligible: 'No hay suscripciones elegibles pendientes de compartir.'
        },
        role: {
          host: 'HOST',
          shared: 'SHARED',
          none: 'NONE'
        },
        card: {
          hostSubscription: 'Suscripción host',
          eligible: 'Elegible',
          notEligible: 'No elegible',
          clusterSize: 'Clúster: {{count}}',
          line: 'Línea',
          renewal: 'Renovación',
          capacity: 'Capacidad {{activated}} · Uso {{used}} · Disponible {{available}}',
          term: 'Duración {{months}} meses',
          status: 'Estado',
          beneficiaries: 'Beneficiarios',
          noBeneficiaries: 'No hay suscripciones SHARED vinculadas a este host.'
        },
        errors: {
          loadError: 'No se pudo cargar el overview de suscripciones compartidas.'
        }
      },
      licenses: {
        title: 'Licencias',
        search: 'Buscar (MAC, device key, cliente, suscripción, estado)',
        actions: {
          server: 'Cambiar servidor',
          transfer: 'Trasladar',
          history: 'Historial',
          removePlaylists: 'Quitar todas las playlists'
        },
        filters: { status: 'Estado', payment: 'Pago', all: 'Todos' },
        paid: { paid: 'Pagada', pending: 'Pendiente' },
        messages: {
          subscriptionsLoadError: 'No se pudieron cargar suscripciones.',
          linesLoadError: 'No se pudieron cargar líneas.',
          serversLoadError: 'No se pudieron cargar los servidores.',
          loadError: 'No se pudieron cargar las licencias.',
          customersLoadError: 'No se pudieron cargar los clientes.',
          required: 'Completa los campos requeridos.',
          invalidMac: 'Formato MAC inválido. Usa AA:BB:CC:DD:EE:FF.',
          created: 'Licencia creada.',
          updated: 'Licencia actualizada.',
          deleted: 'Licencia eliminada.',
          saveError: 'No se pudo guardar la licencia.',
          deleteError: 'No se pudo eliminar la licencia.'
        },
        headers: {
          id: 'ID',
          mac: 'MAC',
          deviceKey: 'Device key',
          name: 'Nombre',
          customer: 'Cliente',
          subscription: 'Suscripción',
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
          mac: 'Mac Address',
          macPlaceholder: 'AA:BB:CC:DD:EE:FF',
          macHelper: 'Formato: AA:BB:CC:DD:EE:FF',
          deviceKey: 'Device key',
          deviceKeyHelper: 'Llave opcional para este dispositivo',
          subscription: 'Suscripción',
          subscriptionNone: 'Sin suscripción relacionada',
          subscriptionSelectCustomer: 'Selecciona primero un cliente.',
          subscriptionHelper: 'Relación opcional con una suscripción del cliente.',
          subscriptionEmpty: 'Este cliente no tiene suscripciones disponibles.',
          paid: 'Estado de pago',
          paidHelper: 'Indica si esta licencia ya fue pagada'
        },
        server: {
          updated: 'Servidor actualizado.',
          error: 'No se pudo cambiar el servidor.',
          removeTitle: 'Quitar todas las playlists',
          removeBody: 'Esta acción eliminará todas las playlists de este dispositivo.',
          removeSubmit: 'Quitar playlists',
          removeSuccess: 'Se quitaron todas las playlists del dispositivo.',
          removeError: 'No se pudieron quitar las playlists del dispositivo.',
          removeRequired: 'La MAC del dispositivo es requerida.',
          removeNotAvailable: 'Esta acción aún no está disponible en backend.'
        },
        transfer: {
          error: 'No se pudo trasladar.'
        }
      },
      demos: {
        title: 'Demos Lion TV',
        listTitle: 'Listado de demos',
        search: 'Buscar (celular, usuario, paquete, app)',
        headers: {
          phone: 'Celular',
          email: 'Email',
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
        form: {
          macAddress: 'MAC Address',
          macPlaceholder: 'aa:bb:cc:dd:ee:ff'
        },
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
      plusLines: {
        title: 'Explorador de Líneas Plus',
        cards: {
          countries: 'Países con líneas plus',
          lines: 'Líneas plus',
          activeSubs: 'Suscripciones activas',
          unusedLines: 'Líneas plus sin uso',
          inactiveSubs: 'Suscripciones inactivas'
        },
        mapTitle: 'Mapa por país',
        pickCountry: 'Elige un país',
        searchLine: 'Buscar línea plus u owner en este país',
        searchLineHelper: 'Filtra las tarjetas de líneas de este país',
        emptyCountry: 'Selecciona un país para ver sus líneas plus',
        emptyLines: 'No hay líneas plus en este país',
        usageSummary: 'En uso activo: {{active}} · Sin uso activo: {{idle}} · Total líneas plus: {{total}}',
        unusedTitle: 'Líneas plus sin uso activo',
        unusedSubtitle: 'Estas líneas están creadas pero no tienen suscripciones activas. Pueden reutilizarse de inmediato.',
        max: 'Máx. conexiones',
        exp: 'Exp',
        unusedChip: 'Disponible para reutilizar',
        noActiveSubscriptions: 'Sin suscripciones activas asociadas.',
        onlyInactiveSubscriptions: 'Tiene {{count}} suscripción(es) total, pero ninguna activa.',
        seeLess: 'Ver menos',
        seeMore: 'Ver más ({{count}})',
        countryItemSummary: '{{lines}} líneas · {{active}} activas · {{unused}} sin uso',
        status: {
          pending: 'Pendiente',
          cancelled: 'Cancelada'
        },
        chips: {
          unusedLine: 'sin uso activo',
          activeSubs: '{{count}} activas',
          inactiveHistorical: '{{count}} inactivas históricas'
        },
        labels: {
          ownerNA: 'Sin owner'
        },
        semaphore: {
          green: 'Verde · {{pct}}%',
          yellow: 'Amarillo · {{pct}}%',
          red: 'Rojo · {{pct}}%'
        },
        subscription: {
          primaryMax: 'Max conexiones línea primaria: {{count}}'
        },
        errors: {
          summaryLoad: 'No se pudo cargar el resumen.',
          linesLoad: 'No se pudieron cargar las líneas plus.',
          subscriptionsLoad: 'No se pudieron cargar suscripciones.'
        }
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
        channels: {
          social: 'Red social',
          google: 'Google',
          family: 'Familiares',
          friends: 'Amigos'
        },
        status: {
          ACTIVE: 'ACTIVO',
          INACTIVE: 'INACTIVO',
          BLOCKED: 'BLOQUEADO',
          SUSPENDED: 'SUSPENDIDO'
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
          loadError: 'No se pudieron cargar los clientes.',
          referersLoadError: 'No se pudieron cargar los referidores.',
          createError: 'No se pudo crear el cliente.',
          missingCustomerId: 'No se pudo identificar el cliente.',
          updateError: 'No se pudo actualizar el cliente.',
          missingDeleteId: 'No se pudo identificar el cliente a eliminar.',
          deleteError: 'No se pudo eliminar el cliente.',
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
      panelAuthAdmin: {
        title: 'Integraciones de Panel',
        subtitle: 'Administra credenciales de Vivo Player y 9xtream por usuario del sistema desde un solo módulo seguro.',
        actions: {
          refresh: 'Refrescar',
          new: 'Nueva integración',
          edit: 'Editar',
          activate: 'Activar',
          deactivate: 'Inactivar',
          delete: 'Eliminar',
          cancel: 'Cancelar',
          save: 'Guardar cambios',
          create: 'Crear'
        },
        filters: {
          username: 'Usuario del sistema',
          provider: 'Proveedor',
          status: 'Estado',
          all: 'Todos',
          active: 'Activos',
          inactive: 'Inactivos'
        },
        table: {
          user: 'Usuario',
          provider: 'Proveedor',
          panelUser: 'Usuario de panel',
          apiUrl: 'URL API',
          cmsUrl: 'URL CMS',
          status: 'Estado',
          updatedAt: 'Actualizado',
          actions: 'Acciones',
          empty: 'No se encontraron integraciones con los filtros actuales.'
        },
        form: {
          username: 'Usuario del sistema',
          provider: 'Proveedor',
          usernamePanel: 'Usuario de panel',
          password: 'Password de panel',
          passwordOptional: 'Password de panel (opcional)',
          apiBaseUrl: 'URL base API',
          cmsBaseUrl: 'URL base CMS'
        },
        status: {
          active: 'ACTIVO',
          inactive: 'INACTIVO'
        },
        dialogs: {
          createTitle: 'Crear integración',
          editTitle: 'Editar integración',
          deleteTitle: 'Eliminar integración',
          deleteMessage: 'Esta acción eliminará permanentemente esta integración de panel.'
        },
        messages: {
          apiMissing: 'VITE_API_VIVO_PLAYER no está configurado. Agrega esta variable de entorno para usar este módulo.',
          requiredFields: 'Completa usuario, proveedor y usuario de panel.',
          passwordRequired: 'El password es obligatorio al crear una integración.',
          loadError: 'No se pudieron cargar las integraciones de panel.',
          created: 'Integración creada correctamente.',
          updated: 'Integración actualizada correctamente.',
          deleted: 'Integración eliminada correctamente.',
          saveError: 'No se pudo guardar la integración.',
          deleteError: 'No se pudo eliminar la integración.',
          statusUpdated: 'Estado actualizado correctamente.',
          statusError: 'No se pudo actualizar el estado.'
        }
      },
      sidebarRadar: {
        title: 'Radar Operativo',
        subtitle: 'Vencimientos y cobranza',
        today: 'Hoy',
        tomorrow: 'Mañana',
        next7Days: 'Próximos 7 días',
        pendingCollection: 'Cobranza pendiente',
        invoices: 'Facturas: {{val}}',
        commitments: 'Compromisos: {{val}}',
        updatedAt: 'Actualizado: {{time}}',
        openTracking: 'Abrir seguimiento',
        partial: 'Radar parcial: algunos módulos no cargaron.',
        loadError: 'No se pudo cargar el radar operativo.'
      },
      liontvDashboard: {
        loading: 'Cargando seguimiento operativo...',
        loadError: 'No se pudo cargar el módulo de seguimiento.',
        empty: 'No hay datos suficientes para construir alertas todavía.',
        partialLoad: 'Se cargaron datos parciales para seguimiento.',
        infoBanner: 'Módulo de seguimiento para no olvidar nada: vencimientos, pendientes, riesgos y próximos eventos del negocio.',
        horizonLabel: 'Horizonte de alertas:',
        daysChip: '{{days}} días',
        criticalOnly: 'Solo críticos',
        actions: {
          open: 'Abrir',
          view: 'Ver',
          openInvoices: 'Abrir facturas',
          openCommitments: 'Abrir compromisos'
        },
        sections: {
          trackingByDate: 'Seguimiento por fecha',
          detailByDate: 'Detalle por fecha',
          expiryRadar: 'Radar de vencimientos',
          priorityQueue: 'Cola de alertas priorizada',
          pendingInvoices: 'Facturas pendientes',
          pendingCommitments: 'Compromisos de pago pendientes'
        },
        metrics: {
          todayAlerts: { title: 'Alertas de hoy', helper: 'vence hoy' },
          tomorrowAlerts: { title: 'Alertas de mañana', helper: 'vence en 1 día' },
          next7Alerts: { title: 'Alertas a 7 días', helper: 'desde 2 hasta 7 días' },
          criticalAlerts: { title: 'Alertas críticas', helper: '{{count}} vencen hoy/1 día' },
          highAlerts: { title: 'Alertas altas', helper: '{{count}} vencidas recientes' },
          horizonAlerts: { title: 'Próximos {{days}} días', helper: '{{count}} en 7 días' },
          pendingInvoices: { title: 'Facturas pendientes' },
          pendingCommitments: { title: 'Compromisos pendientes' },
          lostCustomers: { title: 'Clientes perdidos', helper: 'vencidos > {{days}} días' }
        },
        buckets: {
          today: { title: 'Detalle de hoy', helper: 'Casos que vencen hoy' },
          tomorrow: { title: 'Detalle de mañana', helper: 'Casos que vencen en 1 día' },
          next7: { title: 'Detalle próximos 7 días', helper: 'Casos que vencen entre 2 y 7 días' }
        },
        labels: {
          alertsCount: '{{count}} alertas',
          customer: 'Cliente',
          status: 'Estado',
          appFallback: 'APP',
          planFallback: 'Plan'
        },
        table: {
          priority: 'Prioridad',
          type: 'Tipo',
          reference: 'Referencia',
          customer: 'Cliente',
          targetDate: 'Fecha objetivo',
          status: 'Estado',
          detail: 'Detalle',
          action: 'Acción',
          id: 'ID',
          pendingAmount: 'Monto pendiente',
          dueDate: 'Vence',
          promisedDate: 'Fecha promesa'
        },
        messages: {
          noAlertsInBucket: 'Sin alertas en este bloque.',
          queueEmpty: 'No hay alertas en este rango. Todo está bajo control.',
          noPendingInvoices: 'No hay facturas pendientes.',
          noPendingCommitments: 'No hay compromisos pendientes.',
          operationalRecommendation:
            'Recomendación operativa: revisa primero alertas críticas y luego altas. Los vencidos muy antiguos pasan a perdido para seguimiento comercial y ya no saturan la prioridad crítica.'
        },
        severity: {
          critical: 'Crítico',
          high: 'Alto',
          medium: 'Medio',
          lost: 'Perdido',
          low: 'Bajo'
        },
        due: {
          noDate: 'Sin fecha',
          overdueAgo: 'Vencido hace {{days}}d',
          today: 'Vence hoy',
          inDays: 'Vence en {{days}}d'
        },
        types: {
          license: 'Licencia',
          subscription: 'Suscripción',
          line: 'Línea',
          managedAccount: 'Managed Account',
          pendingInvoice: 'Factura pendiente',
          paymentCommitment: 'Compromiso de pago',
          licensePlural: 'Licencias',
          subscriptionPlural: 'Suscripciones',
          linePlural: 'Líneas',
          managedAccountPlural: 'Managed Accounts'
        },
        reference: {
          invoice: 'Factura #{{id}}',
          commitment: 'Compromiso #{{id}}'
        },
        radar: {
          overdue: 'Vencidos: {{count}}',
          today: 'Hoy: {{count}}',
          next7: '7 días: {{count}}',
          next30: '30 días: {{count}}',
          noDate: 'Sin fecha: {{count}}'
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
        headers: {
          id: 'ID'
        },
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
        import: {
          success: 'Payload importado correctamente.',
          error: 'No se pudo importar el payload.'
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
          deleted: 'Registro de feed de películas eliminado correctamente.',
          import: {
            button: 'Importar desde Alluko',
            title: 'Importación desde Alluko',
            helper:
              'Autentícate manualmente en Alluko, copia el valor del header Cookie desde un request autenticado y úsalo para traer el JSON al payload.',
            cookieLabel: 'Cookie header autenticado',
            cookiePlaceholder: 'PHPSESSID=...; xm_simple_security_check=...; saved_access_code=subadmin; ...',
            categoryLabel: 'Categoría (opcional)',
            categoryPlaceholder: 'Vacío para todas',
            fetch: 'Traer desde Alluko',
            fetching: 'Importando...',
            success: 'Payload importado desde Alluko.',
            error: 'No se pudo importar desde Alluko.'
          }
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
      catalog: {
        title: 'Curación Catálogo Base Global',
        actions: {
          refresh: 'Refrescar',
          refreshProviders: 'Refrescar providers',
          loading: 'Cargando...',
          importing: 'Importando...',
          import: 'Importar catálogo',
          downloading: 'Descargando...',
          downloadM3u: 'Descargar M3U',
          testing: 'Probando...',
          fullFlowTest: 'Probar flujo completo',
          clearFilters: 'Limpiar filtros',
          applyFilters: 'Aplicar filtros',
          openCatalog: 'Abrir catálogo base',
          openLineSources: 'Abrir M3U por línea'
        },
        overview: {
          baseEyebrow: 'Preparación global del catálogo',
          baseTitle: 'Prepara el catálogo maestro antes de tocar líneas individuales',
          baseDescription:
            'Esta pantalla es la capa compartida de preparación: guarda la fuente global, importa la playlist maestra, clasifica títulos y define las categorías que luego moldean el agrupado final de la M3U.',
          lineEyebrow: 'Flujo Xtream por línea',
          lineTitle: 'Configura, valida y descarga la M3U final por lineId',
          lineDescription:
            'Esta pantalla guía al operador una línea a la vez: elige la línea, guarda la configuración del provider, ajusta la plantilla Xtream y solo entonces ejecuta importar o descargar.'
        },
        flow: {
          title: 'Flujo del operador',
          baseSetupTitle: 'Guardar fuente base global',
          baseSetupBody: 'Define la URL playlist maestra y el provider usados para curar el catálogo compartido.',
          baseImportTitle: 'Importar el catálogo compartido',
          baseImportBody: 'Ejecuta la importación base para poblar los items que luego alimentan el match de categorías.',
          curateTitle: 'Asignar categorías manuales',
          curateBody: 'Revisa títulos, afina filtros y asigna categorías que deban imponerse sobre la salida final.',
          lineRunTitle: 'Continuar a M3U por línea',
          lineRunBody: 'Pasa a la pantalla por línea solo cuando el catálogo base se sienta listo.',
          linePickTitle: 'Elegir la línea',
          linePickBody: 'Elige la línea que quieres operar.',
          lineAssignTitle: 'Guardar configuración de línea',
          lineAssignBody: 'Asigna provider y TTL de cache para la línea seleccionada.',
          templateTitle: 'Ajustar plantilla del provider',
          templateBody: 'Define el host Xtream común, el tipo y el output de este provider.',
          runTitle: 'Importar y descargar',
          runBody: 'Ejecuta la importación de catálogo y descarga la M3U final por lineId.'
        },
        lineSources: {
          title: 'Configuración M3U por Línea',
          howItWorks: 'Cómo funciona este módulo',
          step1: '1) Selecciona la línea por lineId. El selector muestra username_encode para identificarla visualmente.',
          step2: '2) Asigna provider y TTL por línea. La URL origen se arma dinámicamente con la plantilla Xtream del provider y las credenciales actuales de la línea.',
          step3: '3) Configura la plantilla Xtream del provider y luego importa o descarga la M3U final por lineId.',
          flowSummary:
            'La pantalla ahora está separada por paso operativo, para que el usuario vea qué ya está configurado y qué sigue bloqueando la ejecución.',
          readyHint: 'Esta línea ya está lista para importar y descargar la M3U final.',
          pendingHint: 'Completa los pasos pendientes debajo. El sistema resuelve automáticamente las credenciales Xtream reales desde la línea activa.',
          configTitle: 'Configuración por línea',
          configBody:
            'Primero identifica la línea visualmente y luego guarda el provider y la política de cache que el backend debe usar para esa línea.',
          lineSelect: 'Selecciona línea (lineId / usernameEncode)',
          lineSelectHelper: 'Este selector usa /api/v1/line-sources/line-options y ya no depende de token.',
          lineSelectPlaceholder: 'Seleccionar línea...'
        },
        baseHowItWorks: {
          title: 'Proceso recomendado',
          summary:
            'El operador debería sentir una secuencia clara aquí: definir la fuente compartida, importar el catálogo, curar categorías y solo entonces pasar al módulo de ejecución por línea.',
          step1: '1) Configura aquí una única URL base global y guárdala.',
          step2: '2) Ejecuta "Importar base" para poblar catálogo base y asignar categorías manuales.',
          step3: '3) La configuración por línea y las pruebas por lineId se hacen en "M3U Line Sources".'
        },
        baseSource: {
          title: 'Fuente M3U Base Global',
          body:
            'Usa una playlist compartida como catálogo maestro. Aquí empieza la categorización global, no la reproducción por línea.',
          url: 'URL playlist base',
          urlHelper: 'Esta lista es el catálogo maestro global para categorizar y hacer override.',
          provider: 'Proveedor base',
          providerHelper: 'Nombre referencial del origen base global.',
          ttl: 'TTL (min)',
          ttlHelper: 'Ventana de refresco de referencia para catálogo base.',
          active: 'Fuente activa',
          reload: 'Recargar',
          save: 'Guardar fuente base',
          saving: 'Guardando...',
          import: 'Importar base',
          importing: 'Importando...',
          loading: 'Cargando...',
          lastDownload: 'Última descarga',
          updatedAt: 'Actualizado'
        },
        source: {
          lineId: 'Line ID',
          lineIdHelper: 'Identificador técnico de la línea seleccionada.',
          usernameEncode: 'Username visible',
          usernameEncodeHelper: 'Valor mostrado para identificar la línea; el backend resuelve internamente el username técnico vigente.',
          provider: 'Provider asignado',
          providerHelper: 'Selecciona el provider cuya plantilla Xtream debe usarse para esta línea.',
          ttl: 'TTL cache (min)',
          ttlHelper: 'Tiempo de cache para playlist final por lineId.',
          active: 'Fuente activa',
          load: 'Cargar configuración',
          loading: 'Cargando...',
          save: 'Guardar configuración',
          saving: 'Guardando...',
          lastDownload: 'Última descarga',
          updatedAt: 'Actualizado'
        },
        import: {
          title: 'Prueba operativa por lineId',
          body:
            'Usa estas acciones solo después de guardar tanto la línea como la plantilla del provider. Esta sección está pensada para ejecutar, no para configurar.',
          lineFlowHelper: 'Importación y descarga final ahora usan /api/v1/catalog/import/line/{lineId} y /api/v1/m3u/line/{lineId}.',
          lineId: 'Line ID seleccionado',
          lineIdHelper: 'Selecciona una línea arriba para operar el flujo completo.'
        },
        providerTemplates: {
          title: 'Plantilla Xtream por provider',
          body:
            'Esta plantilla define el host común y el formato de respuesta del provider. Las credenciales de la línea se inyectan automáticamente cuando el flujo corre.',
          provider: 'Provider',
          providerHelper: 'La plantilla define el host/base Xtream común; el backend agrega las credenciales actuales de la línea.',
          baseUrl: 'Base URL Xtream',
          playlistType: 'Playlist type',
          outputFormat: 'Output',
          active: 'Plantilla activa',
          load: 'Cargar plantilla',
          loading: 'Cargando...',
          save: 'Guardar plantilla',
          saving: 'Guardando...',
          updatedAt: 'Actualizado'
        },
        filters: {
          title: 'Filtros catálogo base',
          body:
            'Filtra fuerte, revisa la página actual y asigna categorías manuales solo donde el catálogo global realmente necesita guía.',
          all: 'Todos',
          type: 'Tipo detectado',
          active: 'Activo',
          search: 'Buscar',
          searchPlaceholder: 'rawTitle, canonicalTitle, groupTitle, tvgName'
        },
        summary: {
          totalItems: 'Total items',
          categories: 'Categorías',
          pageAssigned: '{{count}} asignados en esta página'
        },
        status: {
          baseSource: 'Fuente base',
          lastDownload: 'Última descarga',
          catalogItems: 'Items del catálogo',
          categories: 'Categorías',
          selectedLine: 'Línea seleccionada',
          provider: 'Provider',
          template: 'Plantilla',
          actionsReady: 'Acciones listas',
          lineSnapshot: 'Resumen de la línea',
          lineSnapshotEmpty: 'Selecciona una línea para ver su identidad actual y el hint de provider.',
          prerequisites: 'Checklist de ejecución',
          assignedItems: '{{count}} asignados en esta página',
          providerUnset: 'Provider no seleccionado',
          templateHelper: 'Guarda la base URL para habilitar importaciones.',
          pendingValue: 'Pendiente',
          readyValue: 'Listo',
          missingValue: 'Falta',
          activeValue: 'Activo',
          inactiveValue: 'Inactivo'
        },
        hints: {
          dynamicUrl:
            'La URL fuente no se guarda por línea. Solo se guardan el provider y las reglas de cache; el backend construye la URL Xtream real con las credenciales de la línea activa.',
          categoryImpact:
            'Las categorías manuales definidas desde este catálogo base se reutilizan luego cuando se genera la M3U final para cada línea.',
          baseScope: 'Esta pantalla es global. No guarda credenciales por línea ni plantillas por provider.',
          nextAfterBase: 'El catálogo base ya está suficientemente listo para continuar con el trabajo M3U por línea.',
          dynamicPreview: 'Preview Xtream resuelto'
        },
        table: {
          title: 'Título',
          type: 'Tipo',
          groupTitle: 'Group original',
          primaryCategory: 'Categoría manual',
          noManualCategory: 'Sin asignación manual',
          active: 'Activo',
          updated: 'Actualizado',
          actions: 'Acciones',
          helper:
            'Estas categorías manuales son el lugar más claro para curar el agrupado final. Primero filtra y luego abre el detalle o asigna directamente desde la tabla.'
        },
        categories: {
          title: 'Gestión de categorías',
          body:
            'Las categorías definidas aquí son el lenguaje compartido del agrupado M3U posterior. Mantén la taxonomía limpia y fácil de escanear.',
          new: 'Nueva categoría',
          createTitle: 'Crear categoría',
          name: 'Nombre',
          active: 'Activa'
        },
        assign: {
          title: 'Asignar categoría manual',
          item: 'Item',
          category: 'Categoría',
          clearPrimary: 'Quitar categoría manual primaria',
          primary: 'Asignar como primaria',
          assignedBy: 'Asignado por'
        },
        detail: {
          title: 'Detalle del item'
        },
        messages: {
          baseSourceLoadError: 'No se pudo cargar la fuente base.',
          baseSourceRequired: 'La URL base es obligatoria.',
          baseSourceSaved: 'Fuente base guardada correctamente.',
          baseSourceSaveError: 'No se pudo guardar la fuente base.',
          baseImportSuccess: 'Importación base completada.',
          baseImportError: 'No se pudo importar la lista base.',
          loadItemsError: 'No se pudo cargar el catálogo base.',
          loadCategoriesError: 'No se pudieron cargar las categorías.',
          itemDetailError: 'No se pudo cargar el detalle.',
          assignSuccess: 'Asignación actualizada.',
          assignError: 'No se pudo actualizar la asignación.',
          categoryNameRequired: 'El nombre de categoría es obligatorio.',
          categoryCreateSuccess: 'Categoría creada correctamente.',
          categoryCreateError: 'No se pudo crear la categoría.',
          noItems: 'No se encontraron items con los filtros actuales.',
          lineOptionsLoadError: 'No se pudieron cargar las líneas activas.',
          lineRequired: 'Line ID es obligatorio.',
          lineSourceNotFound: 'No existe configuración guardada para esa línea.',
          lineSourceLoadError: 'No se pudo cargar la fuente de línea.',
          lineSourceRequiredFields: 'Line ID y provider son obligatorios.',
          lineSourceSaved: 'Fuente guardada correctamente.',
          lineSourceSaveError: 'No se pudo guardar la fuente.',
          providerTemplatesLoadError: 'No se pudieron cargar las plantillas Xtream.',
          providerTemplateNotFound: 'No existe plantilla guardada para ese provider.',
          providerTemplateLoadError: 'No se pudo cargar la plantilla Xtream.',
          providerTemplateRequiredFields: 'Provider y baseUrl son obligatorios.',
          providerTemplateSaved: 'Plantilla Xtream guardada correctamente.',
          providerTemplateSaveError: 'No se pudo guardar la plantilla Xtream.',
          lineRequiredForImport: 'Selecciona una línea para importar.',
          importSuccess: 'Importación completada.',
          importError: 'No se pudo importar el catálogo.',
          lineRequiredForDownload: 'Selecciona una línea para descargar la playlist.',
          downloadSuccess: 'Playlist descargada correctamente.',
          downloadError: 'No se pudo descargar la playlist.',
          fullFlowSuccess: 'Flujo completo OK: importación + descarga.',
          fullFlowError: 'Falló la prueba completa del flujo.'
        }
      },
      common: {
        close: 'Cerrar',
        yes: 'Sí',
        no: 'No',
        cancel: 'Cancelar',
        save: 'Guardar',
        clear: 'Limpiar',
        create: 'Crear',
        creating: 'Creando...',
        saving: 'Guardando...',
        saveChanges: 'Guardar cambios',
        deleting: 'Eliminando...',
        edit: 'Editar',
        new: 'Nuevo',
        selectOption: 'Selecciona una opción'
      },
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
