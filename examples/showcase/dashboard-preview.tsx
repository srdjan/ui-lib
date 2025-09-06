/** @jsx h */
import { defineComponent, h } from "../../index.ts";

export default defineComponent("dashboard-preview", {
  styles: {
    container: `{
      padding: 2rem;
      background: var(--gray-50);
      min-height: 500px;
      border-radius: 0.5rem;
    }`,
    heading: `{
      font-size: 1.875rem;
      font-weight: 800;
      color: var(--gray-900);
      margin: 0 0 1.5rem 0;
    }`,
    metricsGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }`,
    card: `{
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
    }`,
    cardLabel: `{
      font-size: 0.875rem;
      color: var(--gray-500);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }`,
    cardValue: `{
      font-size: 2rem;
      font-weight: 800;
      color: var(--gray-900);
      margin-bottom: 0.5rem;
    }`,
    badge: `{
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
    }`,
    badgeUp: `{
      background: var(--green-2);
      color: var(--green-9);
    }`,
    badgeDown: `{
      background: var(--red-2);
      color: var(--red-9);
    }`,

    chartCard: `{
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
    }`,
    chartTitle: `{
      font-size: 1.125rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      color: var(--gray-900);
    }`,
    chart: `{
      height: 200px;
      background: linear-gradient(180deg, var(--indigo-1) 0%, white 100%);
      border-radius: 0.5rem;
      position: relative;
      overflow: hidden;
    }`,
    bars: `{
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 100%;
      padding: 1rem;
      gap: 0.5rem;
    }`,
    bar: `{
      width: 30px;
      background: linear-gradient(180deg, var(--blue-6), var(--blue-7));
      border-radius: 0.25rem 0.25rem 0 0;
    }`,
    bar40: `{ height: 40%; }`,
    bar65: `{ height: 65%; }`,
    bar30: `{ height: 30%; }`,
    bar85: `{ height: 85%; }`,
    bar50: `{ height: 50%; }`,
    bar70: `{ height: 70%; }`,
    bar45: `{ height: 45%; }`,

    realtime: `{
      margin-top: 1rem;
      text-align: center;
    }`,
    realtimeText: `{
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--gray-600);
      font-size: 0.875rem;
    }`,
    dot: `{
      width: 8px;
      height: 8px;
      background: var(--green-6);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }`,
    // keyframes
    pulse: `{
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    }`,
  },

  render: (_: any, __: any, classes: any) => (
    <div class={classes.container}>
      <h2 class={classes.heading}>Analytics Dashboard</h2>

      <div class={classes.metricsGrid}>
        <div class={classes.card}>
          <div class={classes.cardLabel}>Revenue</div>
          <div class={classes.cardValue}>$54,320</div>
          <div class={`${classes.badge} ${classes.badgeUp}`}>↑ 12.5%</div>
        </div>

        <div class={classes.card}>
          <div class={classes.cardLabel}>Active Users</div>
          <div class={classes.cardValue}>2,847</div>
          <div class={`${classes.badge} ${classes.badgeUp}`}>↑ 8.3%</div>
        </div>

        <div class={classes.card}>
          <div class={classes.cardLabel}>Conversion Rate</div>
          <div class={classes.cardValue}>3.24%</div>
          <div class={`${classes.badge} ${classes.badgeDown}`}>↓ 2.1%</div>
        </div>

        <div class={classes.card}>
          <div class={classes.cardLabel}>Sessions</div>
          <div class={classes.cardValue}>18,549</div>
          <div class={`${classes.badge} ${classes.badgeUp}`}>↑ 5.7%</div>
        </div>
      </div>

      <div class={classes.chartCard}>
        <h3 class={classes.chartTitle}>Revenue Trend</h3>
        <div class={classes.chart}>
          <div class={classes.bars}>
            <div class={`${classes.bar} ${classes.bar40}`}></div>
            <div class={`${classes.bar} ${classes.bar65}`}></div>
            <div class={`${classes.bar} ${classes.bar30}`}></div>
            <div class={`${classes.bar} ${classes.bar85}`}></div>
            <div class={`${classes.bar} ${classes.bar50}`}></div>
            <div class={`${classes.bar} ${classes.bar70}`}></div>
            <div class={`${classes.bar} ${classes.bar45}`}></div>
          </div>
        </div>
      </div>

      <div class={classes.realtime}>
        <span class={classes.realtimeText}>
          <span class={classes.dot}></span>
          Real-time data streaming via Pub/Sub
        </span>
      </div>

      <style>{classes.pulse}</style>
    </div>
  ),
});

