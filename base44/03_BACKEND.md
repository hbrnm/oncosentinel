\# 03 — Backend & Infra

\#\# Funcție backend: \`sendAppointmentReminder\`

Cale: \`base44/functions/sendAppointmentReminder/entry.ts\`

\`\`\`typescript  
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {  
  try {  
    const base44 \= createClientFromRequest(req);  
    const user \= await base44.auth.me();  
    if (\!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body \= await req.json();  
    const { appointment\_id } \= body;  
    if (\!appointment\_id) return Response.json({ error: 'appointment\_id required' }, { status: 400 });

    const appt \= await base44.entities.Appointment.get(appointment\_id);  
    if (\!appt) return Response.json({ error: 'Appointment not found' }, { status: 404 });

    const dateStr \= new Date(appt.date \+ 'T00:00:00').toLocaleDateString('ro-RO', {  
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'  
    });

    const lines \= \[  
      \`Programare: \${appt.specialty}\`,  
      appt.doctor ? \`Medic: \${appt.doctor}\` : null,  
      appt.center ? \`Locație: \${appt.center}\` : null,  
      appt.time ? \`Ora: \${appt.time}\` : null,  
      \`Data: \${dateStr}\`,  
    \].filter(Boolean);

    await base44.asServiceRole.integrations.Core.SendEmail({  
      to: user.email,  
      subject: 'Programare înregistrată în OncoSentinel',  
      text: \`Salut,\\n\\nProgramarea ta a fost salvată:\\n\\n\${lines.join('\\n')}\\n\\nTe rugăm să o adaugi manual în calendarul tău pentru a nu uita.\\n\\nCu drag,\\nEchipa OncoSentinel\`,  
    });

    return Response.json({ sent: true });  
  } catch (error) {  
    return Response.json({ error: error.message }, { status: 500 });  
  }  
}  
\`\`\`

\#\# Config: \`base44/config.jsonc\`

\`\`\`jsonc  
{  
  "name": "base44-app",  
  "site": {  
    "installCommand": "npm install",  
    "buildCommand": "npm run build",  
    "serveCommand": "npm run dev",  
    "outputDirectory": "./dist"  
  }  
}  
\`\`\`

\#\# \`src/main.jsx\`

\`\`\`jsx  
import React from 'react'  
import ReactDOM from 'react-dom/client'  
import App from '@/App.jsx'  
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(\<App /\>)  
\`\`\`

\#\# \`src/api/base44Client.js\`

\`\`\`javascript  
import { createClient } from '@base44/sdk';  
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } \= appParams;

export const base44 \= createClient({  
  appId,  
  token,  
  functionsVersion,  
  serverUrl: '',  
  appBaseUrl  
});  
\`\`\`

\#\# \`src/lib/app-params.js\`

\`\`\`javascript  
import { getAccessToken } from '@base44/sdk';

const isNode \= typeof window \=== 'undefined';

const isClearAccessTokenRequested \= () \=\>  
  \!isNode && new URLSearchParams(window.location.search).get("clear\_access\_token") \=== 'true';

const clearStoredAccessToken \= () \=\> {  
  window.localStorage.removeItem('base44\_access\_token');  
  window.localStorage.removeItem('token');  
}

const getAppParams \= () \=\> {  
  if (isClearAccessTokenRequested()) clearStoredAccessToken();  
  return {  
    appId: import.meta.env.VITE\_BASE44\_APP\_ID,  
    token: getAccessToken(),  
    functionsVersion: import.meta.env.VITE\_BASE44\_FUNCTIONS\_VERSION,  
    appBaseUrl: import.meta.env.VITE\_BASE44\_APP\_BASE\_URL,  
  }  
}

export const appParams \= { ...getAppParams() }  
\`\`\`

\#\# \`src/lib/authReturnTo.js\`

\`\`\`javascript  
// Resolve ?returnTo= to a safe same-origin path, else "/".  
export function safeReturnTo() {  
  const raw \= new URLSearchParams(window.location.search).get("returnTo");  
  if (\!raw) return "/";  
  try {  
    const url \= new URL(raw, window.location.origin);  
    if (url.origin \!== window.location.origin) return "/";  
    for (const p of \["access\_token", "clear\_access\_token", "app\_id", "app\_base\_url", "functions\_version", "from\_url"\]) {  
      url.searchParams.delete(p);  
    }  
    const path \= url.pathname \+ url.search;  
    if (\!path.startsWith("/") || path.startsWith("//") || path.includes("\\\\")) return "/";  
    return path;  
  } catch {  
    return "/";  
  }  
}  
\`\`\`

\#\# \`package.json\` (dependințe folosite efectiv)

\`\`\`json  
{  
  "dependencies": {  
    "@base44/sdk": "^0.8.52",  
    "@base44/vite-plugin": "1.0.44",  
    "@hello-pangea/dnd": "^17.0.0",  
    "@hookform/resolvers": "^4.1.2",  
    "@radix-ui/react-dialog": "^1.1.6",  
    "@radix-ui/react-label": "^2.1.2",  
    "@radix-ui/react-switch": "^1.1.3",  
    "@tanstack/react-query": "^5.84.1",  
    "class-variance-authority": "^0.7.1",  
    "clsx": "^2.1.1",  
    "date-fns": "^3.6.0",  
    "framer-motion": "^11.16.4",  
    "lodash": "^4.17.21",  
    "lucide-react": "^0.475.0",  
    "react": "^18.2.0",  
    "react-dom": "^18.2.0",  
    "react-markdown": "^9.0.1",  
    "react-router-dom": "^6.26.0",  
    "tailwind-merge": "^3.0.2",  
    "tailwindcss-animate": "^1.0.7"  
  }  
}  
\`\`\`

\> Lista completă (inclusiv toate componentele shadcn/ui Radix) este în \`package.json\` din proiect.  
