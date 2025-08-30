/** @jsx h */
import { defineComponent, h } from "../../src/index.ts";

console.log("🚀 Loading Simple Dashboard Application...");

// Simple Dashboard App - Minimal working version
defineComponent("dashboard-app", {
  styles: {
    container: { 
      maxWidth: '1400px', margin: '0 auto', padding: '2rem', background: 'white', 
      border: '2px solid #10b981', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
    },
    header: {
      display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', 
      padding: '1.5rem 2rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
      borderRadius: '15px', color: 'white', textAlign: 'center'
    },
    title: { fontSize: '2.5rem', fontWeight: '700', margin: 0 },
    content: { 
      padding: '2rem', background: '#f0fdf4', borderRadius: '10px', textAlign: 'center' 
    },
    grid: { 
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem', marginTop: '2rem' 
    },
    metric: { 
      background: 'white', padding: '1.5rem', borderRadius: '10px', textAlign: 'center', 
      border: '1px solid #d1d5db', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
    },
    metricValue: { fontSize: '2rem', fontWeight: 'bold', color: '#059669' },
    metricLabel: { color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }
  },
  render: (props, api, classes) => (
    h('div', { class: classes!.container },
      h('div', { class: classes!.header },
        h('h1', { class: classes!.title }, '📊 Analytics Dashboard')
      ),
      h('div', { class: classes!.content },
        h('p', {}, 'This is a simplified analytics dashboard for testing. The full interactive version is being debugged.'),
        h('p', {}, 'Features: Real-time metrics, data visualization, activity feeds, and project management.'),
        h('div', { class: classes!.grid },
          h('div', { class: classes!.metric },
            h('div', { class: classes!.metricValue }, '12.5K'),
            h('div', { class: classes!.metricLabel }, 'Total Users')
          ),
          h('div', { class: classes!.metric },
            h('div', { class: classes!.metricValue }, '$45.3K'),
            h('div', { class: classes!.metricLabel }, 'Revenue')
          ),
          h('div', { class: classes!.metric },
            h('div', { class: classes!.metricValue }, '3.2%'),
            h('div', { class: classes!.metricLabel }, 'Conversion Rate')
          ),
          h('div', { class: classes!.metric },
            h('div', { class: classes!.metricValue }, '23'),
            h('div', { class: classes!.metricLabel }, 'Active Projects')
          )
        )
      )
    )
  )
});

console.log("✅ Simple Dashboard Application loaded");