import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { lionTvProfessionalTranslations } from './locales/liontvProfessionalTranslations';

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
        liontvCommercialCaption: 'CRM, collections and commercial',
        vipCustomers: 'VIP Customers',
        loyalty: 'Loyalty',
        raffles: 'Raffles',
        liontvOperations: 'Technical Operations',
        liontvOperationsCaption: 'Inventory, lines and accounts',
        liontvContent: 'Content & Feed',
        liontvContentCaption: 'Demos and visible catalog',
        demos: 'Lion TV Demos',
        subscriptions: 'Subscriptions',
        salesWorkflow: 'Sales & Renewals',
        invoices: 'Invoices',
        businessPurchases: 'Business Purchases',
        creditRequests: 'Credit Requests',
        customers: 'Customers',
        potentialCustomers: 'Potential Customers',
        referrals: 'Referral Leads',
        paymentCommitments: 'Payment Commitments',
        crm: 'Customer CRM',
        lines: 'Lines',
        plusLines: 'Plus Lines',
        m3uBackupLinks: 'M3U Backup Links',
        subscriptionExpiration: 'Subscription Expiration',
        subscriptionExpirationCaption: 'Critical expiration monitoring',
        subscriptionSharing: 'Shared Subscriptions',
        resellerWallet: 'Credit Wallet',
        resellerSupport: 'Support Center',
        ecommerceContactRouting: 'Ecommerce Contact Routing',
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
        panelAuthsCaption: 'Vivo Player and 9xtream credentials by user',
        catalogs: 'Catalogs',
        catalogsCaption: 'catalogs for system',
        catalogBanks: 'Banks',
        catalogServices: 'Services',
        catalogLicenseApps: 'License Apps',
        catalogCountryPhoneCodes: 'Country Phone Codes',
        catalogPackages: 'Packages',
        liontvMarketing: 'Marketing',
        liontvMarketingCaption: 'Email templates and campaigns',
        emailTemplates: 'Email Templates',
        emailCampaigns: 'Email Campaigns',
        contentAutomation: 'Content Automation'
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
      headerCredits: {
        label: '{{count}} credits',
        shortLabel: '{{count}} cr',
        tooltip: 'Open the wallet to request or review credits.'
      },
      invoices: {
        title: 'Invoices',
        summary: {
          total: '{{count}} invoices',
          paid: 'Status: PAID {{count}}',
          pending: 'Status: PENDING {{count}}'
        },
        filters: { status: 'Status', customer: 'Customer', all: 'All', allCustomers: 'All customers' },
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
          loyalty: 'Loyalty',
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
            loyalty: 'Loyalty',
            loyaltyHelper: 'Check available points and apply them directly on the invoice.',
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
          loyalty: {
            availablePoints: 'Available points',
            pointsToUse: 'Points to use',
            redeemedAmount: 'Redeemed amount',
            selectCustomerFirst: 'Select a customer first.',
            noEarnForPackage: 'This package does not accumulate loyalty points when the invoice is paid.',
            exceeded: 'Requested points exceed the available balance.',
            maxAvailable: 'Available for this invoice: {{count}} pts',
            conversion: '{{points}} point(s) = L {{amount}}',
            inactive: 'Loyalty disabled',
            inactiveHelp: 'The loyalty program is inactive. Activate it before charging with points.',
            helper: 'Redeemed points are deducted in the loyalty ledger when the invoice is saved.',
            netAfter: 'Net after discount and points: L {{amount}}',
            amountExceeded: 'Points exceed the net amount available.',
            configError: 'Could not load the loyalty configuration.',
            balanceError: 'Could not load the customer point balance.'
          },
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
            debit: 'Automatic debit',
            cryptocurrency: 'Cryptocurrency',
            loyalty: 'Loyalty points'
          }
        },
        messages: {
          required: 'Please complete required fields.',
          needBank: 'Select a bank for Bank Transfer payments.',
          loyaltyInactive: 'The loyalty program is inactive for this account.',
          loyaltyExceeded: 'The customer does not have enough available points.',
          loyaltyAmountExceeded: 'The points exceed the invoice net amount.',
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
      creditRequests: {
        subtitle:
          'Approve reseller credit requests from one screen and automatically credit the wallet of the reseller who created the request.',
        loading: 'Loading reseller credit requests...',
        helper:
          'Approving a request marks it as paid and credits the wallet of the reseller who created it. Approval is idempotent and will not duplicate credits.',
        filters: {
          search: 'Search by reseller, code, note or request name',
          status: 'Status',
          allStatuses: 'All statuses'
        },
        kpi: {
          total: 'Visible requests',
          totalHelper: 'Requests that match the current admin filters.',
          pending: 'Pending',
          pendingHelper: 'Requests still waiting for approval.',
          approved: 'Approved',
          approvedHelper: 'Requests already credited to reseller wallets.',
          credits: 'Credits requested',
          creditsHelper: 'Total credits represented by the visible requests.'
        },
        headers: {
          request: 'Request',
          reseller: 'Reseller',
          credits: 'Credits',
          created: 'Created',
          status: 'Status',
          notes: 'Notes',
          actions: 'Actions'
        },
        status: {
          pending: 'Pending',
          paid: 'Approved',
          cancelled: 'Cancelled'
        },
        labels: {
          fallbackName: 'Credit request',
          alreadyApproved: 'Already approved',
          noAction: 'No action'
        },
        actions: {
          approve: 'Approve',
          approving: 'Approving...',
          confirmApprove: 'Approve and credit'
        },
        dialog: {
          title: 'Approve credit request',
          helper: 'This action will mark the request as approved and credit the reseller wallet automatically.',
          reseller: 'Reseller: {{username}}',
          credits: 'Credits: {{credits}}',
          requestCode: 'Request code: {{code}}',
          notes: 'Notes: {{notes}}'
        },
        empty: {
          title: 'No credit requests found',
          description: 'Try another status or wait for new reseller requests.'
        },
        messages: {
          approved: '{{credits}} credits were approved and credited to {{username}}.'
        },
        errors: {
          load: 'Could not load credit requests.',
          approve: 'Could not approve this credit request.'
        }
      },
      contentAutomation: {
        subtitle: 'Review the four daily sports posts, validate the SAFE copy, and publish only after manual approval.',
        loading: 'Loading content automation review console...',
        safeMode: 'SAFE mode',
        safeModeOff: 'SAFE mode disabled',
        filters: {
          today: 'Today',
          tomorrow: 'Tomorrow',
          date: 'Date',
          tomorrowHelper:
            'Tomorrow is the default review date because this console is designed to validate what will be published next.',
          historyHelper:
            'You are reviewing a specific date snapshot. You can generate posts for this exact day whenever you need a manual batch.'
        },
        branding: {
          modeGeneric: 'Generic watermark',
          modeReseller: 'Reseller watermark',
          resellerLabel: 'Reseller',
          resellerPlaceholder: 'Search by username',
          resellerConfigured: 'Support phone: {{phone}}',
          resellerMissing: 'Support phone not configured',
          previewGeneric: 'The poster watermark will stay on the generic Lion TV brand for this generation batch.',
          previewReady: 'The poster watermark will use {{phone}} for reseller {{username}}.',
          previewMissing: 'Choose a reseller with a configured support phone to generate branded content.',
          errors: {
            lookup: 'Could not load reseller support profiles.',
            resellerRequired: 'Select a reseller to generate branded content.',
            supportMissing: 'The selected reseller does not have a support phone configured in Support Center.'
          }
        },
        teamLogos: {
          title: 'Team logo catalog',
          subtitle:
            'Configure manual team logos by sport and name. These overrides apply the next time you generate or regenerate the post image.',
          priority: 'Priority order: manual catalog, provider event logo, automatic TheSportsDB lookup, then fallback badge.',
          loading: 'Loading team logo catalog...',
          empty: 'No team logos match the current filters yet.',
          summary: {
            total: '{{count}} catalog logos'
          },
          filters: {
            search: 'Search team',
            searchPlaceholder: 'Search by team name',
            sport: 'Sport',
            status: 'Status',
            allSports: 'All sports',
            allStatuses: 'All',
            enabled: 'Enabled',
            disabled: 'Disabled'
          },
          table: {
            logo: 'Logo',
            team: 'Team',
            sport: 'Sport',
            url: 'URL',
            status: 'Status',
            updatedAt: 'Updated',
            actions: 'Actions'
          },
          actions: {
            new: 'New logo'
          },
          dialog: {
            createTitle: 'New team logo',
            editTitle: 'Edit team logo',
            subtitle:
              'Use the exact team name you expect from the event feed. This override applies on the next image generation.',
            sport: 'Sport',
            teamName: 'Team name',
            logoUrl: 'Logo URL',
            logoHelper: 'Use a direct http:// or https:// image URL.',
            enabled: 'Enabled'
          },
          delete: {
            title: 'Delete team logo',
            body:
              'This will remove the manual override and the system will fall back to provider, automatic lookup, or the generated badge.'
          },
          messages: {
            created: 'The team logo was created successfully.',
            updated: 'The team logo was updated successfully.',
            deleted: 'The team logo was deleted successfully.'
          },
          errors: {
            load: 'Could not load the team logo catalog.',
            save: 'Could not save the team logo.',
            delete: 'Could not delete the team logo.',
            required: 'Sport, team name and logo URL are required.',
            invalidUrl: 'Use a valid http:// or https:// image URL.'
          }
        },
        kpis: {
          posts: 'Posts',
          postsHelper: 'Posts currently loaded for the selected review date.',
          generated: 'Generated',
          generatedHelper: 'Posts ready for editorial review and approval.',
          approved: 'Approved',
          approvedHelper: 'Posts already validated and ready to publish.',
          published: 'Published',
          publishedHelper: 'Posts that were sent to the selected publishing flow.',
          failed: 'Failed',
          failedHelper: 'Posts that need manual intervention before they can move forward.'
        },
        events: {
          title: 'Tomorrow events',
          subtitle:
            'Real fixtures detected for tomorrow in Honduras time. The cards below use the slot distribution plus the full-day pool to build the review content.',
          count: '{{count}} real events',
          emptySlot: 'No featured events were detected in this block.'
        },
        slotsReviewTitle: 'Daily slot review',
        slotsReviewSubtitle:
          'Each slot keeps one professional review card with the final status, sanitized copy and image preview.',
        slots: {
          all_day: 'All day',
          morning: 'Morning',
          afternoon: 'Afternoon',
          night: 'Night'
        },
        slotCard: {
          emptyTitle: 'No generated post yet',
          previewPending: 'Preview image is not available yet.',
          eventCount: '{{count}} real events',
          selectedEvents: '{{count}} selected for image',
          updatedAt: 'Updated {{value}}',
          resellerLabel: 'Reseller: {{username}}',
          phoneLabel: 'Phone: {{phone}}',
          captionLabel: 'Caption summary',
          emptyCaption: 'Generate this slot to prepare the review copy and image.'
        },
        actions: {
          generateTomorrow: 'Generate tomorrow',
          generateDate: 'Generate selected date',
          generating: 'Generating...',
          previewImage: 'Preview image',
          safePreview: 'Safe preview',
          selectEvents: 'Select events',
          clearSelections: 'Clear selections',
          useAutomaticSelection: 'Use automatic selection',
          applySelectedEvents: 'Apply selected events',
          applyingSelection: 'Applying selection...',
          regenerateImage: 'Regenerate image',
          regenerateCaptions: 'Regenerate captions',
          approve: 'Approve',
          publish: 'Publish',
          confirmApprove: 'Approve post',
          confirmPublish: 'Publish post'
        },
        selectionDialog: {
          title: 'Select the events that should appear in the image',
          loading: 'Loading selectable events...',
          subtitle:
            'Choose up to 5 real events for this slot. The system will regenerate the image and captions using exactly this editorial selection.',
          subtitleAllDay:
            'Choose up to 5 real events from the full day. The system will regenerate the image and captions using exactly this editorial selection.',
          searchLabel: 'Search events',
          searchPlaceholder: 'Search events, leagues or teams',
          allCategories: 'All categories',
          selectedCount: '{{count}} selected',
          limit: 'Maximum 5 events in the image',
          manual: 'Manual selection currently active',
          automatic: 'Automatic featured selection is currently active',
          empty: 'No real events are available for this slot yet. Generate or import events first.',
          emptyAllDay: 'No real events are available for this day yet. Generate or import events first.',
          fallbackLeague: 'Sporting event',
          noMatch: 'No events match the current filters.',
          filtersSummary: '{{count}} events match the active filters.',
          groupCount: '{{count}} events',
          sports: {
            SOCCER: 'Fútbol',
            BASKETBALL: 'NBA / Basketball',
            AMERICAN_FOOTBALL: 'NFL',
            BASEBALL: 'MLB',
            MOTORSPORT: 'F1',
            TENNIS: 'Tennis',
            OTHER: 'Other sports'
          }
        },
        previewDialog: {
          title: 'Rendered image preview'
        },
        safePreviewDialog: {
          title: 'SAFE preview',
          loading: 'Loading SAFE preview...',
          clean: 'No direct URL or domain detected',
          review: 'Review CTA and remove direct URL references',
          caption: 'Sanitized caption'
        },
        confirm: {
          approveTitle: 'Approve generated post',
          approveDescription: 'This will mark the slot as approved and keep it ready for manual publishing.',
          publishTitle: 'Publish approved post',
          publishDescription: 'This will send the slot through the configured publishing flow and mark it as published.'
        },
        empty: {
          tomorrow: 'No daily posts were generated for tomorrow yet. Use "Generate tomorrow" to build the review set.',
          history: 'No posts were stored for this date yet. Select another day or generate this specific review batch.'
        },
        status: {
          DRAFT: 'Draft',
          GENERATED: 'Generated',
          APPROVED: 'Approved',
          PUBLISHED: 'Published',
          FAILED: 'Failed'
        },
        messages: {
          generated: '{{count}} posts were refreshed for {{date}}.',
          eventsSelectionSaved: 'The post was regenerated with your selected events.',
          eventsSelectionReset: 'The slot returned to the automatic featured selection.',
          imageRegenerated: 'The preview image was regenerated successfully.',
          captionsRegenerated: 'The captions were regenerated successfully.',
          approved: 'The post is now approved for publishing.',
          published: 'The post was published successfully.'
        },
        errors: {
          loadPosts: 'Could not load content automation posts.',
          loadEvents: 'Could not load tomorrow events.',
          loadSelectableEvents: 'Could not load the available events for this slot.',
          generate: 'Could not generate posts for the selected date.',
          previewMissing: 'Preview image is not available yet.',
          selectionLimit: 'You can only place up to 5 events in the image template.',
          saveSelectedEvents: 'Could not apply the selected events to this post.',
          resetSelectedEvents: 'Could not restore the automatic event selection.',
          safePreview: 'Could not load the safe preview.',
          slotFailed: 'This slot failed and needs attention.'
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
          provider: 'Proveedor',
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
        search: 'Search (customer, line, package, status, provider, country)',
        filters: {
          status: 'Status',
          customer: 'Customer',
          provider: 'Provider',
          customerCountry: 'Country',
          all: 'All',
          allCustomers: 'All customers',
          allProviders: 'All providers',
          allCountries: 'All countries',
          unknownCountry: 'Unknown country',
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
          copySuccess: 'Subscription copy generated.',
          copyError: 'Could not generate subscription copy.',
          m3uCopySuccess: 'M3U list copied.',
          m3uCopyError: 'Could not generate the M3U list.',
          m3uPlusCopySuccess: 'Plus M3U list copied.',
          m3uPlusCopyError: 'Could not generate the Plus M3U list.',
          countryCodesLoadError: 'Could not load country phone codes.',
          notificationError: 'Could not send notification.',
          required: 'Complete required fields.',
          created: 'Subscription created successfully.',
          updated: 'Subscription updated successfully.',
          deleted: 'Subscription deleted successfully.',
          saveError: 'Could not save subscription.',
          deleteError: 'Could not delete subscription.'
        },
        actions: {
          new: 'New subscription',
          notifyExpiration: 'Send expiration notice',
          notifyReengage: 'Send reengagement email',
          notifyRenewed: 'Send renewal notice',
          copyWhatsapp: 'Copy WhatsApp',
          copyM3u: 'Copy M3U',
          copyM3uPlus: 'Copy Plus M3U'
        },
        form: {
          autopayLinkPlaceholder: 'https://...'
        },
        headers: {
          id: 'ID',
          customer: 'Customer',
          line: 'Line',
          package: 'Package',
          lineExpiration: 'Line expiration',
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
        hero: {
          eyebrow: 'Operational alignment',
          title: 'Organize shared subscriptions before a bad host assignment impacts renewals and service quality',
          subtitle:
            'Track hosts, beneficiaries, renewal-day buckets and move recommendations from one view built for daily operational decisions.',
          hostsChip: '{{count}} visible hosts',
          sharedChip: '{{count}} visible shared subscriptions',
          capacityChip: '{{count}} eligible standalone subscriptions',
          signals: {
            criticalTitle: 'Critical',
            criticalHelper: 'Hosts already in OVERDUE or 0-7 days that can affect shared renewals first.',
            misalignedTitle: 'Misaligned',
            misalignedHelper: 'Shared subscriptions whose renewal day still does not match the current host.',
            movesTitle: 'Moves',
            movesHelper: 'Beneficiaries with a clearer exact-day destination recommendation available now.',
            bucketHosts: 'Visible host subscriptions inside this renewal-day bucket.',
            bucketShared: 'Beneficiaries currently attached to these hosts.',
            bucketMisaligned: 'Shared accounts whose own renewal day still differs from the host.',
            bucketMoves: 'Beneficiaries that can be reorganized immediately from this bucket.'
          }
        },
        tabs: {
          clusters: 'Shared clusters',
          capacity: 'Available spaces by day',
          oversold: 'Oversold subscriptions'
        },
        kpi: {
          totalSubscriptions: 'Total subscriptions',
          activeSubscriptions: 'Active',
          sharedClusters: 'Shared clusters',
          hosts: 'Hosts',
          sharedSubscriptions: 'Shared subscriptions',
          misalignedShared: 'Misaligned shared',
          recommendedMoves: 'Recommended moves',
          renewalBuckets: 'Renewal buckets',
          capacityLines: 'Lines with space',
          capacitySlots: '1-screen slots',
          pendingSetupCustomers: 'Pending setup',
          oversoldSubscriptions: 'Oversold subscriptions',
          excessLicenses: 'Excess licenses',
          affectedCustomers: 'Affected customers',
          eligibleSubscriptions: 'Eligible',
          overdueClusters: 'Overdue hosts',
          criticalClusters: 'Critical hosts',
          atRiskSubscriptions: 'Subscriptions affected'
        },
        filters: {
          title: 'Filters and quick reading',
          subtitle: 'Use the current filters to isolate hosts, beneficiaries or blocked subscriptions and open diagnostics from the same screen.',
          searchPlaceholder: 'Search by subscription, customer, line, provider, status',
          status: 'Sharing role',
          eligible: 'Eligible',
          riskBucket: 'Risk bucket',
          atRiskOnly: 'At risk',
          renewalDay: 'Renewal day',
          ownRenewalDay: 'Own renewal day',
          renewalDayAll: 'All days',
          misalignedOnly: 'Misaligned',
          recommendedMoves: 'Recommended moves',
          visible: 'Visible: {{count}}',
          hostsVisible: 'Hosts: {{count}}',
          sharedVisible: 'Shared: {{count}}',
          eligibleVisible: 'Standalone eligible: {{count}}',
          blockedVisible: 'Blocked: {{count}}',
          criticalVisible: 'Critical hosts: {{count}}',
          overdueVisible: 'Overdue hosts: {{count}}',
          misalignedVisible: 'Misaligned: {{count}}',
          recommendedVisible: 'Recommended moves: {{count}}',
          reset: 'Reset filters',
          blockedHint:
            'There are blocked subscriptions in this view. Open diagnostics to confirm if the cause is inactive status, minimum term or no available capacity.',
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
          },
          riskOptions: {
            all: 'All'
          },
          atRiskOptions: {
            all: 'All',
            yes: 'Yes',
            no: 'No'
          },
          recommendationOptions: {
            all: 'All',
            yes: 'Recommended only'
          },
          misalignedOptions: {
            all: 'All',
            yes: 'Misaligned only'
          }
        },
        sections: {
          sharedClusters: 'Shared clusters grouped by host renewal day',
          sharedClustersHint: 'Hosts are grouped by their renewal day of month so you can see in advance which shared clusters are affected when a host gets close to expiration.',
          noSharedClusters: 'No shared clusters found with current filters.',
          eligibleNotShared: 'Eligible and not shared',
          eligibleHint: 'These subscriptions already satisfy the sharing rule and still are not part of any shared cluster.',
          noEligible: 'No eligible subscriptions pending share.',
          notEligible: 'Not eligible right now',
          notEligibleHint:
            'This list surfaces subscriptions that stay outside sharing and explains whether the block is status, term or available capacity.',
          noNotEligible: 'No non-eligible subscriptions matched current filters.'
        },
        capacity: {
          title: 'Available spaces grouped by renewal day',
          subtitle: 'Use this operational view to place new 1-screen sales on lines that still have real capacity on that exact renewal day.',
          info:
            'This tab is operational. It uses active capacity available right now and ignores the Eligible / Misaligned / Recommended filters so monthly accounts with free space are still visible.',
          empty: 'No active lines with spare capacity were found for the current filters.',
          summary: {
            lines: 'Lines with space: {{count}}',
            slots: '1-screen slots: {{count}}',
            hosts: 'Hosts with space: {{count}}',
            standalone: 'Standalone with space: {{count}}'
          },
          bucket: {
            lineCount: 'Lines: {{count}}',
            slotCount: '1-screen slots: {{count}}',
            hostCount: 'Hosts: {{count}}',
            standaloneCount: 'Standalone: {{count}}',
            helper: 'Use this bucket for new 1-screen customers that should renew on this day. Nearest renewal: {{date}}',
            helperNoDate: 'Use this bucket for lines without a visible renewal date only after manual validation.',
            helperLines: 'Operational lines currently available inside this day bucket.',
            helperSlots: 'Real one-screen spaces available to sell on this same renewal day.',
            helperHosts: 'Host subscriptions with spare capacity in this bucket.',
            helperStandalone: 'Standalone subscriptions that can receive new 1-screen sales.'
          },
          card: {
            slotBadge: '{{count}} slot(s) free',
            billing: 'Billing',
            availableSlots: 'Available 1-screen slots',
            salesHelper: 'You can place {{count}} sale(s) of 1 screen here',
            currentUsage: 'Current usage',
            roleHelper: 'Role: {{role}}'
          }
        },
        pendingSetup: {
          title: 'Customers pending license setup',
          subtitle: 'These are active standalone subscriptions that still have contracted screens available to configure.',
          empty: 'No standalone customers with pending license setup were found for the current filters.',
          slotsBadge: '{{count}} pending slot(s)',
          slots: 'Pending slots',
          slotsHelper: 'Screens still available to configure for this customer.',
          usageHelper: 'Configured licenses versus contracted screens.',
          bucket: {
            customers: 'Customers: {{count}}',
            slots: 'Pending slots: {{count}}',
            helper: 'Active standalone customers in this renewal day still need license setup. Nearest renewal: {{date}}',
            helperNoDate: 'These standalone customers still need license setup, but their renewal date should be validated manually.'
          }
        },
        oversold: {
          title: 'Oversold subscriptions by package capacity',
          subtitle: 'Detect subscriptions where the package contract allows fewer connections than the active linked licenses currently configured.',
          listSubtitle: 'These subscriptions have more active linked licenses than the 1P..5P package token currently contracted.',
          filtersSubtitle: 'This tab only uses the global search so you can inspect oversold subscriptions without mixing sharing eligibility filters.',
          info: 'Oversale is calculated by comparing active linked licenses against the 1P..5P token detected in the package text.',
          empty: 'No oversold subscriptions were found for the current search.',
          summary: {
            visible: 'Oversold: {{count}}',
            excess: 'Excess licenses: {{count}}',
            customers: 'Affected customers: {{count}}'
          },
          card: {
            contractedConnections: 'Contracted connections',
            activeLinkedLicenses: 'Active linked licenses',
            oversoldLabel: 'Excess',
            oversoldBy: 'Oversold by {{count}}',
            capacityToken: 'Token: {{token}}',
            renewalDate: 'Renewal: {{date}}',
            customerId: 'Customer #{{id}}'
          },
          detail: {
            title: 'Oversold detail',
            subtitle: 'Subscription #{{subscriptionId}}',
            subtitleFallback: 'Live oversale snapshot',
            empty: 'No oversold detail available for this subscription.',
            summaryTitle: 'Oversale summary',
            affectedLicenseCount: 'Affected licenses',
            licensesTitle: 'Operational linked licenses',
            licensesCount: 'Licenses: {{count}}',
            noLicenses: 'No operational linked licenses were found for this subscription.'
          }
        },
        role: {
          host: 'HOST',
          shared: 'SHARED',
          none: 'NONE'
        },
        reason: {
          inactive: 'Inactive',
          minimumTerm: 'Minimum {{count}} months',
          noCapacity: 'No available capacity'
        },
        alignment: {
          aligned: 'Aligned',
          misaligned: 'Misaligned',
          noHostDate: 'Host date missing',
          noOwnDate: 'Own date missing',
          unknown: 'Alignment unknown'
        },
        alignmentReason: {
          alreadyAligned: 'Own renewal day already matches the host.',
          hostDayDiffers: 'Own renewal day does not match the current host day.',
          noHostDate: 'Current host does not have a renewal date.',
          noOwnDate: 'This subscription does not have a renewal date.',
          unknown: 'Renewal alignment could not be determined.'
        },
        risk: {
          overdue: 'Overdue',
          zeroToSeven: '0-7 days',
          eightToFifteen: '8-15 days',
          sixteenToThirty: '16-30 days',
          thirtyOnePlus: '31+ days',
          unknown: 'No renewal date',
          dayOfMonth: 'Day {{day}}',
          dayUnknown: 'Without date',
          unknownDays: 'Missing date',
          overdueDays: 'Overdue {{days}}d',
          today: 'Due today',
          inDays: 'In {{days}}d'
        },
        bucket: {
          hostCount: 'Hosts: {{count}}',
          sharedCount: 'Shared: {{count}}',
          misalignedCount: 'Misaligned: {{count}}',
          recommendedCount: 'Recommended: {{count}}',
          nearestDate: 'Nearest host renewal: {{date}}',
          nearestDateUnknown: 'Hosts without renewal date in this bucket.',
          overdueAlert: 'This renewal bucket already has overdue hosts affecting shared subscriptions.',
          criticalAlert: 'This renewal bucket includes hosts that will affect shared subscriptions within 7 days.'
        },
        card: {
          hostSubscription: 'Host subscription',
          eligible: 'Eligible',
          notEligible: 'Not eligible',
          clusterSize: 'Cluster: {{count}}',
          customer: 'Customer',
          line: 'Line',
          linePlus: 'Line plus',
          provider: 'Provider',
          package: 'Package',
          subscriptionType: 'Subscription type',
          packageDescription: 'Description',
          renewal: 'Renewal',
          hostRenewal: 'Host renewal',
          renewalDay: 'Renewal day',
          daysLeft: 'Days left',
          capacity: 'Capacity {{activated}} · Usage {{used}} · Available {{available}}',
          term: 'Term {{months}} months',
          termLabel: 'Term',
          termValue: '{{months}} months',
          minimumHint: 'Minimum {{count}} months',
          usageLabel: 'Usage pressure',
          capacityShort: 'Available {{available}}',
          customerId: 'Customer ID',
          clusterMembers: 'Beneficiaries',
          sharedClusterSize: 'Cluster size {{count}}',
          status: 'Status',
          beneficiaries: 'Beneficiaries',
          beneficiariesHint: 'Each shared subscription should renew on the same day as the host. Misaligned accounts are shown first so you can reorganize them.',
          noBeneficiaries: 'No SHARED subscriptions linked to this host.',
          affectsShared: 'Affects {{count}} shared',
          inheritedRisk: 'Inherited risk from host #{{hostId}}',
          misalignedShared: 'Misaligned shared',
          alignedShared: 'Aligned shared',
          sectionCount: '{{count}} items',
          ownRenewalDayValue: 'Own day: {{day}}',
          currentHostDayValue: 'Host day: {{day}}'
        },
        actions: {
          viewDiagnostics: 'View diagnostics',
          rolePreference: 'Role',
          roleAuto: 'Auto',
          roleHost: 'Host',
          roleShared: 'Shared',
          roleCurrent: 'Role mode: {{role}}',
          roleHelp: 'Choose who should behave as host inside this shared line. Auto keeps the system decision.',
          viewOversoldDetail: 'View oversale detail',
          closeOversoldDetail: 'Close oversale detail',
          moveToDay: 'Move to day {{day}}',
          moveToHost: 'Move to host #{{id}}',
          moving: 'Moving...',
          confirmMove: 'Move beneficiary'
        },
        move: {
          title: 'Move recommendation',
          priority: {
            urgent: 'Urgent move',
            review: 'Review move',
            none: 'No move'
          },
          reason: {
            recommended: 'A host with the exact same renewal day is available.',
            alreadyAligned: 'This shared subscription is already aligned with its host.',
            missingRenewalDate: 'Own renewal day or host renewal day is missing.',
            noCapacity: 'The exact-day destination exists, but it does not have enough capacity.',
            incompatibleService: 'Exact-day hosts exist, but they are not compatible by service.',
            noExactDayHost: 'No exact-day host or eligible account was found.',
            none: 'No move recommendation yet.'
          },
          hostAlert: '{{count}} beneficiary(ies) do not renew on the same day as this host.',
          recommendedBadge: 'Recommended move',
          ownDay: 'Own renewal day',
          currentDay: 'Current host day',
          recommendedDay: 'Recommended day',
          requiredScreens: 'Screens to move',
          recommendedHost: 'Host #{{id}}',
          recommendedLine: 'Line: {{line}}',
          recommendedLinePlus: 'Plus: {{value}}',
          recommendedCustomer: 'Customer: {{customer}}',
          confirmTitle: 'Move beneficiary to exact-day host',
          confirmSubtitle: 'Subscription #{{subscriptionId}}',
          confirmSubtitleFallback: 'Confirm the recommended move',
          confirmBody: 'This will move the shared subscription to a host that renews on the same day and keep the destination pinned as HOST.',
          currentAssignment: 'Current assignment',
          currentHost: 'Host #{{id}}',
          currentLine: 'Line: {{line}}',
          currentDayValue: 'Day: {{day}}',
          ownDayValue: 'Own day: {{day}}',
          destinationAssignment: 'Recommended destination',
          confirmWarning: 'This action changes lineId/linePlusId of the beneficiary subscription and immediately affects how the shared cluster is organized.'
        },
        diagnostics: {
          title: 'Subscription diagnostics',
          subtitle: 'Subscription #{{subscriptionId}}',
          subtitleFallback: 'Live eligibility snapshot',
          empty: 'No diagnostics available for this subscription.',
          sharingActive: 'Active for sharing',
          sharingInactive: 'Inactive for sharing',
          sharedCluster: 'Shared cluster · {{count}}',
          standalone: 'Standalone subscription',
          hostAtRisk: 'Host risk affects shared subscriptions',
          hostStable: 'Host currently stable',
          customer: 'Customer',
          line: 'Line',
          linePlus: 'Plus: {{value}}',
          provider: 'Provider',
          package: 'Package',
          packageType: 'Type: {{value}}',
          packageDescription: 'Subscription description',
          status: 'Status: {{value}}',
          billing: 'Billing',
          startDate: 'Start date',
          renewalDate: 'Renewal date',
          ownRenewalDay: 'Own renewal day',
          hostRenewalDate: 'Host renewal date',
          hostRenewalDay: 'Renewal day',
          hostDaysToRenewal: 'Days to host renewal',
          hostRiskBucket: 'Host risk bucket',
          alignmentTitle: 'Renewal alignment',
          termMonths: 'Calculated months',
          minimumEligibleMonths: 'Minimum: {{count}}',
          activatedScreens: 'Activated screens',
          estimatedUsage: 'Estimated usage',
          availableCapacity: 'Available capacity',
          summaryTitle: 'Sharing summary',
          hostSubscription: 'Host #{{id}}',
          readingHostImpact: 'For shared clusters, the host renewal date controls the operational bucket. If the host expires, all linked shared subscriptions are affected.',
          readingStandalone: 'This subscription is not linked to a shared cluster, so its own renewal date drives the operational bucket.'
        },
        errors: {
          loadError: 'Could not load shared overview.',
          loadOversold: 'Could not load oversold subscriptions.',
          loadOversoldDetail: 'Could not load oversold detail.',
          loadDiagnostics: 'Could not load subscription diagnostics.',
          updateRole: 'Could not update sharing role preference.',
          moveSubscription: 'Could not move the shared subscription.'
        },
        messages: {
          roleUpdated: 'Sharing role preference updated.',
          moveCompleted: 'Subscription #{{sourceId}} moved to host #{{destinationId}}.'
        }
      },
      resellerDashboard: {
        loading: 'Preparing reseller command center...',
        lowBalance: 'Your balance is getting low. Request credits now so sales, renewals and urgent support actions do not stall during the day.',
        errors: {
          wallet: 'Could not load reseller credit balance.'
        },
        actions: {
          buyCredits: 'Request credits'
        },
        hero: {
          badge: 'Reseller command center',
          title: 'Run sales, renewals and service health from one professional console',
          subtitle:
            'Monitor credits, customers, subscriptions, lines and shared risk with the context needed to act quickly without losing operational control.',
          primary: 'Request credits',
          secondary: 'Review lines',
          balanceLabel: 'Available credits',
          balanceHelper: 'Use them for new activations, renewals and support operations.',
          balanceStatusLow: 'Low balance',
          balanceStatusGood: 'Healthy balance',
          pendingInvoices: 'Pending invoices',
          sharedRisk: 'Shared risk'
        },
        cards: {
          balance: 'Available balance',
          balanceHelper: 'Credits ready for new activations and service continuity.',
          customers: 'Active customers',
          customersHelper: 'Current customer base operating under your reseller account.',
          subscriptions: 'Active subscriptions',
          subscriptionsHelper: 'Plans currently in production and pending to renew.',
          licenses: 'Active licenses',
          licensesHelper: 'Licenses already in use or ready to assign.',
          pendingInvoices: 'Pending invoices',
          pendingInvoicesHelper: 'Manual collections that still need follow-up.',
          consumed: 'Lifetime credit usage',
          consumedHelper: 'Credits already consumed by activations and operational movements.'
        },
        quick: {
          eyebrow: 'Operate faster',
          title: 'Commercial shortcuts that move the business',
          subtitle:
            'Open the modules you actually use every day to sell, review capacity and reorganize accounts without walking through internal admin-only flows.',
          customers: {
            title: 'Customers',
            helper: 'Create, organize and follow up your active customer base from one place.',
            action: 'Open customers'
          },
          subscriptions: {
            title: 'Subscriptions',
            helper: 'Create, renew and reorganize plans with full commercial visibility.',
            action: 'Open subscriptions'
          },
          licenses: {
            title: 'Licenses',
            helper: 'Activate devices, change servers and resolve support cases faster.',
            action: 'Open licenses'
          },
          lines: {
            title: 'Lines',
            helper: 'Review active lines, available capacity and upcoming renewals.',
            action: 'Open lines'
          },
          plusLines: {
            title: 'Plus Lines',
            helper: 'Track plus inventory, status and operational readiness.',
            action: 'Open plus lines'
          },
          shared: {
            title: 'Shared Subscriptions',
            helper: 'Organize hosts, shared accounts and renewal-day buckets before service is affected.',
            action: 'Open shared subscriptions'
          }
        },
        focus: {
          eyebrow: 'Commercial focus',
          title: 'Three signals you should not ignore today',
          subtitle: 'These cards show where cash flow, service stability or renewals may break first inside your reseller operation.',
          renewals: {
            title: 'Critical renewals',
            helper: 'If this number rises, review subscriptions close to expiration before moving more customers around.',
            action: 'Open subscriptions'
          },
          shared: {
            title: 'Shared accounts at risk',
            helper: 'This is where you detect hosts and beneficiaries that need reorganization before they impact the customer service.',
            action: 'Open shared subscriptions'
          },
          collections: {
            title: 'Collections pending',
            helper: 'Keep manual collections under control so your operation keeps cash while you continue activating accounts.',
            action: 'Open invoices'
          }
        }
      },
      licenses: {
        title: 'Licenses',
        search: 'Search (MAC, device key, customer, subscription, status)',
        actions: {
          authenticateBob: 'Authenticate Bob Player',
          syncBobPlaylist: 'Sync Bob playlist',
          refreshCaptcha: 'Refresh captcha',
          clearBobSession: 'Clear session',
          completeBobLogin: 'Complete login',
          server: 'Change server',
          transfer: 'Transfer',
          history: 'History',
          removePlaylists: 'Remove all playlists'
        },
        filters: { status: 'Status', payment: 'Payment', customer: 'Customer', all: 'All', allCustomers: 'All customers' },
        status: {
          ACTIVE: 'ACTIVE',
          INACTIVE: 'INACTIVE',
          EXPIRED: 'EXPIRED',
          AVAILABLE: 'AVAILABLE',
          EMERGENCY: 'EMERGENCY'
        },
        paid: { paid: 'Paid', pending: 'Pending' },
        labels: {
          requiresSubscriptionLink: 'Requires subscription link'
        },
        bob: {
          session: {
            title: 'Bob session',
            ready: 'Ready',
            captchaRequired: 'Captcha required',
            expired: 'Expired',
            authBlocked: 'Auth blocked',
            invalid: 'Invalid session',
            notConfigured: 'Not configured'
          },
          dialog: {
            title: 'Authenticate Bob Player',
            helper:
              'The system uses the MAC address and device key saved on this license, requests the live captcha from Bob Player and only asks you to enter the captcha answer.'
          },
          deviceKeyMasked: 'Stored device key',
          captchaAnswer: 'Captcha',
          lastRefreshed: 'Last refreshed',
          remotePlaylist: 'Remote playlist',
          sync: {
            title: 'Sync Bob playlist',
            helper:
              'Select one playlist already stored on this Bob device to link it with the current license. The system will keep that remote playlist id for future updates and automatic removal.',
            selectLabel: 'Remote playlist',
            selectHelper: 'Pick the exact remote playlist that belongs to this license.',
            loading: 'Loading playlists from Bob Player...',
            empty: 'No playlists were found on this Bob device.',
            remoteId: 'Remote id'
          },
          messages: {
            startError: 'Could not start Bob Player authentication.',
            completeError: 'Could not complete Bob Player authentication.',
            clearError: 'Could not clear Bob Player session.',
            listError: 'Could not load Bob Player playlists.',
            syncError: 'Could not sync Bob playlist.',
            syncSuccess: 'Bob playlist linked to this license.',
            syncRequired: 'Select one Bob playlist before continuing.',
            success: 'Bob Player session authenticated successfully.',
            cleared: 'Bob Player session cleared.',
            statusError: 'Could not validate Bob Player session status.',
            captchaRequired: 'Enter the captcha before continuing.',
            captchaUnavailable: 'Captcha preview unavailable. Refresh the challenge.'
          }
        },
        messages: {
          subscriptionsLoadError: 'Could not load subscriptions.',
          linesLoadError: 'Could not load lines.',
          serversLoadError: 'Could not load servers.',
          loadError: 'Could not load licenses.',
          customersLoadError: 'Could not load customers.',
          appsLoadError: 'Could not load license apps.',
          noActiveApps: 'No active apps available in the catalog.',
          required: 'Complete required fields.',
          invalidMac: 'Invalid MAC format. Use AA:BB:CC:DD:EE:FF with letters A-Z and digits 0-9.',
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
          macHelper: 'Format: AA:BB:CC:DD:EE:FF using letters A-Z and digits 0-9',
          randomLicense: 'Unknown / external app',
          randomLicenseHelper: 'Use this when the customer uses their own app and you only need to keep the license slot occupied.',
          randomMacHelper: 'The system will generate a synthetic MAC to reserve this license.',
          deviceKey: 'Device key',
          deviceKeyHelper: 'Optional key for this device',
          randomDeviceKeyHelper: 'Optional note or external identifier. If empty, the system creates one.',
          subscription: 'Subscription',
          subscriptionNone: 'No related subscription',
          subscriptionSelectCustomer: 'Select a customer first.',
          subscriptionHelper: 'Optional relation to one customer subscription.',
          subscriptionRandomHelper: 'External licenses may stay without a subscription link.',
          subscriptionRequiredHelper: 'Managed licenses must stay linked to one customer subscription.',
          subscriptionEmpty: 'This customer has no subscriptions available.',
          customerLocked: 'Use transfer to change the customer of an existing license.',
          paid: 'Payment status',
          paidHelper: 'Track if this license was already paid',
          loadingApps: 'Loading apps...',
          appHelper: 'Associated application',
          randomAppLabel: 'Unknown / external app',
          randomAppHelper: 'Remote playlist actions are disabled because this record only reserves the occupied slot.',
          appEmpty: 'No active apps available. Configure the catalog first.',
          appLegacyHelper: 'This license uses an inactive app from the catalog. Choose an active app to replace it.'
        },
        server: {
          required: 'Select server before continuing.',
          updated: 'Server updated.',
          targetApp: 'Target app',
          contextHelper: 'Target app is fixed by the license. Choose the server below; the system will resolve the technical provider automatically.',
          sourceServerHelper: 'Choose the server used to build the M3U. Target app resolves the technical provider automatically.',
          bobApp: 'App',
          bobSessionRequired: 'Authenticate Bob Player before changing server.',
          bobTitle: 'Create or update Bob playlist',
          bobHelper:
            'This action uses the authenticated Bob session on this license to create or update the remote playlist with the line and server you select below.',
          bobNoRemotePlaylist: 'No remote playlist is linked yet. Saving will create one.',
          bobServerHelper: 'This server choice defines the M3U URL that Bob Player will save on the device. The target app resolves the technical provider automatically.',
          bobSubmit: 'Save Bob playlist',
          bobError: 'Could not save Bob playlist.',
          error: 'Could not change server.',
          removeTitle: 'Remove all playlists',
          removeBody: 'This will remove every playlist from this device.',
          removeBobTitle: 'Remove all Bob playlists',
          removeBobBody: 'This will remove every playlist currently saved on this authenticated Bob Player device, not only the playlist linked to this license.',
          removeBobSubmit: 'Remove all Bob playlists',
          removeBobError: 'Could not remove Bob playlists from this device.',
          removeSubmit: 'Remove playlists',
          removeSuccess: 'All playlists removed from device.',
          removeError: 'Could not remove playlists from device.',
          removeRequired: 'License id is required.',
          removeNotAvailable: 'This action is not available yet in backend.'
        },
        transfer: {
          subscription: 'Destination subscription',
          subscriptionSelectCustomer: 'Select the new customer first.',
          subscriptionHelper: 'Choose the subscription that will own this managed license.',
          subscriptionEmpty: 'This customer has no subscriptions available.',
          required: 'Select customer, type and destination subscription when required.',
          error: 'Could not transfer license.'
        }
      },
      demos: {
        title: 'Lion TV demos',
        listTitle: 'Demo list',
        search: 'Search (phone, user, package, app)',
        status: {
          ACTIVE: 'ACTIVE',
          ACTIVATED: 'ACTIVATED',
          PENDING: 'PENDING',
          EXPIRED: 'EXPIRED',
          CANCELLED: 'CANCELLED'
        },
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
          macPlaceholder: 'aa:bb:cc:dd:ee[:ff]'
        },
        table: { empty: 'No demos found.', loading: 'Loading...' }
      },
      lines: {
        title: 'Lines',
        listTitle: 'Line list',
        summary: { total: '{{count}} lines', active: 'Active: {{count}}', expired: 'Expired: {{count}}' },
        search: 'Search (user, package, IP, status)',
        filters: { status: 'Status', all: 'All' },
        actions: { copyM3u: 'Copy M3U' },
        messages: {
          m3uCopySuccess: 'M3U list copied.',
          m3uCopyError: 'Could not generate the M3U list.',
          m3uPlusCopySuccess: 'Plus M3U list copied.',
          m3uPlusCopyError: 'Could not generate the Plus M3U list.',
          m3uUnsupportedProvider: 'Provider not supported for M3U generation.',
          m3uMissingCredentials: 'The line does not have encoded credentials to generate the M3U.'
        },
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
          channel: 'Channel',
          vip: 'VIP',
          points: 'Points'
        },
        pointsChip: '{{count}} pts',
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
          deleted: 'Customer deleted successfully.',
          engagementSummaryError: 'Could not load the VIP/loyalty summary.',
          missingEmail: 'The customer has no registered email.',
          welcomeSent: 'Welcome email sent.',
          welcomeError: 'Could not send the welcome email.'
        }
      },
      referrals: {
        title: 'Referral leads',
        description:
          'Requests submitted from Shopify by active customers who want to refer another person and claim 1 free month when the referral converts.',
        search: 'Search by customer, contact, referred name or WhatsApp',
        empty: 'No referral requests found.',
        metrics: {
          total: 'Total requests',
          new: 'New',
          contacted: 'Contacted',
          converted: 'Converted',
          rewarded: 'Rewarded'
        },
        filters: {
          status: 'Status',
          all: 'All',
          from: 'From',
          to: 'To'
        },
        headers: {
          createdAt: 'Created',
          referrer: 'Current customer',
          referrerContact: 'Contact',
          referredName: 'Referred',
          whatsapp: 'WhatsApp',
          status: 'Status',
          notes: 'Admin notes'
        },
        sections: {
          referrer: 'Current customer',
          referred: 'Referred person'
        },
        fields: {
          referrerCustomer: 'Name',
          referrerCustomerId: 'Customer ID',
          referrerContact: 'Phone or email',
          referredName: 'Name',
          whatsapp: 'WhatsApp',
          createdAt: 'Created',
          contactedAt: 'Contacted',
          convertedAt: 'Converted',
          rewardGrantedAt: 'Reward granted',
          sourceShop: 'Shop',
          status: 'Status',
          adminNotes: 'Admin notes',
          notes: 'Notes'
        },
        status: {
          NEW: 'New',
          CONTACTED: 'Contacted',
          CONVERTED: 'Converted',
          REWARDED: 'Rewarded',
          REJECTED: 'Rejected'
        },
        dialog: {
          title: 'Referral detail'
        },
        actions: {
          copyReferrer: 'Copy contact'
        }
      },
      crm: {
        title: 'Customer CRM',
        search: {
          label: 'Search customer',
          placeholder: 'Name, email or user',
          helper: 'Search a customer and get a 360 view with subscriptions, licenses, managed accounts, commercial timeline and billing.'
        },
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
          opening: 'Opening: {{date}}',
          openingLabel: 'Opening date'
        },
        contact: { call: 'Call', email: 'Email', phone: 'Phone' },
        summary: {
          title: 'Customer summary'
        },
        engagement: {
          title: 'VIP + Loyalty',
          updating: 'Updating...',
          vip: 'VIP: {{value}}',
          score: 'Score: {{value}}',
          points: 'Points: {{value}}',
          latestLedger: 'Latest ledger movements',
          movement: '{{sign}}{{value}} pts',
          balance: 'Balance: {{value}}',
          empty: 'No loyalty movements yet.'
        },
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
          provider: 'Provider',
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
          partialData: 'Some data sources failed. Retry to complete the 360 view.',
          engagementLoad: 'Could not load the VIP/loyalty summary.'
        },
        table: { detail: 'Detail', empty: 'No data', emptyHelp: 'No records were found for this customer in this module.' }
      },
      vipCustomers: {
        title: 'VIP Customers',
        actions: {
          config: 'Configuration',
          recompute: 'Recompute',
          recomputeCustomer: 'Recompute',
          override: 'Override',
          apply: 'Apply'
        },
        alerts: {
          scoreInfo: 'The VIP score combines seniority, paid billing and subscription history per user.'
        },
        metrics: {
          profilesLoaded: 'Loaded profiles',
          profilesLoadedHelper: 'Active VIP snapshots',
          overridesVisible: 'Visible overrides',
          overridesVisibleHelper: 'Customers with manual tier',
          averageScore: 'Average score',
          averageScoreHelper: 'Average on the current page',
          topTier: 'Leading tier',
          topTierHelper: 'First record in the current ranking'
        },
        filters: {
          search: 'Search',
          status: 'Status',
          finalTier: 'Final tier',
          all: 'All',
          overrideOnly: 'Only overrides'
        },
        table: {
          customer: 'Customer',
          status: 'Status',
          channel: 'Channel',
          seniority: 'Seniority',
          billing: 'Billing',
          subscriptions: 'Subscriptions',
          score: 'Score',
          computedTier: 'Computed tier',
          finalTier: 'Final tier',
          actions: 'Actions',
          paidInvoices: 'Paid invoices: {{count}}',
          subscriptionsSplit: '{{active}} active / {{total}} historical',
          manual: 'Manual',
          empty: 'No VIP profiles to display.'
        },
        dialogs: {
          configTitle: 'VIP configuration',
          activeConfig: 'Active configuration',
          seniorityWeight: 'Seniority weight',
          billingWeight: 'Billing weight',
          subscriptionsWeight: 'Subscriptions weight',
          fullScoreDays: 'Days for max score',
          fullScoreAmount: 'Billing for max score',
          fullScoreSubscriptions: 'Subscriptions for max score',
          notes: 'Notes',
          tiers: 'Tiers',
          code: 'Code',
          name: 'Name',
          minScore: 'Minimum score',
          order: 'Order',
          color: 'Color',
          active: 'Active',
          overrideTitle: 'VIP override',
          clearOverride: 'Clear override',
          finalTier: 'Final tier',
          reason: 'Reason'
        },
        units: {
          days: '{{count}} days'
        },
        messages: {
          loadConfigError: 'Could not load VIP configuration.',
          loadRankingError: 'Could not load the VIP ranking.',
          configUpdated: 'VIP configuration updated.',
          saveConfigError: 'Could not save VIP configuration.',
          rankingRecomputed: 'VIP ranking recomputed.',
          recomputeError: 'Could not recompute VIP.',
          customerRecomputed: 'VIP customer recomputed.',
          recomputeCustomerError: 'Could not recompute the customer.',
          overrideApplied: 'VIP override applied.',
          overrideError: 'Could not apply the override.'
        }
      },
      loyalty: {
        title: 'Loyalty',
        movementTypes: {
          EARN: 'Earned points',
          REVERSAL: 'Earn reversal',
          REDEEM: 'Points redeemed',
          REDEEM_REVERSAL: 'Redeem reversal',
          MANUAL_ADJUSTMENT: 'Manual adjustment',
          INACTIVE_RESET: 'Inactive reset'
        },
        actions: {
          config: 'Configuration',
          ledger: 'Ledger',
          adjust: 'Adjust',
          apply: 'Apply'
        },
        alerts: {
          active: 'Program active since {{date}}.',
          noDate: 'no defined date',
          inactive: 'The program is inactive. No new points will be credited until it is activated.'
        },
        metrics: {
          listedCustomers: 'Listed customers',
          listedCustomersHelper: 'Visible balances',
          customersWithPoints: 'Customers with points',
          customersWithPointsHelper: 'With available balance above zero',
          visiblePoints: 'Visible points',
          visiblePointsHelper: 'Current page total',
          baseRule: 'Base rule',
          baseRuleValue: '{{points}} / L{{amount}}',
          baseRuleHelper: 'Rounding: {{mode}}'
        },
        filters: {
          search: 'Search',
          status: 'Status',
          all: 'All',
          minimumPoints: 'Minimum points'
        },
        table: {
          customer: 'Customer',
          status: 'Status',
          channel: 'Channel',
          availablePoints: 'Available points',
          lifetimeEarned: 'Lifetime earned',
          lifetimeAdjusted: 'Lifetime adjusted',
          lastMovement: 'Last movement',
          actions: 'Actions',
          empty: 'No loyalty balances to display.'
        },
        dialogs: {
          configTitle: 'Loyalty configuration',
          programActive: 'Program active',
          pointsPerUnit: 'Points per unit',
          amountPerUnit: 'Amount per unit',
          rounding: 'Rounding',
          effectiveFrom: 'Effective from',
          notes: 'Notes',
          ledgerTitle: 'Points ledger',
          ledgerShown: '{{name}} · displayed records: {{count}}',
          date: 'Date',
          type: 'Type',
          source: 'Source',
          points: 'Points',
          balance: 'Balance',
          reason: 'Reason',
          ledgerEmpty: 'No movements yet.',
          adjustTitle: 'Adjust points',
          adjustPoints: 'Points',
          adjustHelper: 'Use positive values to add and negative values to subtract.',
          adjustReason: 'Reason'
        },
        messages: {
          loadConfigError: 'Could not load the loyalty configuration.',
          loadModuleError: 'Could not load the loyalty module.',
          loadLedgerError: 'Could not load the customer ledger.',
          configUpdated: 'Loyalty configuration updated.',
          saveConfigError: 'Could not save the configuration.',
          adjustmentApplied: 'Points adjustment applied.',
          adjustmentError: 'Could not apply the adjustment.'
        }
      },
      raffles: {
        title: 'Raffles',
        actions: {
          newTemplate: 'New template',
          newRaffle: 'New raffle',
          preview: 'Preview',
          freeze: 'Freeze',
          draw: 'Draw',
          entries: 'Entries',
          winners: 'Winners'
        },
        alerts: {
          info: 'The raffle works on a frozen audience. You can filter by criteria, mix manual IDs and run a reproducible draw.'
        },
        metrics: {
          templates: 'Templates',
          templatesHelper: 'Reusable criteria',
          raffles: 'Raffles',
          rafflesHelper: 'Visible records',
          frozen: 'Frozen',
          frozenHelper: 'Ready to run',
          drawn: 'Drawn',
          drawnHelper: 'With winners defined'
        },
        tabs: {
          templates: 'Templates',
          raffles: 'Raffles'
        },
        filters: {
          status: 'Status',
          all: 'All'
        },
        status: {
          DRAFT: 'Draft',
          FROZEN: 'Frozen',
          DRAWN: 'Drawn'
        },
        modes: {
          FILTERED: 'Filtered',
          MANUAL: 'Manual',
          MIXED: 'Mixed'
        },
        table: {
          name: 'Name',
          description: 'Description',
          active: 'Active',
          seed: 'Seed',
          prize: 'Prize',
          mode: 'Mode',
          winners: 'Winners',
          status: 'Status',
          actions: 'Actions',
          empty: 'No raffles to display.',
          yes: 'Yes',
          no: 'No'
        },
        dialogs: {
          templateTitle: 'Raffle template',
          raffleTitle: 'Raffle',
          entriesTitle: 'Frozen entries',
          winnersTitle: 'Winners',
          activeTemplate: 'Active template',
          customerStatus: 'Customer status',
          channel: 'Channel',
          minSeniority: 'Minimum seniority (days)',
          minPaidBilling: 'Minimum paid billing',
          minPaidInvoices: 'Minimum paid invoices',
          minActiveSubscriptions: 'Minimum active subscriptions',
          minTotalSubscriptions: 'Minimum historical subscriptions',
          referredOnly: 'Referred only',
          name: 'Name',
          description: 'Description',
          prize: 'Prize',
          mode: 'Mode',
          template: 'Template',
          noTemplate: 'No template',
          winnerCount: 'Winner count',
          manualCustomerIds: 'Manual customer IDs',
          manualCustomerIdsHelper: 'You can separate IDs by comma, space or line break.',
          previewTitle: 'Audience preview',
          previewHelper: 'Calculate the audience before saving or freezing the raffle.',
          previewAlert: 'Eligible: {{eligible}} · filtered: {{filtered}} · manual: {{manual}}',
          id: 'ID',
          customer: 'Customer',
          billing: 'Billing',
          subscriptions: 'Subscriptions',
          source: 'Source',
          contact: 'Contact',
          rank: 'Rank'
        },
        messages: {
          loadTemplatesError: 'Could not load templates.',
          loadRafflesError: 'Could not load raffles.',
          templateSaved: 'Template saved.',
          templateSaveError: 'Could not save the template.',
          previewError: 'Could not preview the audience.',
          raffleSaved: 'Raffle saved.',
          raffleSaveError: 'Could not save the raffle.',
          freezeSuccess: 'Audience frozen with {{count}} participants.',
          freezeError: 'Could not freeze the audience.',
          drawSuccess: 'Raffle executed. Winners: {{count}}.',
          drawError: 'Could not execute the raffle.',
          loadEntriesError: 'Could not load entries.',
          loadWinnersError: 'Could not load winners.',
          winnersEmpty: 'No winners to display.'
        }
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
          apiMissing: 'Panel integrations require the Lion TV and panel credential API routes to be configured in this environment.',
          requiredFields: 'Complete user, provider and panel user.',
          requiredFieldsReseller: 'Complete provider and panel user.',
          passwordRequired: 'Password is required when creating an integration.',
          loadError: 'Could not load panel integrations.',
          created: 'Integration created successfully.',
          updated: 'Integration updated successfully.',
          deleted: 'Integration deleted successfully.',
          saveError: 'Could not save integration.',
          deleteError: 'Could not delete integration.',
          statusUpdated: 'Status updated successfully.',
          statusError: 'Could not update status.',
          resellerScope: 'This module is scoped to your reseller account. You can only see and manage your own panel integrations.'
        },
        metrics: {
          total: 'Integrations',
          active: 'Active',
          inactive: 'Inactive'
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
        sharedRisk: {
          open: 'Open shared risk',
          overdue: '{{overdue}} shared hosts already overdue and {{critical}} critical buckets in shared subscriptions.',
          critical: '{{critical}} hosts expire in 7 days or less and already put {{affected}} subscriptions at risk inside shared subscriptions.'
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
          lostCustomers: { title: 'Lost customers', helper: 'overdue > {{days}} days' },
          sharedRisk: { title: 'Shared risk', helper: '{{overdue}} overdue hosts' }
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
        },
        widgets: {
          popularStocks: 'Popular stocks',
          totalEarning: 'Total earning',
          totalOrder: 'Total order',
          totalGrowth: 'Total growth',
          today: 'Today',
          thisMonth: 'This month',
          thisYear: 'This year',
          month: 'Month',
          year: 'Year',
          viewAll: 'View all',
          importCard: 'Import card',
          copyData: 'Copy data',
          export: 'Export',
          archiveFile: 'Archive file',
          profit: '{{value}} profit',
          loss: '{{value}} loss',
          profitLabel: 'Profit',
          lossLabel: 'Loss',
          investment: 'Investment',
          maintenance: 'Maintenance'
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
          deleted: 'Series feed record deleted successfully.',
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
        futbol: {
          title: 'Futbol Events Feed',
          create: 'New futbol event',
          empty: 'No futbol event records found.',
          created: 'Futbol event record created successfully.',
          updated: 'Futbol event record updated successfully.',
          deleted: 'Futbol event record deleted successfully.',
          import: {
            button: 'Import from Alluko',
            title: 'Alluko import',
            helper:
              'Sign in manually in Alluko, copy the Cookie header from an authenticated request, and use category 536 to fetch the football events payload.',
            cookieLabel: 'Authenticated Cookie header',
            cookiePlaceholder: 'PHPSESSID=...; xm_simple_security_check=...; saved_access_code=subadmin; ...',
            categoryLabel: 'Category',
            categoryPlaceholder: '536',
            fetch: 'Fetch from Alluko',
            fetching: 'Importing...',
            success: 'Payload imported from Alluko.',
            error: 'Could not import from Alluko.'
          }
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
          passwordUpdateError: 'Could not update password.',
          viewModeUpdated: 'View changed to {{mode}}.'
        },
        viewMode: {
          title: 'Console mode',
          subtitle: 'Choose which workspace you want to use in this session.',
          admin: 'Admin mode',
          reseller: 'Reseller mode'
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
          referrals: { title: 'Open referral leads', subtitle: 'Validated leads submitted from Shopify referrals.' },
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
        filters: { status: 'Status', category: 'Category', groupName: 'Name group' },
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
          markContacted: 'Mark as contacted',
          exportWhatsappCsv: 'Export WhatsApp CSV',
          importWhatsappCsv: 'Import WhatsApp CSV',
          sendPaymentFailedEmail: 'Send payment failed email',
          sendAbandonedCartEmail: 'Send abandoned cart email'
        },
        export: {
          byName: 'Export grouped by name',
          byCategory: 'Export grouped by category',
          fallbackName: 'Prospect',
          fileSuffixName: 'by-name',
          fileSuffixCategory: 'by-category'
        },
        import: {
          title: 'Import WhatsApp CSV',
          subtitle: 'Upload a phone,group file and create prospects only for the authenticated user.',
          helper: 'Existing phones for the same user are skipped automatically. Categories are inferred from the group label when possible.',
          fileName: 'Selected file',
          rowsDetected: 'Rows detected',
          groupsDetected: 'Groups detected',
          defaults: 'Import defaults',
          defaultCountry: 'Default country',
          defaultCategory: 'Default category',
          preview: 'Preview groups',
          noGroups: 'No groups detected in the file.',
          changeFile: 'Choose another file',
          confirm: 'Import now',
          importing: 'Importing...',
          fallbackName: 'WhatsApp Lead'
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
        whatsappMessage: `Hi, how are you?

I'm reaching out because I think my service could be a very good fit for your business. It is a TV entertainment solution that helps your customers feel more comfortable and entertained while they wait or are being served.

You can have sports, movies, series, live channels and varied content, helping your business feel more modern and with a better atmosphere.

You can learn more about our service at www.liontvpremium.com

If you want, I can share a demo with no commitment so you can see how it looks in your business.`,
        selectCountry: 'Select country',
        deleteTitle: 'Delete potential customer',
        deleteBody: 'Delete {{name}}?',
        messages: {
          loadError: 'Could not load potential customers.',
          alreadyContacted: 'This prospect is already Contacted.',
          markContactedSuccess: 'Status updated to Contacted.',
          markContactedError: 'Could not update status.',
          invalidWhatsAppPhone: 'This prospect has no valid WhatsApp phone.',
          missingRealEmail: 'This prospect does not have a usable email.',
          paymentFailedSent: 'Payment failed follow-up email sent.',
          paymentFailedError: 'Could not send the payment failed email.',
          abandonedCartSent: 'Abandoned cart email sent.',
          abandonedCartError: 'Could not send the abandoned cart email.',
          groupLoadError: 'Could not load name groups.',
          exportEmpty: 'There are no records to export with the current filters.',
          exportNoPhones: 'The filtered records do not have valid phones to export or they already belong to registered customers.',
          exportSuccess: 'CSV exported with {{count}} records.',
          exportError: 'Could not export the WhatsApp CSV.',
          importInvalidFile: 'The selected file does not contain valid WhatsApp rows.',
          importParsingError: 'The CSV file could not be parsed. Check the format and try again.',
          importSuccess:
            'Import finished. Inserted {{inserted}}, skipped existing leads {{skipped}}, skipped customers {{skippedCustomers}}, invalid {{invalid}}.',
          importError: 'Could not import the WhatsApp CSV.',
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
          passwordUpdateError: 'No se pudo actualizar la contraseña.',
          viewModeUpdated: 'Vista cambiada a {{mode}}.'
        },
        viewMode: {
          title: 'Modo de consola',
          subtitle: 'Elige qué espacio de trabajo quieres usar en esta sesión.',
          admin: 'Modo admin',
          reseller: 'Modo reseller'
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
          referrals: { title: 'Abrir leads por referidos', subtitle: 'Leads validados enviados desde referidos en Shopify.' },
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
        filters: { status: 'Estado', category: 'Categoría', groupName: 'Grupo por nombre' },
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
          markContacted: 'Marcar como contactado',
          exportWhatsappCsv: 'Exportar CSV WhatsApp',
          importWhatsappCsv: 'Importar CSV WhatsApp',
          sendPaymentFailedEmail: 'Enviar correo de pago fallido',
          sendAbandonedCartEmail: 'Enviar correo de carrito abandonado'
        },
        export: {
          byName: 'Exportar agrupado por nombre',
          byCategory: 'Exportar agrupado por categoría',
          fallbackName: 'Prospecto',
          fileSuffixName: 'por-nombre',
          fileSuffixCategory: 'por-categoria'
        },
        import: {
          title: 'Importar CSV WhatsApp',
          subtitle: 'Sube un archivo phone,group y crea prospectos solo para el usuario autenticado.',
          helper: 'Los teléfonos existentes para el mismo usuario se omiten automáticamente. Las categorías se infieren desde el nombre del grupo cuando es posible.',
          fileName: 'Archivo seleccionado',
          rowsDetected: 'Filas detectadas',
          groupsDetected: 'Grupos detectados',
          defaults: 'Valores por defecto',
          defaultCountry: 'País por defecto',
          defaultCategory: 'Categoría por defecto',
          preview: 'Vista previa de grupos',
          noGroups: 'No se detectaron grupos en el archivo.',
          changeFile: 'Elegir otro archivo',
          confirm: 'Importar ahora',
          importing: 'Importando...',
          fallbackName: 'Lead WhatsApp'
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
        whatsappMessage: `Hola, ¿qué tal?

Te escribo porque creo que mi servicio te puede servir muy bien en tu negocio. Es una solución de entretenimiento para TV que ayuda a que tus clientes estén más cómodos y entretenidos mientras esperan o se atienden.

Puedes tener deportes, películas, series, canales en vivo y contenido variado, haciendo que tu negocio se vea más moderno y con mejor ambiente.

Puedes conocer más sobre nuestro servicio en www.liontvpremium.com

Si gustas, te comparto una demo sin compromiso para que veas cómo se mira en tu local.`,
        selectCountry: 'Seleccionar país',
        deleteTitle: 'Eliminar cliente potencial',
        deleteBody: '¿Eliminar a {{name}}?',
        messages: {
          loadError: 'No se pudieron cargar los clientes potenciales.',
          alreadyContacted: 'Este prospecto ya está en Contacted.',
          markContactedSuccess: 'Estado actualizado a Contacted.',
          markContactedError: 'No se pudo actualizar el estado.',
          invalidWhatsAppPhone: 'Este prospecto no tiene teléfono válido para WhatsApp.',
          groupLoadError: 'No se pudieron cargar los grupos por nombre.',
          exportEmpty: 'No hay registros para exportar con los filtros actuales.',
          exportNoPhones: 'Los registros filtrados no tienen teléfonos válidos para exportar o ya pertenecen a clientes registrados.',
          exportSuccess: 'CSV exportado con {{count}} registros.',
          exportError: 'No se pudo exportar el CSV de WhatsApp.',
          importInvalidFile: 'El archivo seleccionado no contiene filas válidas de WhatsApp.',
          importParsingError: 'No se pudo interpretar el archivo CSV. Revisa el formato e inténtalo de nuevo.',
          importSuccess:
            'Importación completada. Insertados {{inserted}}, omitidos por existentes {{skipped}}, omitidos por clientes {{skippedCustomers}}, inválidos {{invalid}}.',
          importError: 'No se pudo importar el CSV de WhatsApp.',
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
        selectOption: 'Select an option',
        search: 'Search',
        status: 'Status',
        all: 'All',
        total: 'Total',
        global: 'Global',
        active: 'Active',
        inactive: 'Inactive',
        actions: 'Actions',
        id: 'ID',
        loading: 'Loading...',
        rowsPerPage: 'Rows per page:',
        secure: 'Secure',
        reference: 'Reference'
      },
      layout: {
        footer: {
          allRightsReserved: 'All rights reserved',
          x: 'X',
          discord: 'Discord'
        },
        customization: {
          borderRadius: 'Border radius',
          fontStyle: 'Font style',
          fontSelector: 'Font selector'
        },
        aria: {
          breadcrumb: 'Breadcrumb',
          themeLogo: 'Lion Services home',
          navigationMenu: 'Navigation menu',
          menuItemIcon: 'Menu item icon',
          openReference: 'Open reference link'
        }
      },
      catalogAdmin: {
        searchLabel: 'Search',
        empty: 'No records to display.',
        dialogSubtitle: 'Complete the catalog information.',
        deleteMessage: 'Delete {{name}}? This action cannot be undone.',
        messages: {
          loadError: 'Could not load {{entity}}.',
          saveError: 'Could not save {{entity}}.',
          deleteError: 'Could not delete {{entity}}.',
          created: '{{entity}} created successfully.',
          updated: '{{entity}} updated successfully.',
          deleted: '{{entity}} deleted successfully.'
        },
        metrics: {
          totalRegistered: '{{entity}} registered',
          totalCatalog: 'Full catalog',
          available: 'Available for use',
          hidden: 'Hidden or disabled',
          coverage: 'Registered coverage',
          localCatalog: 'Local catalog',
          trialEnabled: 'Trial enabled',
          officialEnabled: 'Official enabled',
          adminLocked: 'Locked for editing'
        },
        bank: {
          title: 'Banks',
          subtitle: 'Manage the bank catalog used by invoices and commercial flows.',
          helperText: 'Changes here affect bank selectors across the system.',
          entityLabel: 'bank',
          createLabel: 'New bank',
          searchPlaceholder: 'Search by bank name',
          fields: {
            bank: 'Bank',
            status: 'Active'
          }
        },
        service: {
          title: 'Services',
          subtitle: 'Manage the service catalog used by customers, invoices and CRM.',
          helperText: 'Service names are consumed by multiple commercial modules.',
          entityLabel: 'service',
          createLabel: 'New service',
          searchPlaceholder: 'Search by service name',
          fields: {
            serviceName: 'Service',
            status: 'Active'
          }
        },
        countryPhoneCode: {
          title: 'Phone codes',
          subtitle: 'Manage the global catalog of phone prefixes by country.',
          helperText: 'This catalog is used in forms and contact normalization.',
          entityLabel: 'phone code',
          createLabel: 'New phone code',
          searchPlaceholder: 'Search by country, continent or prefix',
          fields: {
            phoneCode: 'Code',
            country: 'Country',
            continent: 'Continent'
          }
        },
        licenseApp: {
          title: 'License Apps',
          subtitle: 'Manage the canonical applications available in the licenses form selector.',
          helperText: 'Only active apps appear when creating a new license. The code is persisted in licenses and cannot be changed after creation.',
          entityLabel: 'license app',
          createLabel: 'New license app',
          searchPlaceholder: 'Search by code, name or id',
          fields: {
            licenseAppCode: 'App code',
            licenseAppCodeHelper: 'Canonical code in UPPER_SNAKE_CASE. Example: VIVO_PLAYER. This value is immutable after creation.',
            licenseAppName: 'App name',
            status: 'Status'
          }
        },
        package: {
          title: 'Packages',
          subtitle: 'Manage the local package catalog synced and used by the Lion TV panel.',
          helperText: 'The package identifier is set manually and should not change after creation.',
          entityLabel: 'package',
          createLabel: 'New package',
          searchPlaceholder: 'Search by name, id, type or credits',
          fields: {
            packageId: 'Package ID',
            name: 'Name',
            type: 'Type',
            ord: 'Order',
            roleCount: 'Role count',
            bouquetCount: 'Bouquet count',
            trialCredits: 'Trial credits',
            trialDuration: 'Trial duration',
            trialDurationIn: 'Trial duration unit',
            officialCredits: 'Official credits',
            officialDuration: 'Official duration',
            officialDurationIn: 'Official duration unit',
            isTrial: 'Trial enabled',
            isOfficial: 'Official enabled',
            isp: 'ISP',
            stb: 'STB',
            canRestream: 'Can restream',
            adminLocked: 'Admin locked',
            flags: 'Flags',
            trial: 'Trial',
            official: 'Official',
            locked: 'Locked'
          }
        }
      },
      sms: {
        title: 'SMS Management',
        enqueue: 'Enqueue SMS',
        history: 'SMS history',
        chips: { ready: '{{count}} numbers ready', total: '{{count}} records', secure: 'Secure' },
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
        vipCustomers: 'Clientes VIP',
        loyalty: 'Lealtad',
        raffles: 'Sorteos',
        liontvOperations: 'Operación Técnica',
        liontvOperationsCaption: 'Inventario, líneas y cuentas',
        liontvContent: 'Contenido y Feed',
        liontvContentCaption: 'Demos y catálogo visible',
        demos: 'Demos Lion TV',
        subscriptions: 'Suscripciones',
        salesWorkflow: 'Ventas y Renovaciones',
        invoices: 'Facturas',
        businessPurchases: 'Compras negocio',
        creditRequests: 'Solicitudes de créditos',
        customers: 'Clientes',
        potentialCustomers: 'Prospectos',
        referrals: 'Leads por Referidos',
        paymentCommitments: 'Compromisos de pago',
        crm: 'CRM Clientes',
        lines: 'Líneas',
        plusLines: 'Líneas Plus',
        m3uBackupLinks: 'Links de Respaldo M3U',
        subscriptionExpiration: 'Expiración de Suscripciones',
        subscriptionExpirationCaption: 'Monitoreo crítico de expiraciones',
        subscriptionSharing: 'Suscripciones compartidas',
        resellerWallet: 'Wallet de Créditos',
        resellerSupport: 'Centro de Soporte',
        ecommerceContactRouting: 'Routing de Contacto Ecommerce',
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
        panelAuthsCaption: 'Credenciales de Vivo Player y 9xtream por usuario',
        catalogs: 'Catálogos',
        catalogsCaption: 'Bancos, servicios, países y paquetes',
        catalogBanks: 'Bancos',
        catalogServices: 'Servicios',
        catalogLicenseApps: 'Apps de Licencias',
        catalogCountryPhoneCodes: 'Códigos telefónicos',
        catalogPackages: 'Paquetes',
        liontvMarketing: 'Marketing',
        liontvMarketingCaption: 'Templates y campañas de correo',
        emailTemplates: 'Templates de Email',
        emailCampaigns: 'Campañas de Email',
        contentAutomation: 'Automatización de Contenido'
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
      headerCredits: {
        label: '{{count}} créditos',
        shortLabel: '{{count}} cr',
        tooltip: 'Abre el wallet para solicitar o revisar créditos.'
      },
      invoices: {
        title: 'Facturas',
        summary: {
          total: '{{count}} facturas',
          paid: 'Estado: PAGADAS {{count}}',
          pending: 'Estado: PENDIENTES {{count}}'
        },
        filters: { status: 'Estado', customer: 'Cliente', all: 'Todos', allCustomers: 'Todos los clientes' },
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
          loyalty: 'Lealtad',
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
            loyalty: 'Lealtad',
            loyaltyHelper: 'Consulta los puntos disponibles y aplícalos directamente en la factura.',
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
          loyalty: {
            availablePoints: 'Puntos disponibles',
            pointsToUse: 'Puntos a usar',
            redeemedAmount: 'Monto canjeado',
            selectCustomerFirst: 'Selecciona primero un cliente.',
            noEarnForPackage: 'Este paquete no acumula puntos de lealtad cuando la factura queda pagada.',
            exceeded: 'Los puntos solicitados superan el saldo disponible.',
            maxAvailable: 'Disponible para esta factura: {{count}} pts',
            conversion: '{{points}} punto(s) = L {{amount}}',
            inactive: 'Lealtad inactiva',
            inactiveHelp: 'El programa de lealtad está inactivo. Actívalo antes de cobrar con puntos.',
            helper: 'Los puntos canjeados se descuentan en el ledger de lealtad cuando se guarda la factura.',
            netAfter: 'Neto después de descuento y puntos: L {{amount}}',
            amountExceeded: 'Los puntos superan el monto neto disponible.',
            configError: 'No se pudo cargar la configuración de lealtad.',
            balanceError: 'No se pudo cargar el saldo de puntos del cliente.'
          },
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
            debit: 'Débito automático',
            cryptocurrency: 'Criptomoneda',
            loyalty: 'Puntos de lealtad'
          }
        },
        messages: {
          required: 'Completa los campos requeridos.',
          needBank: 'Selecciona un banco para pagos por transferencia.',
          loyaltyInactive: 'El programa de puntos está inactivo para esta cuenta.',
          loyaltyExceeded: 'El cliente no tiene suficientes puntos disponibles.',
          loyaltyAmountExceeded: 'Los puntos exceden el monto neto de la factura.',
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
      creditRequests: {
        subtitle:
          'Aprueba solicitudes de créditos reseller desde una sola pantalla y acredita automáticamente el wallet del reseller que creó la solicitud.',
        loading: 'Cargando solicitudes de créditos reseller...',
        helper:
          'Aprobar una solicitud la marca como pagada y acredita el wallet del reseller que la creó. La aprobación es idempotente y no duplica créditos.',
        filters: {
          search: 'Buscar por reseller, código, nota o nombre de la solicitud',
          status: 'Estado',
          allStatuses: 'Todos los estados'
        },
        kpi: {
          total: 'Solicitudes visibles',
          totalHelper: 'Solicitudes que coinciden con los filtros actuales de administración.',
          pending: 'Pendientes',
          pendingHelper: 'Solicitudes que todavía esperan aprobación.',
          approved: 'Aprobadas',
          approvedHelper: 'Solicitudes ya acreditadas a wallets reseller.',
          credits: 'Créditos solicitados',
          creditsHelper: 'Total de créditos representados por las solicitudes visibles.'
        },
        headers: {
          request: 'Solicitud',
          reseller: 'Reseller',
          credits: 'Créditos',
          created: 'Creada',
          status: 'Estado',
          notes: 'Notas',
          actions: 'Acciones'
        },
        status: {
          pending: 'Pendiente',
          paid: 'Aprobada',
          cancelled: 'Cancelada'
        },
        labels: {
          fallbackName: 'Solicitud de créditos',
          alreadyApproved: 'Ya aprobada',
          noAction: 'Sin acción'
        },
        actions: {
          approve: 'Aprobar',
          approving: 'Aprobando...',
          confirmApprove: 'Aprobar y acreditar'
        },
        dialog: {
          title: 'Aprobar solicitud de créditos',
          helper: 'Esta acción marcará la solicitud como aprobada y acreditará automáticamente el wallet del reseller.',
          reseller: 'Reseller: {{username}}',
          credits: 'Créditos: {{credits}}',
          requestCode: 'Código de solicitud: {{code}}',
          notes: 'Notas: {{notes}}'
        },
        empty: {
          title: 'No se encontraron solicitudes de créditos',
          description: 'Prueba otro estado o espera nuevas solicitudes reseller.'
        },
        messages: {
          approved: 'Se aprobaron {{credits}} créditos y quedaron acreditados a {{username}}.'
        },
        errors: {
          load: 'No se pudieron cargar las solicitudes de créditos.',
          approve: 'No se pudo aprobar esta solicitud de créditos.'
        }
      },
      contentAutomation: {
        subtitle: 'Revisa los cuatro posts deportivos del día, valida el copy SAFE y publica solo después de la aprobación manual.',
        loading: 'Cargando consola de revisión de automatización de contenido...',
        safeMode: 'Modo SAFE',
        safeModeOff: 'Modo SAFE desactivado',
        filters: {
          today: 'Hoy',
          tomorrow: 'Mañana',
          date: 'Fecha',
          tomorrowHelper:
            'Mañana es la fecha predeterminada porque esta consola está pensada para validar lo que se publicará a continuación.',
          historyHelper:
            'Estás revisando una fecha específica. Puedes generar posts para este día exacto cuando necesites un lote manual.'
        },
        branding: {
          modeGeneric: 'Marca genérica',
          modeReseller: 'Marca reseller',
          resellerLabel: 'Reseller',
          resellerPlaceholder: 'Buscar por username',
          resellerConfigured: 'Teléfono de soporte: {{phone}}',
          resellerMissing: 'El teléfono de soporte no está configurado',
          previewGeneric: 'La marca de agua del poster se mantendrá con la marca genérica de Lion TV para este lote.',
          previewReady: 'La marca de agua del poster usará {{phone}} para el reseller {{username}}.',
          previewMissing: 'Elige un reseller con teléfono de soporte configurado para generar contenido branded.',
          errors: {
            lookup: 'No se pudieron cargar los perfiles de soporte reseller.',
            resellerRequired: 'Selecciona un reseller para generar contenido branded.',
            supportMissing: 'El reseller seleccionado no tiene teléfono de soporte configurado en Support Center.'
          }
        },
        teamLogos: {
          title: 'Catálogo de logos de equipos',
          subtitle:
            'Configura logos manuales por deporte y nombre del equipo. Estos overrides se aplican la próxima vez que generes o regeneres la imagen del post.',
          priority:
            'Orden de prioridad: catálogo manual, logo del evento/proveedor, búsqueda automática en TheSportsDB y luego badge fallback.',
          loading: 'Cargando catálogo de logos...',
          empty: 'Todavía no hay logos que coincidan con los filtros actuales.',
          summary: {
            total: '{{count}} logos en catálogo'
          },
          filters: {
            search: 'Buscar equipo',
            searchPlaceholder: 'Buscar por nombre del equipo',
            sport: 'Deporte',
            status: 'Estado',
            allSports: 'Todos los deportes',
            allStatuses: 'Todos',
            enabled: 'Activo',
            disabled: 'Inactivo'
          },
          table: {
            logo: 'Logo',
            team: 'Equipo',
            sport: 'Deporte',
            url: 'URL',
            status: 'Estado',
            updatedAt: 'Actualizado',
            actions: 'Acciones'
          },
          actions: {
            new: 'Nuevo logo'
          },
          dialog: {
            createTitle: 'Nuevo logo de equipo',
            editTitle: 'Editar logo de equipo',
            subtitle:
              'Usa el nombre exacto del equipo como esperas verlo en el feed de eventos. Este override se aplicará en la próxima regeneración de imagen.',
            sport: 'Deporte',
            teamName: 'Nombre del equipo',
            logoUrl: 'URL del logo',
            logoHelper: 'Usa una URL directa de imagen con http:// o https://.',
            enabled: 'Activo'
          },
          delete: {
            title: 'Eliminar logo de equipo',
            body:
              'Esto quitará el override manual y el sistema volverá a usar el proveedor, la búsqueda automática o el badge generado.'
          },
          messages: {
            created: 'El logo del equipo se creó correctamente.',
            updated: 'El logo del equipo se actualizó correctamente.',
            deleted: 'El logo del equipo se eliminó correctamente.'
          },
          errors: {
            load: 'No se pudo cargar el catálogo de logos.',
            save: 'No se pudo guardar el logo del equipo.',
            delete: 'No se pudo eliminar el logo del equipo.',
            required: 'Deporte, nombre del equipo y URL del logo son obligatorios.',
            invalidUrl: 'Usa una URL de imagen válida con http:// o https://.'
          }
        },
        kpis: {
          posts: 'Posts',
          postsHelper: 'Posts cargados actualmente para la fecha seleccionada.',
          generated: 'Generados',
          generatedHelper: 'Posts listos para revisión editorial y aprobación.',
          approved: 'Aprobados',
          approvedHelper: 'Posts ya validados y listos para publicación.',
          published: 'Publicados',
          publishedHelper: 'Posts que ya se enviaron al flujo de publicación configurado.',
          failed: 'Fallidos',
          failedHelper: 'Posts que requieren intervención manual antes de continuar.'
        },
        events: {
          title: 'Eventos de mañana',
          subtitle:
            'Partidos reales detectados para mañana en horario de Honduras. Las cards de abajo usan la distribución por slot más el pool completo del día para construir el contenido de revisión.',
          count: '{{count}} eventos reales',
          emptySlot: 'No se detectaron eventos destacados para este bloque.'
        },
        slotsReviewTitle: 'Revisión diaria por slot',
        slotsReviewSubtitle:
          'Cada slot mantiene una card profesional con el estado final, el copy sanitizado y la imagen generada.',
        slots: {
          all_day: 'Todo el día',
          morning: 'Mañana',
          afternoon: 'Tarde',
          night: 'Noche'
        },
        slotCard: {
          emptyTitle: 'Todavía no hay post generado',
          previewPending: 'La imagen de vista previa todavía no está disponible.',
          eventCount: '{{count}} eventos reales',
          selectedEvents: '{{count}} seleccionados para la imagen',
          updatedAt: 'Actualizado {{value}}',
          resellerLabel: 'Reseller: {{username}}',
          phoneLabel: 'Teléfono: {{phone}}',
          captionLabel: 'Resumen del caption',
          emptyCaption: 'Genera este slot para preparar el copy y la imagen de revisión.'
        },
        actions: {
          generateTomorrow: 'Generar mañana',
          generateDate: 'Generar fecha seleccionada',
          generating: 'Generando...',
          previewImage: 'Ver imagen',
          safePreview: 'Vista SAFE',
          selectEvents: 'Seleccionar eventos',
          clearSelections: 'Limpiar selecciones',
          useAutomaticSelection: 'Usar selección automática',
          applySelectedEvents: 'Aplicar eventos seleccionados',
          applyingSelection: 'Aplicando selección...',
          regenerateImage: 'Regenerar imagen',
          regenerateCaptions: 'Regenerar captions',
          approve: 'Aprobar',
          publish: 'Publicar',
          confirmApprove: 'Aprobar post',
          confirmPublish: 'Publicar post'
        },
        selectionDialog: {
          title: 'Selecciona los eventos que deben aparecer en la imagen',
          loading: 'Cargando eventos seleccionables...',
          subtitle:
            'Elige hasta 5 eventos reales para este slot. El sistema regenerará la imagen y los captions usando exactamente esta selección editorial.',
          subtitleAllDay:
            'Elige hasta 5 eventos reales de todo el día. El sistema regenerará la imagen y los captions usando exactamente esta selección editorial.',
          searchLabel: 'Buscar eventos',
          searchPlaceholder: 'Busca eventos, ligas o equipos',
          allCategories: 'Todas las categorías',
          selectedCount: '{{count}} seleccionados',
          limit: 'Máximo 5 eventos en la imagen',
          manual: 'La selección manual está activa actualmente',
          automatic: 'La selección automática destacada está activa actualmente',
          empty: 'Todavía no hay eventos reales disponibles para este slot. Primero genera o importa eventos.',
          emptyAllDay: 'Todavía no hay eventos reales disponibles para este día. Primero genera o importa eventos.',
          fallbackLeague: 'Evento deportivo',
          noMatch: 'No hay eventos que coincidan con los filtros actuales.',
          filtersSummary: '{{count}} eventos coinciden con los filtros activos.',
          groupCount: '{{count}} eventos',
          sports: {
            SOCCER: 'Fútbol',
            BASKETBALL: 'NBA / Basketball',
            AMERICAN_FOOTBALL: 'NFL',
            BASEBALL: 'MLB',
            MOTORSPORT: 'F1',
            TENNIS: 'Tennis',
            OTHER: 'Otros deportes'
          }
        },
        previewDialog: {
          title: 'Vista previa de la imagen renderizada'
        },
        safePreviewDialog: {
          title: 'Vista SAFE',
          loading: 'Cargando vista SAFE...',
          clean: 'No se detectó URL ni dominio directo',
          review: 'Revisa el CTA y elimina referencias directas',
          caption: 'Caption sanitizado'
        },
        confirm: {
          approveTitle: 'Aprobar post generado',
          approveDescription: 'Esto marcará el slot como aprobado y lo dejará listo para publicación manual.',
          publishTitle: 'Publicar post aprobado',
          publishDescription: 'Esto enviará el slot al flujo de publicación configurado y lo marcará como publicado.'
        },
        empty: {
          tomorrow: 'Todavía no se generaron posts del día para mañana. Usa "Generar mañana" para construir el set de revisión.',
          history: 'No hay posts almacenados para esta fecha. Selecciona otro día o genera este lote específico.'
        },
        status: {
          DRAFT: 'Borrador',
          GENERATED: 'Generado',
          APPROVED: 'Aprobado',
          PUBLISHED: 'Publicado',
          FAILED: 'Fallido'
        },
        messages: {
          generated: 'Se refrescaron {{count}} posts para {{date}}.',
          eventsSelectionSaved: 'El post se regeneró con tus eventos seleccionados.',
          eventsSelectionReset: 'El slot volvió a la selección automática destacada.',
          imageRegenerated: 'La imagen de vista previa se regeneró correctamente.',
          captionsRegenerated: 'Los captions se regeneraron correctamente.',
          approved: 'El post quedó aprobado para publicación.',
          published: 'El post se publicó correctamente.'
        },
        errors: {
          loadPosts: 'No se pudieron cargar los posts de automatización.',
          loadEvents: 'No se pudieron cargar los eventos de mañana.',
          loadSelectableEvents: 'No se pudieron cargar los eventos disponibles para este slot.',
          generate: 'No se pudieron generar los posts para la fecha seleccionada.',
          previewMissing: 'La imagen de vista previa todavía no está disponible.',
          selectionLimit: 'Solo puedes colocar hasta 5 eventos dentro del template de imagen.',
          saveSelectedEvents: 'No se pudieron aplicar los eventos seleccionados a este post.',
          resetSelectedEvents: 'No se pudo restaurar la selección automática de eventos.',
          safePreview: 'No se pudo cargar la vista SAFE.',
          slotFailed: 'Este slot falló y requiere atención.'
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
        search: 'Buscar (cliente, línea, paquete, estado, proveedor, país)',
        filters: {
          status: 'Estado',
          customer: 'Cliente',
          provider: 'Proveedor',
          customerCountry: 'País',
          all: 'Todos',
          allCustomers: 'Todos los clientes',
          allProviders: 'Todos los proveedores',
          allCountries: 'Todos los países',
          unknownCountry: 'País no detectado',
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
          copySuccess: 'Resumen de suscripción copiado.',
          copyError: 'No se pudo generar el resumen de la suscripción.',
          m3uCopySuccess: 'Lista M3U copiada.',
          m3uCopyError: 'No se pudo generar la lista M3U.',
          m3uPlusCopySuccess: 'Lista M3U Plus copiada.',
          m3uPlusCopyError: 'No se pudo generar la lista M3U Plus.',
          countryCodesLoadError: 'No se pudieron cargar los códigos telefónicos de país.',
          notificationError: 'No se pudo enviar la notificación.',
          required: 'Completa los campos requeridos.',
          created: 'Suscripción creada correctamente.',
          updated: 'Suscripción actualizada correctamente.',
          deleted: 'Suscripción eliminada correctamente.',
          saveError: 'No se pudo guardar la suscripción.',
          deleteError: 'No se pudo eliminar la suscripción.'
        },
        actions: {
          new: 'Nueva suscripción',
          notifyExpiration: 'Enviar aviso vencimiento',
          notifyReengage: 'Notificar reenganche',
          notifyRenewed: 'Notificar renovación exitosa',
          copyWhatsapp: 'Copiar WhatsApp',
          copyM3u: 'Copiar M3U',
          copyM3uPlus: 'Copiar M3U Plus'
        },
        form: {
          autopayLinkPlaceholder: 'https://...'
        },
        headers: {
          id: 'ID',
          customer: 'Cliente',
          line: 'Línea',
          package: 'Paquete',
          lineExpiration: 'Vence línea',
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
        hero: {
          eyebrow: 'Alineación operativa',
          title: 'Organiza las shared subscriptions antes de que un mal host impacte renovaciones y calidad de servicio',
          subtitle:
            'Monitorea hosts, beneficiarios, buckets por día de renovación y movimientos recomendados desde una vista pensada para decisiones operativas diarias.',
          hostsChip: '{{count}} hosts visibles',
          sharedChip: '{{count}} shared visibles',
          capacityChip: '{{count}} suscripciones elegibles independientes',
          signals: {
            criticalTitle: 'Críticos',
            criticalHelper: 'Hosts ya en OVERDUE o 0-7 días que pueden afectar primero las renovaciones shared.',
            misalignedTitle: 'Desalineadas',
            misalignedHelper: 'Suscripciones shared cuyo día de renovación todavía no coincide con el host actual.',
            movesTitle: 'Movimientos',
            movesHelper: 'Beneficiarios con una recomendación clara disponible para moverse hoy mismo.',
            bucketHosts: 'Hosts visibles dentro de este bucket de renovación.',
            bucketShared: 'Beneficiarios actualmente colgados de estos hosts.',
            bucketMisaligned: 'Cuentas shared cuyo día propio todavía no coincide con el host.',
            bucketMoves: 'Beneficiarios que pueden reorganizarse de inmediato desde este bucket.'
          }
        },
        tabs: {
          clusters: 'Clústeres shared',
          capacity: 'Espacios disponibles por día',
          oversold: 'Suscripciones sobrevendidas'
        },
        kpi: {
          totalSubscriptions: 'Suscripciones totales',
          activeSubscriptions: 'Activas',
          sharedClusters: 'Clústeres compartidos',
          hosts: 'Hosts',
          sharedSubscriptions: 'Suscripciones SHARED',
          misalignedShared: 'Shared desalineadas',
          recommendedMoves: 'Movimientos recomendados',
          renewalBuckets: 'Buckets de renovación',
          capacityLines: 'Líneas con espacio',
          capacitySlots: 'Espacios de 1 pantalla',
          pendingSetupCustomers: 'Pendientes de configurar',
          oversoldSubscriptions: 'Suscripciones sobrevendidas',
          excessLicenses: 'Licencias excedentes',
          affectedCustomers: 'Clientes afectados',
          eligibleSubscriptions: 'Elegibles',
          overdueClusters: 'Hosts vencidos',
          criticalClusters: 'Hosts críticos',
          atRiskSubscriptions: 'Suscripciones afectadas'
        },
        filters: {
          title: 'Filtros y lectura rápida',
          subtitle: 'Usa los filtros actuales para aislar hosts, beneficiarios o suscripciones bloqueadas y abrir el diagnóstico desde la misma pantalla.',
          searchPlaceholder: 'Buscar por suscripción, cliente, línea, proveedor o estado',
          status: 'Rol de compartición',
          eligible: 'Elegible',
          riskBucket: 'Bucket de riesgo',
          atRiskOnly: 'En riesgo',
          renewalDay: 'Día de renovación',
          ownRenewalDay: 'Día propio de renovación',
          renewalDayAll: 'Todos los días',
          misalignedOnly: 'Desalineadas',
          recommendedMoves: 'Movimientos recomendados',
          visible: 'Visibles: {{count}}',
          hostsVisible: 'Hosts: {{count}}',
          sharedVisible: 'Shared: {{count}}',
          eligibleVisible: 'Elegibles libres: {{count}}',
          blockedVisible: 'Bloqueadas: {{count}}',
          criticalVisible: 'Hosts críticos: {{count}}',
          overdueVisible: 'Hosts vencidos: {{count}}',
          misalignedVisible: 'Desalineadas: {{count}}',
          recommendedVisible: 'Movimientos recomendados: {{count}}',
          reset: 'Resetear filtros',
          blockedHint:
            'Hay suscripciones bloqueadas en esta vista. Abre el diagnóstico para confirmar si la causa es estado inactivo, duración mínima o falta de capacidad.',
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
          },
          riskOptions: {
            all: 'Todos'
          },
          atRiskOptions: {
            all: 'Todos',
            yes: 'Sí',
            no: 'No'
          },
          recommendationOptions: {
            all: 'Todos',
            yes: 'Solo recomendados'
          },
          misalignedOptions: {
            all: 'Todas',
            yes: 'Solo desalineadas'
          }
        },
        sections: {
          sharedClusters: 'Clústeres compartidos agrupados por día de renovación del host',
          sharedClustersHint:
            'Los hosts se agrupan por su día de renovación para que puedas ver con anticipación qué clústeres compartidos se afectan cuando un host se acerca al vencimiento.',
          noSharedClusters: 'No se encontraron clústeres compartidos con los filtros actuales.',
          eligibleNotShared: 'Elegibles sin compartir',
          eligibleHint: 'Estas suscripciones ya cumplen la regla de sharing y todavía no forman parte de ningún clúster compartido.',
          noEligible: 'No hay suscripciones elegibles pendientes de compartir.',
          notEligible: 'No elegibles en este momento',
          notEligibleHint:
            'Esta lista muestra las suscripciones que siguen fuera del sharing y explica si el bloqueo es por estado, duración o capacidad disponible.',
          noNotEligible: 'No hay suscripciones no elegibles con los filtros actuales.'
        },
        capacity: {
          title: 'Espacios disponibles agrupados por día de renovación',
          subtitle: 'Usa esta vista operativa para colocar nuevas ventas de 1 pantalla en líneas que todavía tienen capacidad real en ese día exacto.',
          info:
            'Este tab es operativo. Usa la capacidad activa disponible en este momento e ignora los filtros de Elegible / Desalineadas / Recomendados para que las cuentas mensuales con espacio sigan visibles.',
          empty: 'No se encontraron líneas activas con capacidad libre para los filtros actuales.',
          summary: {
            lines: 'Líneas con espacio: {{count}}',
            slots: 'Espacios de 1 pantalla: {{count}}',
            hosts: 'Hosts con espacio: {{count}}',
            standalone: 'Independientes con espacio: {{count}}'
          },
          bucket: {
            lineCount: 'Líneas: {{count}}',
            slotCount: 'Espacios de 1 pantalla: {{count}}',
            hostCount: 'Hosts: {{count}}',
            standaloneCount: 'Independientes: {{count}}',
            helper: 'Usa este bucket para nuevos clientes de 1 pantalla que deban renovar ese día. Renovación más próxima: {{date}}',
            helperNoDate: 'Usa este bucket para líneas sin fecha visible solo después de validación manual.',
            helperLines: 'Líneas operativas disponibles actualmente dentro de este bucket por día.',
            helperSlots: 'Espacios reales de 1 pantalla que puedes vender en este mismo día de renovación.',
            helperHosts: 'Suscripciones host con capacidad libre en este bucket.',
            helperStandalone: 'Suscripciones independientes que pueden recibir nuevas ventas de 1 pantalla.'
          },
          card: {
            slotBadge: '{{count}} espacio(s) libres',
            billing: 'Facturación',
            availableSlots: 'Espacios disponibles de 1 pantalla',
            salesHelper: 'Puedes colocar {{count}} venta(s) de 1 pantalla aquí',
            currentUsage: 'Uso actual',
            roleHelper: 'Rol: {{role}}'
          }
        },
        pendingSetup: {
          title: 'Clientes con licencias pendientes de configurar',
          subtitle: 'Estas son suscripciones activas e independientes que todavía tienen pantallas contratadas disponibles para configurar.',
          empty: 'No se encontraron clientes independientes con licencias pendientes de configurar para los filtros actuales.',
          slotsBadge: '{{count}} slots pendientes',
          slots: 'Slots pendientes',
          slotsHelper: 'Pantallas que todavía faltan por configurarse para este cliente.',
          usageHelper: 'Licencias configuradas versus pantallas contratadas.',
          bucket: {
            customers: 'Clientes: {{count}}',
            slots: 'Slots pendientes: {{count}}',
            helper: 'Los clientes independientes de este día de renovación todavía necesitan configurar licencias. Renovación más próxima: {{date}}',
            helperNoDate: 'Estos clientes independientes todavía necesitan configurar licencias, pero su fecha de renovación debe validarse manualmente.'
          }
        },
        oversold: {
          title: 'Suscripciones sobrevendidas por capacidad del paquete',
          subtitle: 'Detecta suscripciones donde el paquete contratado permite menos conexiones que las licencias activas vinculadas actualmente.',
          listSubtitle: 'Estas suscripciones tienen más licencias activas vinculadas que el token 1P..5P contratado en el texto del paquete.',
          filtersSubtitle: 'Este tab solo usa la búsqueda global para revisar sobreventa sin mezclar filtros de elegibilidad shared.',
          info: 'La sobreventa se calcula comparando las licencias activas vinculadas contra el token 1P..5P detectado en el texto del paquete.',
          empty: 'No se encontraron suscripciones sobrevendidas para la búsqueda actual.',
          summary: {
            visible: 'Sobrevendidas: {{count}}',
            excess: 'Licencias excedentes: {{count}}',
            customers: 'Clientes afectados: {{count}}'
          },
          card: {
            contractedConnections: 'Conexiones contratadas',
            activeLinkedLicenses: 'Licencias activas vinculadas',
            oversoldLabel: 'Exceso',
            oversoldBy: 'Sobrevendida por {{count}}',
            capacityToken: 'Token: {{token}}',
            renewalDate: 'Renovación: {{date}}',
            customerId: 'Cliente #{{id}}'
          },
          detail: {
            title: 'Detalle de sobreventa',
            subtitle: 'Suscripción #{{subscriptionId}}',
            subtitleFallback: 'Snapshot de sobreventa en vivo',
            empty: 'No hay detalle de sobreventa disponible para esta suscripción.',
            summaryTitle: 'Resumen de sobreventa',
            affectedLicenseCount: 'Licencias afectadas',
            licensesTitle: 'Licencias operativas vinculadas',
            licensesCount: 'Licencias: {{count}}',
            noLicenses: 'No se encontraron licencias operativas vinculadas para esta suscripción.'
          }
        },
        role: {
          host: 'HOST',
          shared: 'SHARED',
          none: 'NONE'
        },
        reason: {
          inactive: 'Inactiva',
          minimumTerm: 'Mínimo {{count}} meses',
          noCapacity: 'Sin capacidad disponible'
        },
        alignment: {
          aligned: 'Alineada',
          misaligned: 'Desalineada',
          noHostDate: 'Host sin fecha',
          noOwnDate: 'Sin fecha propia',
          unknown: 'Alineación desconocida'
        },
        alignmentReason: {
          alreadyAligned: 'El día propio ya coincide con el host.',
          hostDayDiffers: 'El día propio no coincide con el día del host actual.',
          noHostDate: 'El host actual no tiene fecha de renovación.',
          noOwnDate: 'Esta suscripción no tiene fecha de renovación.',
          unknown: 'No se pudo determinar la alineación de renovación.'
        },
        risk: {
          overdue: 'Vencido',
          zeroToSeven: '0-7 días',
          eightToFifteen: '8-15 días',
          sixteenToThirty: '16-30 días',
          thirtyOnePlus: '31+ días',
          unknown: 'Sin fecha de renovación',
          dayOfMonth: 'Día {{day}}',
          dayUnknown: 'Sin fecha',
          unknownDays: 'Fecha faltante',
          overdueDays: 'Vencido {{days}}d',
          today: 'Vence hoy',
          inDays: 'En {{days}}d'
        },
        bucket: {
          hostCount: 'Hosts: {{count}}',
          sharedCount: 'Shared: {{count}}',
          misalignedCount: 'Desalineadas: {{count}}',
          recommendedCount: 'Recomendados: {{count}}',
          nearestDate: 'Renovación host más próxima: {{date}}',
          nearestDateUnknown: 'Hosts sin fecha de renovación en este bucket.',
          overdueAlert: 'Este bucket de renovación ya tiene hosts vencidos que afectan suscripciones shared.',
          criticalAlert: 'Este bucket de renovación incluye hosts que afectarán suscripciones shared en 7 días o menos.'
        },
        card: {
          hostSubscription: 'Suscripción host',
          eligible: 'Elegible',
          notEligible: 'No elegible',
          clusterSize: 'Clúster: {{count}}',
          customer: 'Cliente',
          line: 'Línea',
          linePlus: 'Línea plus',
          provider: 'Proveedor',
          package: 'Paquete',
          subscriptionType: 'Tipo de suscripción',
          packageDescription: 'Descripción',
          renewal: 'Renovación',
          hostRenewal: 'Renovación host',
          renewalDay: 'Día de renovación',
          daysLeft: 'Días restantes',
          capacity: 'Capacidad {{activated}} · Uso {{used}} · Disponible {{available}}',
          term: 'Duración {{months}} meses',
          termLabel: 'Duración',
          termValue: '{{months}} meses',
          minimumHint: 'Mínimo {{count}} meses',
          usageLabel: 'Presión de uso',
          capacityShort: 'Disponible {{available}}',
          customerId: 'Customer ID',
          clusterMembers: 'Beneficiarios',
          sharedClusterSize: 'Tamaño clúster {{count}}',
          status: 'Estado',
          beneficiaries: 'Beneficiarios',
          beneficiariesHint: 'Cada shared debería renovar el mismo día que el host. Las cuentas desalineadas se muestran primero para reorganizarlas.',
          noBeneficiaries: 'No hay suscripciones SHARED vinculadas a este host.',
          affectsShared: 'Afecta {{count}} shared',
          inheritedRisk: 'Riesgo heredado del host #{{hostId}}',
          misalignedShared: 'Shared desalineadas',
          alignedShared: 'Shared alineadas',
          sectionCount: '{{count}} items',
          ownRenewalDayValue: 'Día propio: {{day}}',
          currentHostDayValue: 'Día del host: {{day}}'
        },
        actions: {
          viewDiagnostics: 'Ver diagnóstico',
          rolePreference: 'Rol',
          roleAuto: 'Auto',
          roleHost: 'Host',
          roleShared: 'Shared',
          roleCurrent: 'Modo de rol: {{role}}',
          roleHelp: 'Elige qué suscripción debe comportarse como host dentro de esta línea compartida. Auto mantiene la decisión del sistema.',
          viewOversoldDetail: 'Ver detalle de sobreventa',
          closeOversoldDetail: 'Cerrar detalle de sobreventa',
          moveToDay: 'Mover al día {{day}}',
          moveToHost: 'Mover al host #{{id}}',
          moving: 'Moviendo...',
          confirmMove: 'Mover beneficiario'
        },
        move: {
          title: 'Recomendación de movimiento',
          priority: {
            urgent: 'Movimiento urgente',
            review: 'Revisar movimiento',
            none: 'Sin movimiento'
          },
          reason: {
            recommended: 'Ya existe un host con el mismo día exacto de renovación.',
            alreadyAligned: 'Esta suscripción shared ya está alineada con su host.',
            missingRenewalDate: 'Falta el día propio o el día del host.',
            noCapacity: 'Existe un destino del mismo día, pero no tiene capacidad suficiente.',
            incompatibleService: 'Existen hosts del mismo día, pero no son compatibles por servicio.',
            noExactDayHost: 'No se encontró un host o cuenta elegible con el mismo día exacto.',
            none: 'Todavía no hay una recomendación de movimiento.'
          },
          hostAlert: '{{count}} beneficiario(s) no renuevan el mismo día que este host.',
          recommendedBadge: 'Movimiento recomendado',
          ownDay: 'Día propio de renovación',
          currentDay: 'Día actual del host',
          recommendedDay: 'Día recomendado',
          requiredScreens: 'Pantallas a mover',
          recommendedHost: 'Host #{{id}}',
          recommendedLine: 'Línea: {{line}}',
          recommendedLinePlus: 'Plus: {{value}}',
          recommendedCustomer: 'Cliente: {{customer}}',
          confirmTitle: 'Mover beneficiario a host del mismo día',
          confirmSubtitle: 'Suscripción #{{subscriptionId}}',
          confirmSubtitleFallback: 'Confirma el movimiento recomendado',
          confirmBody: 'Esto moverá la suscripción shared a un host que renueva el mismo día y dejará el destino fijado como HOST.',
          currentAssignment: 'Asignación actual',
          currentHost: 'Host #{{id}}',
          currentLine: 'Línea: {{line}}',
          currentDayValue: 'Día: {{day}}',
          ownDayValue: 'Día propio: {{day}}',
          destinationAssignment: 'Destino recomendado',
          confirmWarning: 'Esta acción cambia lineId/linePlusId de la suscripción beneficiaria y afecta de inmediato cómo queda organizado el clúster compartido.'
        },
        diagnostics: {
          title: 'Diagnóstico de suscripción',
          subtitle: 'Suscripción #{{subscriptionId}}',
          subtitleFallback: 'Snapshot de elegibilidad en vivo',
          empty: 'No hay diagnóstico disponible para esta suscripción.',
          sharingActive: 'Activa para sharing',
          sharingInactive: 'Inactiva para sharing',
          sharedCluster: 'Clúster compartido · {{count}}',
          standalone: 'Suscripción independiente',
          hostAtRisk: 'El riesgo del host afecta suscripciones shared',
          hostStable: 'Host estable por ahora',
          customer: 'Cliente',
          line: 'Línea',
          linePlus: 'Plus: {{value}}',
          provider: 'Proveedor',
          package: 'Paquete',
          packageType: 'Tipo: {{value}}',
          packageDescription: 'Descripción de la suscripción',
          status: 'Estado: {{value}}',
          billing: 'Billing',
          startDate: 'Fecha de inicio',
          renewalDate: 'Fecha de renovación',
          ownRenewalDay: 'Día propio de renovación',
          hostRenewalDate: 'Fecha de renovación del host',
          hostRenewalDay: 'Día de renovación',
          hostDaysToRenewal: 'Días al vencimiento del host',
          hostRiskBucket: 'Bucket de riesgo del host',
          alignmentTitle: 'Alineación de renovación',
          termMonths: 'Meses calculados',
          minimumEligibleMonths: 'Mínimo: {{count}}',
          activatedScreens: 'Pantallas activadas',
          estimatedUsage: 'Uso estimado',
          availableCapacity: 'Capacidad disponible',
          summaryTitle: 'Resumen de sharing',
          hostSubscription: 'Host #{{id}}',
          readingHostImpact:
            'Para clústeres shared, la fecha del host controla el bucket operativo. Si el host vence, todas las suscripciones shared vinculadas se ven afectadas.',
          readingStandalone:
            'Esta suscripción no pertenece a un clúster shared, así que su propia fecha de renovación controla el bucket operativo.'
        },
        errors: {
          loadError: 'No se pudo cargar el overview de suscripciones compartidas.',
          loadOversold: 'No se pudo cargar la sobreventa de suscripciones.',
          loadOversoldDetail: 'No se pudo cargar el detalle de sobreventa.',
          loadDiagnostics: 'No se pudo cargar el diagnóstico de la suscripción.',
          updateRole: 'No se pudo actualizar la preferencia de rol.',
          moveSubscription: 'No se pudo mover la suscripción shared.'
        },
        messages: {
          roleUpdated: 'Preferencia de rol actualizada.',
          moveCompleted: 'La suscripción #{{sourceId}} se movió al host #{{destinationId}}.'
        }
      },
      resellerDashboard: {
        loading: 'Preparando centro de control reseller...',
        lowBalance:
          'Tu saldo está bajando. Solicita créditos ahora para que ventas, renovaciones y soportes urgentes no se frenen durante el día.',
        errors: {
          wallet: 'No se pudo cargar el saldo de créditos reseller.'
        },
        actions: {
          buyCredits: 'Solicitar créditos'
        },
        hero: {
          badge: 'Centro de control reseller',
          title: 'Controla ventas, renovaciones y salud del servicio desde una sola consola profesional',
          subtitle:
            'Monitorea créditos, clientes, suscripciones, líneas y riesgo shared con el contexto necesario para actuar rápido sin perder control operativo.',
          primary: 'Solicitar créditos',
          secondary: 'Revisar lines',
          balanceLabel: 'Créditos disponibles',
          balanceHelper: 'Úsalos para nuevas activaciones, renovaciones y operaciones de soporte.',
          balanceStatusLow: 'Saldo bajo',
          balanceStatusGood: 'Saldo saludable',
          pendingInvoices: 'Facturas pendientes',
          sharedRisk: 'Riesgo shared'
        },
        cards: {
          balance: 'Saldo disponible',
          balanceHelper: 'Créditos listos para nuevas activaciones y continuidad del servicio.',
          customers: 'Clientes activos',
          customersHelper: 'Base actual de clientes operando bajo tu cuenta reseller.',
          subscriptions: 'Suscripciones activas',
          subscriptionsHelper: 'Planes en producción y pendientes de renovación.',
          licenses: 'Licencias activas',
          licensesHelper: 'Licencias ya en uso o listas para asignarse.',
          pendingInvoices: 'Facturas pendientes',
          pendingInvoicesHelper: 'Cobros manuales que todavía requieren seguimiento.',
          consumed: 'Consumo histórico de créditos',
          consumedHelper: 'Créditos ya consumidos por activaciones y movimientos operativos.'
        },
        quick: {
          eyebrow: 'Opera más rápido',
          title: 'Accesos comerciales que sí mueven el negocio',
          subtitle:
            'Abre los módulos que realmente usas todos los días para vender, revisar capacidad y reorganizar cuentas sin pasar por flujos internos que no te aportan.',
          customers: {
            title: 'Clientes',
            helper: 'Crea, organiza y da seguimiento a tu base activa desde un solo lugar.',
            action: 'Abrir clientes'
          },
          subscriptions: {
            title: 'Suscripciones',
            helper: 'Crea, renueva y reorganiza planes con visibilidad comercial completa.',
            action: 'Abrir suscripciones'
          },
          licenses: {
            title: 'Licencias',
            helper: 'Activa dispositivos, cambia servidores y resuelve soporte con más velocidad.',
            action: 'Abrir licencias'
          },
          lines: {
            title: 'Lines',
            helper: 'Revisa líneas activas, capacidad disponible y próximas renovaciones.',
            action: 'Abrir lines'
          },
          plusLines: {
            title: 'Plus Lines',
            helper: 'Monitorea inventario plus, estado y preparación operativa.',
            action: 'Abrir plus lines'
          },
          shared: {
            title: 'Shared Subscriptions',
            helper: 'Ordena hosts, beneficiarios y buckets por día antes de afectar el servicio al cliente.',
            action: 'Abrir shared subscriptions'
          }
        },
        focus: {
          eyebrow: 'Foco comercial',
          title: 'Tres señales que no debes ignorar hoy',
          subtitle:
            'Estas tarjetas te muestran dónde pueden romperse primero el flujo de caja, la estabilidad del servicio o las renovaciones dentro de tu operación reseller.',
          renewals: {
            title: 'Renovaciones críticas',
            helper: 'Si este número sube, revisa las suscripciones cercanas al vencimiento antes de mover más clientes.',
            action: 'Abrir suscripciones'
          },
          shared: {
            title: 'Shared en riesgo',
            helper: 'Aquí detectas hosts y beneficiarios que debes reorganizar antes de que impacten el servicio del cliente.',
            action: 'Abrir shared subscriptions'
          },
          collections: {
            title: 'Cobros pendientes',
            helper: 'Mantén los cobros manuales bajo control para sostener caja mientras sigues activando cuentas.',
            action: 'Abrir facturas'
          }
        }
      },
      licenses: {
        title: 'Licencias',
        search: 'Buscar (MAC, device key, cliente, suscripción, estado)',
        actions: {
          authenticateBob: 'Autenticar Bob Player',
          syncBobPlaylist: 'Sincronizar playlist Bob',
          refreshCaptcha: 'Refrescar captcha',
          clearBobSession: 'Limpiar sesión',
          completeBobLogin: 'Completar login',
          server: 'Cambiar servidor',
          transfer: 'Trasladar',
          history: 'Historial',
          removePlaylists: 'Quitar todas las playlists'
        },
        filters: { status: 'Estado', payment: 'Pago', customer: 'Cliente', all: 'Todos', allCustomers: 'Todos los clientes' },
        status: {
          ACTIVE: 'ACTIVO',
          INACTIVE: 'INACTIVO',
          EXPIRED: 'EXPIRADA',
          AVAILABLE: 'DISPONIBLE',
          EMERGENCY: 'EMERGENCIA'
        },
        paid: { paid: 'Pagada', pending: 'Pendiente' },
        labels: {
          requiresSubscriptionLink: 'Requiere vínculo con suscripción'
        },
        bob: {
          session: {
            title: 'Sesión Bob',
            ready: 'Lista',
            captchaRequired: 'Captcha requerido',
            expired: 'Expirada',
            authBlocked: 'Autenticación bloqueada',
            invalid: 'Sesión inválida',
            notConfigured: 'No configurada'
          },
          dialog: {
            title: 'Autenticar Bob Player',
            helper:
              'El sistema usa la MAC y el device key guardados en esta licencia, solicita el captcha real de Bob Player y solo te pide escribir la respuesta del captcha.'
          },
          deviceKeyMasked: 'Device key guardada',
          captchaAnswer: 'Captcha',
          lastRefreshed: 'Última actualización',
          remotePlaylist: 'Playlist remota',
          sync: {
            title: 'Sincronizar playlist Bob',
            helper:
              'Selecciona una playlist que ya exista en este dispositivo Bob para vincularla con la licencia actual. El sistema guardará ese id remoto para futuras actualizaciones y bajas automáticas.',
            selectLabel: 'Playlist remota',
            selectHelper: 'Elige la playlist remota exacta que pertenece a esta licencia.',
            loading: 'Cargando playlists desde Bob Player...',
            empty: 'No se encontraron playlists en este dispositivo Bob.',
            remoteId: 'Id remoto'
          },
          messages: {
            startError: 'No se pudo iniciar la autenticación de Bob Player.',
            completeError: 'No se pudo completar la autenticación de Bob Player.',
            clearError: 'No se pudo limpiar la sesión de Bob Player.',
            listError: 'No se pudieron cargar las playlists de Bob Player.',
            syncError: 'No se pudo sincronizar la playlist Bob.',
            syncSuccess: 'La playlist Bob quedó vinculada a esta licencia.',
            syncRequired: 'Selecciona una playlist Bob antes de continuar.',
            success: 'La sesión de Bob Player quedó autenticada correctamente.',
            cleared: 'La sesión de Bob Player fue limpiada.',
            statusError: 'No se pudo validar el estado de la sesión de Bob Player.',
            captchaRequired: 'Escribe el captcha antes de continuar.',
            captchaUnavailable: 'La vista previa del captcha no está disponible. Refresca el challenge.'
          }
        },
        messages: {
          subscriptionsLoadError: 'No se pudieron cargar suscripciones.',
          linesLoadError: 'No se pudieron cargar líneas.',
          serversLoadError: 'No se pudieron cargar los servidores.',
          loadError: 'No se pudieron cargar las licencias.',
          customersLoadError: 'No se pudieron cargar los clientes.',
          appsLoadError: 'No se pudieron cargar las apps de licencias.',
          noActiveApps: 'No hay apps activas disponibles en el catálogo.',
          required: 'Completa los campos requeridos.',
          invalidMac: 'Formato MAC inválido. Usa AA:BB:CC:DD:EE:FF con letras A-Z y dígitos 0-9.',
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
          macHelper: 'Formato: AA:BB:CC:DD:EE:FF usando letras A-Z y dígitos 0-9',
          randomLicense: 'App externa / desconocida',
          randomLicenseHelper: 'Úsalo cuando el cliente maneja su propia app y solo necesitas mantener ocupado el cupo de la licencia.',
          randomMacHelper: 'El sistema generará una MAC sintética para reservar esta licencia.',
          deviceKey: 'Device key',
          deviceKeyHelper: 'Llave opcional para este dispositivo',
          randomDeviceKeyHelper: 'Nota o identificador externo opcional. Si lo dejas vacío, el sistema genera uno.',
          subscription: 'Suscripción',
          subscriptionNone: 'Sin suscripción relacionada',
          subscriptionSelectCustomer: 'Selecciona primero un cliente.',
          subscriptionHelper: 'Relación opcional con una suscripción del cliente.',
          subscriptionRandomHelper: 'Las licencias externas pueden mantenerse sin vínculo con suscripción.',
          subscriptionRequiredHelper: 'Las licencias administradas deben quedar vinculadas a una suscripción del cliente.',
          subscriptionEmpty: 'Este cliente no tiene suscripciones disponibles.',
          customerLocked: 'Usa trasladar para cambiar el cliente de una licencia existente.',
          paid: 'Estado de pago',
          paidHelper: 'Indica si esta licencia ya fue pagada',
          loadingApps: 'Cargando apps...',
          appHelper: 'Aplicación asociada',
          randomAppLabel: 'App externa / desconocida',
          randomAppHelper: 'Las acciones remotas de playlists se desactivan porque este registro solo reserva el cupo ocupado.',
          appEmpty: 'No hay apps activas disponibles. Configura primero el catálogo.',
          appLegacyHelper: 'Esta licencia usa una app inactiva del catálogo. Elige una app activa para reemplazarla.'
        },
        server: {
          required: 'Selecciona el servidor antes de continuar.',
          updated: 'Servidor actualizado.',
          targetApp: 'App destino',
          contextHelper: 'La app destino queda fijada por la licencia. Debajo selecciona el servidor y el sistema resolverá automáticamente el provider técnico.',
          sourceServerHelper: 'Selecciona el servidor que se usará para construir la M3U. La app destino resuelve automáticamente el provider técnico.',
          bobApp: 'App',
          bobSessionRequired: 'Autentica Bob Player antes de cambiar el servidor.',
          bobTitle: 'Crear o actualizar playlist Bob',
          bobHelper:
            'Esta acción usa la sesión Bob autenticada en esta licencia para crear o actualizar la playlist remota con la línea y el servidor que selecciones abajo.',
          bobNoRemotePlaylist: 'Todavía no hay una playlist remota vinculada. Guardar creará una nueva.',
          bobServerHelper: 'Esta selección define la URL M3U que Bob Player guardará en el dispositivo. La app destino resuelve automáticamente el provider técnico.',
          bobSubmit: 'Guardar playlist Bob',
          bobError: 'No se pudo guardar la playlist Bob.',
          error: 'No se pudo cambiar el servidor.',
          removeTitle: 'Quitar todas las playlists',
          removeBody: 'Esta acción eliminará todas las playlists de este dispositivo.',
          removeBobTitle: 'Quitar todas las playlists Bob',
          removeBobBody:
            'Esta acción eliminará todas las playlists guardadas en este dispositivo Bob autenticado, no solo la playlist vinculada a esta licencia.',
          removeBobSubmit: 'Quitar todas las playlists Bob',
          removeBobError: 'No se pudieron quitar las playlists Bob de este dispositivo.',
          removeSubmit: 'Quitar playlists',
          removeSuccess: 'Se quitaron todas las playlists del dispositivo.',
          removeError: 'No se pudieron quitar las playlists del dispositivo.',
          removeRequired: 'El id de la licencia es requerido.',
          removeNotAvailable: 'Esta acción aún no está disponible en backend.'
        },
        transfer: {
          subscription: 'Suscripción destino',
          subscriptionSelectCustomer: 'Selecciona primero el nuevo cliente.',
          subscriptionHelper: 'Elige la suscripción que será dueña de esta licencia administrada.',
          subscriptionEmpty: 'Este cliente no tiene suscripciones disponibles.',
          required: 'Selecciona cliente, tipo y la suscripción destino cuando aplique.',
          error: 'No se pudo trasladar.'
        }
      },
      demos: {
        title: 'Demos Lion TV',
        listTitle: 'Listado de demos',
        search: 'Buscar (celular, usuario, paquete, app)',
        status: {
          ACTIVE: 'ACTIVA',
          ACTIVATED: 'ACTIVADA',
          PENDING: 'PENDIENTE',
          EXPIRED: 'EXPIRADA',
          CANCELLED: 'CANCELADA'
        },
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
          macPlaceholder: 'aa:bb:cc:dd:ee[:ff]'
        },
        table: { empty: 'No hay demos registradas.', loading: 'Cargando...' }
      },
      lines: {
        title: 'Líneas',
        listTitle: 'Listado de líneas',
        summary: { total: '{{count}} líneas', active: 'Activas: {{count}}', expired: 'Expiradas: {{count}}' },
        search: 'Buscar (usuario, paquete, IP, estado)',
        filters: { status: 'Estado', all: 'Todos' },
        actions: { copyM3u: 'Copiar M3U' },
        messages: {
          m3uCopySuccess: 'Lista M3U copiada.',
          m3uCopyError: 'No se pudo generar la lista M3U.',
          m3uPlusCopySuccess: 'Lista M3U Plus copiada.',
          m3uPlusCopyError: 'No se pudo generar la lista M3U Plus.',
          m3uUnsupportedProvider: 'Provider no soportado para generar M3U.',
          m3uMissingCredentials: 'La línea no tiene credenciales codificadas para generar M3U.'
        },
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
          channel: 'Canal',
          vip: 'VIP',
          points: 'Puntos'
        },
        pointsChip: '{{count}} pts',
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
          deleted: 'Cliente eliminado correctamente.',
          engagementSummaryError: 'No se pudo cargar el resumen VIP/lealtad.',
          missingEmail: 'El cliente no tiene correo registrado.',
          welcomeSent: 'Correo de bienvenida enviado.',
          welcomeError: 'No se pudo enviar la bienvenida.'
        }
      },
      referrals: {
        title: 'Leads por referidos',
        description:
          'Solicitudes enviadas desde Shopify por clientes activos que quieren referir a otra persona y reclamar 1 mes gratis cuando ese referido convierta.',
        search: 'Buscar por cliente, contacto, nombre del referido o WhatsApp',
        empty: 'No hay solicitudes de referidos.',
        metrics: {
          total: 'Solicitudes totales',
          new: 'Nuevas',
          contacted: 'Contactadas',
          converted: 'Convertidas',
          rewarded: 'Bonificadas'
        },
        filters: {
          status: 'Estado',
          all: 'Todos',
          from: 'Desde',
          to: 'Hasta'
        },
        headers: {
          createdAt: 'Creado',
          referrer: 'Cliente actual',
          referrerContact: 'Contacto',
          referredName: 'Referido',
          whatsapp: 'WhatsApp',
          status: 'Estado',
          notes: 'Notas admin'
        },
        sections: {
          referrer: 'Cliente actual',
          referred: 'Persona referida'
        },
        fields: {
          referrerCustomer: 'Nombre',
          referrerCustomerId: 'Customer ID',
          referrerContact: 'Teléfono o correo',
          referredName: 'Nombre',
          whatsapp: 'WhatsApp',
          createdAt: 'Creado',
          contactedAt: 'Contactado',
          convertedAt: 'Convertido',
          rewardGrantedAt: 'Beneficio aplicado',
          sourceShop: 'Shop',
          status: 'Estado',
          adminNotes: 'Notas admin',
          notes: 'Notas'
        },
        status: {
          NEW: 'Nueva',
          CONTACTED: 'Contactada',
          CONVERTED: 'Convertida',
          REWARDED: 'Bonificada',
          REJECTED: 'Rechazada'
        },
        dialog: {
          title: 'Detalle del referido'
        },
        actions: {
          copyReferrer: 'Copiar contacto'
        }
      },
      crm: {
        title: 'CRM Clientes',
        search: {
          label: 'Buscar cliente',
          placeholder: 'Nombre, correo o usuario',
          helper: 'Busca un cliente y obtén una vista 360 con suscripciones, licencias, managed accounts, timeline comercial y facturación.'
        },
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
          opening: 'Alta: {{date}}',
          openingLabel: 'Fecha de alta'
        },
        contact: { call: 'Llamar', email: 'Email', phone: 'Teléfono' },
        summary: {
          title: 'Resumen del cliente'
        },
        engagement: {
          title: 'VIP + Lealtad',
          updating: 'Actualizando...',
          vip: 'VIP: {{value}}',
          score: 'Score: {{value}}',
          points: 'Puntos: {{value}}',
          latestLedger: 'Últimos movimientos de puntos',
          movement: '{{sign}}{{value}} pts',
          balance: 'Balance: {{value}}',
          empty: 'No hay movimientos de lealtad todavía.'
        },
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
          provider: 'Proveedor',
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
          partialData: 'Algunas fuentes fallaron. Puedes reintentar para completar la vista 360.',
          engagementLoad: 'No se pudo cargar el resumen VIP/lealtad.'
        },
        table: { detail: 'Detalle', empty: 'No hay datos', emptyHelp: 'No hay registros para este cliente en este módulo.' }
      },
      vipCustomers: {
        title: 'Clientes VIP',
        actions: {
          config: 'Configuración',
          recompute: 'Recalcular',
          recomputeCustomer: 'Recalcular',
          override: 'Ajustar tier',
          apply: 'Aplicar'
        },
        alerts: {
          scoreInfo: 'El score VIP combina antigüedad, facturación pagada e historial de suscripciones por usuario.'
        },
        metrics: {
          profilesLoaded: 'Perfiles cargados',
          profilesLoadedHelper: 'Perfiles VIP activos',
          overridesVisible: 'Ajustes manuales visibles',
          overridesVisibleHelper: 'Clientes con tier manual',
          averageScore: 'Score promedio',
          averageScoreHelper: 'Media de la página actual',
          topTier: 'Tier líder',
          topTierHelper: 'Primer registro del ranking actual'
        },
        filters: {
          search: 'Buscar',
          status: 'Estado',
          finalTier: 'Tier final',
          all: 'Todos',
          overrideOnly: 'Solo overrides'
        },
        table: {
          customer: 'Cliente',
          status: 'Estado',
          channel: 'Canal',
          seniority: 'Antigüedad',
          billing: 'Facturación',
          subscriptions: 'Suscripciones',
          score: 'Score',
          computedTier: 'Tier calculado',
          finalTier: 'Tier final',
          actions: 'Acciones',
          paidInvoices: 'Facturas pagadas: {{count}}',
          subscriptionsSplit: '{{active}} activas / {{total}} históricas',
          manual: 'Manual',
          empty: 'No hay perfiles VIP para mostrar.'
        },
        dialogs: {
          configTitle: 'Configuración VIP',
          activeConfig: 'Configuración activa',
          seniorityWeight: 'Peso antigüedad',
          billingWeight: 'Peso facturación',
          subscriptionsWeight: 'Peso suscripciones',
          fullScoreDays: 'Días para score máximo',
          fullScoreAmount: 'Facturación para score máximo',
          fullScoreSubscriptions: 'Suscripciones para score máximo',
          notes: 'Notas',
          tiers: 'Tiers',
          code: 'Código',
          name: 'Nombre',
          minScore: 'Score mínimo',
          order: 'Orden',
          color: 'Color',
          active: 'Activo',
          overrideTitle: 'Ajuste VIP',
          clearOverride: 'Limpiar ajuste',
          finalTier: 'Tier final',
          reason: 'Motivo'
        },
        units: {
          days: '{{count}} días'
        },
        messages: {
          loadConfigError: 'No se pudo cargar la configuración VIP.',
          loadRankingError: 'No se pudo cargar el ranking VIP.',
          configUpdated: 'Configuración VIP actualizada.',
          saveConfigError: 'No se pudo guardar la configuración VIP.',
          rankingRecomputed: 'Ranking VIP recalculado.',
          recomputeError: 'No se pudo recalcular VIP.',
          customerRecomputed: 'Cliente VIP recalculado.',
          recomputeCustomerError: 'No se pudo recalcular el cliente.',
          overrideApplied: 'Ajuste VIP aplicado.',
          overrideError: 'No se pudo aplicar el ajuste.'
        }
      },
      loyalty: {
        title: 'Lealtad',
        movementTypes: {
          EARN: 'Puntos generados',
          REVERSAL: 'Reverso de acumulacion',
          REDEEM: 'Puntos canjeados',
          REDEEM_REVERSAL: 'Reverso de canje',
          MANUAL_ADJUSTMENT: 'Ajuste manual',
          INACTIVE_RESET: 'Reset por inactividad'
        },
        actions: {
          config: 'Configuración',
          ledger: 'Historial',
          adjust: 'Ajustar',
          apply: 'Aplicar'
        },
        alerts: {
          active: 'Programa activo desde {{date}}.',
          noDate: 'sin fecha definida',
          inactive: 'El programa está inactivo. No se acreditarán puntos nuevos hasta activarlo.'
        },
        metrics: {
          listedCustomers: 'Clientes listados',
          listedCustomersHelper: 'Balances visibles',
          customersWithPoints: 'Clientes con puntos',
          customersWithPointsHelper: 'Con saldo disponible mayor a cero',
          visiblePoints: 'Puntos visibles',
          visiblePointsHelper: 'Total de la página actual',
          baseRule: 'Regla base',
          baseRuleValue: '{{points}} / L{{amount}}',
          baseRuleHelper: 'Redondeo: {{mode}}'
        },
        filters: {
          search: 'Buscar',
          status: 'Estado',
          all: 'Todos',
          minimumPoints: 'Puntos mínimos'
        },
        table: {
          customer: 'Cliente',
          status: 'Estado',
          channel: 'Canal',
          availablePoints: 'Puntos disponibles',
          lifetimeEarned: 'Puntos acumulados',
          lifetimeAdjusted: 'Ajustes acumulados',
          lastMovement: 'Último movimiento',
          actions: 'Acciones',
          empty: 'No hay balances de lealtad para mostrar.'
        },
        dialogs: {
          configTitle: 'Configuración de lealtad',
          programActive: 'Programa activo',
          pointsPerUnit: 'Puntos por unidad',
          amountPerUnit: 'Monto por unidad',
          rounding: 'Redondeo',
          effectiveFrom: 'Vigente desde',
          notes: 'Notas',
          ledgerTitle: 'Historial de puntos',
          ledgerShown: '{{name}} · registros mostrados: {{count}}',
          date: 'Fecha',
          type: 'Tipo',
          source: 'Origen',
          points: 'Puntos',
          balance: 'Balance',
          reason: 'Motivo',
          ledgerEmpty: 'No hay movimientos todavía.',
          adjustTitle: 'Ajustar puntos',
          adjustPoints: 'Puntos',
          adjustHelper: 'Usa positivos para sumar y negativos para restar.',
          adjustReason: 'Motivo'
        },
        messages: {
          loadConfigError: 'No se pudo cargar la configuración de lealtad.',
          loadModuleError: 'No se pudo cargar el módulo de lealtad.',
          loadLedgerError: 'No se pudo cargar el historial del cliente.',
          configUpdated: 'Configuración de lealtad actualizada.',
          saveConfigError: 'No se pudo guardar la configuración.',
          adjustmentApplied: 'Ajuste de puntos aplicado.',
          adjustmentError: 'No se pudo aplicar el ajuste.'
        }
      },
      raffles: {
        title: 'Sorteos',
        actions: {
          newTemplate: 'Nueva plantilla',
          newRaffle: 'Nuevo sorteo',
          preview: 'Previsualizar',
          freeze: 'Congelar',
          draw: 'Sortear',
          entries: 'Entradas',
          winners: 'Ganadores'
        },
        alerts: {
          info: 'El sorteo trabaja sobre audiencia congelada. Puedes filtrar por criterios, mezclar IDs manuales y ejecutar una corrida reproducible.'
        },
        metrics: {
          templates: 'Plantillas',
          templatesHelper: 'Criterios reutilizables',
          raffles: 'Sorteos',
          rafflesHelper: 'Registros visibles',
          frozen: 'Congelados',
          frozenHelper: 'Listos para corrida',
          drawn: 'Sorteados',
          drawnHelper: 'Con ganadores definidos'
        },
        tabs: {
          templates: 'Plantillas',
          raffles: 'Sorteos'
        },
        filters: {
          status: 'Estado',
          all: 'Todos'
        },
        status: {
          DRAFT: 'Borrador',
          FROZEN: 'Congelado',
          DRAWN: 'Sorteado'
        },
        modes: {
          FILTERED: 'Filtrado',
          MANUAL: 'Manual',
          MIXED: 'Mixto'
        },
        table: {
          name: 'Nombre',
          description: 'Descripción',
          active: 'Activa',
          seed: 'Semilla',
          prize: 'Premio',
          mode: 'Modo',
          winners: 'Ganadores',
          status: 'Estado',
          actions: 'Acciones',
          empty: 'No hay sorteos para mostrar.',
          yes: 'Sí',
          no: 'No'
        },
        dialogs: {
          templateTitle: 'Plantilla de sorteo',
          raffleTitle: 'Sorteo',
          entriesTitle: 'Participantes congelados',
          winnersTitle: 'Ganadores',
          activeTemplate: 'Plantilla activa',
          customerStatus: 'Estado cliente',
          channel: 'Canal',
          minSeniority: 'Antigüedad mínima (días)',
          minPaidBilling: 'Facturación mínima pagada',
          minPaidInvoices: 'Facturas pagadas mínimas',
          minActiveSubscriptions: 'Subs activas mínimas',
          minTotalSubscriptions: 'Subs históricas mínimas',
          referredOnly: 'Solo referidos',
          name: 'Nombre',
          description: 'Descripción',
          prize: 'Premio',
          mode: 'Modo',
          template: 'Plantilla',
          noTemplate: 'Sin plantilla',
          winnerCount: 'Cantidad de ganadores',
          manualCustomerIds: 'Customer IDs manuales',
          manualCustomerIdsHelper: 'Puedes separar IDs por coma, espacio o salto de línea.',
          previewTitle: 'Previsualización de audiencia',
          previewHelper: 'Calcula la audiencia antes de guardar o congelar el sorteo.',
          previewAlert: 'Elegibles: {{eligible}} · filtrados: {{filtered}} · manuales: {{manual}}',
          id: 'ID',
          customer: 'Cliente',
          billing: 'Facturación',
          subscriptions: 'Subs',
          source: 'Origen',
          contact: 'Contacto',
          rank: 'Posición'
        },
        messages: {
          loadTemplatesError: 'No se pudieron cargar las plantillas.',
          loadRafflesError: 'No se pudieron cargar los sorteos.',
          templateSaved: 'Plantilla guardada.',
          templateSaveError: 'No se pudo guardar la plantilla.',
          previewError: 'No se pudo previsualizar la audiencia.',
          raffleSaved: 'Sorteo guardado.',
          raffleSaveError: 'No se pudo guardar el sorteo.',
          freezeSuccess: 'Audiencia congelada con {{count}} participantes.',
          freezeError: 'No se pudo congelar la audiencia.',
          drawSuccess: 'Sorteo ejecutado. Ganadores: {{count}}.',
          drawError: 'No se pudo ejecutar el sorteo.',
          loadEntriesError: 'No se pudieron cargar las entradas.',
          loadWinnersError: 'No se pudieron cargar los ganadores.',
          winnersEmpty: 'No hay ganadores para mostrar.'
        }
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
          apiMissing: 'Las integraciones de panel requieren que las rutas Lion TV y credenciales de panel estén configuradas en este entorno.',
          requiredFields: 'Completa usuario, proveedor y usuario de panel.',
          requiredFieldsReseller: 'Completa proveedor y usuario de panel.',
          passwordRequired: 'El password es obligatorio al crear una integración.',
          loadError: 'No se pudieron cargar las integraciones de panel.',
          created: 'Integración creada correctamente.',
          updated: 'Integración actualizada correctamente.',
          deleted: 'Integración eliminada correctamente.',
          saveError: 'No se pudo guardar la integración.',
          deleteError: 'No se pudo eliminar la integración.',
          statusUpdated: 'Estado actualizado correctamente.',
          statusError: 'No se pudo actualizar el estado.',
          resellerScope: 'Este módulo está limitado a tu cuenta reseller. Solo puedes ver y administrar tus propias integraciones de panel.'
        },
        metrics: {
          total: 'Integraciones',
          active: 'Activas',
          inactive: 'Inactivas'
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
        sharedRisk: {
          open: 'Abrir riesgo shared',
          overdue: '{{overdue}} hosts shared ya vencidos y {{critical}} buckets críticos en shared subscriptions.',
          critical: '{{critical}} hosts vencen en 7 días o menos y ya ponen en riesgo {{affected}} suscripciones dentro de shared subscriptions.'
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
          lostCustomers: { title: 'Clientes perdidos', helper: 'vencidos > {{days}} días' },
          sharedRisk: { title: 'Riesgo shared', helper: '{{overdue}} hosts vencidos' }
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
        },
        widgets: {
          popularStocks: 'Acciones populares',
          totalEarning: 'Ganancia total',
          totalOrder: 'Órdenes totales',
          totalGrowth: 'Crecimiento total',
          today: 'Hoy',
          thisMonth: 'Este mes',
          thisYear: 'Este año',
          month: 'Mes',
          year: 'Año',
          viewAll: 'Ver todo',
          importCard: 'Importar tarjeta',
          copyData: 'Copiar datos',
          export: 'Exportar',
          archiveFile: 'Archivar archivo',
          profit: '{{value}} ganancia',
          loss: '{{value}} pérdida',
          profitLabel: 'Ganancia',
          lossLabel: 'Pérdida',
          investment: 'Inversión',
          maintenance: 'Mantenimiento'
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
          deleted: 'Registro de feed de series eliminado correctamente.',
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
        futbol: {
          title: 'Feed de Eventos de Fútbol',
          create: 'Nuevo evento de fútbol',
          empty: 'No hay registros en el feed de fútbol.',
          created: 'Registro de evento de fútbol creado correctamente.',
          updated: 'Registro de evento de fútbol actualizado correctamente.',
          deleted: 'Registro de evento de fútbol eliminado correctamente.',
          import: {
            button: 'Importar desde Alluko',
            title: 'Importación desde Alluko',
            helper:
              'Autentícate manualmente en Alluko, copia el valor del header Cookie desde un request autenticado y usa la categoría 536 para traer el payload de eventos de fútbol.',
            cookieLabel: 'Cookie header autenticado',
            cookiePlaceholder: 'PHPSESSID=...; xm_simple_security_check=...; saved_access_code=subadmin; ...',
            categoryLabel: 'Categoría',
            categoryPlaceholder: '536',
            fetch: 'Traer desde Alluko',
            fetching: 'Importando...',
            success: 'Payload importado desde Alluko.',
            error: 'No se pudo importar desde Alluko.'
          }
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
        selectOption: 'Selecciona una opción',
        search: 'Buscar',
        status: 'Estado',
        all: 'Todos',
        total: 'Total',
        global: 'Global',
        active: 'Activo',
        inactive: 'Inactivo',
        actions: 'Acciones',
        id: 'ID',
        loading: 'Cargando...',
        rowsPerPage: 'Filas por página:',
        secure: 'Seguro',
        reference: 'Referencia'
      },
      layout: {
        footer: {
          allRightsReserved: 'Todos los derechos reservados',
          x: 'X',
          discord: 'Discord'
        },
        customization: {
          borderRadius: 'Radio del borde',
          fontStyle: 'Estilo de fuente',
          fontSelector: 'Selector de fuente'
        },
        aria: {
          breadcrumb: 'Ruta de navegación',
          themeLogo: 'Inicio Lion Services',
          navigationMenu: 'Menú de navegación',
          menuItemIcon: 'Icono del menú',
          openReference: 'Abrir enlace de referencia'
        }
      },
      catalogAdmin: {
        searchLabel: 'Buscar',
        empty: 'No hay registros para mostrar.',
        dialogSubtitle: 'Completa la información del catálogo.',
        deleteMessage: '¿Eliminar {{name}}? Esta acción no se puede deshacer.',
        messages: {
          loadError: 'No se pudo cargar {{entity}}.',
          saveError: 'No se pudo guardar {{entity}}.',
          deleteError: 'No se pudo eliminar {{entity}}.',
          created: '{{entity}} creado correctamente.',
          updated: '{{entity}} actualizado correctamente.',
          deleted: '{{entity}} eliminado correctamente.'
        },
        metrics: {
          totalRegistered: '{{entity}} registrados',
          totalCatalog: 'Catálogo total',
          available: 'Disponibles para uso',
          hidden: 'Ocultos o deshabilitados',
          coverage: 'Cobertura registrada',
          localCatalog: 'Catálogo local',
          trialEnabled: 'Prueba habilitada',
          officialEnabled: 'Venta oficial habilitada',
          adminLocked: 'Bloqueados para edición'
        },
        bank: {
          title: 'Bancos',
          subtitle: 'Administra el catálogo de bancos usado por facturas y flujos comerciales.',
          helperText: 'Los cambios aquí impactan los selectores de bancos del sistema.',
          entityLabel: 'banco',
          createLabel: 'Nuevo banco',
          searchPlaceholder: 'Buscar por nombre de banco',
          fields: {
            bank: 'Banco',
            status: 'Activo'
          }
        },
        service: {
          title: 'Servicios',
          subtitle: 'Administra el catálogo de servicios usado por clientes, facturas y CRM.',
          helperText: 'Los nombres de servicio se consumen en varios módulos comerciales.',
          entityLabel: 'servicio',
          createLabel: 'Nuevo servicio',
          searchPlaceholder: 'Buscar por nombre de servicio',
          fields: {
            serviceName: 'Servicio',
            status: 'Activo'
          }
        },
        countryPhoneCode: {
          title: 'Códigos telefónicos',
          subtitle: 'Administra el catálogo global de prefijos telefónicos por país.',
          helperText: 'Este catálogo se usa para formularios y normalización de contactos.',
          entityLabel: 'código telefónico',
          createLabel: 'Nuevo código',
          searchPlaceholder: 'Buscar por país, continente o prefijo',
          fields: {
            phoneCode: 'Código',
            country: 'País',
            continent: 'Continente'
          }
        },
        licenseApp: {
          title: 'Apps de Licencias',
          subtitle: 'Administra las aplicaciones canónicas disponibles en el selector del formulario de licencias.',
          helperText: 'Solo las apps activas aparecen al crear una licencia nueva. El código se persiste en licencias y no puede cambiarse después de crear la app.',
          entityLabel: 'app de licencia',
          createLabel: 'Nueva app de licencia',
          searchPlaceholder: 'Buscar por código, nombre o id',
          fields: {
            licenseAppCode: 'Código de la app',
            licenseAppCodeHelper: 'Código canónico en UPPER_SNAKE_CASE. Ejemplo: VIVO_PLAYER. Este valor es inmutable después de crear la app.',
            licenseAppName: 'Nombre de la app',
            status: 'Estado'
          }
        },
        package: {
          title: 'Paquetes',
          subtitle: 'Administra el catálogo local de paquetes sincronizados y usados por el panel Lion TV.',
          helperText: 'El identificador del paquete se define manualmente y no debe cambiarse después de creado.',
          entityLabel: 'paquete',
          createLabel: 'Nuevo paquete',
          searchPlaceholder: 'Buscar por nombre, id, tipo o créditos',
          fields: {
            packageId: 'Package ID',
            name: 'Nombre',
            type: 'Tipo',
            ord: 'Orden',
            roleCount: 'Role count',
            bouquetCount: 'Bouquet count',
            trialCredits: 'Trial credits',
            trialDuration: 'Trial duration',
            trialDurationIn: 'Trial duration unit',
            officialCredits: 'Official credits',
            officialDuration: 'Official duration',
            officialDurationIn: 'Official duration unit',
            isTrial: 'Prueba habilitada',
            isOfficial: 'Venta oficial habilitada',
            isp: 'ISP',
            stb: 'STB',
            canRestream: 'Puede restream',
            adminLocked: 'Bloqueado por admin',
            flags: 'Flags',
            trial: 'Trial',
            official: 'Official',
            locked: 'Locked'
          }
        }
      },
      sms: {
        title: 'Gestión de SMS',
        enqueue: 'Encolar SMS',
        history: 'Historial de SMS',
        chips: { ready: '{{count}} números listos', total: '{{count}} registros', secure: 'Seguro' },
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

const mergeTranslations = (target, source) => {
  if (!source || typeof source !== 'object') return target;

  Object.entries(source).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
        target[key] = {};
      }
      mergeTranslations(target[key], value);
      return;
    }

    target[key] = value;
  });

  return target;
};

mergeTranslations(resources.en.translation, lionTvProfessionalTranslations.en);
mergeTranslations(resources.es.translation, lionTvProfessionalTranslations.es);

resources.en.translation.salesWorkflow = {
  title: 'Sales & Renewals',
  common: {
    customerFallback: 'Customer',
    noPackage: 'No package'
  },
  tabs: {
    activation: 'New account',
    renewal: 'Renew customer'
  },
  steps: {
    activation: {
      customer: 'Customer',
      linePlan: 'Line & plan',
      paymentConfirm: 'Payment & confirmation'
    },
    renewal: {
      search: 'Search',
      selectPlan: 'Select plan',
      paymentConfirm: 'Payment & confirmation'
    }
  },
  sections: {
    customerTitle: 'Customer details',
    customerHelper: 'Capture the minimum details to create the customer and validate duplicates before continuing.',
    initialStatusTitle: 'Initial status',
    initialStatusHelper: 'Operational values that will be sent to the backend.',
    packageTitle: 'Package',
    packageHelper: 'Select a real package; connections and name are filled automatically.',
    subscriptionPackageTitle: 'Subscription package',
    subscriptionPackageHelper: 'This package is used for the subscription, invoice, credits and renewal.',
    lineTitle: 'Main line',
    lineHelper: 'The line is associated with the customer and subscription in the transactional execute.',
    paymentTitle: 'Payment and subscription',
    paymentHelper: 'The amount remains editable to handle discounts, promotions and commercial adjustments.',
    activationSummaryTitle: 'Activation summary',
    activationSummaryHelper: 'Review before generating the preview or executing.',
    searchTitle: 'Search customer or subscription',
    searchHelper: 'Search by name, email, phone, lineId or subscriptionId.',
    selectSubscriptionTitle: 'Select subscription',
    selectSubscriptionHelper: 'The renewal uses the existing customer; it does not create a new customer.',
    selectedSubscriptionTitle: 'Selected subscription',
    selectedSubscriptionHelper: 'Adjust package, renewal base and devices.',
    renewalPaymentTitle: 'Payment and confirmation',
    renewalPaymentHelper: 'Preview shows the new date, plan change and missing licenses before executing.',
    loyaltyTitle: 'Loyalty points',
    loyaltyHelper: 'Apply available points to this renewal invoice.',
    loyaltyActivationHelper: 'Points apply only to existing customers during renewals.'
  },
  fields: {
    fullName: 'Full name',
    customerChannel: 'Customer channel',
    gender: 'Gender',
    openingDate: 'Opening date',
    email: 'Email',
    phone: 'Phone / WhatsApp',
    lineId: 'Line ID',
    lineProvider: 'Line provider',
    lineUsername: 'Line username',
    mainLineMode: 'Line mode',
    searchExistingLine: 'Search existing line',
    searchExistingLinePlaceholder: 'Line ID, username or package',
    password: 'Password',
    expires: 'Expires',
    desiredDevices: 'Desired devices',
    package: 'Package',
    subscriptionPackage: 'Subscription package',
    linePackage: 'Line package',
    linePlusPackage: 'Line Plus package',
    linePlusProvider: 'Plus line provider',
    searchPackage: 'Search package',
    searchSubscriptionPackage: 'Search subscription package',
    linePlusId: 'Line Plus ID',
    plusUsername: 'Plus username',
    plusPassword: 'Plus password',
    billing: 'Billing',
    start: 'Start',
    renewalDate: 'Renews',
    amount: 'Amount',
    discount: 'Discount',
    subscriptionAmount: 'Subscription amount',
    invoiceAmount: 'Invoice amount',
    invoiceDiscount: 'Invoice discount',
    service: 'Service',
    paymentMethod: 'Payment method',
    bank: 'Bank',
    notes: 'Invoice notes',
    search: 'Search',
    planPackage: 'Plan / package',
    renewalBase: 'Base if expired',
    manualRenewalDate: 'Optional manual date',
    loyaltyPointsUsed: 'Points to use',
    loyaltyAmountRedeemed: 'Redeemed amount'
  },
  options: {
    male: 'Male',
    female: 'Female',
    other: 'Other',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    biannual: 'Biannual',
    annual: 'Annual',
    addPlusLine: 'Add Plus line',
    createNewLine: 'Create new line',
    useExistingLine: 'Use existing line',
    currentExpiration: 'From current expiration',
    today: 'From today'
  },
  buttons: {
    reloadOptions: 'Reload options',
    back: 'Back',
    continue: 'Continue',
    reset: 'Reset',
    preview: 'Preview',
    confirmActivation: 'Confirm activation',
    confirmRenewal: 'Confirm renewal',
    search: 'Search',
    copyWhatsapp: 'Copy WhatsApp',
    openCustomer: 'Open customer',
    openSubscription: 'Open subscription',
    openInvoice: 'Open invoice',
    openLicenses: 'Open licenses'
  },
  metrics: {
    status: 'Status',
    channel: 'Channel',
    client: 'Customer',
    plan: 'Plan',
    subscriptionPackage: 'Subscription package',
    linePackage: 'Line package',
    lineProvider: 'Line provider',
    linePlusProvider: 'Plus line provider',
    currentPlan: 'Current plan',
    line: 'Line',
    devices: 'Devices',
    expires: 'Expires',
    amount: 'Amount',
    subscriptionAmount: 'Subscription amount',
    availableSlots: 'Available slots',
    capacity: 'Capacity',
    newDate: 'New date',
    invoiceAmount: 'Invoice amount',
    availablePoints: 'Available points',
    loyaltyApplied: 'Points applied',
    invoiceNetAmount: 'Net invoice'
  },
  status: {
    available: 'Available',
    review: 'Review'
  },
  preview: {
    title: 'Review before confirming',
    subscription: 'Subscription',
    newSubscription: 'new',
    devicesValue: '{{desired}} desired · {{newLicenses}} new'
  },
  result: {
    title: 'Workflow executed',
    customer: 'Customer',
    line: 'Line',
    subscription: 'Subscription',
    invoice: 'Invoice',
    newLicenses: 'New licenses'
  },
  messages: {
    flowInfo:
      'Guided flow for activations and renewals. Packages, banks, services and payment methods come from catalogs/API; manual CRUD remains as backup.',
    packageDevices: '{{count}} suggested device(s)',
    possibleExistingCustomer: 'Possible existing customer',
    customersFound: 'Customers found',
    noSubscriptions: 'No subscriptions were found for this search.',
    linesLoadError: 'Could not load lines.',
    existingLineSelected: 'Existing line selected',
    existingLineNoMutation: 'This line will not be modified. The workflow only creates the customer, subscription, invoice and licenses.',
    selectExistingLine: 'Select one existing line from inventory to continue.',
    selectCustomerChannel: 'Select a channel',
    selectLineProvider: 'Select a provider',
    capacityValue: '{{active}} active / {{max}} max · {{available}} free',
    selectedRenewal: '{{customer}} · subscription #{{subscriptionId}} · current date {{date}}',
    noSubscriptionSelected: 'Select a subscription before renewing.',
    decreaseDevicesWarning: 'You are reducing devices. The system does not remove licenses automatically; this will remain for manual review.',
    changedPlan: 'Subscription package change',
    copiedWhatsapp: 'WhatsApp message copied.',
    whatsappMessage: 'Hi {{customer}}, your Lion TV Premium {{workflow}} was registered. New date: {{date}}.',
    optionsLoadError: 'Could not load workflow options.',
    lookupError: 'Could not search customer.',
    previewError: 'Could not generate preview.',
    created: 'New account created successfully.',
    renewed: 'Renewal executed successfully.',
    activationError: 'Could not execute activation.',
    renewalError: 'Could not execute renewal.',
    loyaltyConfigError: 'Could not load loyalty configuration.',
    loyaltyBalanceError: 'Could not load customer points balance.',
    loyaltyInactive: 'The loyalty program is inactive for this account.',
    loyaltyExceeded: 'The customer does not have enough available points.',
    loyaltyAmountExceeded: 'Points exceed the net invoice amount.',
    loyaltyExistingOnly: 'Existing customers only',
    loyaltyReady: 'Ready to apply',
    loyaltyDisabled: 'Loyalty disabled',
    loyaltyActivationInfo: 'New accounts start without a points balance. Apply points later from a renewal or invoice.',
    loyaltyConversion: '{{points}} point(s) = ${{amount}}',
    loadingPoints: 'Loading points...',
    loyaltySelectSubscription: 'Select a subscription first.',
    loyaltyMaxAvailable: 'Available: {{count}} pts',
    loyaltyNetAfter: 'Net after discount and points: ${{amount}}',
    loyaltyInactiveHelp: 'The loyalty program is inactive. Activate it before applying points.',
    loyaltyHelper: 'The redeemed points are sent to the invoice and the loyalty ledger applies the deduction when the invoice is saved.'
  },
  workflowTypes: {
    renewal: 'renewal',
    activation: 'activation'
  },
  customerChannels: {
    'red social': 'Social media',
    google: 'Google',
    familiares: 'Family',
    amigos: 'Friends'
  },
  paymentMethods: {
    'Bank Transfer': 'Bank transfer',
    Paypal: 'PayPal',
    Ecommerce: 'Ecommerce',
    'Link pago': 'Payment link',
    'Debito Automatico': 'Automatic debit',
    Cryptocurrency: 'Cryptocurrency',
    'Loyalty Points': 'Loyalty points'
  },
  fallbacks: {
    bank: 'Bank',
    service: 'Service',
    channel: 'Channel',
    provider: 'Provider'
  }
};

resources.es.translation.salesWorkflow = {
  title: 'Ventas y Renovaciones',
  common: {
    customerFallback: 'Cliente',
    noPackage: 'Sin paquete'
  },
  tabs: {
    activation: 'Nueva cuenta',
    renewal: 'Renovar cliente'
  },
  steps: {
    activation: {
      customer: 'Cliente',
      linePlan: 'Línea y plan',
      paymentConfirm: 'Pago y confirmación'
    },
    renewal: {
      search: 'Buscar',
      selectPlan: 'Seleccionar plan',
      paymentConfirm: 'Pago y confirmación'
    }
  },
  sections: {
    customerTitle: 'Datos del cliente',
    customerHelper: 'Captura lo mínimo para crear el cliente y validar duplicados antes de continuar.',
    initialStatusTitle: 'Estado inicial',
    initialStatusHelper: 'Valores operativos que se enviarán al backend.',
    packageTitle: 'Paquete',
    packageHelper: 'Selecciona un paquete real; se autocompletan conexiones y nombre.',
    subscriptionPackageTitle: 'Paquete de suscripción',
    subscriptionPackageHelper: 'Este paquete se usa para la suscripción, factura, créditos y renovación.',
    lineTitle: 'Línea principal',
    lineHelper: 'La línea queda asociada al cliente y a la suscripción en el execute transaccional.',
    paymentTitle: 'Pago y suscripción',
    paymentHelper: 'El monto sigue editable para manejar descuentos, promociones y ajustes comerciales.',
    activationSummaryTitle: 'Resumen de activación',
    activationSummaryHelper: 'Revisa antes de generar el preview o ejecutar.',
    searchTitle: 'Buscar cliente o suscripción',
    searchHelper: 'Puedes buscar por nombre, correo, teléfono, lineId o subscriptionId.',
    selectSubscriptionTitle: 'Selecciona la suscripción',
    selectSubscriptionHelper: 'La renovación usa el cliente existente; no se crea cliente nuevo.',
    selectedSubscriptionTitle: 'Suscripción seleccionada',
    selectedSubscriptionHelper: 'Ajusta paquete, base de renovación y dispositivos.',
    renewalPaymentTitle: 'Pago y confirmación',
    renewalPaymentHelper: 'El preview muestra fecha nueva, cambio de plan y licencias faltantes antes de ejecutar.',
    loyaltyTitle: 'Puntos de lealtad',
    loyaltyHelper: 'Aplica puntos disponibles a esta factura de renovación.',
    loyaltyActivationHelper: 'Los puntos aplican solo para clientes existentes durante renovaciones.'
  },
  fields: {
    fullName: 'Nombre completo',
    customerChannel: 'Canal del cliente',
    gender: 'Género',
    openingDate: 'Fecha alta',
    email: 'Correo',
    phone: 'Teléfono / WhatsApp',
    lineId: 'Line ID',
    lineProvider: 'Provider de línea',
    lineUsername: 'Usuario línea',
    mainLineMode: 'Modo de línea',
    searchExistingLine: 'Buscar línea existente',
    searchExistingLinePlaceholder: 'Line ID, usuario o paquete',
    password: 'Password',
    expires: 'Expira',
    desiredDevices: 'Dispositivos deseados',
    package: 'Paquete',
    subscriptionPackage: 'Paquete de suscripción',
    linePackage: 'Paquete de línea',
    linePlusPackage: 'Paquete de línea Plus',
    linePlusProvider: 'Provider línea Plus',
    searchPackage: 'Buscar paquete',
    searchSubscriptionPackage: 'Buscar paquete de suscripción',
    linePlusId: 'Line Plus ID',
    plusUsername: 'Usuario plus',
    plusPassword: 'Password plus',
    billing: 'Billing',
    start: 'Inicio',
    renewalDate: 'Renueva',
    amount: 'Monto',
    discount: 'Descuento',
    subscriptionAmount: 'Monto de suscripción',
    invoiceAmount: 'Monto facturado',
    invoiceDiscount: 'Descuento factura',
    service: 'Servicio',
    paymentMethod: 'Método de pago',
    bank: 'Banco',
    notes: 'Notas factura',
    search: 'Buscar',
    planPackage: 'Plan / paquete',
    renewalBase: 'Base si venció',
    manualRenewalDate: 'Fecha manual opcional',
    loyaltyPointsUsed: 'Puntos a usar',
    loyaltyAmountRedeemed: 'Monto redimido'
  },
  options: {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    biannual: 'Semestral',
    annual: 'Anual',
    addPlusLine: 'Agregar línea Plus',
    createNewLine: 'Crear línea nueva',
    useExistingLine: 'Usar línea existente',
    currentExpiration: 'Desde vencimiento actual',
    today: 'Desde hoy'
  },
  buttons: {
    reloadOptions: 'Recargar opciones',
    back: 'Atrás',
    continue: 'Continuar',
    reset: 'Reiniciar',
    preview: 'Vista previa',
    confirmActivation: 'Confirmar activación',
    confirmRenewal: 'Confirmar renovación',
    search: 'Buscar',
    copyWhatsapp: 'Copiar WhatsApp',
    openCustomer: 'Abrir cliente',
    openSubscription: 'Abrir suscripción',
    openInvoice: 'Abrir factura',
    openLicenses: 'Abrir licencias'
  },
  metrics: {
    status: 'Estado',
    channel: 'Canal',
    client: 'Cliente',
    plan: 'Plan',
    subscriptionPackage: 'Paquete de suscripción',
    linePackage: 'Paquete de línea',
    lineProvider: 'Provider de línea',
    linePlusProvider: 'Provider línea Plus',
    currentPlan: 'Plan actual',
    line: 'Línea',
    devices: 'Dispositivos',
    expires: 'Expira',
    amount: 'Monto',
    subscriptionAmount: 'Monto suscripción',
    availableSlots: 'Cupos libres',
    capacity: 'Capacidad',
    newDate: 'Fecha nueva',
    invoiceAmount: 'Monto factura',
    availablePoints: 'Puntos disponibles',
    loyaltyApplied: 'Puntos aplicados',
    invoiceNetAmount: 'Neto factura'
  },
  status: {
    available: 'Disponible',
    review: 'Revisar'
  },
  preview: {
    title: 'Resumen antes de confirmar',
    subscription: 'Suscripción',
    newSubscription: 'nueva',
    devicesValue: '{{desired}} deseados · {{newLicenses}} nuevas'
  },
  result: {
    title: 'Flujo ejecutado',
    customer: 'Cliente',
    line: 'Línea',
    subscription: 'Suscripción',
    invoice: 'Factura',
    newLicenses: 'Licencias nuevas'
  },
  messages: {
    flowInfo:
      'Flujo guiado para activaciones y renovaciones. Los paquetes, bancos, servicios y métodos salen de catálogos/API; el CRUD manual queda como respaldo.',
    packageDevices: '{{count}} dispositivo(s) sugeridos',
    possibleExistingCustomer: 'Posible cliente existente',
    customersFound: 'Clientes encontrados',
    noSubscriptions: 'No se encontraron suscripciones para esa búsqueda.',
    linesLoadError: 'No se pudieron cargar las líneas.',
    existingLineSelected: 'Línea existente seleccionada',
    existingLineNoMutation: 'Esta línea no será modificada. El flujo solo crea el cliente, la suscripción, la factura y las licencias.',
    selectExistingLine: 'Selecciona una línea existente del inventario para continuar.',
    selectCustomerChannel: 'Selecciona un canal',
    selectLineProvider: 'Selecciona un provider',
    capacityValue: '{{active}} activas / {{max}} máximas · {{available}} libres',
    selectedRenewal: '{{customer}} · suscripción #{{subscriptionId}} · fecha actual {{date}}',
    noSubscriptionSelected: 'Selecciona una suscripción antes de renovar.',
    decreaseDevicesWarning: 'Estás bajando dispositivos. El sistema no elimina licencias automáticamente; quedará para revisión manual.',
    changedPlan: 'Cambio de paquete de suscripción',
    copiedWhatsapp: 'Mensaje copiado para WhatsApp.',
    whatsappMessage: 'Hola {{customer}}, tu {{workflow}} Lion TV Premium quedó registrada. Nueva fecha: {{date}}.',
    optionsLoadError: 'No se pudieron cargar las opciones del workflow.',
    lookupError: 'No se pudo buscar el cliente.',
    previewError: 'No se pudo generar el preview.',
    created: 'Nueva cuenta creada correctamente.',
    renewed: 'Renovación ejecutada correctamente.',
    activationError: 'No se pudo ejecutar la activación.',
    renewalError: 'No se pudo ejecutar la renovación.',
    loyaltyConfigError: 'No se pudo cargar la configuración de lealtad.',
    loyaltyBalanceError: 'No se pudo cargar el saldo de puntos del cliente.',
    loyaltyInactive: 'El programa de puntos está inactivo para esta cuenta.',
    loyaltyExceeded: 'El cliente no tiene suficientes puntos disponibles.',
    loyaltyAmountExceeded: 'Los puntos exceden el monto neto de la factura.',
    loyaltyExistingOnly: 'Solo clientes existentes',
    loyaltyReady: 'Listo para aplicar',
    loyaltyDisabled: 'Lealtad desactivada',
    loyaltyActivationInfo: 'Las cuentas nuevas inician sin saldo de puntos. Aplica puntos después desde una renovación o factura.',
    loyaltyConversion: '{{points}} punto(s) = ${{amount}}',
    loadingPoints: 'Cargando puntos...',
    loyaltySelectSubscription: 'Selecciona una suscripción primero.',
    loyaltyMaxAvailable: 'Disponibles: {{count}} pts',
    loyaltyNetAfter: 'Neto después de descuento y puntos: ${{amount}}',
    loyaltyInactiveHelp: 'El programa de puntos está inactivo. Actívalo antes de aplicar puntos.',
    loyaltyHelper: 'Los puntos redimidos se envían a la factura y el ledger de lealtad aplica la deducción cuando se guarda la factura.'
  },
  workflowTypes: {
    renewal: 'renovación',
    activation: 'activación'
  },
  customerChannels: {
    'red social': 'Red social',
    google: 'Google',
    familiares: 'Familiares',
    amigos: 'Amigos'
  },
  paymentMethods: {
    'Bank Transfer': 'Transferencia bancaria',
    Paypal: 'PayPal',
    Ecommerce: 'Ecommerce',
    'Link pago': 'Link de pago',
    'Debito Automatico': 'Débito automático',
    Cryptocurrency: 'Criptomoneda',
    'Loyalty Points': 'Puntos de lealtad'
  },
  fallbacks: {
    bank: 'Banco',
    service: 'Servicio',
    channel: 'Canal',
    provider: 'Provider'
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

const normalizeLanguageCode = (language) => {
  const raw = String(language || '')
    .trim()
    .toLowerCase();

  if (!raw) return null;
  if (raw.startsWith('es')) return 'es';
  if (raw.startsWith('en')) return 'en';
  return null;
};

const storedLng = typeof window !== 'undefined' ? localStorage.getItem('lng') : null;
const initialLng = normalizeLanguageCode(storedLng) || 'es';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: 'en',
  supportedLngs: ['es', 'en'],
  nonExplicitSupportedLngs: true,
  load: 'languageOnly',
  cleanCode: true,
  lowerCaseLng: true,
  interpolation: { escapeValue: false },
  parseMissingKeyHandler: (key, _defaultValue, options) =>
    missingKeyFallback(key, options?.lng || i18n.resolvedLanguage || i18n.language || initialLng, options),
  returnNull: false,
  returnEmptyString: false
});

export default i18n;
