/** @jsx h */
import { defineComponent, h, string, number, boolean, array, object } from "../../src/index.ts";
import { post, patch, del, get } from "../../src/index.ts";
import { renderComponent } from "../../src/index.ts";

// Real-World Dashboard Application - Analytics, Charts, and Data Management

console.log("🚀 Loading Real-World Dashboard Application...");

// Mock data for dashboard
const dashboardData = {
  metrics: {
    totalUsers: 12567,
    revenue: 45320.50,
    conversionRate: 3.2,
    activeProjects: 23
  },
  recentActivity: [
    { id: 1, type: 'user_signup', message: 'New user registered: john@example.com', timestamp: new Date(Date.now() - 5000).toISOString() },
    { id: 2, type: 'payment', message: 'Payment received: $299.00', timestamp: new Date(Date.now() - 15000).toISOString() },
    { id: 3, type: 'project', message: 'Project "Website Redesign" completed', timestamp: new Date(Date.now() - 45000).toISOString() },
    { id: 4, type: 'error', message: 'Server alert: High CPU usage detected', timestamp: new Date(Date.now() - 120000).toISOString() }
  ],
  chartData: {
    sales: [
      { month: 'Jan', value: 12000 },
      { month: 'Feb', value: 15000 },
      { month: 'Mar', value: 13500 },
      { month: 'Apr', value: 18000 },
      { month: 'May', value: 22000 },
      { month: 'Jun', value: 25500 }
    ],
    userGrowth: [
      { period: 'Q1', users: 8500 },
      { period: 'Q2', users: 10200 },
      { period: 'Q3', users: 11800 },
      { period: 'Q4', users: 12567 }
    ]
  },
  projects: [
    { id: 1, name: 'E-commerce Platform', status: 'active', progress: 75, team: 5, deadline: '2024-03-15' },
    { id: 2, name: 'Mobile App v2.0', status: 'active', progress: 45, team: 3, deadline: '2024-04-20' },
    { id: 3, name: 'API Integration', status: 'completed', progress: 100, team: 2, deadline: '2024-02-28' },
    { id: 4, name: 'Security Audit', status: 'planning', progress: 10, team: 4, deadline: '2024-05-10' }
  ]
};

// 1. Dashboard Container - Main dashboard layout
defineComponent("dashboard-app", {
  styles: {
    container: { maxWidth: '1400px', margin: '0 auto', padding: '2rem', background: 'var(--theme-bg, #ffffff)' },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1.5rem 2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', color: 'white',
    },
    title: { fontSize: '2.5rem', fontWeight: '700', margin: 0 },
    subtitle: { opacity: '0.9', marginTop: '0.5rem' },
    dateTime: { textAlign: 'right', opacity: '0.9' },
    grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' },
    leftColumn: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    rightColumn: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    mobileStack: `{
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }`
  },
  stateSubscriptions: {
    "dashboard-metrics": `this.updateDateTime();`,
    "dashboard-time": `this.updateDateTime();`
  },
  onMount: `
    this.updateDateTime = () => {
      const dateTimeEl = this.querySelector('#dashboard-datetime');
      if (dateTimeEl) {
        dateTimeEl.innerHTML = 
          '<div style="font-size: 1.1rem; font-weight: 500;">' + 
          new Date().toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          }) + 
          '</div><div style="font-size: 0.9rem; margin-top: 0.25rem;">' + 
          new Date().toLocaleTimeString() + 
          '</div>';
      }
    };
    
    // Initialize dashboard data (client-side version)
    const sampleMetrics = {
      totalUsers: 12567,
      revenue: 45320.50,
      conversionRate: 3.2,
      activeProjects: 23
    };
    
    const sampleActivity = [
      { id: 1, type: 'user_signup', message: 'New user registered: john@example.com', timestamp: new Date(Date.now() - 5000).toISOString() },
      { id: 2, type: 'payment', message: 'Payment received: $299.00', timestamp: new Date(Date.now() - 15000).toISOString() },
      { id: 3, type: 'project', message: 'Project "Website Redesign" completed', timestamp: new Date(Date.now() - 45000).toISOString() },
      { id: 4, type: 'error', message: 'Server alert: High CPU usage detected', timestamp: new Date(Date.now() - 120000).toISOString() }
    ];
    
    window.StateManager?.publish('dashboard-metrics', sampleMetrics);
    window.StateManager?.publish('dashboard-activity', sampleActivity);
    
    // Update time every second
    this.timeInterval = setInterval(() => {
      window.StateManager?.publish('dashboard-time', new Date().toISOString());
    }, 1000);
    
    // Initial time update
    this.updateDateTime();
  `,
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('div', { class: classes!.header },
        h('div', {},
          h('h1', { class: classes!.title }, '📊 Analytics Dashboard'),
          h('div', { class: classes!.subtitle }, 'Real-time business intelligence')
        ),
        h('div', { class: classes!.dateTime, id: 'dashboard-datetime' })
      ),
      h('div', { class: `${classes!.grid} ${classes!.mobileStack}` },
        h('div', { class: classes!.leftColumn },
          h('metrics-overview', {}),
          h('sales-chart', {}),
          h('projects-overview', {})
        ),
        h('div', { class: classes!.rightColumn },
          h('activity-feed', {}),
          h('quick-stats', {})
        )
      )
    )
  )
} as any);

// 2. Metrics Overview - Key performance indicators
defineComponent("metrics-overview", {
  styles: {
    container: { background: 'var(--theme-bg, #ffffff)', border: '1px solid var(--theme-border, #e2e8f0)', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: 'var(--theme-text, #1e293b)', margin: '0 0 1.5rem 0' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' },
    metric: { textAlign: 'center', padding: '1.5rem', background: 'var(--theme-secondary, #f8fafc)', borderRadius: '10px', border: '1px solid var(--theme-border, #e2e8f0)', transition: 'transform 0.2s ease' },
    metricHover: `{
      &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    }`,
    metricIcon: { fontSize: '2rem', marginBottom: '0.5rem' },
    metricValue: { fontSize: '2rem', fontWeight: 'bold', color: 'var(--theme-primary, #3b82f6)', display: 'block', marginBottom: '0.25rem' },
    metricLabel: { color: 'var(--theme-text, #64748b)', fontSize: '0.9rem', fontWeight: '500' },
    metricChange: { fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: '500' },
    positive: { color: '#10b981' },
    negative: { color: '#ef4444' }
  },
  stateSubscriptions: {
    "dashboard-metrics": `
      const metrics = value || {};
      
      const totalUsersEl = this.querySelector('#metric-users');
      const revenueEl = this.querySelector('#metric-revenue');
      const conversionEl = this.querySelector('#metric-conversion');
      const projectsEl = this.querySelector('#metric-projects');
      
      if (totalUsersEl) totalUsersEl.textContent = metrics.totalUsers?.toLocaleString() || '0';
      if (revenueEl) revenueEl.textContent = '$' + (metrics.revenue?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00');
      if (conversionEl) conversionEl.textContent = (metrics.conversionRate || 0) + '%';
      if (projectsEl) projectsEl.textContent = metrics.activeProjects?.toString() || '0';
    `
  },
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h2', { class: classes!.title }, '📈 Key Metrics'),
      h('div', { class: classes!.grid },
        h('div', { class: `${classes!.metric} ${classes!.metricHover}` },
          h('div', { class: classes!.metricIcon }, '👥'),
          h('span', { class: classes!.metricValue, id: 'metric-users' }, '0'),
          h('div', { class: classes!.metricLabel }, 'Total Users'),
          h('div', { class: `${classes!.metricChange} ${classes!.positive}` }, '↗ +12.5% this month')
        ),
        h('div', { class: `${classes!.metric} ${classes!.metricHover}` },
          h('div', { class: classes!.metricIcon }, '💰'),
          h('span', { class: classes!.metricValue, id: 'metric-revenue' }, '$0.00'),
          h('div', { class: classes!.metricLabel }, 'Revenue'),
          h('div', { class: `${classes!.metricChange} ${classes!.positive}` }, '↗ +8.3% this month')
        ),
        h('div', { class: `${classes!.metric} ${classes!.metricHover}` },
          h('div', { class: classes!.metricIcon }, '🎯'),
          h('span', { class: classes!.metricValue, id: 'metric-conversion' }, '0%'),
          h('div', { class: classes!.metricLabel }, 'Conversion Rate'),
          h('div', { class: `${classes!.metricChange} ${classes!.negative}` }, '↘ -2.1% this month')
        ),
        h('div', { class: `${classes!.metric} ${classes!.metricHover}` },
          h('div', { class: classes!.metricIcon }, '📋'),
          h('span', { class: classes!.metricValue, id: 'metric-projects' }, '0'),
          h('div', { class: classes!.metricLabel }, 'Active Projects'),
          h('div', { class: `${classes!.metricChange} ${classes!.positive}` }, '↗ +3 new this week')
        )
      )
    )
  )
} as any);

// 3. Sales Chart - Visual data representation (simplified)
defineComponent("sales-chart", {
  styles: {
    container: { background: 'var(--theme-bg, #ffffff)', border: '1px solid var(--theme-border, #e2e8f0)', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    title: { fontSize: '1.5rem', fontWeight: '600', color: 'var(--theme-text, #1e293b)', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    chart: { display: 'flex', alignItems: 'end', justifyContent: 'space-between', height: '200px', padding: '1rem', background: 'var(--theme-secondary, #f8fafc)', borderRadius: '8px', border: '1px solid var(--theme-border, #e2e8f0)', position: 'relative' },
    bar: { background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '4px 4px 0 0', transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: 'center', minWidth: '40px', margin: '0 2px' },
    barLabel: { position: 'absolute', bottom: '-25px', fontSize: '0.8rem', color: 'var(--theme-text, #64748b)', whiteSpace: 'nowrap' },
    barValue: { position: 'absolute', top: '-30px', fontSize: '0.75rem', fontWeight: '500', color: 'var(--theme-text, #374151)', whiteSpace: 'nowrap', opacity: '0', transition: 'opacity 0.2s ease' },
    barHover: `{
      &:hover { transform: scaleY(1.05); }
      &:hover .bar-value { opacity: 1; }
    }`
  },
  stateSubscriptions: {
    "dashboard-charts": `
      const chartData = value?.sales || [];
      const chartEl = this.querySelector('#sales-chart-container');
      if (!chartEl) return;
      
      const maxValue = Math.max(...chartData.map(d => d.value));
      
      chartEl.innerHTML = chartData.map(data => {
        const height = (data.value / maxValue) * 160; // Max height 160px
        return \`
          <div class="bar" style="height: \${height}px;" title="\${data.month}: $\${data.value.toLocaleString()}">
            <div class="bar-value">\${data.value.toLocaleString()}</div>
            <div class="bar-label">\${data.month}</div>
          </div>
        \`;
      }).join('');
    `
  },
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h2', { class: classes!.title }, '📊 Sales Overview'),
      h('div', { class: classes!.chart, id: 'sales-chart-container' },
        h('div', { style: 'text-align: center; color: #64748b; font-style: italic;' }, 'Loading chart data...')
      )
    )
  )
} as any);

// 4. Activity Feed - Recent system activity
defineComponent("activity-feed", {
  styles: {
    container: `{
      background: var(--theme-bg, #ffffff);
      border: 1px solid var(--theme-border, #e2e8f0);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      height: fit-content;
    }`,
    title: `{
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--theme-text, #1e293b);
      margin: 0 0 1.5rem 0;
    }`,
    activity: `{
      display: flex;
      align-items: start;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid var(--theme-border, #f1f5f9);
    }`,
    activityIcon: `{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }`,
    activityContent: `{
      flex: 1;
    }`,
    activityMessage: `{
      color: var(--theme-text, #374151);
      font-size: 0.9rem;
      line-height: 1.4;
      margin-bottom: 0.25rem;
    }`,
    activityTime: `{
      color: var(--theme-text, #64748b);
      font-size: 0.8rem;
    }`,
    iconSuccess: `{
      background: #dcfce7;
      color: #16a34a;
    }`,
    iconWarning: `{
      background: #fef3c7;
      color: #d97706;
    }`,
    iconError: `{
      background: #fee2e2;
      color: #dc2626;
    }`,
    iconInfo: `{
      background: #dbeafe;
      color: #2563eb;
    }`
  },
  stateSubscriptions: {
    "dashboard-activity": `
      const activities = Array.isArray(value) ? value : [];
      const feedEl = this.querySelector('#activity-feed-content');
      if (!feedEl) return;
      
      if (activities.length === 0) {
        feedEl.innerHTML = '<div style="text-align: center; color: #64748b; padding: 2rem;">No recent activity</div>';
        return;
      }
      
      feedEl.innerHTML = activities.map(activity => {
        const timeAgo = this.getTimeAgo(new Date(activity.timestamp));
        const { icon, iconClass } = this.getActivityIcon(activity.type);
        
        return \`
          <div class="activity">
            <div class="activity-icon \${iconClass}">
              \${icon}
            </div>
            <div class="activity-content">
              <div class="activity-message">\${activity.message}</div>
              <div class="activity-time">\${timeAgo}</div>
            </div>
          </div>
        \`;
      }).join('');
    `
  },
  onMount: `
    this.getTimeAgo = (date) => {
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + 'm ago';
      if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + 'h ago';
      return Math.floor(diffInSeconds / 86400) + 'd ago';
    };
    
    this.getActivityIcon = (type) => {
      const icons = {
        user_signup: { icon: '👤', iconClass: 'icon-success' },
        payment: { icon: '💳', iconClass: 'icon-success' },
        project: { icon: '📋', iconClass: 'icon-info' },
        error: { icon: '⚠️', iconClass: 'icon-error' }
      };
      return icons[type] || { icon: '📝', iconClass: 'icon-info' };
    };
  `,
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h2', { class: classes!.title }, '📋 Recent Activity'),
      h('div', { id: 'activity-feed-content' },
        h('div', { style: 'text-align: center; color: #64748b; padding: 2rem;' }, 'Loading activities...')
      )
    )
  )
} as any);

// 5. Projects Overview - Project status and management
defineComponent("projects-overview", {
  styles: {
    container: `{
      background: var(--theme-bg, #ffffff);
      border: 1px solid var(--theme-border, #e2e8f0);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }`,
    title: `{
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--theme-text, #1e293b);
      margin: 0 0 1.5rem 0;
    }`,
    project: `{
      padding: 1rem;
      margin: 0.5rem 0;
      border: 1px solid var(--theme-border, #e2e8f0);
      border-radius: 8px;
      background: var(--theme-secondary, #f8fafc);
    }`,
    projectHeader: `{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }`,
    projectName: `{
      font-weight: 500;
      color: var(--theme-text, #1e293b);
    }`,
    statusBadge: `{
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }`,
    statusActive: `{
      background: #dcfce7;
      color: #16a34a;
    }`,
    statusCompleted: `{
      background: #dbeafe;
      color: #2563eb;
    }`,
    statusPlanning: `{
      background: #fef3c7;
      color: #d97706;
    }`,
    progressBar: `{
      width: 100%;
      height: 8px;
      background: var(--theme-border, #e2e8f0);
      border-radius: 4px;
      overflow: hidden;
      margin: 0.5rem 0;
    }`,
    progressFill: `{
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      transition: width 0.3s ease;
    }`,
    projectMeta: `{
      display: flex;
      justify-content: between;
      gap: 1rem;
      font-size: 0.8rem;
      color: var(--theme-text, #64748b);
    }`
  },
  stateSubscriptions: {
    "dashboard-projects": `
      const projects = Array.isArray(value) ? value : [];
      const projectsEl = this.querySelector('#projects-list');
      if (!projectsEl) return;
      
      if (projects.length === 0) {
        projectsEl.innerHTML = '<div style="text-align: center; color: #64748b; padding: 2rem;">No projects found</div>';
        return;
      }
      
      projectsEl.innerHTML = projects.map(project => {
        const statusClass = project.status === 'active' ? 'status-active' :
                           project.status === 'completed' ? 'status-completed' :
                           'status-planning';
        
        const deadlineDate = new Date(project.deadline);
        const daysLeft = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
        
        return \`
          <div class="project">
            <div class="project-header">
              <div class="project-name">\${project.name}</div>
              <div class="status-badge \${statusClass}">
                \${project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: \${project.progress}%"></div>
            </div>
            <div class="project-meta">
              <span>👥 \${project.team} team members</span>
              <span>📅 \${daysLeft > 0 ? daysLeft + ' days left' : 'Overdue'}</span>
              <span>📊 \${project.progress}% complete</span>
            </div>
          </div>
        \`;
      }).join('');
    `
  },
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h2', { class: classes!.title }, '📋 Projects Overview'),
      h('div', { id: 'projects-list' },
        h('div', { style: 'text-align: center; color: #64748b; padding: 2rem;' }, 'Loading projects...')
      )
    )
  )
} as any);

// 6. Quick Stats - Additional metrics widget
defineComponent("quick-stats", {
  styles: {
    container: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', padding: '2rem', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    title: { fontSize: '1.5rem', fontWeight: '600', margin: '0 0 1.5rem 0' },
    stat: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    statLabel: { opacity: '0.9' },
    statValue: { fontWeight: 'bold', fontSize: '1.1rem' }
  },
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h2', { class: classes!.title }, '⚡ Quick Stats'),
      h('div', { class: classes!.stat },
        h('span', { class: classes!.statLabel }, 'Server Uptime'),
        h('span', { class: classes!.statValue }, '99.9%')
      ),
      h('div', { class: classes!.stat },
        h('span', { class: classes!.statLabel }, 'API Requests Today'),
        h('span', { class: classes!.statValue }, '45.2K')
      ),
      h('div', { class: classes!.stat },
        h('span', { class: classes!.statLabel }, 'Cache Hit Rate'),
        h('span', { class: classes!.statValue }, '94.3%')
      ),
      h('div', { class: classes!.stat },
        h('span', { class: classes!.statLabel }, 'Database Size'),
        h('span', { class: classes!.statValue }, '2.3 GB')
      ),
      h('div', { class: classes!.stat, style: 'border-bottom: none;' },
        h('span', { class: classes!.statLabel }, 'Active Sessions'),
        h('span', { class: classes!.statValue }, '1,234')
      )
    )
  )
} as any);

console.log("✅ Real-World Dashboard Application loaded - Complete analytics and data visualization");
