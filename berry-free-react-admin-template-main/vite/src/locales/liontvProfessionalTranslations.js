export const lionTvProfessionalTranslations = {
  en: {
    actions: {
      actions: 'Actions',
      close: 'Close',
      copy: 'Copy',
      saveChanges: 'Save changes',
      search: 'Search',
      sendEmail: 'Send email',
      view: 'View'
    },
    menu: {
      ecommerceSettings: 'Ecommerce Settings',
      moviesSeriesPosts: 'Movies & Series Posts'
    },
    common: {
      all: 'All',
      back: 'Back',
      dateFrom: 'Date from',
      dateTo: 'Date to',
      disabled: 'Disabled',
      done: 'Done',
      enabled: 'Enabled',
      error: 'Error',
      job: 'Job',
      next: 'Next',
      nextAttempt: 'Next attempt',
      reason: 'Reason',
      username: 'Username',
      view: 'View'
    },
    billing: {
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      biannual: 'Biannual',
      annual: 'Annual'
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      cancelled: 'Cancelled'
    },
    businessPurchases: {
      headers: {
        requester: 'Requested by'
      },
      summary: {
        totalLabel: 'Purchases',
        totalAmountLabel: 'Total amount',
        pendingLabel: 'Pending',
        paidLabel: 'Paid',
        pendingCreditRequestsLabel: 'Credit requests',
        pendingCreditRequests: 'Pending reseller requests: {{count}}'
      }
    },
    crm: {
      managedAccount: {
        accountCode: 'Account code: {{value}}',
        alias: 'Alias: {{value}}',
        allowDistribution: 'Distribution: {{value}}',
        createdBy: 'Created by: {{value}}',
        displayName: 'Name: {{value}}',
        expirationDate: 'Expires: {{value}}',
        lastEmail: 'Last email: {{value}}',
        notes: 'Notes: {{value}}',
        provider: 'Provider: {{value}}',
        renewalDate: 'Renews: {{value}}',
        block: {
          identity: {
            title: 'Account identity',
            helper: 'Internal code, alias and provider assigned to this managed account.'
          },
          status: {
            title: 'Status & term',
            helper: 'Expiration visibility, email activity and distribution permission.'
          }
        }
      }
    },
    customers: {
      customerId: 'Customer ID',
      actions: {
        sendWelcome: 'Send welcome email',
        sendingWelcome: 'Sending welcome email...'
      },
      form: {
        tone: {
          create: 'Capture complete contact data so sales, support and billing stay aligned.',
          edit: 'Update key customer data and confirm the operational details before saving.'
        }
      }
    },
    demos: {
      editTitle: 'Edit demo',
      cards: {
        total: 'Demos'
      },
      delete: {
        title: 'Delete demo',
        body: 'Delete demo with MAC {{mac}}?'
      },
      headers: {
        mac: 'MAC',
        deviceKey: 'Device key'
      },
      form: {
        customer: 'Customer',
        customerHelper: 'Contact details for the demo owner.',
        device: 'Device',
        deviceHelper: 'Access identifier for the trial device.',
        deviceKeyHelper: 'Required for 9Xtream/IPTV; optional for Vivo Player.',
        note: 'Note',
        stateHelper: 'Track validity, lifecycle and internal notes.'
      },
      messages: {
        required: 'Complete phone, MAC, name and email before saving the demo.',
        deviceKeyRequired: 'Device Key is required for the selected app.',
        created: 'Demo created.',
        updated: 'Demo updated.',
        deleted: 'Demo deleted.',
        emailMissing: 'This demo does not have an email address.',
        emailSent: 'Email sent successfully.',
        emailError: 'Could not send the email.'
      }
    },
    emailCampaigns: {
      title: 'Email Campaigns',
      titleHelper: 'Build, preview and launch campaigns with a reusable audience and controlled delivery.',
      metrics: {
        totalOnPage: 'Campaigns on page',
        drafts: 'Drafts on page',
        sent: 'Sent on page',
        failed: 'Failed on page'
      },
      filters: {
        search: 'Search campaigns',
        status: 'Status',
        template: 'Template',
        from: 'From',
        to: 'To'
      },
      headers: {
        name: 'Campaign',
        template: 'Template',
        status: 'Status',
        sendType: 'Send type',
        totalRecipients: 'Total recipients',
        sentSuccessCount: 'Sent successfully',
        sentFailureCount: 'Failed',
        createdAt: 'Created',
        queuedAt: 'Queued',
        sentAt: 'Completed'
      },
      steps: {
        template: 'Template',
        variables: 'Variables',
        audience: 'Audience',
        preview: 'Preview & Send'
      },
      dialog: {
        createTitle: 'Create email campaign',
        editTitle: 'Edit email campaign',
        subtitle: 'Build a reusable campaign from a template, resolve manual variables, choose the audience and send or schedule it.'
      },
      actions: {
        new: 'New campaign',
        refreshTemplates: 'Refresh templates',
        refreshPreview: 'Refresh preview',
        importExternalRecipients: 'Import leads and demos',
        importingExternalRecipients: 'Importing emails...',
        sendTest: 'Send test email',
        saveDraft: 'Save draft',
        schedule: 'Schedule campaign',
        sendNow: 'Queue campaign',
        queue: 'Queue now',
        view: 'View detail',
        cancelCampaign: 'Cancel campaign'
      },
      form: {
        name: 'Campaign name',
        template: 'Template',
        templateHint: 'Selected template: {{name}} ({{code}}).',
        sendType: 'Send type',
        scheduledAt: 'Scheduled at',
        booleanValue: 'Boolean value'
      },
      sendType: {
        IMMEDIATE: 'Queue now',
        SCHEDULED: 'Scheduled'
      },
      customerMode: {
        MIXED: 'Mixed audience',
        FILTERED: 'Filtered audience',
        SELECTED: 'Selected customers'
      },
      status: {
        ALL: 'All',
        DRAFT: 'Draft',
        READY: 'Ready',
        SENDING: 'Sending',
        SENT: 'Sent',
        FAILED: 'Failed',
        CANCELLED: 'Cancelled'
      },
      recipientStatus: {
        ALL: 'All',
        PENDING: 'Pending',
        SENT: 'Sent',
        FAILED: 'Failed',
        SKIPPED: 'Skipped'
      },
      audience: {
        mode: 'Customer mode',
        customerStatus: 'Customer status',
        channel: 'Channel',
        search: 'Customer search',
        fromDate: 'From date',
        toDate: 'To date',
        selectCustomers: 'Select customers',
        selectedCustomers: '{{count}} selected',
        externalRecipients: 'External recipients',
        externalHelper: 'Paste emails separated by commas or lines. You can also use Name <email@example.com> format.',
        externalCount: '{{count}} external recipient(s)',
        customerPicker: {
          title: 'Select customers',
          subtitle: 'Search customers with the current filters and choose the ones you want to include in the campaign.',
          selectedCount: '{{count}} customer(s) selected.'
        }
      },
      customerHeaders: {
        customer: 'Customer',
        email: 'Email',
        status: 'Status',
        channel: 'Channel'
      },
      preview: {
        totalRecipients: 'Total recipients',
        customerRecipients: 'Customers',
        externalRecipients: 'External',
        subject: 'Resolved subject',
        html: 'Resolved HTML',
        testEmail: 'Send test email to'
      },
      detail: {
        summary: 'Summary',
        variables: 'Variables',
        preview: 'Preview',
        recipients: 'Recipients',
        recipientSearch: 'Search recipients',
        recipientStatus: 'Send status'
      },
      variableHeaders: {
        name: 'Variable',
        value: 'Value'
      },
      recipientHeaders: {
        email: 'Email',
        fullName: 'Full name',
        type: 'Type',
        status: 'Status',
        sentAt: 'Sent at',
        error: 'Error'
      },
      messages: {
        loadError: 'Unable to load email campaigns.',
        loadCampaignError: 'Unable to load campaign detail.',
        loadTemplateError: 'Unable to load selected template.',
        loadTemplatesError: 'Unable to load active templates.',
        customerSearchError: 'Unable to search customers.',
        recipientsLoadError: 'Unable to load recipient history.',
        requiredHeader: 'Campaign name, template and send type are required.',
        scheduleRequired: 'Choose a scheduled date and time.',
        missingManualVariables: 'Complete required variables: {{items}}',
        noManualVariables: 'This template only uses recipient-bound variables. You can continue to audience selection.',
        draftCreated: 'Campaign draft created.',
        draftUpdated: 'Campaign draft updated.',
        saveDraftError: 'Unable to save campaign draft.',
        previewError: 'Unable to build campaign preview.',
        previewPending: 'Move to this step or click refresh preview to resolve the final email.',
        testEmailRequired: 'Enter a test email address.',
        testSent: 'Test email sent.',
        testSendError: 'Unable to send test email.',
        scheduled: 'Campaign scheduled successfully.',
        queued: 'Campaign queued for sending.',
        queueError: 'Unable to queue campaign.',
        noCustomers: 'No customers match the current search.',
        noVariablesUsed: 'This campaign does not have manual variables.',
        noRecipientsHistory: 'No recipients found for the current filter.',
        externalRecipientsImported: '{{count}} external recipient(s) imported.',
        externalRecipientsImportedEmpty: 'No new external recipients were found to import.',
        externalRecipientsImportError: 'Unable to import external recipients from potential customers and demos.',
        templatesLoadError: 'Unable to load active templates.',
        empty: 'No campaigns found for the current filters.',
        cancelConfirm: 'Cancel campaign {{name}}?',
        cancelled: 'Campaign cancelled.',
        cancelError: 'Unable to cancel campaign.'
      }
    },
    emailTemplates: {
      title: 'Email Templates',
      titleHelper: 'Maintain reusable templates with placeholders, bindings and preview before they reach a campaign.',
      metrics: {
        total: 'Templates on page',
        active: 'Active',
        variables: 'Variables on page'
      },
      filters: {
        search: 'Search templates',
        category: 'Category',
        active: 'Status'
      },
      headers: {
        name: 'Template',
        category: 'Category',
        variables: 'Variables',
        updatedAt: 'Updated',
        status: 'Status'
      },
      status: {
        active: 'Active',
        inactive: 'Inactive'
      },
      actions: {
        new: 'New template',
        importantMatchPreset: 'Important match preset',
        loadPreset: 'Load preset',
        syncVariables: 'Detect placeholders',
        addVariable: 'Add variable row',
        copyCode: 'Copy code',
        activate: 'Activate',
        deactivate: 'Deactivate'
      },
      dialog: {
        createTitle: 'Create email template',
        editTitle: 'Edit email template',
        subtitle: 'Manage reusable HTML templates and declare which variables will be filled dynamically in campaigns.'
      },
      tabs: {
        general: 'General',
        html: 'HTML',
        variables: 'Variables',
        preview: 'Preview'
      },
      form: {
        code: 'Code',
        codeHelper: 'Unique identifier per owner.',
        name: 'Name',
        category: 'Category',
        active: 'Template active',
        subjectTemplate: 'Subject template',
        placeholderHint: 'Use placeholders like {{customerName}}.',
        description: 'Description',
        htmlHelp: 'Paste the full HTML and subject placeholders. Then sync variables to define labels, types and defaults.',
        htmlTemplate: 'HTML template',
        variable: 'Variable',
        variableOrder: 'Sort order',
        variableName: 'Variable name',
        label: 'Label',
        helpText: 'Help text',
        inputType: 'Input type',
        valueSource: 'Value source',
        bindingKey: 'Recipient binding',
        defaultValue: 'Default value',
        required: 'Required variable'
      },
      preview: {
        note: 'This preview uses default values for manual variables and a sample customer context for recipient-bound variables.',
        subject: 'Resolved subject',
        html: 'Resolved HTML'
      },
      messages: {
        loadError: 'Unable to load email templates.',
        loadOneError: 'Unable to load template detail.',
        required: 'Code, name, subject and HTML are required.',
        variableRequired: 'Every detected variable needs a name and label.',
        updated: 'Template updated successfully.',
        created: 'Template created successfully.',
        saveError: 'Unable to save template.',
        activated: 'Template activated.',
        deactivated: 'Template deactivated.',
        statusError: 'Unable to update template status.',
        deleteConfirm: 'Delete template {{name}}?',
        deleted: 'Template removed successfully.',
        deleteError: 'Unable to delete template.',
        codeCopied: 'Template code copied.',
        copyError: 'Unable to copy template code.',
        empty: 'No templates found for the current filters.',
        presetHelp: 'Start from the important match preset and then adapt the copy to your operation before saving.',
        presetLoaded: 'Important match preset loaded. Review the variables and save it.',
        noVariables: 'No variables detected yet. Use placeholders in subject or HTML and click Detect placeholders.'
      }
    },
    headerNotifications: {
      title: 'Alerts & jobs',
      empty: 'There are no critical alerts right now.',
      loadError: 'Unable to load header alerts.',
      partial: 'Showing partial data while the dashboard finishes syncing.',
      updatedAt: 'Updated {{time}}',
      openTracking: 'Open tracking',
      labels: {
        alert: 'Alert',
        customer: 'Customer',
        open: 'Open',
        reviewPending: 'Pending review',
        appFallback: 'App',
        planFallback: 'Plan',
        lineFallback: 'Line',
        accountCodeFallback: 'Account'
      },
      types: {
        license: 'License',
        subscription: 'Subscription',
        line: 'Line',
        managedAccount: 'Managed account',
        pendingInvoice: 'Pending invoice',
        paymentCommitment: 'Payment commitment',
        subscriptionExpiration: 'Expirations'
      },
      reference: {
        invoice: 'Invoice #{{id}}',
        commitment: 'Commitment #{{id}}',
        subscriptionExpirationJobs: 'Critical expiration jobs',
        subscriptionExpirationStale: 'Stale scheduler'
      },
      alertDetail: {
        dueToday: 'Due today',
        dueTodayAmount: 'Pending {{amount}}',
        subscriptionExpirationJobs: 'Retry, manual review or failed jobs detected.',
        subscriptionExpirationStale: 'Detector or worker missed its expected execution cycle.'
      },
      severity: {
        critical: 'Critical',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        info: 'Info'
      }
    },
    headerSearch: {
      dialogTitle: 'Global search',
      placeholder: 'Search customers, subscriptions, invoices or commands',
      kinds: {
        command: 'Command'
      },
      sections: {
        quickActions: 'Quick actions',
        recents: 'Recent searches',
        todayPending: 'Due today'
      },
      labels: {
        result: 'Result',
        customerValue: 'Customer: {{value}}',
        customerById: 'Customer #{{id}}',
        idValue: 'ID {{id}}',
        licenseFallback: 'License',
        planFallback: 'Plan',
        noProvider: 'No provider'
      },
      due: {
        inDays: 'Due in {{days}}d',
        overdue: '{{days}}d overdue',
        today: 'Due today',
        tomorrow: 'Due tomorrow'
      },
      reference: {
        invoice: 'Invoice #{{id}}',
        commitment: 'Commitment #{{id}}'
      },
      summary: {
        results: '{{count}} results',
        sync: 'Updated {{time}}',
        todayAlerts: '{{count}} due today'
      },
      messages: {
        filtersHelp: 'Use short terms like customer, invoice, subscription, line or CRM to move faster.',
        loadError: 'Unable to load global search data.',
        noRecents: 'You do not have recent searches yet.',
        noResults: 'No results match the current query.',
        noTodayDue: 'There are no urgent items due today.',
        partialData: 'Some widgets are still syncing. Results may be partial.'
      }
    },
    vodPosts: {
      title: 'Movies & Series Posts',
      subtitle: 'Manual VOD drafts with preview, approval and publishing flow.',
      intro:
        'Build premium VOD posts from the latest active movies or series feed, choose the visual layout and publish with the same editorial flow used by sports automation.',
      loading: 'Loading VOD publishing console...',
      contentTypes: {
        movie: 'Movies',
        series: 'Series'
      },
      layouts: {
        single: 'Single',
        grid: 'Grid',
        hero_stack: 'Hero Stack'
      },
      layoutHints: {
        single: 'One title with dominant poster and premium CTA.',
        grid: 'A premium poster mosaic for 2 to 6 selected titles.',
        hero_stack: 'One main title with a stacked set of supporting titles.'
      },
      branding: {
        modeGeneric: 'Generic watermark',
        modeReseller: 'Reseller watermark',
        resellerLabel: 'Reseller',
        resellerPlaceholder: 'Search by username',
        resellerConfigured: 'Support phone ready: {{phone}}',
        resellerMissing: 'Support phone pending configuration',
        errors: {
          resellerRequired: 'Select a reseller before generating branded VOD content.',
          supportMissing: 'The selected reseller does not have a support phone configured in Support Center.',
          lookup: 'Could not load reseller support profiles.'
        }
      },
      safeMode: 'SAFE mode',
      safeModeOff: 'SAFE mode disabled',
      safeModeLocked: 'SAFE mode is enabled for this draft',
      safeModeUnlocked: 'SAFE mode is disabled for this draft',
      kpis: {
        catalogItems: 'Catalog titles',
        catalogItemsHelper: 'Available titles in the latest active feed.',
        drafts: 'Drafts',
        draftsHelper: 'Recent posts stored for this content type.',
        approved: 'Approved',
        approvedHelper: 'Drafts already validated and ready to publish.',
        published: 'Published',
        publishedHelper: 'Drafts already sent to the publishing flow.'
      },
      composer: {
        title: 'VOD composer',
        contentType: 'Content type',
        layoutMode: 'Layout mode',
        branding: 'Branding',
        selectionCounter: '{{selected}} selected · required {{min}}-{{max}}',
        editing: 'Editing draft #{{id}} · changes regenerate the image and captions from the new snapshot.',
        createHint: 'Select titles, choose the layout and create a premium draft preview.'
      },
      catalog: {
        search: 'Search title',
        searchPlaceholder: 'Title, year or genre',
        category: 'Category',
        categoryAll: 'All categories',
        categoryUncategorized: 'Uncategorized',
        selected: 'Selected',
        posterFallback: 'Poster pending',
        feedSnapshot: 'Active feed #{{id}} · Updated {{date}}',
        pageSummary: 'Page {{page}} of {{pages}} · {{count}} visible',
        selectionPersistence: 'Selections stay active across pages. You can mark titles here and continue selecting on the next pages.',
        activeFilters: 'Filters · {{summary}}',
        activeFilterSearch: 'Search',
        activeFilterCategory: 'Category: {{category}}'
      },
      posts: {
        title: 'Recent VOD drafts',
        loading: 'Loading VOD drafts...',
        untitled: 'VOD draft',
        selectedItems: 'selected titles',
        reseller: 'Reseller: {{username}}',
        feed: 'Feed #{{id}}',
        captionPending: 'Generate captions to complete the publishing copy.',
        updatedAt: 'Updated {{date}}'
      },
      previewDialog: {
        title: 'Rendered image preview',
        loading: 'Loading rendered image...',
        alt: 'Generated VOD post'
      },
      safePreviewDialog: {
        title: 'SAFE preview',
        loading: 'Loading SAFE preview...',
        helper: 'Use this view to confirm the sanitized caption before approving or publishing the VOD post.',
        caption: 'Sanitized caption',
        phone: 'Support {{phone}}'
      },
      validation: {
        single: 'Select exactly 1 title.',
        grid: 'Select between 2 and 6 titles.',
        hero_stack: 'Select between 2 and 5 titles.'
      },
      status: {
        generated: 'Generated',
        approved: 'Approved',
        published: 'Published',
        failed: 'Failed',
        draft: 'Draft'
      },
      actions: {
        createDraft: 'Create draft',
        updateSelection: 'Update selection',
        saving: 'Saving...',
        cancelEdit: 'Cancel edit',
        deleteDraft: 'Delete draft',
        deleting: 'Deleting...',
        previewImage: 'Preview image',
        safePreview: 'Safe preview',
        editSelection: 'Edit selection',
        regenerateImage: 'Regenerate image',
        regeneratingImage: 'Regenerating...',
        regenerateCaptions: 'Regenerate captions',
        regeneratingCaptions: 'Regenerating...',
        approve: 'Approve',
        approving: 'Approving...',
        publish: 'Publish',
        publishing: 'Publishing...'
      },
      messages: {
        created: 'The VOD draft was created successfully.',
        deleted: 'The VOD draft was deleted successfully.',
        selectionUpdated: 'The VOD draft was updated with your selected titles.',
        imageRegenerated: 'The preview image was regenerated successfully.',
        captionsRegenerated: 'The captions were regenerated successfully.',
        approved: 'The VOD draft is now approved.',
        published: 'The VOD draft was published successfully.'
      },
      warnings: {
        missingTitles:
          '{{count}} selected title(s) no longer exist in the active feed. Keep this draft for preview/publish or replace the selection to refresh it.'
      },
      errors: {
        loadCatalog: 'Could not load the active catalog feed.',
        loadPosts: 'Could not load existing VOD drafts.',
        create: 'Could not create the VOD draft.',
        delete: 'Could not delete this VOD draft.',
        updateSelection: 'Could not update the selected titles for this draft.',
        previewImage: 'Preview image is not available yet.',
        safePreview: 'Could not load the SAFE preview.',
        regenerateImage: 'Could not regenerate the image.',
        regenerateCaptions: 'Could not regenerate the captions.',
        approve: 'Could not approve this VOD draft.',
        publish: 'Could not publish this VOD draft.',
        selectionLimit: 'This layout supports up to {{count}} titles.'
      },
      delete: {
        title: 'Delete VOD draft',
        body: 'Delete "{{title}}"? This action removes the draft and its generated preview image.',
        publishedBlocked: 'Published posts cannot be deleted from this module.'
      },
      empty: {
        search: 'No titles match the current search.',
        filtered: 'No titles match the current filters.',
        catalog: 'The active feed does not contain publishable titles yet.',
        posts: 'No VOD drafts have been created for this content type yet.'
      }
    },
    licenses: {
      badge: {
        new: 'New',
        edit: 'Editing'
      },
      modal: {
        newTitle: 'New license',
        editTitle: 'Edit license',
        subtitle: 'Register the device, owner and operational parameters of the license.',
        helper: 'Complete key data and confirm ownership before saving.'
      },
      table: {
        loading: 'Loading licenses...',
        emptyTitle: 'No licenses found',
        emptyText: 'Try adjusting the filters or create a new license.'
      },
      delete: {
        title: 'Delete license',
        body: 'Delete license {{name}}? This action cannot be undone.'
      },
      form: {
        identity: 'Identity',
        identityHelper: 'Device, owner and identification data.',
        customer: 'Customer',
        customerHelper: 'Customer linked to this license.',
        attributes: 'Attributes',
        attributesHelper: 'App, status, type and period.',
        billing: 'Billing & expiration',
        billingHelper: 'Price, validity and lifecycle controls.',
        name: 'Name',
        app: 'App',
        status: 'Status',
        statusHelper: 'Current operational state.',
        type: 'Type',
        typeHelper: 'Primary or used license.',
        period: 'Period',
        periodHelper: 'License validity.',
        price: 'Price',
        expire: 'Expire',
        select: 'Select',
        loadingCustomers: 'Loading customers...',
        buttons: {
          create: 'Create',
          save: 'Save changes'
        }
      },
      server: {
        title: 'Change server',
        helper: 'Select the destination server and review the line context before sending the command.',
        summaryTitle: 'Selected line context',
        mac: 'MAC',
        customer: 'Customer',
        country: 'Country (phone)',
        subscription: 'Subscription',
        lineSource: 'Line source',
        lineSourceMain: 'Main line',
        lineSourcePlus: 'Line plus',
        lineSourceHelper: 'Choose whether the server change must use the main line or the plus line.',
        lineSourceMainOnly: 'This subscription only has the main line available.',
        effectiveLine: 'Effective line',
        provider: 'Provider',
        noProvider: 'Not available',
        server: 'Server',
        playlist: 'Playlist name',
        plusMetadataRequired: 'Line plus metadata is incomplete. Review the selected subscription before continuing.',
        plusLineMissing: 'The plus line could not be resolved from the current metadata.',
        submit: 'Change server'
      },
      transfer: {
        title: 'Transfer license',
        license: 'License',
        newCustomer: 'New customer',
        helperCustomer: 'Choose the new license owner.',
        loadingCustomers: 'Loading customers...',
        subscription: 'Destination subscription',
        subscriptionSelectCustomer: 'Select the new customer first.',
        subscriptionHelper: 'Choose the subscription that will own this managed license.',
        subscriptionEmpty: 'This customer does not have subscriptions available.',
        type: 'Type',
        typeHelper: 'Type to assign to the new customer.',
        submit: 'Transfer',
        sending: 'Transferring...',
        done: 'License transferred.'
      },
      history: {
        title: 'License history',
        subtitle: 'Review customer changes, type changes and operational traceability.',
        license: 'License',
        currentCustomer: 'Current customer',
        currentType: 'Current type',
        total: 'Total moves',
        movements: 'Movements',
        helper: 'Most recent changes appear first.',
        empty: 'No movements recorded.',
        type: 'Type',
        tip: 'If the API returns customer names, the timeline will show them instead of local IDs.'
      }
    },
    lines: {
      actions: {
        new: 'New line',
        edit: 'Edit line'
      },
      delete: {
        title: 'Delete line',
        body: 'Delete line {{id}}?',
        done: 'Line deleted.'
      },
      summary: {
        totalLabel: 'Total lines',
        activeLabel: 'Active',
        expiredLabel: 'Expired'
      },
      headers: {
        provider: 'Provider',
        country: 'Country'
      },
      filters: {
        provider: 'Provider'
      },
      errors: {
        load: 'Unable to load lines.',
        save: 'Unable to save the line.',
        delete: 'Unable to delete the line.'
      },
      detail: {
        copy: 'Copy',
        copied: 'Credentials copied.',
        copyFallback: 'Could not copy automatically. Try again manually.',
        noPackage: 'No package',
        noStream: 'No recent stream'
      },
      form: {
        id: 'Line ID',
        username: 'Username',
        password: 'Password',
        provider: 'Provider',
        country: 'Country',
        packageId: 'Package',
        packageHelper: 'Choose the commercial package and the available connections.',
        maxConnections: 'Max connections',
        expDate: 'Expire date',
        notes: 'Reseller notes',
        access: 'Access',
        accessHelper: 'Operational credentials and current state.',
        meta: 'Dates & notes',
        metaHelper: 'Expiration date and internal operational notes.',
        helper: 'Configure the access and commercial package of the line.',
        required: 'Complete line ID, username and password.',
        saved: 'Line saved.'
      }
    },
    m3uBackup: {
      title: 'M3U Backup Link',
      subtitle: 'Create a controlled alias for resilient playlist delivery without exposing the original line credentials.',
      helper: 'The alias is what the customer sees. Internally the system still uses the real line and provider template.',
      pageTitle: 'M3U backup aliases',
      pageHelper: 'Control player links, direct download links and fallback routing from one operational module.'
    },
    paymentCommitments: {
      title: 'Payment Commitments',
      filters: {
        title: 'Debt control',
        all: 'All',
        debtorsOnly: 'Debtors only',
        search: 'Search by customer, status, note or ID',
        status: 'Status'
      },
      dialog: {
        createTitle: 'Create payment commitment',
        editTitle: 'Edit payment commitment',
        subtitle: 'Track promised dates, debt, partial payments and commercial risk in a single record.'
      },
      kpi: {
        totalLabel: 'Commitments',
        total: '{{count}} active commitments on the current view',
        debtorsLabel: 'Debtors',
        debtors: '{{count}} customers still owe money',
        pendingAmountLabel: 'Pending',
        pendingAmount: '{{amount}} still pending to collect',
        overdueLabel: 'Overdue',
        overdue: '{{count}} commitments already missed the promised date'
      },
      form: {
        main: {
          title: 'Commercial commitment',
          helper: 'Customer, promised date and total amount due.'
        },
        tracking: {
          title: 'Collection tracking',
          helper: 'Partial payment, projected status and operational notes.'
        }
      },
      risk: {
        onTime: 'On time',
        overdue: 'Overdue'
      },
      table: {
        emptyTitle: 'No payment commitments found',
        emptyText: 'Try another filter combination or create the first commitment for this customer.'
      },
      delete: {
        title: 'Delete payment commitment',
        body: 'Delete commitment for {{name}}?'
      }
    },
    potentialCustomers: {
      title: 'Potential Customers',
      subtitle: 'Capture, classify and activate prospects without mixing them with active customers.',
      search: 'Search prospects',
      searchPlaceholder: 'Search by name, email, phone or country',
      selectCountry: 'Select country',
      empty: 'There are no prospects registered yet.',
      emailDefault: 'If left empty, the system stores nomail@gmail.com as fallback.',
      whatsappMessage: 'Hello, we are contacting you from Lion TV Premium to help you activate your access. Tell us what type of service you need and we will guide you.',
      kpi: {
        total: 'Total prospects',
        new: 'New',
        contacted: 'Contacted',
        converted: 'Converted'
      },
      headers: {
        actions: 'Actions',
        name: 'Name',
        email: 'Email',
        phone: 'Phone activity',
        status: 'Status',
        category: 'Category pipeline',
        country: 'Country',
        createdAt: 'Created'
      },
      filters: {
        status: 'Status',
        category: 'Category',
        groupName: 'Name group'
      },
      actions: {
        new: 'New prospect',
        edit: 'Edit prospect',
        markContacted: 'Mark as contacted',
        importWhatsappCsv: 'Import WhatsApp CSV',
        exportWhatsappCsv: 'Export WhatsApp CSV',
        sendPaymentFailedEmail: 'Send payment failed email',
        sendAbandonedCartEmail: 'Send abandoned cart email'
      },
      form: {
        identity: 'Identity',
        identityHelper: 'Primary contact data for this opportunity.',
        classification: 'Classification',
        classificationHelper: 'Category, sales stage and next commercial step.'
      },
      import: {
        title: 'Import WhatsApp CSV',
        subtitle: 'Upload a phone,group file and create prospects only for the authenticated owner.',
        helper: 'Existing phones for the same user are skipped automatically. Categories are inferred from the group label when possible.',
        defaults: 'Import defaults',
        defaultCountry: 'Default country',
        defaultCategory: 'Default category',
        fileName: 'Selected file',
        rowsDetected: 'Rows detected',
        groupsDetected: 'Groups detected',
        preview: 'Preview groups',
        noGroups: 'No groups detected in the file.',
        fallbackName: 'WhatsApp lead',
        changeFile: 'Choose another file',
        confirm: 'Import now',
        importing: 'Importing...'
      },
      export: {
        byName: 'Export grouped by name',
        byCategory: 'Export grouped by category',
        fallbackName: 'Prospect',
        fileSuffixName: 'by-name',
        fileSuffixCategory: 'by-category'
      },
      categories: {
        GENERAL: 'General',
        IPTV: 'IPTV',
        SPORTS_BAR: 'Sports bar',
        BAR_RESTAURANT: 'Bar & restaurant',
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
      messages: {
        requiredName: 'Enter the prospect name before saving.',
        loadError: 'Unable to load potential customers.',
        saveError: 'Unable to save the potential customer.',
        deleteError: 'Unable to delete the prospect.',
        deleted: 'Potential customer deleted.',
        created: 'Potential customer created.',
        updated: 'Potential customer updated.',
        alreadyContacted: 'This prospect is already marked as contacted.',
        markContactedSuccess: 'Prospect marked as contacted.',
        markContactedError: 'Unable to update the contact status.',
        invalidWhatsAppPhone: 'This prospect does not have a valid WhatsApp number.',
        importError: 'Unable to import the WhatsApp CSV.',
        importInvalidFile: 'The selected file does not contain valid WhatsApp rows.',
        importParsingError: 'The CSV file could not be parsed. Check the format and try again.',
        importSuccess: 'Import finished. Inserted {{inserted}}, skipped existing leads {{skipped}}, skipped customers {{skippedCustomers}}, invalid {{invalid}}.',
        exportEmpty: 'There are no records to export with the current filters.',
        exportNoPhones: 'The filtered records do not have valid phones to export or they already belong to registered customers.',
        exportError: 'Could not export the WhatsApp CSV.',
        exportSuccess: 'CSV exported with {{count}} records.',
        groupLoadError: 'Could not load name groups.',
        missingRealEmail: 'This prospect does not have a usable email.'
      },
      deleteTitle: 'Delete potential customer',
      deleteBody: 'Delete {{name}}?'
    },
    profileMenu: {
      greeting: 'Hi,',
      userFallback: 'User',
      roleFallback: 'No role assigned',
      searchPlaceholder: 'Search profile settings',
      changeLanguage: 'Language',
      colorTheme: 'Theme mode',
      changePassword: 'Change password',
      accountSettings: 'Account settings',
      logout: 'Log out',
      current: 'Current',
      viewMode: {
        title: 'Workspace mode',
        subtitle: 'Switch between the internal admin view and the reseller commercial console.',
        admin: 'Admin mode',
        reseller: 'Reseller mode'
      },
      messages: {
        fillAllFields: 'Complete all password fields.',
        passwordMismatch: 'The new passwords do not match.',
        passwordUpdated: 'Password updated successfully.',
        passwordUpdateError: 'Unable to update the password.',
        logoutSuccess: 'Session closed successfully.',
        viewModeUpdated: 'Workspace switched to {{mode}}.'
      },
      passwordDialog: {
        title: 'Change password',
        subtitle: 'Update your credentials without leaving the current workspace.',
        tip: 'Use a strong password and keep it different from your email or panel credentials.',
        currentPassword: 'Current password',
        newPassword: 'New password',
        confirmPassword: 'Confirm password',
        newPasswordHelper: 'Use at least 8 characters, mixing letters, numbers and symbols.'
      },
      upgradeCard: {
        title: 'Keep your control center secure',
        subtitleLine1: 'Review language, theme and password from a single profile menu.',
        subtitleLine2: 'Small operational settings make the whole team faster.',
        action: 'Review settings'
      }
    },
    resellerSupport: {
      loading: 'Loading support configuration...',
      messages: {
        saved: 'The reseller WhatsApp number was saved. Email notifications will now use this contact for your customers.'
      },
      errors: {
        load: 'Unable to load the support profile.',
        save: 'Unable to save the support profile.',
        invalidPhone: 'Enter a valid WhatsApp number with 8 to 15 digits.'
      },
      profile: {
        configured: 'Configured',
        notConfigured: 'Using global fallback',
        activeNotice: 'Transactional emails and email campaigns can now send the customer to your own WhatsApp contact.',
        fallbackNotice: 'You have not configured a reseller WhatsApp yet. Until then, emails will keep pointing to the global system number.',
        phoneLabel: 'WhatsApp number',
        phoneHelper: 'Only the number matters. You can type it with spaces, + or dashes; the system stores digits only.',
        save: 'Save WhatsApp',
        testLink: 'Test link',
        previewTitle: 'Link preview',
        previewFallback: 'The global contact will be used',
        usageTitle: 'Where this number will be used',
        usageDescription: 'This WhatsApp becomes the commercial contact whenever the email was generated by your reseller account. Admin keeps the current global number flow.',
        usage: {
          notifications: 'Operational emails: welcome, renewal, expiration, invoice and loyalty points.',
          campaigns: 'Email campaigns and templates with a WhatsApp support button.',
          preview: 'Template previews and test sends from Email Templates / Campaigns.'
        }
      },
      steps: {
        onboarding: {
          title: 'Private onboarding',
          description: 'The platform creates the reseller account manually, assigns permissions, loads initial balance and delivers the access.'
        },
        billing: {
          title: 'Manual billing',
          description: 'Phase 1 collections are still registered outside the platform. Use invoices and internal references to keep operational traceability.'
        },
        wallet: {
          title: 'Credit allocation',
          description: 'After confirming the payment, admin credits the wallet manually. The ledger remains as the source of truth for the movement.'
        },
        support: {
          title: 'Escalation path',
          description: 'If an activation needs correction, document invoice, customer and reason. Then escalate it with support for the commercial adjustment.'
        }
      }
    },
    resellerWallet: {
      loading: 'Loading wallet...',
      lowBalance: 'Your balance is below the recommended threshold. Request more credits before processing additional activations or renewals.',
      errors: {
        load: 'Unable to load the credit wallet.',
        request: 'Unable to create the credit request.',
        adjust: 'Unable to apply the wallet adjustment.'
      },
      hero: {
        balanceLabel: 'Available balance',
        balanceHelper: 'Credits ready for new sales and real renewals.',
        balanceHealthy: 'Healthy balance',
        balanceLow: 'Top-up recommended'
      },
      cards: {
        available: 'Available balance',
        availableHelper: 'Ready to be consumed by commercial operations.',
        credited: 'Credited credits',
        creditedHelper: 'Historical total of manual top-ups.',
        consumed: 'Consumed credits',
        consumedHelper: 'Credits already used by billable operations.',
        pendingRequests: 'Pending requests',
        pendingRequestsHelper: 'Top-up requests already sent to administration.'
      },
      actions: {
        manualTopUp: 'Admin adjustment',
        apply: 'Apply adjustment'
      },
      buy: {
        credits: 'Requested credits',
        notes: 'Optional note',
        notesPlaceholder: 'Example: need credits before the renewal wave on day 2',
        helper: 'You do not need to type IDs or internal references. The platform creates the request and administration receives it as a pending credit purchase.',
        action: 'Send request',
        sending: 'Sending...'
      },
      dialog: {
        title: 'Manual credit adjustment',
        helper: 'This form is for internal operation only. Use positive values for top-ups and negative values for discounts.',
        creditsDelta: 'Credits',
        sourceType: 'Source',
        sourceId: 'Reference ID',
        reason: 'Reason'
      },
      ledger: {
        title: 'Movement history',
        subtitle: 'Review credited top-ups and historical wallet consumption.',
        empty: 'There are no movements recorded yet.',
        headers: {
          date: 'Date',
          type: 'Type',
          delta: 'Delta',
          balance: 'Balance',
          reason: 'Reason'
        }
      },
      requests: {
        title: 'Latest requests',
        subtitle: 'Track the status of your recent top-up requests while administration processes them.',
        empty: 'You have not submitted any credit requests yet.',
        fallback: 'Credit request',
        noNotes: 'No additional notes on this request.'
      },
      messages: {
        invalidDelta: 'Enter a non-zero adjustment.',
        invalidRequestCredits: 'Enter a valid amount of credits.',
        adjusted: 'Wallet updated successfully.',
        requestCreated: 'The credit request was sent to administration. You will be notified once the top-up is credited.'
      }
    },
    subscriptionExpiration: {
      title: 'Subscription expiration monitoring',
      subtitle: 'Operational panel to understand why a subscription did not expire, did not remove playlists or still needs manual intervention.',
      loading: 'Loading expiration monitoring...',
      loadingJobs: 'Loading critical jobs...',
      loadingDetail: 'Loading job detail...',
      staleBanner:
        'The scheduler is stale. Review detector and worker cycles; this process is critical for expiring subscriptions and removing playlists.',
      table: {
        title: 'Critical jobs queue'
      },
      states: {
        empty: 'There are no critical jobs with the current filters.',
        noDetail: 'Select a job to review the timeline and operational snapshot.'
      },
      metrics: {
        attention: 'Attention jobs',
        attentionHelper: 'Failed and manual review items.',
        blockers: 'Blockers',
        blockersHelper: 'Missing credentials and unsupported providers.',
        noLicenses: 'No licenses',
        noLicensesHelper: 'Audited events without linked licenses.',
        retry: 'Retry queue',
        retryHelper: 'Jobs ready for another attempt.'
      },
      cards: {
        detector: 'Detector',
        worker: 'Worker'
      },
      actions: {
        runDetector: 'Run detector',
        runWorker: 'Run worker',
        detectorSuccess: 'Detector executed successfully.',
        workerSuccess: 'Worker executed successfully.',
        markReviewed: 'Mark reviewed',
        markReviewedSuccess: 'Alert marked as reviewed.',
        retry: 'Retry',
        retrySuccess: 'Job retried successfully.',
        openSubscription: 'Open subscription',
        enqueueSubscription: 'Requeue subscription',
        enqueueSuccess: 'Subscription requeued successfully.'
      },
      drawer: {
        title: 'Job diagnostics',
        summary: 'Subscription snapshot',
        timeline: 'Audit timeline',
        licenses: 'Affected licenses',
        noAudit: 'No audit data is registered for this job.',
        noLicenses: 'No licenses are linked to this subscription.'
      },
      errors: {
        loadOverview: 'Unable to load the overview.',
        loadJobs: 'Unable to load the jobs.',
        loadDetail: 'Unable to load the job detail.',
        actionFailed: 'Unable to complete the action.',
        subscriptionRequired: 'Provide a subscription ID to requeue.'
      }
    },
    subscriptions: {
      badge: {
        new: 'New',
        edit: 'Editing'
      },
      delete: {
        title: 'Delete subscription',
        message: 'Delete subscription',
        warning: 'This action cannot be undone.',
        confirm: 'Delete',
        deleting: 'Deleting...'
      },
      filters: {
        yesterday: 'Expired yesterday',
        today: 'Due today',
        tomorrow: 'Due tomorrow',
        sortRenewal: 'Renewal order',
        asc: 'Closest first',
        desc: 'Farthest first'
      },
      fields: {
        subscriptionId: 'Subscription ID'
      },
      form: {
        subtitle: 'Complete customer, package and billing details.',
        helperTone: 'Review the key fields before saving.',
        customer: 'Customer',
        customerHint: 'Choose the customer that owns this subscription.',
        package: 'Package',
        packagesHint: 'Commercial packages only. Demo packages are excluded from this flow.',
        line: 'Line',
        linesHint: 'The list shows the operational username for each line.',
        linePlus: 'Line plus',
        linesPlusHint: 'Only LionPlus and TitanPlus lines are shown here.',
        status: 'Status',
        statusPlaceholder: 'Status',
        start: 'Start',
        renewal: 'Renewal',
        amount: 'Amount',
        discount: 'Discount',
        billing: 'Billing',
        billingHint: 'Billing frequency for the subscription.',
        autopay: 'Automatic payment',
        autopayLink: 'Automatic payment link',
        loadingCustomers: 'Loading customers...',
        loadingPackages: 'Loading packages...',
        loadingLines: 'Loading lines...',
        noCustomers: 'No customers available',
        noPackages: 'No packages available',
        noLines: 'No lines available',
        noPlusLines: 'No LionPlus/TitanPlus lines available',
        sections: {
          main: 'Main data',
          mainHelper: 'Customer, package and operational status.',
          billing: 'Billing',
          billingHelper: 'Lines, frequency and commercial amounts.',
          dates: 'Dates',
          datesHelper: 'Start, renewal and lifecycle visibility.',
          automation: 'Automation',
          automationHelper: 'Autopay settings and activation link.'
        }
      },
      actions: {
        expirationDiagnostics: 'Expiration diagnostics'
      },
      headers: {
        provider: 'Provider',
        linePlus: 'Line plus'
      },
      kpi: {
        activeLineExpiredLabel: 'Line risk',
        sharedLabel: 'Shared'
      }
    },
    liontvDashboard: {
      expirationAlert: {
        open: 'Open expiration monitoring',
        stale: 'Stale process',
        jobs: 'Critical expiration jobs are waiting for review.'
      }
    }
  },
  es: {
    actions: {
      actions: 'Acciones',
      close: 'Cerrar',
      copy: 'Copiar',
      saveChanges: 'Guardar cambios',
      search: 'Buscar',
      sendEmail: 'Enviar correo',
      view: 'Ver'
    },
    menu: {
      ecommerceSettings: 'Configuración ecommerce',
      moviesSeriesPosts: 'Posts de Películas y Series'
    },
    common: {
      all: 'Todos',
      back: 'Atrás',
      dateFrom: 'Fecha desde',
      dateTo: 'Fecha hasta',
      disabled: 'Deshabilitada',
      done: 'Listo',
      enabled: 'Habilitada',
      error: 'Error',
      job: 'Job',
      next: 'Siguiente',
      nextAttempt: 'Próximo intento',
      reason: 'Motivo',
      username: 'Usuario',
      view: 'Ver'
    },
    billing: {
      monthly: 'Mensual',
      quarterly: 'Trimestral',
      biannual: 'Semestral',
      annual: 'Anual'
    },
    status: {
      active: 'Activa',
      inactive: 'Inactiva',
      cancelled: 'Cancelada'
    },
    businessPurchases: {
      headers: {
        requester: 'Solicitado por'
      },
      summary: {
        totalLabel: 'Compras',
        totalAmountLabel: 'Monto total',
        pendingLabel: 'Pendientes',
        paidLabel: 'Pagadas',
        pendingCreditRequestsLabel: 'Solicitudes de créditos',
        pendingCreditRequests: 'Pendientes de reseller: {{count}}'
      }
    },
    crm: {
      managedAccount: {
        accountCode: 'Código de cuenta: {{value}}',
        alias: 'Alias: {{value}}',
        allowDistribution: 'Distribución: {{value}}',
        createdBy: 'Creada por: {{value}}',
        displayName: 'Nombre: {{value}}',
        expirationDate: 'Expira: {{value}}',
        lastEmail: 'Último correo: {{value}}',
        notes: 'Notas: {{value}}',
        provider: 'Provider: {{value}}',
        renewalDate: 'Renueva: {{value}}',
        block: {
          identity: {
            title: 'Identidad de la cuenta',
            helper: 'Código interno, alias y provider asignado a esta managed account.'
          },
          status: {
            title: 'Estado y vigencia',
            helper: 'Vencimiento, actividad de correo y permiso de distribución.'
          }
        }
      }
    },
    customers: {
      customerId: 'ID cliente',
      actions: {
        sendWelcome: 'Enviar bienvenida',
        sendingWelcome: 'Enviando bienvenida...'
      },
      form: {
        tone: {
          create: 'Captura datos completos para que ventas, soporte y cobro trabajen alineados.',
          edit: 'Actualiza los datos clave del cliente y confirma los detalles operativos antes de guardar.'
        }
      }
    },
    demos: {
      editTitle: 'Editar demo',
      cards: {
        total: 'Demos'
      },
      delete: {
        title: 'Eliminar demo',
        body: '¿Eliminar la demo con MAC {{mac}}?'
      },
      headers: {
        mac: 'MAC',
        deviceKey: 'Device key'
      },
      form: {
        customer: 'Cliente',
        customerHelper: 'Datos de contacto del dueño de la demo.',
        device: 'Dispositivo',
        deviceHelper: 'Identificador de acceso del dispositivo de prueba.',
        deviceKeyHelper: 'Requerido para 9Xtream/IPTV; opcional para Vivo Player.',
        note: 'Nota',
        stateHelper: 'Control de vigencia, ciclo de vida y notas internas.'
      },
      messages: {
        required: 'Completa celular, MAC, nombre y correo antes de guardar la demo.',
        deviceKeyRequired: 'Device Key es requerido para la aplicación seleccionada.',
        created: 'Demo creada.',
        updated: 'Demo actualizada.',
        deleted: 'Demo eliminada.',
        emailMissing: 'Esta demo no tiene correo.',
        emailSent: 'Correo enviado correctamente.',
        emailError: 'No se pudo enviar el correo.'
      }
    },
    emailCampaigns: {
      title: 'Campañas de Email',
      titleHelper: 'Diseña, previsualiza y lanza campañas con audiencias reutilizables y control de entrega.',
      metrics: {
        totalOnPage: 'Campañas en página',
        drafts: 'Borradores en página',
        sent: 'Enviadas en página',
        failed: 'Fallidas en página'
      },
      filters: {
        search: 'Buscar campañas',
        status: 'Estado',
        template: 'Template',
        from: 'Desde',
        to: 'Hasta'
      },
      headers: {
        name: 'Campaña',
        template: 'Template',
        status: 'Estado',
        sendType: 'Tipo de envío',
        totalRecipients: 'Destinatarios totales',
        sentSuccessCount: 'Enviados',
        sentFailureCount: 'Fallidos',
        createdAt: 'Creada',
        queuedAt: 'Encolada',
        sentAt: 'Finalizada'
      },
      steps: {
        template: 'Template',
        variables: 'Variables',
        audience: 'Audiencia',
        preview: 'Preview y envío'
      },
      dialog: {
        createTitle: 'Crear campaña email',
        editTitle: 'Editar campaña email',
        subtitle: 'Construye una campaña reusable desde un template, resuelve variables manuales, elige la audiencia y luego envíala o prográmala.'
      },
      actions: {
        new: 'Nueva campaña',
        refreshTemplates: 'Actualizar templates',
        refreshPreview: 'Actualizar preview',
        importExternalRecipients: 'Importar leads y demos',
        importingExternalRecipients: 'Importando correos...',
        sendTest: 'Enviar correo de prueba',
        saveDraft: 'Guardar borrador',
        schedule: 'Programar campaña',
        sendNow: 'Encolar campaña',
        queue: 'Encolar ahora',
        view: 'Ver detalle',
        cancelCampaign: 'Cancelar campaña'
      },
      form: {
        name: 'Nombre de campaña',
        template: 'Template',
        templateHint: 'Template seleccionado: {{name}} ({{code}}).',
        sendType: 'Tipo de envío',
        scheduledAt: 'Programar para',
        booleanValue: 'Valor booleano'
      },
      sendType: {
        IMMEDIATE: 'Encolar ahora',
        SCHEDULED: 'Programado'
      },
      customerMode: {
        MIXED: 'Audiencia mixta',
        FILTERED: 'Audiencia filtrada',
        SELECTED: 'Clientes seleccionados'
      },
      status: {
        ALL: 'Todos',
        DRAFT: 'Borrador',
        READY: 'Lista',
        SENDING: 'Enviando',
        SENT: 'Enviada',
        FAILED: 'Fallida',
        CANCELLED: 'Cancelada'
      },
      recipientStatus: {
        ALL: 'Todos',
        PENDING: 'Pendiente',
        SENT: 'Enviado',
        FAILED: 'Fallido',
        SKIPPED: 'Omitido'
      },
      audience: {
        mode: 'Modo de clientes',
        customerStatus: 'Estado del cliente',
        channel: 'Canal',
        search: 'Búsqueda de clientes',
        fromDate: 'Desde fecha',
        toDate: 'Hasta fecha',
        selectCustomers: 'Seleccionar clientes',
        selectedCustomers: '{{count}} seleccionados',
        externalRecipients: 'Destinatarios externos',
        externalHelper: 'Pega correos separados por comas o líneas. También puedes usar el formato Nombre <correo@ejemplo.com>.',
        externalCount: '{{count}} destinatario(s) externos',
        customerPicker: {
          title: 'Seleccionar clientes',
          subtitle: 'Busca clientes con los filtros actuales y elige cuáles quieres incluir en la campaña.',
          selectedCount: '{{count}} cliente(s) seleccionados.'
        }
      },
      customerHeaders: {
        customer: 'Cliente',
        email: 'Correo',
        status: 'Estado',
        channel: 'Canal'
      },
      preview: {
        totalRecipients: 'Destinatarios totales',
        customerRecipients: 'Clientes',
        externalRecipients: 'Externos',
        subject: 'Asunto resuelto',
        html: 'HTML resuelto',
        testEmail: 'Enviar correo de prueba a'
      },
      detail: {
        summary: 'Resumen',
        variables: 'Variables',
        preview: 'Preview',
        recipients: 'Destinatarios',
        recipientSearch: 'Buscar destinatarios',
        recipientStatus: 'Estado de envío'
      },
      variableHeaders: {
        name: 'Variable',
        value: 'Valor'
      },
      recipientHeaders: {
        email: 'Correo',
        fullName: 'Nombre completo',
        type: 'Tipo',
        status: 'Estado',
        sentAt: 'Enviado',
        error: 'Error'
      },
      messages: {
        loadError: 'No se pudieron cargar las campañas email.',
        loadCampaignError: 'No se pudo cargar el detalle de la campaña.',
        loadTemplateError: 'No se pudo cargar el template seleccionado.',
        loadTemplatesError: 'No se pudieron cargar los templates activos.',
        customerSearchError: 'No se pudieron buscar clientes.',
        recipientsLoadError: 'No se pudo cargar el histórico de destinatarios.',
        requiredHeader: 'Nombre de campaña, template y tipo de envío son obligatorios.',
        scheduleRequired: 'Elige una fecha y hora programada.',
        missingManualVariables: 'Completa las variables obligatorias: {{items}}',
        noManualVariables: 'Este template solo usa variables ligadas al destinatario. Puedes continuar a la selección de audiencia.',
        draftCreated: 'Borrador de campaña creado.',
        draftUpdated: 'Borrador de campaña actualizado.',
        saveDraftError: 'No se pudo guardar el borrador de campaña.',
        previewError: 'No se pudo construir el preview de la campaña.',
        previewPending: 'Muévete a este paso o actualiza el preview para resolver el correo final.',
        testEmailRequired: 'Ingresa un correo para prueba.',
        testSent: 'Correo de prueba enviado.',
        testSendError: 'No se pudo enviar el correo de prueba.',
        scheduled: 'Campaña programada correctamente.',
        queued: 'Campaña encolada correctamente.',
        queueError: 'No se pudo encolar la campaña.',
        noCustomers: 'No hay clientes que coincidan con la búsqueda actual.',
        noVariablesUsed: 'Esta campaña no tiene variables manuales.',
        noRecipientsHistory: 'No se encontraron destinatarios con el filtro actual.',
        externalRecipientsImported: '{{count}} destinatario(s) externos importados.',
        externalRecipientsImportedEmpty: 'No se encontraron nuevos destinatarios externos para importar.',
        externalRecipientsImportError: 'No se pudieron importar destinatarios desde potenciales y demos.',
        templatesLoadError: 'No se pudieron cargar los templates activos.',
        empty: 'No se encontraron campañas con los filtros actuales.',
        cancelConfirm: '¿Cancelar la campaña {{name}}?',
        cancelled: 'Campaña cancelada.',
        cancelError: 'No se pudo cancelar la campaña.'
      }
    },
    emailTemplates: {
      title: 'Templates de Email',
      titleHelper: 'Mantén templates reutilizables con placeholders, bindings y preview antes de llegar a una campaña.',
      metrics: {
        total: 'Templates en página',
        active: 'Activos',
        variables: 'Variables en página'
      },
      filters: {
        search: 'Buscar templates',
        category: 'Categoría',
        active: 'Estado'
      },
      headers: {
        name: 'Template',
        category: 'Categoría',
        variables: 'Variables',
        updatedAt: 'Actualizado',
        status: 'Estado'
      },
      status: {
        active: 'Activo',
        inactive: 'Inactivo'
      },
      actions: {
        new: 'Nuevo template',
        importantMatchPreset: 'Preset partido importante',
        loadPreset: 'Cargar preset',
        syncVariables: 'Detectar placeholders',
        addVariable: 'Agregar fila de variable',
        copyCode: 'Copiar código',
        activate: 'Activar',
        deactivate: 'Desactivar'
      },
      dialog: {
        createTitle: 'Crear template email',
        editTitle: 'Editar template email',
        subtitle: 'Administra templates HTML reutilizables y define qué variables se llenarán dinámicamente en las campañas.'
      },
      tabs: {
        general: 'General',
        html: 'HTML',
        variables: 'Variables',
        preview: 'Preview'
      },
      form: {
        code: 'Código',
        codeHelper: 'Identificador único por owner.',
        name: 'Nombre',
        category: 'Categoría',
        active: 'Template activo',
        subjectTemplate: 'Template de asunto',
        placeholderHint: 'Usa placeholders como {{customerName}}.',
        description: 'Descripción',
        htmlHelp: 'Pega el HTML completo y los placeholders del asunto. Luego sincroniza variables para definir labels, tipos y valores por defecto.',
        htmlTemplate: 'Template HTML',
        variable: 'Variable',
        variableOrder: 'Orden',
        variableName: 'Nombre de variable',
        label: 'Label',
        helpText: 'Texto de ayuda',
        inputType: 'Tipo de input',
        valueSource: 'Fuente del valor',
        bindingKey: 'Binding del destinatario',
        defaultValue: 'Valor por defecto',
        required: 'Variable obligatoria'
      },
      preview: {
        note: 'Este preview usa valores por defecto para variables manuales y un contexto de cliente de ejemplo para variables ligadas al destinatario.',
        subject: 'Asunto resuelto',
        html: 'HTML resuelto'
      },
      messages: {
        loadError: 'No se pudieron cargar los templates email.',
        loadOneError: 'No se pudo cargar el detalle del template.',
        required: 'Código, nombre, asunto y HTML son obligatorios.',
        variableRequired: 'Cada variable detectada necesita nombre y label.',
        updated: 'Template actualizado correctamente.',
        created: 'Template creado correctamente.',
        saveError: 'No se pudo guardar el template.',
        activated: 'Template activado.',
        deactivated: 'Template desactivado.',
        statusError: 'No se pudo actualizar el estado del template.',
        deleteConfirm: '¿Eliminar el template {{name}}?',
        deleted: 'Template eliminado correctamente.',
        deleteError: 'No se pudo eliminar el template.',
        codeCopied: 'Código del template copiado.',
        copyError: 'No se pudo copiar el código del template.',
        empty: 'No se encontraron templates con los filtros actuales.',
        presetHelp: 'Empieza desde el preset de partido importante y luego ajusta el copy según tu operación antes de guardar.',
        presetLoaded: 'Preset de partido importante cargado. Revisa las variables y luego guarda.',
        noVariables: 'Todavía no se detectan variables. Usa placeholders en asunto o HTML y luego pulsa Detectar placeholders.'
      }
    },
    headerNotifications: {
      title: 'Alertas y jobs',
      empty: 'No hay alertas críticas en este momento.',
      loadError: 'No se pudieron cargar las alertas del header.',
      partial: 'Mostrando datos parciales mientras el dashboard termina de sincronizar.',
      updatedAt: 'Actualizado {{time}}',
      openTracking: 'Abrir seguimiento',
      labels: {
        alert: 'Alerta',
        customer: 'Cliente',
        open: 'Abrir',
        reviewPending: 'Revisión pendiente',
        appFallback: 'App',
        planFallback: 'Plan',
        lineFallback: 'Línea',
        accountCodeFallback: 'Cuenta'
      },
      types: {
        license: 'Licencia',
        subscription: 'Suscripción',
        line: 'Línea',
        managedAccount: 'Managed account',
        pendingInvoice: 'Factura pendiente',
        paymentCommitment: 'Compromiso de pago',
        subscriptionExpiration: 'Expiraciones'
      },
      reference: {
        invoice: 'Factura #{{id}}',
        commitment: 'Compromiso #{{id}}',
        subscriptionExpirationJobs: 'Jobs críticos de expiración',
        subscriptionExpirationStale: 'Scheduler stale'
      },
      alertDetail: {
        dueToday: 'Vence hoy',
        dueTodayAmount: 'Pendiente {{amount}}',
        subscriptionExpirationJobs: 'Se detectaron jobs en retry, manual o failed.',
        subscriptionExpirationStale: 'El detector o worker no ejecutó su ciclo esperado.'
      },
      severity: {
        critical: 'Crítica',
        high: 'Alta',
        medium: 'Media',
        low: 'Baja',
        info: 'Info'
      }
    },
    headerSearch: {
      dialogTitle: 'Búsqueda global',
      placeholder: 'Busca clientes, suscripciones, facturas o comandos',
      kinds: {
        command: 'Comando'
      },
      sections: {
        quickActions: 'Acciones rápidas',
        recents: 'Búsquedas recientes',
        todayPending: 'Vence hoy'
      },
      labels: {
        result: 'Resultado',
        customerValue: 'Cliente: {{value}}',
        customerById: 'Cliente #{{id}}',
        idValue: 'ID {{id}}',
        licenseFallback: 'Licencia',
        planFallback: 'Plan',
        noProvider: 'Sin provider'
      },
      due: {
        inDays: 'Vence en {{days}}d',
        overdue: 'Vencido {{days}}d',
        today: 'Vence hoy',
        tomorrow: 'Vence mañana'
      },
      reference: {
        invoice: 'Factura #{{id}}',
        commitment: 'Compromiso #{{id}}'
      },
      summary: {
        results: '{{count}} resultados',
        sync: 'Actualizado {{time}}',
        todayAlerts: '{{count}} vencen hoy'
      },
      messages: {
        filtersHelp: 'Usa términos cortos como cliente, factura, suscripción, línea o CRM para moverte más rápido.',
        loadError: 'No se pudieron cargar los datos de búsqueda global.',
        noRecents: 'Todavía no tienes búsquedas recientes.',
        noResults: 'No hay resultados con la consulta actual.',
        noTodayDue: 'No hay elementos urgentes que venzan hoy.',
        partialData: 'Algunos widgets siguen sincronizando. Los resultados podrían ser parciales.'
      }
    },
    vodPosts: {
      title: 'Posts de Películas y Series',
      subtitle: 'Borradores manuales VOD con preview, aprobación y publicación.',
      intro:
        'Construye posts premium VOD desde el último feed activo de películas o series, elige el layout visual y publícalos con el mismo flujo editorial usado en sports automation.',
      loading: 'Cargando consola de publicación VOD...',
      contentTypes: {
        movie: 'Películas',
        series: 'Series'
      },
      layouts: {
        single: 'Single',
        grid: 'Grid',
        hero_stack: 'Hero Stack'
      },
      layoutHints: {
        single: 'Un solo título con portada dominante y CTA premium.',
        grid: 'Un mosaico premium de posters para 2 a 6 títulos seleccionados.',
        hero_stack: 'Un título principal con secundarios apilados.'
      },
      branding: {
        modeGeneric: 'Marca de agua genérica',
        modeReseller: 'Marca de agua reseller',
        resellerLabel: 'Reseller',
        resellerPlaceholder: 'Buscar por username',
        resellerConfigured: 'Teléfono de soporte listo: {{phone}}',
        resellerMissing: 'Falta configurar el teléfono de soporte',
        errors: {
          resellerRequired: 'Selecciona un reseller antes de generar contenido VOD con branding.',
          supportMissing: 'El reseller seleccionado no tiene teléfono de soporte configurado en Support Center.',
          lookup: 'No se pudieron cargar los perfiles de soporte reseller.'
        }
      },
      safeMode: 'SAFE mode',
      safeModeOff: 'SAFE mode desactivado',
      safeModeLocked: 'SAFE mode está activo para este borrador',
      safeModeUnlocked: 'SAFE mode está desactivado para este borrador',
      kpis: {
        catalogItems: 'Títulos del catálogo',
        catalogItemsHelper: 'Títulos disponibles en el último feed activo.',
        drafts: 'Borradores',
        draftsHelper: 'Posts recientes guardados para este tipo de contenido.',
        approved: 'Aprobados',
        approvedHelper: 'Borradores ya validados y listos para publicar.',
        published: 'Publicados',
        publishedHelper: 'Borradores ya enviados al flujo de publicación.'
      },
      composer: {
        title: 'Composer VOD',
        contentType: 'Tipo de contenido',
        layoutMode: 'Modo visual',
        branding: 'Branding',
        selectionCounter: '{{selected}} seleccionados · requerido {{min}}-{{max}}',
        editing: 'Editando borrador #{{id}} · los cambios regeneran la imagen y los captions desde el nuevo snapshot.',
        createHint: 'Selecciona títulos, define el layout y crea un preview premium.'
      },
      catalog: {
        search: 'Buscar título',
        searchPlaceholder: 'Título, año o género',
        category: 'Categoría',
        categoryAll: 'Todas las categorías',
        categoryUncategorized: 'Sin categoría',
        selected: 'Seleccionado',
        posterFallback: 'Poster pendiente',
        feedSnapshot: 'Feed activo #{{id}} · Actualizado {{date}}',
        pageSummary: 'Página {{page}} de {{pages}} · {{count}} visibles',
        selectionPersistence: 'La selección se mantiene entre páginas. Puedes marcar títulos aquí y seguir seleccionando en las páginas siguientes.',
        activeFilters: 'Filtros · {{summary}}',
        activeFilterSearch: 'Búsqueda',
        activeFilterCategory: 'Categoría: {{category}}'
      },
      posts: {
        title: 'Borradores VOD recientes',
        loading: 'Cargando borradores VOD...',
        untitled: 'Borrador VOD',
        selectedItems: 'títulos seleccionados',
        reseller: 'Reseller: {{username}}',
        feed: 'Feed #{{id}}',
        captionPending: 'Genera captions para completar el copy de publicación.',
        updatedAt: 'Actualizado {{date}}'
      },
      previewDialog: {
        title: 'Preview de imagen renderizada',
        loading: 'Cargando imagen renderizada...',
        alt: 'Post VOD generado'
      },
      safePreviewDialog: {
        title: 'SAFE preview',
        loading: 'Cargando SAFE preview...',
        helper: 'Usa esta vista para confirmar el caption sanitizado antes de aprobar o publicar el post VOD.',
        caption: 'Caption sanitizado',
        phone: 'Soporte {{phone}}'
      },
      validation: {
        single: 'Selecciona exactamente 1 título.',
        grid: 'Selecciona entre 2 y 6 títulos.',
        hero_stack: 'Selecciona entre 2 y 5 títulos.'
      },
      status: {
        generated: 'Generado',
        approved: 'Aprobado',
        published: 'Publicado',
        failed: 'Fallido',
        draft: 'Borrador'
      },
      actions: {
        createDraft: 'Crear borrador',
        updateSelection: 'Actualizar selección',
        saving: 'Guardando...',
        cancelEdit: 'Cancelar edición',
        deleteDraft: 'Eliminar borrador',
        deleting: 'Eliminando...',
        previewImage: 'Preview image',
        safePreview: 'Safe preview',
        editSelection: 'Editar selección',
        regenerateImage: 'Regenerate image',
        regeneratingImage: 'Regenerando...',
        regenerateCaptions: 'Regenerate captions',
        regeneratingCaptions: 'Regenerando...',
        approve: 'Aprobar',
        approving: 'Aprobando...',
        publish: 'Publicar',
        publishing: 'Publicando...'
      },
      messages: {
        created: 'El borrador VOD fue creado correctamente.',
        deleted: 'El borrador VOD fue eliminado correctamente.',
        selectionUpdated: 'El borrador VOD fue actualizado con los títulos seleccionados.',
        imageRegenerated: 'La imagen preview fue regenerada correctamente.',
        captionsRegenerated: 'Los captions fueron regenerados correctamente.',
        approved: 'El borrador VOD quedó aprobado.',
        published: 'El borrador VOD fue publicado correctamente.'
      },
      warnings: {
        missingTitles:
          '{{count}} título(s) seleccionados ya no existen en el feed activo. Puedes mantener este borrador para preview/publish o reemplazar la selección para refrescarlo.'
      },
      errors: {
        loadCatalog: 'No se pudo cargar el feed activo del catálogo.',
        loadPosts: 'No se pudieron cargar los borradores VOD existentes.',
        create: 'No se pudo crear el borrador VOD.',
        delete: 'No se pudo eliminar este borrador VOD.',
        updateSelection: 'No se pudieron actualizar los títulos seleccionados de este borrador.',
        previewImage: 'La imagen preview todavía no está disponible.',
        safePreview: 'No se pudo cargar el SAFE preview.',
        regenerateImage: 'No se pudo regenerar la imagen.',
        regenerateCaptions: 'No se pudieron regenerar los captions.',
        approve: 'No se pudo aprobar este borrador VOD.',
        publish: 'No se pudo publicar este borrador VOD.',
        selectionLimit: 'Este layout soporta hasta {{count}} títulos.'
      },
      delete: {
        title: 'Eliminar borrador VOD',
        body: '¿Eliminar "{{title}}"? Esta acción borra el borrador y su imagen preview generada.',
        publishedBlocked: 'Los posts publicados no se pueden eliminar desde este módulo.'
      },
      empty: {
        search: 'No hay títulos que coincidan con la búsqueda actual.',
        filtered: 'No hay títulos que coincidan con los filtros actuales.',
        catalog: 'El feed activo no contiene títulos publicables todavía.',
        posts: 'Todavía no se han creado borradores VOD para este tipo de contenido.'
      }
    },
    licenses: {
      badge: {
        new: 'Nueva',
        edit: 'Editando'
      },
      modal: {
        newTitle: 'Nueva licencia',
        editTitle: 'Editar licencia',
        subtitle: 'Registra el dispositivo, owner y parámetros operativos de la licencia.',
        helper: 'Completa los datos clave y confirma el owner antes de guardar.'
      },
      table: {
        loading: 'Cargando licencias...',
        emptyTitle: 'No se encontraron licencias',
        emptyText: 'Prueba otros filtros o crea una nueva licencia.'
      },
      delete: {
        title: 'Eliminar licencia',
        body: '¿Eliminar la licencia {{name}}? Esta acción no se puede deshacer.'
      },
      form: {
        identity: 'Identidad',
        identityHelper: 'Dispositivo, owner y datos de identificación.',
        customer: 'Cliente',
        customerHelper: 'Cliente ligado a esta licencia.',
        attributes: 'Atributos',
        attributesHelper: 'App, estado, tipo y período.',
        billing: 'Cobro y expiración',
        billingHelper: 'Precio, vigencia y control del ciclo de vida.',
        name: 'Nombre',
        app: 'App',
        status: 'Estado',
        statusHelper: 'Estado operativo actual.',
        type: 'Tipo',
        typeHelper: 'Licencia principal o usada.',
        period: 'Período',
        periodHelper: 'Vigencia de la licencia.',
        price: 'Precio',
        expire: 'Expira',
        select: 'Seleccionar',
        loadingCustomers: 'Cargando clientes...',
        buttons: {
          create: 'Crear',
          save: 'Guardar cambios'
        }
      },
      server: {
        title: 'Cambiar servidor',
        helper: 'Selecciona el servidor destino y revisa el contexto de línea antes de enviar el comando.',
        summaryTitle: 'Contexto de línea seleccionado',
        mac: 'MAC',
        customer: 'Cliente',
        country: 'País (teléfono)',
        subscription: 'Suscripción',
        lineSource: 'Fuente de línea',
        lineSourceMain: 'Línea principal',
        lineSourcePlus: 'Línea plus',
        lineSourceHelper: 'Define si el cambio debe usar la línea principal o la línea plus.',
        lineSourceMainOnly: 'Esta suscripción solo tiene disponible la línea principal.',
        effectiveLine: 'Línea efectiva',
        provider: 'Provider',
        noProvider: 'No disponible',
        server: 'Servidor',
        playlist: 'Nombre de playlist',
        plusMetadataRequired: 'La metadata de línea plus está incompleta. Revisa la suscripción seleccionada antes de continuar.',
        plusLineMissing: 'No se pudo resolver la línea plus con la metadata actual.',
        submit: 'Cambiar servidor'
      },
      transfer: {
        title: 'Transferir licencia',
        license: 'Licencia',
        newCustomer: 'Nuevo cliente',
        helperCustomer: 'Elige el nuevo owner de la licencia.',
        loadingCustomers: 'Cargando clientes...',
        subscription: 'Suscripción destino',
        subscriptionSelectCustomer: 'Selecciona primero el nuevo cliente.',
        subscriptionHelper: 'Elige la suscripción que será dueña de esta licencia administrada.',
        subscriptionEmpty: 'Este cliente no tiene suscripciones disponibles.',
        type: 'Tipo',
        typeHelper: 'Tipo que tendrá la licencia en el nuevo cliente.',
        submit: 'Transferir',
        sending: 'Transfiriendo...',
        done: 'Licencia transferida.'
      },
      history: {
        title: 'Historial de licencia',
        subtitle: 'Revisa cambios de cliente, cambios de tipo y trazabilidad operativa.',
        license: 'Licencia',
        currentCustomer: 'Cliente actual',
        currentType: 'Tipo actual',
        total: 'Movimientos totales',
        movements: 'Movimientos',
        helper: 'Los cambios más recientes aparecen primero.',
        empty: 'No hay movimientos registrados.',
        type: 'Tipo',
        tip: 'Si la API devuelve nombres de clientes, la línea de tiempo los mostrará en lugar de IDs locales.'
      }
    },
    lines: {
      actions: {
        new: 'Nueva línea',
        edit: 'Editar línea'
      },
      delete: {
        title: 'Eliminar línea',
        body: '¿Eliminar la línea {{id}}?',
        done: 'Línea eliminada.'
      },
      summary: {
        totalLabel: 'Líneas totales',
        activeLabel: 'Activas',
        expiredLabel: 'Expiradas'
      },
      headers: {
        provider: 'Provider',
        country: 'País'
      },
      filters: {
        provider: 'Provider'
      },
      errors: {
        load: 'No se pudieron cargar las líneas.',
        save: 'No se pudo guardar la línea.',
        delete: 'No se pudo eliminar la línea.'
      },
      detail: {
        copy: 'Copiar',
        copied: 'Credenciales copiadas.',
        copyFallback: 'No se pudo copiar automáticamente. Inténtalo manualmente.',
        noPackage: 'Sin package',
        noStream: 'Sin stream reciente'
      },
      form: {
        id: 'ID de línea',
        username: 'Usuario',
        password: 'Contraseña',
        provider: 'Provider',
        country: 'País',
        packageId: 'Package',
        packageHelper: 'Elige el paquete comercial y las conexiones disponibles.',
        maxConnections: 'Conexiones máximas',
        expDate: 'Fecha de expiración',
        notes: 'Notas reseller',
        access: 'Acceso',
        accessHelper: 'Credenciales operativas y estado actual.',
        meta: 'Fechas y notas',
        metaHelper: 'Fecha de expiración y notas internas de operación.',
        helper: 'Configura el acceso y el paquete comercial de la línea.',
        required: 'Completa id de línea, usuario y contraseña.',
        saved: 'Línea guardada.'
      }
    },
    m3uBackup: {
      title: 'Link de Respaldo M3U',
      subtitle: 'Crea un alias controlado para entregar playlists con resiliencia sin exponer las credenciales originales de la línea.',
      helper: 'El alias es lo que ve el cliente. Internamente el sistema sigue usando la línea real y el template del provider.',
      pageTitle: 'Aliases de respaldo M3U',
      pageHelper: 'Controla links para player, links de descarga directa y rutas de fallback desde un solo módulo operativo.'
    },
    paymentCommitments: {
      title: 'Compromisos de Pago',
      filters: {
        title: 'Control de deuda',
        all: 'Todos',
        debtorsOnly: 'Solo deudores',
        search: 'Buscar por cliente, estado, nota o ID',
        status: 'Estado'
      },
      dialog: {
        createTitle: 'Crear compromiso de pago',
        editTitle: 'Editar compromiso de pago',
        subtitle: 'Da seguimiento a fechas prometidas, deuda, pagos parciales y riesgo comercial en un solo registro.'
      },
      kpi: {
        totalLabel: 'Compromisos',
        total: '{{count}} compromisos activos en la vista actual',
        debtorsLabel: 'Deudores',
        debtors: '{{count}} clientes todavía deben dinero',
        pendingAmountLabel: 'Pendiente',
        pendingAmount: '{{amount}} sigue pendiente de cobro',
        overdueLabel: 'Vencidos',
        overdue: '{{count}} compromisos ya superaron la fecha prometida'
      },
      form: {
        main: {
          title: 'Compromiso comercial',
          helper: 'Cliente, fecha prometida y monto total comprometido.'
        },
        tracking: {
          title: 'Seguimiento de cobro',
          helper: 'Pago parcial, estado proyectado y notas operativas.'
        }
      },
      risk: {
        onTime: 'Al día',
        overdue: 'Vencido'
      },
      table: {
        emptyTitle: 'No se encontraron compromisos de pago',
        emptyText: 'Prueba otra combinación de filtros o crea el primer compromiso para este cliente.'
      },
      delete: {
        title: 'Eliminar compromiso de pago',
        body: '¿Eliminar el compromiso de {{name}}?'
      }
    },
    potentialCustomers: {
      title: 'Prospectos Comerciales',
      subtitle: 'Captura, clasifica y activa interesados sin mezclarlos con clientes activos.',
      search: 'Buscar prospectos',
      searchPlaceholder: 'Buscar por nombre, correo, teléfono o país',
      selectCountry: 'Seleccionar país',
      empty: 'Todavía no hay prospectos registrados.',
      emailDefault: 'Si lo dejas vacío, el sistema guardará nomail@gmail.com como respaldo.',
      whatsappMessage:
        'Hola, te contactamos de Lion TV Premium para ayudarte a activar tu acceso. Cuéntanos qué tipo de servicio necesitas y te guiamos.',
      kpi: {
        total: 'Prospectos totales',
        new: 'Nuevos',
        contacted: 'Contactados',
        converted: 'Convertidos'
      },
      headers: {
        actions: 'Acciones',
        name: 'Nombre',
        email: 'Correo',
        phone: 'Actividad telefónica',
        status: 'Estado',
        category: 'Pipeline por categoría',
        country: 'País',
        createdAt: 'Creado'
      },
      filters: {
        status: 'Estado',
        category: 'Categoría',
        groupName: 'Grupo por nombre'
      },
      actions: {
        new: 'Nuevo prospecto',
        edit: 'Editar prospecto',
        markContacted: 'Marcar como contactado',
        importWhatsappCsv: 'Importar CSV de WhatsApp',
        exportWhatsappCsv: 'Exportar CSV de WhatsApp',
        sendPaymentFailedEmail: 'Enviar correo de pago fallido',
        sendAbandonedCartEmail: 'Enviar correo de carrito abandonado'
      },
      form: {
        identity: 'Identidad',
        identityHelper: 'Datos principales de contacto para esta oportunidad.',
        classification: 'Clasificación',
        classificationHelper: 'Categoría, etapa comercial y siguiente paso de venta.'
      },
      import: {
        title: 'Importar CSV de WhatsApp',
        subtitle: 'Sube un archivo phone,group y crea prospectos solo para el owner autenticado.',
        helper: 'Los teléfonos ya existentes para el mismo usuario se omiten automáticamente. Cuando es posible, la categoría se infiere del nombre del grupo.',
        defaults: 'Defaults de importación',
        defaultCountry: 'País por defecto',
        defaultCategory: 'Categoría por defecto',
        fileName: 'Archivo seleccionado',
        rowsDetected: 'Filas detectadas',
        groupsDetected: 'Grupos detectados',
        preview: 'Preview de grupos',
        noGroups: 'No se detectaron grupos en el archivo.',
        fallbackName: 'Lead de WhatsApp',
        changeFile: 'Elegir otro archivo',
        confirm: 'Importar ahora',
        importing: 'Importando...'
      },
      export: {
        byName: 'Exportar agrupado por nombre',
        byCategory: 'Exportar agrupado por categoría',
        fallbackName: 'Prospecto',
        fileSuffixName: 'por-nombre',
        fileSuffixCategory: 'por-categoria'
      },
      categories: {
        GENERAL: 'General',
        IPTV: 'IPTV',
        SPORTS_BAR: 'Bar deportivo',
        BAR_RESTAURANT: 'Bar y restaurante',
        RESTAURANT: 'Restaurante',
        CAFE: 'Cafetería',
        BARBERSHOP: 'Barbería',
        BEAUTY_SALON: 'Salón de belleza',
        HOTEL: 'Hotel',
        MOTEL: 'Motel',
        HOSTEL: 'Hostal',
        GYM: 'Gimnasio',
        CLINIC_WAITING_ROOM: 'Sala de espera clínica',
        DENTAL_CLINIC: 'Clínica dental',
        AUTO_WORKSHOP: 'Taller automotriz',
        CAR_DEALERSHIP: 'Agencia de autos',
        SUPERMARKET: 'Supermercado',
        CONVENIENCE_STORE: 'Tienda de conveniencia',
        OFFICE: 'Oficina',
        CALL_CENTER: 'Call center',
        EVENT_HALL: 'Salón de eventos',
        BILLIARD_CLUB: 'Billar',
        NIGHTCLUB: 'Discoteca',
        SOCIAL_MEDIA: 'Redes sociales',
        REFERRAL: 'Referido',
        WEB: 'Web',
        OTHER: 'Otro'
      },
      status: {
        NEW: 'Nuevo',
        CONTACTED: 'Contactado',
        NEGOTIATION: 'Negociación',
        CONVERTED: 'Convertido',
        LOST: 'Perdido'
      },
      messages: {
        requiredName: 'Ingresa el nombre del prospecto antes de guardar.',
        loadError: 'No se pudieron cargar los prospectos.',
        saveError: 'No se pudo guardar el prospecto.',
        deleteError: 'No se pudo eliminar el prospecto.',
        deleted: 'Prospecto eliminado.',
        created: 'Prospecto creado.',
        updated: 'Prospecto actualizado.',
        alreadyContacted: 'Este prospecto ya estaba marcado como contactado.',
        markContactedSuccess: 'Prospecto marcado como contactado.',
        markContactedError: 'No se pudo actualizar el estado de contacto.',
        invalidWhatsAppPhone: 'Este prospecto no tiene un número válido de WhatsApp.',
        importError: 'No se pudo importar el CSV de WhatsApp.',
        importInvalidFile: 'El archivo seleccionado no contiene filas válidas de WhatsApp.',
        importParsingError: 'No se pudo parsear el archivo CSV. Revisa el formato e inténtalo de nuevo.',
        importSuccess: 'Importación finalizada. Insertados {{inserted}}, leads existentes {{skipped}}, clientes omitidos {{skippedCustomers}}, inválidos {{invalid}}.',
        exportEmpty: 'No hay registros para exportar con los filtros actuales.',
        exportNoPhones: 'Los registros filtrados no tienen teléfonos válidos para exportar o ya pertenecen a clientes registrados.',
        exportError: 'No se pudo exportar el CSV de WhatsApp.',
        exportSuccess: 'CSV exportado con {{count}} registros.',
        groupLoadError: 'No se pudieron cargar los grupos por nombre.',
        missingRealEmail: 'Este prospecto no tiene un correo utilizable.'
      },
      deleteTitle: 'Eliminar prospecto',
      deleteBody: '¿Eliminar a {{name}}?'
    },
    profileMenu: {
      greeting: 'Hola,',
      userFallback: 'Usuario',
      roleFallback: 'Sin rol asignado',
      searchPlaceholder: 'Buscar ajustes del perfil',
      changeLanguage: 'Idioma',
      colorTheme: 'Modo visual',
      changePassword: 'Cambiar contraseña',
      accountSettings: 'Ajustes de cuenta',
      logout: 'Cerrar sesión',
      current: 'Actual',
      viewMode: {
        title: 'Modo de trabajo',
        subtitle: 'Cambia entre la vista interna de admin y la consola comercial reseller.',
        admin: 'Modo admin',
        reseller: 'Modo reseller'
      },
      messages: {
        fillAllFields: 'Completa todos los campos de contraseña.',
        passwordMismatch: 'Las nuevas contraseñas no coinciden.',
        passwordUpdated: 'Contraseña actualizada correctamente.',
        passwordUpdateError: 'No se pudo actualizar la contraseña.',
        logoutSuccess: 'Sesión cerrada correctamente.',
        viewModeUpdated: 'Vista cambiada a {{mode}}.'
      },
      passwordDialog: {
        title: 'Cambiar contraseña',
        subtitle: 'Actualiza tus credenciales sin salir del workspace actual.',
        tip: 'Usa una contraseña fuerte y distinta a tu correo o a las credenciales de panel.',
        currentPassword: 'Contraseña actual',
        newPassword: 'Nueva contraseña',
        confirmPassword: 'Confirmar contraseña',
        newPasswordHelper: 'Usa al menos 8 caracteres mezclando letras, números y símbolos.'
      },
      upgradeCard: {
        title: 'Mantén seguro tu centro de control',
        subtitleLine1: 'Revisa idioma, tema y contraseña desde un solo menú de perfil.',
        subtitleLine2: 'Pequeños ajustes operativos hacen más rápido a todo el equipo.',
        action: 'Revisar ajustes'
      }
    },
    resellerSupport: {
      loading: 'Cargando configuración de soporte...',
      messages: {
        saved: 'El WhatsApp reseller quedó guardado. Las notificaciones por email ahora usarán este contacto para tus clientes.'
      },
      errors: {
        load: 'No se pudo cargar el perfil de soporte.',
        save: 'No se pudo guardar el perfil de soporte.',
        invalidPhone: 'Ingresa un WhatsApp válido de 8 a 15 dígitos.'
      },
      profile: {
        configured: 'Configurado',
        notConfigured: 'Usando fallback global',
        activeNotice: 'Los correos transaccionales y las campañas email ya podrán dirigir al cliente a tu propio WhatsApp.',
        fallbackNotice: 'Todavía no has configurado tu WhatsApp reseller. Mientras tanto, los correos seguirán apuntando al número global del sistema.',
        phoneLabel: 'Número de WhatsApp',
        phoneHelper: 'Solo importa el número. Puedes escribirlo con espacios, + o guiones; el sistema guardará solo dígitos.',
        save: 'Guardar WhatsApp',
        testLink: 'Probar enlace',
        previewTitle: 'Preview del enlace',
        previewFallback: 'Se usará el contacto global',
        usageTitle: 'Dónde se usará este número',
        usageDescription: 'Este WhatsApp se vuelve la referencia comercial cuando el correo fue generado por tu cuenta reseller. Admin conserva el flujo actual con el número global.',
        usage: {
          notifications: 'Correos operativos: bienvenida, renovación, expiración, factura y puntos.',
          campaigns: 'Campañas email y templates con botón de soporte por WhatsApp.',
          preview: 'Previews de templates y envíos de prueba desde Email Templates / Campaigns.'
        }
      },
      steps: {
        onboarding: {
          title: 'Onboarding privado',
          description: 'La plataforma crea manualmente la cuenta reseller, asigna permisos, carga saldo inicial y entrega el acceso.'
        },
        billing: {
          title: 'Cobro manual',
          description: 'En fase 1 el cobro sigue fuera de la plataforma. Usa invoices y referencias internas para dejar trazabilidad.'
        },
        wallet: {
          title: 'Acreditación de créditos',
          description: 'Después de confirmar el pago, admin acredita el wallet manualmente. El ledger queda como fuente de verdad del movimiento.'
        },
        support: {
          title: 'Ruta de escalamiento',
          description: 'Si una activación necesita corrección, documenta invoice, cliente y motivo. Luego escálalo con soporte para el ajuste comercial.'
        }
      }
    },
    resellerWallet: {
      loading: 'Cargando wallet...',
      lowBalance: 'Tu saldo está por debajo del umbral recomendado. Solicita más créditos antes de procesar más activaciones o renovaciones.',
      errors: {
        load: 'No se pudo cargar el wallet de créditos.',
        request: 'No se pudo crear la solicitud de créditos.',
        adjust: 'No se pudo aplicar el ajuste al wallet.'
      },
      hero: {
        balanceLabel: 'Saldo disponible',
        balanceHelper: 'Créditos listos para ventas nuevas y renovaciones reales.',
        balanceHealthy: 'Saldo saludable',
        balanceLow: 'Recarga recomendada'
      },
      cards: {
        available: 'Saldo disponible',
        availableHelper: 'Listo para consumirse en operaciones comerciales.',
        credited: 'Créditos acreditados',
        creditedHelper: 'Total histórico de recargas manuales.',
        consumed: 'Créditos consumidos',
        consumedHelper: 'Créditos ya usados por operaciones cobrables.',
        pendingRequests: 'Solicitudes pendientes',
        pendingRequestsHelper: 'Recargas ya enviadas a administración.'
      },
      actions: {
        manualTopUp: 'Ajuste admin',
        apply: 'Aplicar ajuste'
      },
      buy: {
        credits: 'Créditos solicitados',
        notes: 'Nota opcional',
        notesPlaceholder: 'Ejemplo: necesito créditos antes de la ola de renovaciones del día 2',
        helper: 'No necesitas escribir IDs ni referencias internas. La plataforma genera la solicitud y administración la recibe como compra pendiente de créditos.',
        action: 'Enviar solicitud',
        sending: 'Enviando...'
      },
      dialog: {
        title: 'Ajuste manual de créditos',
        helper: 'Este formulario es solo para operación interna. Usa valores positivos para recargas y negativos para descuentos.',
        creditsDelta: 'Créditos',
        sourceType: 'Origen',
        sourceId: 'ID de referencia',
        reason: 'Motivo'
      },
      ledger: {
        title: 'Historial de movimientos',
        subtitle: 'Consulta recargas acreditadas y consumos históricos del wallet.',
        empty: 'Todavía no hay movimientos registrados.',
        headers: {
          date: 'Fecha',
          type: 'Tipo',
          delta: 'Delta',
          balance: 'Saldo',
          reason: 'Motivo'
        }
      },
      requests: {
        title: 'Últimas solicitudes',
        subtitle: 'Da seguimiento al estado de tus recargas recientes mientras administración las procesa.',
        empty: 'Todavía no has enviado solicitudes de créditos.',
        fallback: 'Solicitud de créditos',
        noNotes: 'Sin notas adicionales en esta solicitud.'
      },
      messages: {
        invalidDelta: 'Ingresa un ajuste distinto de cero.',
        invalidRequestCredits: 'Ingresa una cantidad válida de créditos.',
        adjusted: 'Wallet actualizado correctamente.',
        requestCreated: 'La solicitud de créditos fue enviada a administración. Te avisarán cuando la recarga quede acreditada.'
      }
    },
    subscriptionExpiration: {
      title: 'Monitoreo de expiración de suscripciones',
      subtitle: 'Panel operativo para entender por qué una suscripción no expiró, no removió playlists o todavía requiere intervención manual.',
      loading: 'Cargando monitoreo de expiraciones...',
      loadingJobs: 'Cargando jobs críticos...',
      loadingDetail: 'Cargando detalle del job...',
      staleBanner:
        'El scheduler está stale. Revisa los ciclos del detector y worker; este proceso es crítico para expirar suscripciones y remover playlists.',
      table: {
        title: 'Cola de jobs críticos'
      },
      states: {
        empty: 'No hay jobs críticos con los filtros actuales.',
        noDetail: 'Selecciona un job para revisar la línea de tiempo y el snapshot operativo.'
      },
      metrics: {
        attention: 'Jobs de atención',
        attentionHelper: 'Fallidos y pendientes de revisión manual.',
        blockers: 'Bloqueos',
        blockersHelper: 'Credenciales faltantes y providers no soportados.',
        noLicenses: 'Sin licencias',
        noLicensesHelper: 'Eventos auditados sin licencias ligadas.',
        retry: 'Cola de retry',
        retryHelper: 'Jobs listos para otro intento.'
      },
      cards: {
        detector: 'Detector',
        worker: 'Worker'
      },
      actions: {
        runDetector: 'Ejecutar detector',
        runWorker: 'Ejecutar worker',
        detectorSuccess: 'Detector ejecutado correctamente.',
        workerSuccess: 'Worker ejecutado correctamente.',
        markReviewed: 'Marcar revisada',
        markReviewedSuccess: 'Alerta marcada como revisada.',
        retry: 'Reintentar',
        retrySuccess: 'Job reintentado correctamente.',
        openSubscription: 'Abrir suscripción',
        enqueueSubscription: 'Reencolar suscripción',
        enqueueSuccess: 'Suscripción reencolada correctamente.'
      },
      drawer: {
        title: 'Diagnóstico del job',
        summary: 'Snapshot de la suscripción',
        timeline: 'Timeline de auditoría',
        licenses: 'Licencias afectadas',
        noAudit: 'No hay auditoría registrada para este job.',
        noLicenses: 'No hay licencias ligadas a esta suscripción.'
      },
      errors: {
        loadOverview: 'No se pudo cargar el overview.',
        loadJobs: 'No se pudieron cargar los jobs.',
        loadDetail: 'No se pudo cargar el detalle del job.',
        actionFailed: 'No se pudo completar la acción.',
        subscriptionRequired: 'Indica un ID de suscripción para reencolar.'
      }
    },
    subscriptions: {
      badge: {
        new: 'Nueva',
        edit: 'Editando'
      },
      delete: {
        title: 'Eliminar suscripción',
        message: 'Eliminar suscripción',
        warning: 'Esta acción no se puede deshacer.',
        confirm: 'Eliminar',
        deleting: 'Eliminando...'
      },
      filters: {
        yesterday: 'Venció ayer',
        today: 'Vence hoy',
        tomorrow: 'Vence mañana',
        sortRenewal: 'Orden de renovación',
        asc: 'Más cercanas',
        desc: 'Más lejanas'
      },
      fields: {
        subscriptionId: 'ID suscripción'
      },
      form: {
        subtitle: 'Completa cliente, package y detalles de cobro.',
        helperTone: 'Revisa los campos clave antes de guardar.',
        customer: 'Cliente',
        customerHint: 'Elige el cliente dueño de esta suscripción.',
        package: 'Package',
        packagesHint: 'Solo packages comerciales. Los DEMO quedan fuera de este flujo.',
        line: 'Línea',
        linesHint: 'La lista muestra el usuario operativo de cada línea.',
        linePlus: 'Línea plus',
        linesPlusHint: 'Aquí se muestran líneas LionPlus y TitanPlus.',
        status: 'Estado',
        statusPlaceholder: 'Estado',
        start: 'Inicio',
        renewal: 'Renovación',
        amount: 'Monto',
        discount: 'Descuento',
        billing: 'Billing',
        billingHint: 'Frecuencia de cobro de la suscripción.',
        autopay: 'Pago automático',
        autopayLink: 'Link de pago automático',
        loadingCustomers: 'Cargando clientes...',
        loadingPackages: 'Cargando packages...',
        loadingLines: 'Cargando líneas...',
        noCustomers: 'No hay clientes disponibles',
        noPackages: 'No hay packages disponibles',
        noLines: 'No hay líneas disponibles',
        noPlusLines: 'No hay líneas LionPlus/TitanPlus disponibles',
        sections: {
          main: 'Datos principales',
          mainHelper: 'Cliente, package y estado operativo.',
          billing: 'Cobro',
          billingHelper: 'Líneas, frecuencia y montos comerciales.',
          dates: 'Fechas',
          datesHelper: 'Inicio, renovación y visibilidad del ciclo de vida.',
          automation: 'Automatización',
          automationHelper: 'Autopay y link de activación.'
        }
      },
      actions: {
        expirationDiagnostics: 'Diagnóstico de expiración'
      },
      headers: {
        provider: 'Provider',
        linePlus: 'Línea plus'
      },
      kpi: {
        activeLineExpiredLabel: 'Riesgo de línea',
        sharedLabel: 'Compartidas'
      }
    },
    liontvDashboard: {
      expirationAlert: {
        open: 'Abrir monitoreo de expiración',
        stale: 'Proceso stale',
        jobs: 'Hay jobs críticos de expiración esperando revisión.'
      }
    }
  }
};
