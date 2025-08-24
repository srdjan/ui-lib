/** @jsx h */
import { h } from "https://deno.land/x/jsx@v0.1.5/mod.ts";

interface LayoutProps {
  title: string;
  children: any;
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <style>{`
          body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            background: #f5f5f5;
          }
          .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin: 20px 0;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 40px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          .stat {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
          }
          .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #1976d2;
          }
          code {
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 14px;
          }
          pre {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 14px;
            line-height: 1.4;
          }
          ul { line-height: 1.6; }
          li { margin: 8px 0; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

