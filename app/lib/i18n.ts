export type AppLanguage = "en" | "el";

export const DEFAULT_LANGUAGE: AppLanguage = "en";

export const dashboardCopy = {
  en: {
    workspace: "Workspace",
    dashboardOverview: "Dashboard Overview",
    searchPlaceholder: "Search anything...",
    inviteTeam: "Invite Team",
    openNavigation: "Open navigation menu",

    brandSubtitle: "Workspace platform",
    currentWorkspace: "Current workspace",
    workspaceTitle: "Workspace",
    workspaceDescription:
      "Manage clients, projects, tasks and billing in one place.",
    mainMenu: "Main Menu",

    nav: {
      overview: "Overview",
      clients: "Clients",
      projects: "Projects",
      tasks: "Tasks",
      team: "Team",
      billing: "Billing",
      settings: "Settings",
    },

    upgradeTitle: "Need more control?",
    upgradeDescription:
      "Upgrade for deeper analytics, permissions and advanced billing visibility.",
    upgradeButton: "Upgrade Plan",

    languageLabel: "Switch language",
    languageShort: "EL",

    homePage: {
      badge: "Live Product",
      titleStart: "Run your workspace like a real",
      titleHighlight: "operations system",
      description:
        "OrbitOps is the control layer for modern teams — manage clients, projects, tasks, billing, permissions and workspace switching from one clean command center.",
      openDashboard: "Open Dashboard",

      featurePills: [
        "Multi-workspace control",
        "Role-based access",
        "Project and task flow",
        "Billing visibility",
      ],

      stats: {
        activeWorkspaces: "Active workspaces",
        operationalClarity: "Operational clarity",
        realtime: "Realtime",
        projectTracking: "Project tracking",
        smart: "Smart",
        billingOversight: "Billing oversight",
        secure: "Secure",
      },

      preview: {
        subtitle: "Multi-tenant workspace flow",
        live: "Live",
        workspaceSignal: "Workspace Signal",
        premiumVisibility: "Premium operational visibility",
        stable: "Stable",
        teamAccess: "Team Access",
        workspaceSwitch: "Workspace Switch",
        seamless: "Seamless",

        cards: [
          {
            label: "Workspace Signal",
            title: "Healthy",
            meta: "Delivery, finance and team flow aligned",
          },
          {
            label: "Open Tasks",
            title: "24",
            meta: "Live task pressure monitored across teams",
          },
          {
            label: "Team Access",
            title: "Role-based",
            meta: "Owners, admins and members managed cleanly",
          },
        ],
      },

      why: {
        eyebrow: "Why OrbitOps",
        title: "Less clutter. More control.",
        description:
          "Designed like a real product, not just another admin mockup. Clean, scalable and ready to showcase.",
      },

      liveFeed: [
        "Workspace switched successfully",
        "2 team invites accepted",
        "Billing synced",
        "Project health updated",
        "Live operational signal active",
      ],
    },

    loginPage: {
      brandSubtitle: "Workspace platform",
      eyebrow: "Modern SaaS Operations",
      heroTitle: "Run clients, projects and billing in one place.",
      heroDescription:
        "OrbitOps helps teams manage delivery, workspace operations, subscriptions and team access with a clean product-first experience.",

      deliveryLabel: "Delivery",
      deliveryTitle: "Projects",
      deliveryDescription: "Track progress and linked clients.",

      controlLabel: "Control",
      controlTitle: "Billing",
      controlDescription: "Plans, invoices and usage visibility.",

      productAccess: "Product Access",
      productAccessDescription:
        "Sign in with your GitHub account to access your OrbitOps workspace securely.",

      welcomeBack: "Welcome back",
      signIn: "Sign in",
      signInDescription:
        "Access your workspace dashboard securely and continue managing operations from one place.",

      signInFailed: "Sign-in failed:",
      accountNotLinked: "Email already in use with another provider.",
      githubError: "Something went wrong with GitHub.",

      continueWithGithub: "Continue with GitHub",

      secureAccess: "Secure access",
      secureAccessDescription:
        "Authentication is handled through your GitHub account for a faster and safer sign-in flow.",

      languageLabel: "Switch language",
    },

    overview: {
      operationsCenter: "Operations center",
      heroDescription:
        "Centralize delivery, client relationships, billing oversight and day-to-day execution across your active workspace.",
      workspace: "Workspace",
      workload: "Workload",
      createProject: "Create Project",
      inviteTeam: "Invite Team",

      healthy: "Healthy",
      needsAttention: "Needs Attention",
      heavy: "Heavy",
      moderate: "Moderate",
      stable: "Stable",

      clients: "Clients",
      projects: "Projects",
      openTasks: "Open Tasks",
      invoices: "Invoices",
      active: "active",
      completed: "completed",
      billed: "billed",

      highlights: "Highlights",
      workspaceSignal: "Workspace Signal",
      live: "Live",
      highPriorityTasks: "High priority tasks",
      pendingInvoices: "Pending invoices",
      seatsUsed: "Seats used",
      projectsUsage: "Projects usage",
      stableMessage:
        "Operations are stable. Delivery, task load and finance are under control.",

      analytics: "Analytics",
      weeklyOverview: "Weekly Overview",
      details: "Details ↗",
      clientsActivity: "Clients activity",
      liveAccounts: "live accounts",
      taskPressure: "Task pressure",
      activeTasks: "active tasks",
      billingExposure: "Billing exposure",
      total: "total",

      performance: "Performance",
      executionSnapshot: "Execution Snapshot",
      liveData: "Live data",
      activeClients: "Active Clients",
      completedProjects: "Completed Projects",
      completedTasks: "Completed Tasks",

      trend: "Trend",
      executionMomentum: "Execution Momentum",

      projectStatusDistribution: "Status Distribution",
      planning: "Planning",
      inProgress: "In Progress",
      inReview: "In Review",

      tasks: "Tasks",
      priorityLoad: "Priority Load",
      highPriority: "High Priority",
      mediumPriority: "Medium Priority",
      lowPriority: "Low Priority",
      totalTasks: "Total Tasks",

      finance: "Finance",
      billingActivity: "Billing Activity",
      noRecentInvoiceActivity: "No recent invoice activity.",

      subscription: "Subscription",
      planUsage: "Plan Usage",
      currentPlan: "Current Plan",
      seatsUsage: "Seats Usage",
      paidInvoices: "Paid Invoices",
      noBillingProfile: "No billing profile found for this workspace.",

      delivery: "Delivery",
      recentProjects: "Recent Projects",
      viewAll: "View All",
      noRecentProjects: "No recent projects yet.",

      summary: "Summary",
      revenueSnapshot: "Revenue Snapshot",
      totalBilled: "Total billed",
      completionRate: "Completion rate",
      taskClosure: "Task closure",
      paidInvoiceRate: "Paid invoice rate",

      weekdays: {
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
        sun: "Sun",
      },
    },

    clients: {
      eyebrow: "Workspace",
      title: "Clients",
      description:
        "Manage relationships, filter account status and keep your customer pipeline organized.",
      addClient: "Add Client",

      totalClients: "Total Clients",
      activeAccounts: "Active Accounts",
      pendingInactive: "Pending / Inactive",

      createClient: "Create Client",
      createClientButton: "Create Client",
      addNewClientAccount: "Add a new client account",

      clientName: "Client name",
      company: "Company",
      email: "Email",
      status: "Status",

      active: "Active",
      pending: "Pending",
      inactive: "Inactive",

      currentWorkspace: "Current workspace",
      export: "Export",

      searchPlaceholder: "Search by client, company or email...",
      allStatuses: "All Statuses",
      apply: "Apply",
      reset: "Reset",

      client: "Client",
      actions: "Actions",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",

      noClientsFound: "No clients found",
      noClientsDescription:
        "Try adjusting your search or status filters to see more results.",
    },

    projects: {
      eyebrow: "Workspace",
      title: "Projects",
      description:
        "Track delivery, monitor progress and manage active work across all linked clients.",
      newProject: "New Project",

      totalProjects: "Total Projects",
      inProgress: "In Progress",
      planningCompleted: "Planning / Completed",

      createProject: "Create Project",
      addNewDeliveryStream: "Add a new delivery stream",

      projectName: "Project name",
      budget: "Budget",
      budgetPlaceholder: "Budget (e.g. €5,000)",
      dueDate: "Due date",
      team: "Team",
      teamPlaceholder: "Team (e.g. 3 members)",
      projectDescription: "Project description",
      progress: "Progress",
      progressPlaceholder: "Progress %",
      client: "Client",

      planning: "Planning",
      inReview: "In Review",
      completed: "Completed",

      noClientSelected: "No client selected",
      noClientLinked: "No client linked",

      currentWorkspace: "Current workspace",
      export: "Export",

      searchPlaceholder: "Search by project, client, budget or team...",
      allStatuses: "All Statuses",
      apply: "Apply",
      reset: "Reset",

      viewProject: "View Project",
      edit: "Edit",
      delete: "Delete",
      saveProject: "Save Project",
      cancel: "Cancel",

      noProjectsFound: "No projects found",
      noProjectsDescription:
        "Change your filters or create a new project to populate this space.",
    },

    tasksPage: {
      eyebrow: "Workspace",
      title: "Tasks",
      description:
        "Track daily execution, manage deadlines and keep priority work under control.",
      newTask: "New Task",

      totalTasks: "Total Tasks",
      completed: "Completed",
      highPriority: "High Priority",

      createTask: "Create Task",
      addNewTaskItem: "Add a new task item",

      taskTitle: "Task title",
      dueDate: "Due date",
      priority: "Priority",
      project: "Project",

      high: "High",
      medium: "Medium",
      low: "Low",

      noProjectSelected: "No project selected",
      noProjectLinked: "No project linked",

      currentWorkspace: "Current workspace",

      searchPlaceholder: "Search tasks...",
      all: "All",
      active: "Active",
      allPriorities: "All Priorities",
      allProjects: "All Projects",
      noProjectLinkedFilter: "No Project Linked",
      resetFilters: "Reset Filters",

      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",

      due: "Due",
      projectLabel: "Project",

      noTasksFound: "No tasks found",
      noTasksDescription:
        "Try changing your search, project filter or priority selection.",
    },

    teamPage: {
      eyebrow: "Workspace",
      title: "Team",
      description:
        "Manage workspace access, member roles, pending invites and collaboration permissions.",
      inviteMember: "Invite Member",

      activeMembers: "Active Members",
      currentlyActive: "Currently active",
      pendingInvites: "Pending Invites",
      awaitingAcceptance: "Awaiting acceptance",
      owners: "Owners",
      workspaceControl: "Workspace control",
      admins: "Admins",
      operationalAccess: "Operational access",

      teamAccess: "Team Access",
      inviteNewMember: "Invite New Member",
      inviteDescriptionStart: "Add teammates to",
      inviteDescriptionEnd: "and assign the right role before they join.",
      currentWorkspace: "Current workspace",
      inviteByEmail: "Invite by email",
      owner: "Owner",
      admin: "Admin",
      memberRole: "Member",
      sendInvite: "Send Invite",
      viewOnlyMessage:
        "You have view access only. Only owners and admins can invite members or manage team permissions.",

      members: "Members",
      workspaceMembers: "Workspace Members",
      total: "total",
      member: "Member",
      role: "Role",
      status: "Status",
      joined: "Joined",
      actions: "Actions",
      unnamedUser: "Unnamed User",
      noEmail: "No email",
      noAccess: "No access",
      noTeamMembers: "No team members found in this workspace.",

      invitations: "Invitations",
      pendingInvitations: "Pending Invitations",
      pending: "pending",
      expires: "Expires",
      noPendingInvitations: "No pending invitations",
      noPendingInvitationsDescription:
        "New team invites will appear here until they are accepted.",

      accessSummary: "Access Summary",
      teamRolesOverview: "Team Roles Overview",
      yourAccess: "Your access",

      activeStatus: "Active",
      pendingStatus: "Pending",
    },

    billingPage: {
      eyebrow: "Workspace",
      title: "Billing",
      description:
        "Manage subscription usage, invoices, billing plan and payment details.",
      emptyDescription: "Manage your plan, payment method and invoices.",
      manageBilling: "Manage Billing",
      billing: "Billing",

      noBillingProfile: "No billing profile found",
      noBillingProfileDescription:
        "This workspace does not have a billing profile yet.",

      planPrice: "Plan Price",
      paidInvoices: "Paid Invoices",
      projectsUsage: "Projects Usage",
      seatsUsage: "Seats Usage",
      billingLower: "billing",
      pendingLower: "pending",

      currentWorkspace: "Current workspace",
      currentPlan: "Current Plan",
      billingPeriod: "Billing Period",
      usageOverview: "Usage Overview",
      planUsage: "Plan Usage",
      liveUsage: "Live usage",

      invoiceHistory: "Invoice History",
      invoices: "Invoices",
      invoice: "Invoice",
      amount: "Amount",
      issued: "Issued",
      status: "Status",
      totalBilledLower: "total billed",

      paid: "Paid",
      pending: "Pending",
      failed: "Failed",

      noInvoicesYet: "No invoices yet",
      noInvoicesDescription:
        "Once billing activity starts, your invoice history will appear here.",

      payment: "Payment",
      paymentMethod: "Payment Method",
      savedCard: "Saved Card",
      endingIn: "ending in",

      planControls: "Plan Controls",
      updatePlan: "Update Plan",
      monthly: "Monthly",
      yearly: "Yearly",
      saveBillingChanges: "Save Billing Changes",
    },

    settingsPage: {
      eyebrow: "Workspace",
      title: "Settings",
      description:
        "Manage workspace identity, brand preferences and communication settings.",
      emptyDescription:
        "Manage your workspace details, brand preferences and notifications.",
      settings: "Settings",
      saveSettings: "Save Settings",

      noSettingsFound: "No settings found",
      noSettingsDescription: "This workspace does not have settings yet.",

      workspace: "Workspace",
      brand: "Brand",
      timezone: "Timezone",
      currentWorkspace: "Current workspace",

      workspacePreferences: "Workspace Preferences",
      generalSettings: "General Settings",
      workspaceName: "Workspace Name",
      companyEmail: "Company Email",
      brandColor: "Brand Color",

      notifications: "Notifications",
      communicationPreferences: "Communication Preferences",

      emailNotifications: "Email Notifications",
      emailNotificationsDescription:
        "Receive account and workspace email alerts.",
      productUpdates: "Product Updates",
      productUpdatesDescription:
        "Receive updates about new features and improvements.",
      weeklyReports: "Weekly Reports",
      weeklyReportsDescription:
        "Get a weekly summary of workspace activity.",

      saveChanges: "Save Changes",

      workspaceSummary: "Workspace Summary",
      currentConfiguration: "Current Configuration",

      status: "Status",
      preferencesStatus: "Preferences Status",
      enabled: "Enabled",
      disabled: "Disabled",
    },
  },

  el: {
    workspace: "Χώρος εργασίας",
    dashboardOverview: "Πίνακας Ελέγχου",
    searchPlaceholder: "Αναζήτηση...",
    inviteTeam: "Πρόσκληση ομάδας",
    openNavigation: "Άνοιγμα μενού πλοήγησης",

    brandSubtitle: "Πλατφόρμα εργασίας",
    currentWorkspace: "Τρέχων χώρος εργασίας",
    workspaceTitle: "Χώρος εργασίας",
    workspaceDescription:
      "Διαχείριση πελατών, έργων, εργασιών και τιμολόγησης σε ένα σημείο.",
    mainMenu: "Κύριο μενού",

    nav: {
      overview: "Επισκόπηση",
      clients: "Πελάτες",
      projects: "Έργα",
      tasks: "Εργασίες",
      team: "Ομάδα",
      billing: "Τιμολόγηση",
      settings: "Ρυθμίσεις",
    },

    upgradeTitle: "Θες περισσότερο έλεγχο;",
    upgradeDescription:
      "Αναβάθμισε για καλύτερα analytics, δικαιώματα ομάδας και οικονομική εικόνα.",
    upgradeButton: "Αναβάθμιση",

    languageLabel: "Αλλαγή γλώσσας",
    languageShort: "EN",

    homePage: {
      badge: "Ζωντανό προϊόν",
      titleStart: "Οργάνωσε την εταιρεία σου σαν πραγματικό",
      titleHighlight: "σύστημα λειτουργιών",
      description:
        "Το OrbitOps είναι το κέντρο ελέγχου για μικρές και μεσαίες ομάδες — πελάτες, έργα, εργασίες, τιμολόγηση, δικαιώματα και workspaces σε ένα καθαρό περιβάλλον.",
      openDashboard: "Άνοιγμα Dashboard",

      featurePills: [
        "Έλεγχος πολλών workspaces",
        "Ρόλοι και δικαιώματα ομάδας",
        "Ροή έργων και εργασιών",
        "Ορατότητα τιμολόγησης",
      ],

      stats: {
        activeWorkspaces: "Ενεργά workspaces",
        operationalClarity: "Καθαρή εικόνα",
        realtime: "Άμεσα",
        projectTracking: "Παρακολούθηση έργων",
        smart: "Έξυπνα",
        billingOversight: "Έλεγχος χρεώσεων",
        secure: "Ασφαλές",
      },

      preview: {
        subtitle: "Ροή πολλών workspaces",
        live: "Ζωντανά",
        workspaceSignal: "Σήμα workspace",
        premiumVisibility: "Premium λειτουργική εικόνα",
        stable: "Σταθερό",
        teamAccess: "Πρόσβαση ομάδας",
        workspaceSwitch: "Αλλαγή workspace",
        seamless: "Άμεση",

        cards: [
          {
            label: "Σήμα workspace",
            title: "Υγιές",
            meta: "Παράδοση, οικονομικά και ομάδα ευθυγραμμισμένα",
          },
          {
            label: "Ανοιχτές εργασίες",
            title: "24",
            meta: "Ζωντανή εικόνα φόρτου εργασιών ανά ομάδα",
          },
          {
            label: "Πρόσβαση ομάδας",
            title: "Με ρόλους",
            meta: "Owners, admins και members οργανωμένα καθαρά",
          },
        ],
      },

      why: {
        eyebrow: "Γιατί OrbitOps",
        title: "Λιγότερο χάος. Περισσότερος έλεγχος.",
        description:
          "Σχεδιασμένο σαν πραγματικό προϊόν, όχι σαν απλό admin demo. Καθαρό, scalable και έτοιμο για παρουσίαση.",
      },

      liveFeed: [
        "Το workspace άλλαξε επιτυχώς",
        "2 προσκλήσεις ομάδας έγιναν αποδεκτές",
        "Η τιμολόγηση συγχρονίστηκε",
        "Η υγεία έργου ενημερώθηκε",
        "Το λειτουργικό σήμα είναι ενεργό",
      ],
    },

    loginPage: {
      brandSubtitle: "Πλατφόρμα εργασίας",
      eyebrow: "Σύγχρονη οργάνωση εταιρείας",
      heroTitle: "Πελάτες, έργα και τιμολόγηση σε ένα σημείο.",
      heroDescription:
        "Το OrbitOps βοηθά ομάδες να διαχειρίζονται έργα, λειτουργίες workspace, συνδρομές και πρόσβαση ομάδας μέσα από ένα καθαρό product-first περιβάλλον.",

      deliveryLabel: "Παράδοση",
      deliveryTitle: "Έργα",
      deliveryDescription: "Παρακολούθηση προόδου και συνδεδεμένων πελατών.",

      controlLabel: "Έλεγχος",
      controlTitle: "Τιμολόγηση",
      controlDescription: "Πλάνα, τιμολόγια και καθαρή εικόνα χρήσης.",

      productAccess: "Πρόσβαση προϊόντος",
      productAccessDescription:
        "Συνδέσου με GitHub για ασφαλή πρόσβαση στο OrbitOps workspace σου.",

      welcomeBack: "Καλώς ήρθες ξανά",
      signIn: "Σύνδεση",
      signInDescription:
        "Μπες με ασφάλεια στο workspace dashboard σου και συνέχισε να οργανώνεις τις λειτουργίες από ένα σημείο.",

      signInFailed: "Η σύνδεση απέτυχε:",
      accountNotLinked: "Το email χρησιμοποιείται ήδη με άλλον provider.",
      githubError: "Κάτι πήγε λάθος με το GitHub.",

      continueWithGithub: "Συνέχεια με GitHub",

      secureAccess: "Ασφαλής πρόσβαση",
      secureAccessDescription:
        "Η σύνδεση γίνεται μέσω GitHub για πιο γρήγορη και ασφαλή πρόσβαση.",

      languageLabel: "Αλλαγή γλώσσας",
    },

    overview: {
      operationsCenter: "Κέντρο λειτουργιών",
      heroDescription:
        "Συγκέντρωσε παράδοση έργων, σχέσεις πελατών, οικονομική εικόνα και καθημερινή εκτέλεση σε έναν ενεργό χώρο εργασίας.",

      workspace: "Χώρος εργασίας",
      workload: "Φόρτος",
      createProject: "Νέο Έργο",
      inviteTeam: "Πρόσκληση Ομάδας",

      healthy: "Υγιής",
      needsAttention: "Θέλει προσοχή",
      heavy: "Βαρύς",
      moderate: "Μέτριος",
      stable: "Σταθερός",

      clients: "Πελάτες",
      projects: "Έργα",
      openTasks: "Ανοιχτές εργασίες",
      invoices: "Τιμολόγια",
      active: "ενεργοί",
      completed: "ολοκληρωμένα",
      billed: "τιμολογημένα",

      highlights: "Σημεία ελέγχου",
      workspaceSignal: "Σήμα Χώρου Εργασίας",
      live: "Ζωντανά",
      highPriorityTasks: "Εργασίες υψηλής προτεραιότητας",
      pendingInvoices: "Εκκρεμή τιμολόγια",
      seatsUsed: "Θέσεις χρήσης",
      projectsUsage: "Χρήση έργων",
      stableMessage:
        "Οι λειτουργίες είναι σταθερές. Η παράδοση, ο φόρτος εργασιών και τα οικονομικά είναι υπό έλεγχο.",

      analytics: "Αναλυτικά",
      weeklyOverview: "Εβδομαδιαία εικόνα",
      details: "Λεπτομέρειες ↗",
      clientsActivity: "Δραστηριότητα πελατών",
      liveAccounts: "ενεργοί λογαριασμοί",
      taskPressure: "Πίεση εργασιών",
      activeTasks: "ενεργές εργασίες",
      billingExposure: "Οικονομική έκθεση",
      total: "σύνολο",

      performance: "Απόδοση",
      executionSnapshot: "Στιγμιότυπο εκτέλεσης",
      liveData: "Ζωντανά δεδομένα",
      activeClients: "Ενεργοί πελάτες",
      completedProjects: "Ολοκληρωμένα έργα",
      completedTasks: "Ολοκληρωμένες εργασίες",

      trend: "Τάση",
      executionMomentum: "Ροή εκτέλεσης",

      projectStatusDistribution: "Κατανομή κατάστασης",
      planning: "Σχεδιασμός",
      inProgress: "Σε εξέλιξη",
      inReview: "Σε έλεγχο",

      tasks: "Εργασίες",
      priorityLoad: "Φόρτος προτεραιοτήτων",
      highPriority: "Υψηλή προτεραιότητα",
      mediumPriority: "Μεσαία προτεραιότητα",
      lowPriority: "Χαμηλή προτεραιότητα",
      totalTasks: "Σύνολο εργασιών",

      finance: "Οικονομικά",
      billingActivity: "Δραστηριότητα τιμολόγησης",
      noRecentInvoiceActivity: "Δεν υπάρχει πρόσφατη δραστηριότητα τιμολογίων.",

      subscription: "Συνδρομή",
      planUsage: "Χρήση πλάνου",
      currentPlan: "Τρέχον πλάνο",
      seatsUsage: "Χρήση θέσεων",
      paidInvoices: "Πληρωμένα τιμολόγια",
      noBillingProfile:
        "Δεν βρέθηκε προφίλ τιμολόγησης για αυτόν τον χώρο εργασίας.",

      delivery: "Παράδοση",
      recentProjects: "Πρόσφατα έργα",
      viewAll: "Προβολή όλων",
      noRecentProjects: "Δεν υπάρχουν πρόσφατα έργα ακόμα.",

      summary: "Σύνοψη",
      revenueSnapshot: "Οικονομικό στιγμιότυπο",
      totalBilled: "Σύνολο τιμολογημένων",
      completionRate: "Ποσοστό ολοκλήρωσης",
      taskClosure: "Ολοκλήρωση εργασιών",
      paidInvoiceRate: "Ποσοστό πληρωμένων τιμολογίων",

      weekdays: {
        mon: "Δευ",
        tue: "Τρι",
        wed: "Τετ",
        thu: "Πεμ",
        fri: "Παρ",
        sat: "Σαβ",
        sun: "Κυρ",
      },
    },

    clients: {
      eyebrow: "Χώρος εργασίας",
      title: "Πελάτες",
      description:
        "Διαχειρίσου σχέσεις πελατών, κατάσταση λογαριασμών και το customer pipeline σου.",
      addClient: "Προσθήκη πελάτη",

      totalClients: "Σύνολο πελατών",
      activeAccounts: "Ενεργοί λογαριασμοί",
      pendingInactive: "Εκκρεμείς / Ανενεργοί",

      createClient: "Δημιουργία πελάτη",
      createClientButton: "Δημιουργία πελάτη",
      addNewClientAccount: "Πρόσθεσε νέο λογαριασμό πελάτη",

      clientName: "Όνομα πελάτη",
      company: "Εταιρεία",
      email: "Email",
      status: "Κατάσταση",

      active: "Ενεργός",
      pending: "Εκκρεμεί",
      inactive: "Ανενεργός",

      currentWorkspace: "Τρέχων χώρος εργασίας",
      export: "Εξαγωγή",

      searchPlaceholder: "Αναζήτηση με πελάτη, εταιρεία ή email...",
      allStatuses: "Όλες οι καταστάσεις",
      apply: "Εφαρμογή",
      reset: "Επαναφορά",

      client: "Πελάτης",
      actions: "Ενέργειες",
      view: "Προβολή",
      edit: "Επεξεργασία",
      delete: "Διαγραφή",
      save: "Αποθήκευση",
      cancel: "Άκυρο",

      noClientsFound: "Δεν βρέθηκαν πελάτες",
      noClientsDescription:
        "Δοκίμασε να αλλάξεις την αναζήτηση ή τα φίλτρα κατάστασης.",
    },

    projects: {
      eyebrow: "Χώρος εργασίας",
      title: "Έργα",
      description:
        "Παρακολούθησε την πρόοδο, την παράδοση και την ενεργή δουλειά που συνδέεται με τους πελάτες.",
      newProject: "Νέο Έργο",

      totalProjects: "Σύνολο έργων",
      inProgress: "Σε εξέλιξη",
      planningCompleted: "Σχεδιασμός / Ολοκληρωμένα",

      createProject: "Δημιουργία έργου",
      addNewDeliveryStream: "Πρόσθεσε νέο έργο παράδοσης",

      projectName: "Όνομα έργου",
      budget: "Budget",
      budgetPlaceholder: "Budget (π.χ. €5,000)",
      dueDate: "Ημερομηνία παράδοσης",
      team: "Ομάδα",
      teamPlaceholder: "Ομάδα (π.χ. 3 μέλη)",
      projectDescription: "Περιγραφή έργου",
      progress: "Πρόοδος",
      progressPlaceholder: "Πρόοδος %",
      client: "Πελάτης",

      planning: "Σχεδιασμός",
      inReview: "Σε έλεγχο",
      completed: "Ολοκληρωμένο",

      noClientSelected: "Δεν επιλέχθηκε πελάτης",
      noClientLinked: "Δεν έχει συνδεθεί πελάτης",

      currentWorkspace: "Τρέχων χώρος εργασίας",
      export: "Εξαγωγή",

      searchPlaceholder: "Αναζήτηση με έργο, πελάτη, budget ή ομάδα...",
      allStatuses: "Όλες οι καταστάσεις",
      apply: "Εφαρμογή",
      reset: "Επαναφορά",

      viewProject: "Προβολή έργου",
      edit: "Επεξεργασία",
      delete: "Διαγραφή",
      saveProject: "Αποθήκευση έργου",
      cancel: "Άκυρο",

      noProjectsFound: "Δεν βρέθηκαν έργα",
      noProjectsDescription:
        "Άλλαξε τα φίλτρα ή δημιούργησε νέο έργο για να εμφανιστεί εδώ.",
    },

    tasksPage: {
      eyebrow: "Χώρος εργασίας",
      title: "Εργασίες",
      description:
        "Παρακολούθησε την καθημερινή εκτέλεση, τις προθεσμίες και τις εργασίες υψηλής προτεραιότητας.",
      newTask: "Νέα Εργασία",

      totalTasks: "Σύνολο εργασιών",
      completed: "Ολοκληρωμένες",
      highPriority: "Υψηλή προτεραιότητα",

      createTask: "Δημιουργία εργασίας",
      addNewTaskItem: "Πρόσθεσε νέα εργασία",

      taskTitle: "Τίτλος εργασίας",
      dueDate: "Ημερομηνία λήξης",
      priority: "Προτεραιότητα",
      project: "Έργο",

      high: "Υψηλή",
      medium: "Μεσαία",
      low: "Χαμηλή",

      noProjectSelected: "Δεν επιλέχθηκε έργο",
      noProjectLinked: "Δεν έχει συνδεθεί έργο",

      currentWorkspace: "Τρέχων χώρος εργασίας",

      searchPlaceholder: "Αναζήτηση εργασιών...",
      all: "Όλες",
      active: "Ενεργές",
      allPriorities: "Όλες οι προτεραιότητες",
      allProjects: "Όλα τα έργα",
      noProjectLinkedFilter: "Χωρίς συνδεδεμένο έργο",
      resetFilters: "Επαναφορά φίλτρων",

      save: "Αποθήκευση",
      cancel: "Άκυρο",
      edit: "Επεξεργασία",
      delete: "Διαγραφή",

      due: "Λήξη",
      projectLabel: "Έργο",

      noTasksFound: "Δεν βρέθηκαν εργασίες",
      noTasksDescription:
        "Δοκίμασε να αλλάξεις την αναζήτηση, το έργο ή την προτεραιότητα.",
    },

    teamPage: {
      eyebrow: "Χώρος εργασίας",
      title: "Ομάδα",
      description:
        "Διαχειρίσου πρόσβαση workspace, ρόλους μελών, εκκρεμείς προσκλήσεις και δικαιώματα συνεργασίας.",
      inviteMember: "Πρόσκληση μέλους",

      activeMembers: "Ενεργά μέλη",
      currentlyActive: "Ενεργά αυτή τη στιγμή",
      pendingInvites: "Εκκρεμείς προσκλήσεις",
      awaitingAcceptance: "Αναμονή αποδοχής",
      owners: "Ιδιοκτήτες",
      workspaceControl: "Έλεγχος workspace",
      admins: "Διαχειριστές",
      operationalAccess: "Πρόσβαση διαχείρισης",

      teamAccess: "Πρόσβαση ομάδας",
      inviteNewMember: "Πρόσκληση νέου μέλους",
      inviteDescriptionStart: "Πρόσθεσε άτομα στο",
      inviteDescriptionEnd: "και όρισε τον σωστό ρόλο πριν μπουν.",
      currentWorkspace: "Τρέχων χώρος εργασίας",
      inviteByEmail: "Πρόσκληση με email",
      owner: "Ιδιοκτήτης",
      admin: "Διαχειριστής",
      memberRole: "Μέλος",
      sendInvite: "Αποστολή πρόσκλησης",
      viewOnlyMessage:
        "Έχεις μόνο πρόσβαση προβολής. Μόνο οι ιδιοκτήτες και οι διαχειριστές μπορούν να προσκαλούν μέλη ή να αλλάζουν δικαιώματα.",

      members: "Μέλη",
      workspaceMembers: "Μέλη workspace",
      total: "σύνολο",
      member: "Μέλος",
      role: "Ρόλος",
      status: "Κατάσταση",
      joined: "Ημερομηνία ένταξης",
      actions: "Ενέργειες",
      unnamedUser: "Χρήστης χωρίς όνομα",
      noEmail: "Χωρίς email",
      noAccess: "Χωρίς πρόσβαση",
      noTeamMembers: "Δεν βρέθηκαν μέλη σε αυτό το workspace.",

      invitations: "Προσκλήσεις",
      pendingInvitations: "Εκκρεμείς προσκλήσεις",
      pending: "εκκρεμείς",
      expires: "Λήγει",
      noPendingInvitations: "Δεν υπάρχουν εκκρεμείς προσκλήσεις",
      noPendingInvitationsDescription:
        "Οι νέες προσκλήσεις ομάδας θα εμφανίζονται εδώ μέχρι να γίνουν αποδεκτές.",

      accessSummary: "Σύνοψη πρόσβασης",
      teamRolesOverview: "Επισκόπηση ρόλων ομάδας",
      yourAccess: "Η πρόσβασή σου",

      activeStatus: "Ενεργός",
      pendingStatus: "Εκκρεμεί",
    },

    billingPage: {
      eyebrow: "Χώρος εργασίας",
      title: "Τιμολόγηση",
      description:
        "Διαχειρίσου χρήση συνδρομής, τιμολόγια, πλάνο χρέωσης και στοιχεία πληρωμής.",
      emptyDescription: "Διαχειρίσου το πλάνο, την πληρωμή και τα τιμολόγια.",
      manageBilling: "Διαχείριση τιμολόγησης",
      billing: "Τιμολόγηση",

      noBillingProfile: "Δεν βρέθηκε προφίλ τιμολόγησης",
      noBillingProfileDescription:
        "Αυτός ο χώρος εργασίας δεν έχει ακόμα προφίλ τιμολόγησης.",

      planPrice: "Τιμή πλάνου",
      paidInvoices: "Πληρωμένα τιμολόγια",
      projectsUsage: "Χρήση έργων",
      seatsUsage: "Χρήση θέσεων",
      billingLower: "χρέωση",
      pendingLower: "εκκρεμούν",

      currentWorkspace: "Τρέχων χώρος εργασίας",
      currentPlan: "Τρέχον πλάνο",
      billingPeriod: "Περίοδος χρέωσης",
      usageOverview: "Επισκόπηση χρήσης",
      planUsage: "Χρήση πλάνου",
      liveUsage: "Ζωντανή χρήση",

      invoiceHistory: "Ιστορικό τιμολογίων",
      invoices: "Τιμολόγια",
      invoice: "Τιμολόγιο",
      amount: "Ποσό",
      issued: "Έκδοση",
      status: "Κατάσταση",
      totalBilledLower: "σύνολο τιμολογημένων",

      paid: "Πληρωμένο",
      pending: "Εκκρεμεί",
      failed: "Απέτυχε",

      noInvoicesYet: "Δεν υπάρχουν τιμολόγια ακόμα",
      noInvoicesDescription:
        "Όταν ξεκινήσει δραστηριότητα χρέωσης, το ιστορικό τιμολογίων θα εμφανίζεται εδώ.",

      payment: "Πληρωμή",
      paymentMethod: "Μέθοδος πληρωμής",
      savedCard: "Αποθηκευμένη κάρτα",
      endingIn: "λήγει σε",

      planControls: "Έλεγχος πλάνου",
      updatePlan: "Αλλαγή πλάνου",
      monthly: "Μηνιαία",
      yearly: "Ετήσια",
      saveBillingChanges: "Αποθήκευση αλλαγών",
    },

    settingsPage: {
      eyebrow: "Χώρος εργασίας",
      title: "Ρυθμίσεις",
      description:
        "Διαχειρίσου την ταυτότητα του workspace, το brand και τις ρυθμίσεις επικοινωνίας.",
      emptyDescription:
        "Διαχειρίσου τα στοιχεία workspace, το brand και τις ειδοποιήσεις.",
      settings: "Ρυθμίσεις",
      saveSettings: "Αποθήκευση ρυθμίσεων",

      noSettingsFound: "Δεν βρέθηκαν ρυθμίσεις",
      noSettingsDescription:
        "Αυτός ο χώρος εργασίας δεν έχει ακόμα ρυθμίσεις.",

      workspace: "Workspace",
      brand: "Brand",
      timezone: "Ζώνη ώρας",
      currentWorkspace: "Τρέχων χώρος εργασίας",

      workspacePreferences: "Προτιμήσεις workspace",
      generalSettings: "Γενικές ρυθμίσεις",
      workspaceName: "Όνομα workspace",
      companyEmail: "Email εταιρείας",
      brandColor: "Χρώμα brand",

      notifications: "Ειδοποιήσεις",
      communicationPreferences: "Προτιμήσεις επικοινωνίας",

      emailNotifications: "Email ειδοποιήσεις",
      emailNotificationsDescription:
        "Λάβε ειδοποιήσεις για λογαριασμό και workspace μέσω email.",
      productUpdates: "Ενημερώσεις προϊόντος",
      productUpdatesDescription:
        "Λάβε ενημερώσεις για νέα features και βελτιώσεις.",
      weeklyReports: "Εβδομαδιαίες αναφορές",
      weeklyReportsDescription:
        "Λάβε εβδομαδιαία σύνοψη δραστηριότητας workspace.",

      saveChanges: "Αποθήκευση αλλαγών",

      workspaceSummary: "Σύνοψη workspace",
      currentConfiguration: "Τρέχουσα διαμόρφωση",

      status: "Κατάσταση",
      preferencesStatus: "Κατάσταση προτιμήσεων",
      enabled: "Ενεργό",
      disabled: "Ανενεργό",
    },
  },
} as const;