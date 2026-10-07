\# 01 — Sistem de design

\#\# Paleta de culori

| Token | Hex | Folosire |  
|---|---|---|  
| \`--sage\` | \`\#5E7A68\` | Primar — butoane, accente, iconițe active |  
| \`--sage-light\` | \`\#7A9A8B\` | Accente secundare, botanical line\-art |  
| \`--sage-soft\` | \`\#E8EDE7\` | Fundaluri sage deschise, badge\-uri |  
| \`--sage-deep\` | \`\#4A6354\` | Text pe sage, hover states |  
| \`--blush\` | \`\#F6ECEC\` | Fundal blush, carduri jurnal |  
| \`--blush-accent\` | \`\#DFB2B5\` | Accente blush |  
| \`--blush-deep\` | \`\#C99A9D\` | Text pe blush |  
| \`--cream\` | \`\#FAF8F5\` | Fundal principal aplicație |  
| \`--cream-deep\` | \`\#F5F2EB\` | Fundaluri secundare, input\-uri |  
| \`--warm-border\` | \`\#EAE5DE\` | Borduri subtile |  
| \`--ink\` | \`\#3A332E\` | Text principal |  
| \`--ink-soft\` | \`\#6B6259\` | Text secundar, descrieri |

\#\# Tipografie

\- **\*\*Headings:\*\*** \`Lora\` (serif) — Google Fonts, weights 400–700 \+ italic  
\- **\*\*Body/UI:\*\*** \`Plus Jakarta Sans\` (geometric sans) — Google Fonts, weights 300–800  
\- Import în \`index.html\`: \`https\://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500\&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800\&display=swap\`

\#\# Spațiere & rază

\- Border radius principal: \`1.25rem\` (20px) — mapat la \`rounded-lg\`  
\- Carduri: \`rounded-3xl\` (24px) sau \`rounded-\[28px\]\`  
\- Max-width app shell: \`440px\`, centrat  
\- Touch targets: min 48×48px  
\- Padding orizontal pagini: \`px-5\` / \`px-6\`  
\- Spacing între secțiuni: \`space-y-5\` / \`space-y-6\`

\#\# Principii de design

\- **\*\*Non-clinical:\*\*** culori organice calde (cream, sage, blush), nu alb/albastru spitalicesc  
\- **\*\*Empatic:\*\*** mesaje blânde, emoji-uri pentru dispoziție, ilustrații botanice line-art  
\- **\*\*Mobile-first:\*\*** layout 440px, navigație bottom dock cu 5 tab-uri  
\- **\*\*Micro-interacțiuni:\*\*** \`tap-scale\` (scale 0.96 pe active), fade-in la montare  
\- **\*\*Accesibilitate:\*\*** touch targets ≥48px, contrast adecvat, aria-labels pe butoane icon

\---

\#\# \`index.html\`

\`\`\`html  
\<\!doctype html\>  
\<html lang\="ro"\>  
  \<head\>  
    \<meta charset\="UTF-8" /\>  
    \<link rel\="icon" type\="image/svg+xml" href\="https\://base44.com/logo\_v2.svg" /\>  
    \<meta name\="viewport" content\="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /\>  
    \<meta name\="theme-color" content\="\#FAF8F5" /\>  
    \<meta name\="description" content\="OncoSentinel — sprijin empatic pentru supraviețuirea după cancerul de sân și terapia endocrină pe termen lung." /\>  
    \<link rel\="manifest" href\="/manifest.json" /\>  
    \<link rel\="preconnect" href\="https\://fonts.googleapis.com" /\>  
    \<link rel\="preconnect" href\="https\://fonts.gstatic.com" crossorigin /\>  
    \<link href\="https\://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500\&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800\&display=swap" rel\="stylesheet" /\>  
    \<title\>OncoSentinel — Îngrijire empatică\</title\>  
  \</head\>  
  \<body\>  
    \<div id\="root"\>\</div\>  
    \<script type\="module" src\="/src/main.jsx"\>\</script\>  
  \</body\>  
\</html\>  
\`\`\`

\#\# \`tailwind.config.js\`

\`\`\`javascript  
/\*\* @type {import('tailwindcss').Config} \*/  
module.exports \= {  
  darkMode: \["class"\],  
  content: \["./index.html", "./src/\*\*/\*.{ts,tsx,js,jsx}"\],  
  theme: {  
    extend: {  
      opacity: Object.fromEntries(Array.from({ length: 101 }, (\_, i) \=\> \[i, \`\${i / 100}\`\])),  
      borderRadius: {  
        lg: 'var(--radius)',  
        md: 'calc(var(--radius) \- 6px)',  
        sm: 'calc(var(--radius) \- 10px)'  
      },  
      colors: {  
        background: 'hsl(var(--background))',  
        foreground: 'hsl(var(--foreground))',  
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },  
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },  
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },  
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },  
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },  
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },  
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },  
        border: 'hsl(var(--border))',  
        input: 'hsl(var(--input))',  
        ring: 'hsl(var(--ring))',  
        sage: { DEFAULT: '\#5E7A68', light: '\#7A9A8B', soft: '\#E8EDE7', deep: '\#4A6354' },  
        blush: { DEFAULT: '\#F6ECEC', accent: '\#DFB2B5', deep: '\#C99A9D' },  
        cream: { DEFAULT: '\#FAF8F5', deep: '\#F5F2EB' },  
        warmborder: '\#EAE5DE',  
        ink: { DEFAULT: '\#3A332E', soft: '\#6B6259' },  
      },  
      fontFamily: {  
        heading: \['Lora', 'Georgia', 'serif'\],  
        body: \['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'\],  
        display: \['Lora', 'Georgia', 'serif'\],  
      },  
      boxShadow: {  
        organic: '0 8px 30px \-12px rgba(94, 122, 104, 0.14), 0 2px 8px \-4px rgba(58, 51, 46, 0.06)',  
        soft: '0 4px 20px \-8px rgba(58, 51, 46, 0.1)'  
      },  
      keyframes: {  
        'fade-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },  
        'soft-pulse': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } }  
      },  
      animation: {  
        'fade-in': 'fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1\) both',  
        'soft-pulse': 'soft-pulse 2.4s ease-in-out infinite'  
      }  
    }  
  },  
  plugins: \[require("tailwindcss-animate")\],  
}  
\`\`\`

\#\# \`src/index.css\`

\`\`\`css  
@tailwind base;  
@tailwind components;  
@tailwind utilities;

@layer base {  
  :root {  
    \--background: 40 33% 97%;  
    \--foreground: 30 10% 18%;  
    \--card: 0 0% 100%;  
    \--card-foreground: 30 10% 18%;  
    \--popover: 0 0% 100%;  
    \--popover-foreground: 30 10% 18%;  
    \--primary: 145 14% 38%;  
    \--primary-foreground: 40 33% 98%;  
    \--secondary: 40 16% 92%;  
    \--secondary-foreground: 30 10% 18%;  
    \--muted: 40 16% 93%;  
    \--muted-foreground: 30 6% 42%;  
    \--accent: 350 35% 88%;  
    \--accent-foreground: 350 30% 32%;  
    \--destructive: 20 30% 50%;  
    \--destructive-foreground: 40 33% 98%;  
    \--border: 36 22% 89%;  
    \--input: 36 22% 89%;  
    \--ring: 145 14% 38%;  
    \--radius: 1.25rem;  
    \--font-heading: 'Lora', Georgia, 'Times New Roman', serif;  
    \--font-body: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;  
    \--font-display: 'Lora', Georgia, serif;  
    \--font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;

    \--sage: \#5E7A68;  
    \--sage-light: \#7A9A8B;  
    \--sage-soft: \#E8EDE7;  
    \--blush: \#F6ECEC;  
    \--blush-accent: \#DFB2B5;  
    \--cream: \#FAF8F5;  
    \--cream-deep: \#F5F2EB;  
    \--warm-border: \#EAE5DE;  
    \--ink: \#3A332E;  
    \--ink-soft: \#6B6259;  
  }  
}

@layer base {  
  \* { @apply border-border outline-ring/50; }  
  html, body { @apply bg-background text-foreground; \-webkit-font-smoothing: antialiased; }  
  body { @apply font-body; }  
  h1, h2, h3, h4, .font-heading { font-family: var(--font-heading); letter-spacing: \-0.01em; }  
}

@layer components {  
  .app-shell {  
    max-width: 440px;  
    margin-inline: auto;  
    min-height: 100vh;  
    min-height: 100dvh;  
    background: var(--cream);  
    position: relative;  
    box-shadow: 0 0 60px \-20px rgba(58, 51, 46, 0.12);  
  }  
  .organic-card {  
    @apply bg-card rounded-3xl border;  
    border-color: var(--warm-border);  
    box-shadow: 0 8px 30px \-12px rgba(94, 122, 104, 0.12), 0 2px 8px \-4px rgba(58, 51, 46, 0.06);  
  }  
  .sage-card {  
    background: linear-gradient(150deg, \#EEF2EC 0%, \#E4EBE1 100%);  
    border: 1px solid \#D4DFD0;  
    box-shadow: 0 10px 34px \-14px rgba(94, 122, 104, 0.28);  
  }  
  .blush-card {  
    background: linear-gradient(150deg, \#F6ECEC 0%, \#F1E0E1 100%);  
    border: 1px solid \#EAD3D5;  
    box-shadow: 0 10px 34px \-14px rgba(223, 178, 181, 0.3);  
  }  
  .micro-label {  
    @apply font-body text-\[10px\] font-semibold uppercase tracking-\[0.18em\];  
    color: var(--ink-soft);  
  }  
  .tap-scale { transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1); }  
  .tap-scale:active { transform: scale(0.96); }  
  .prose-onco { @apply text-\[14px\] text-ink leading-relaxed; }  
  .prose-onco h2 { @apply font-heading text-\[18px\] text-ink mt-6 mb-2; }  
  .prose-onco h3 { @apply font-heading text-\[16px\] text-ink mt-5 mb-2; }  
  .prose-onco p { @apply text-\[14px\] text-ink-soft leading-relaxed mb-3; }  
  .prose-onco ul { @apply list-disc pl-5 mb-3 space-y-1.5; }  
  .prose-onco ol { @apply list-decimal pl-5 mb-3 space-y-1.5; }  
  .prose-onco li { @apply text-\[14px\] text-ink-soft leading-relaxed; }  
  .prose-onco strong { @apply font-semibold text-ink; }  
  .prose-onco blockquote { @apply border-l-2 border-sage pl-4 italic text-ink-soft my-4; }  
}

@layer utilities {  
  .no-scrollbar::-webkit-scrollbar { display: none; }  
  .no-scrollbar { \-ms-overflow-style: none; scrollbar-width: none; }  
  .text-balance { text-wrap: balance; }  
}  
\`\`\`

\#\# \`vite.config.js\`

\`\`\`javascript  
import base44 from "@base44/vite-plugin"  
import react from '@vitejs/plugin-react'  
import { defineConfig } from 'vite'

export default defineConfig({  
  plugins: \[  
    base44({  
      legacySDKImports: process.env.BASE44\_LEGACY\_SDK\_IMPORTS \=== 'true',  
      hmrNotifier: true,  
      navigationNotifier: true,  
      analyticsTracker: true,  
      visualEditAgent: true  
    }),  
    react(),  
  \]  
});  
\`\`  
