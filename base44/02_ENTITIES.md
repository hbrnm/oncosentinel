\# 02 — Entități (scheme DB)

Toate entitățile au câmpuri built-in: \`id\`, \`created\_date\`, \`updated\_date\`, \`created\_by\_id\`.

\#\# User (built-in, customizat)

\`\`\`jsonc  
{  
  "name": "User",  
  "type": "object",  
  "properties": {  
    "display\_name": { "type": "string", "title": "Nume afișat" },  
    "onboarding\_complete": { "type": "boolean", "title": "Onboarding finalizat", "default": false },  
    "dose\_reminder\_enabled": { "type": "boolean", "title": "Reminder doză", "default": true },  
    "appointment\_reminder\_enabled": { "type": "boolean", "title": "Reminder control", "default": true },  
    "diagnosis": { "type": "string", "title": "Diagnostic", "description": "ex: DCIS" }  
  },  
  "required": \[\]  
}  
\`\`\`

\#\# Medication (RLS per-user)

\`\`\`jsonc  
{  
  "name": "Medication",  
  "type": "object",  
  "properties": {  
    "name": { "type": "string", "title": "Denumire medicament", "minLength": 1 },  
    "dose": { "type": "string", "title": "Doză", "description": "ex: 20 mg" },  
    "frequency": { "type": "string", "title": "Frecvență", "default": "1 comprimat/zi" },  
    "time\_of\_day": { "type": "string", "title": "Ora administrării", "description": "Format HH:MM", "default": "08:00" },  
    "active": { "type": "boolean", "title": "Activ", "default": true }  
  },  
  "required": \["name"\],  
  "rls": {  
    "read": { "created\_by\_id": "{{user.id}}" },  
    "create": { "created\_by\_id": "{{user.id}}" },  
    "update": { "created\_by\_id": "{{user.id}}" },  
    "delete": { "created\_by\_id": "{{user.id}}" }  
  }  
}  
\`\`\`

\#\# DoseLog (RLS per-user)

\`\`\`jsonc  
{  
  "name": "DoseLog",  
  "type": "object",  
  "properties": {  
    "date": { "type": "string", "format": "date", "title": "Data dozei" },  
    "taken": { "type": "boolean", "title": "Luat", "default": false },  
    "medication\_id": { "type": "string", "title": "ID medicament" },  
    "taken\_at": { "type": "string", "format": "date-time", "title": "Marcat la" }  
  },  
  "required": \["date"\],  
  "rls": {  
    "read": { "created\_by\_id": "{{user.id}}" },  
    "create": { "created\_by\_id": "{{user.id}}" },  
    "update": { "created\_by\_id": "{{user.id}}" },  
    "delete": { "created\_by\_id": "{{user.id}}" }  
  }  
}  
\`\`\`

\#\# MoodEntry (RLS per-user)

\`\`\`jsonc  
{  
  "name": "MoodEntry",  
  "type": "object",  
  "properties": {  
    "mood": { "type": "integer", "title": "Nivel dispoziție", "minimum": 1, "maximum": 5, "description": "1=Foarte rău, 5=Foarte bine" },  
    "note": { "type": "string", "title": "Notă" },  
    "date": { "type": "string", "format": "date", "title": "Data" },  
    "week\_key": { "type": "string", "title": "Cheie săptămână", "description": "ISO week key for grouping" }  
  },  
  "required": \["mood", "date"\],  
  "rls": {  
    "read": { "created\_by\_id": "{{user.id}}" },  
    "create": { "created\_by\_id": "{{user.id}}" },  
    "update": { "created\_by\_id": "{{user.id}}" },  
    "delete": { "created\_by\_id": "{{user.id}}" }  
  }  
}  
\`\`\`

\#\# Appointment (RLS per-user)

\`\`\`jsonc  
{  
  "name": "Appointment",  
  "type": "object",  
  "properties": {  
    "date": { "type": "string", "format": "date", "title": "Data controlului" },  
    "time": { "type": "string", "title": "Ora", "description": "Format HH:MM" },  
    "specialty": { "type": "string", "title": "Specialitate", "description": "ex: Oncologie" },  
    "doctor": { "type": "string", "title": "Medic" },  
    "center": { "type": "string", "title": "Centru/Spital" },  
    "notes": { "type": "string", "title": "Notițe" },  
    "status": { "type": "string", "title": "Status", "enum": \["upcoming", "done", "cancelled"\], "default": "upcoming" },  
    "calendar\_event\_id": { "type": "string", "title": "ID eveniment calendar", "description": "Google Calendar event ID for sync" }  
  },  
  "required": \["date"\],  
  "rls": {  
    "read": { "created\_by\_id": "{{user.id}}" },  
    "create": { "created\_by\_id": "{{user.id}}" },  
    "update": { "created\_by\_id": "{{user.id}}" },  
    "delete": { "created\_by\_id": "{{user.id}}" }  
  }  
}  
\`\`\`

\#\# Guide (admin-only write, public read)

\`\`\`jsonc  
{  
  "name": "Guide",  
  "type": "object",  
  "properties": {  
    "title": { "type": "string", "title": "Titlu", "minLength": 1 },  
    "tag": { "type": "string", "title": "Etichetă", "default": "GHIDURI & INFORMAȚII" },  
    "summary": { "type": "string", "title": "Rezumat" },  
    "content": { "type": "string", "title": "Conținut", "description": "Markdown content" },  
    "image\_url": { "type": "string", "title": "Imagine", "format": "uri" },  
    "category": { "type": "string", "title": "Categorie", "enum": \["tratament", "stil\_viata", "emotional", "monitorizare"\], "default": "tratament" },  
    "order": { "type": "integer", "title": "Ordine", "default": 0 }  
  },  
  "required": \["title"\],  
  "rls": {  
    "read": {},  
    "create": { "user\_condition": { "role": "admin" } },  
    "update": { "user\_condition": { "role": "admin" } },  
    "delete": { "user\_condition": { "role": "admin" } }  
  }  
}  
\`\`\`

\#\# NewsUpdate (admin-only write, public read)

\`\`\`jsonc  
{  
  "name": "NewsUpdate",  
  "type": "object",  
  "properties": {  
    "title": { "type": "string", "title": "Titlu", "minLength": 1 },  
    "date": { "type": "string", "format": "date", "title": "Data" },  
    "summary": { "type": "string", "title": "Rezumat" },  
    "content": { "type": "string", "title": "Conținut", "description": "Markdown content" },  
    "icon\_type": { "type": "string", "title": "Tip icon", "enum": \["shield", "document", "info"\], "default": "shield" },  
    "order": { "type": "integer", "title": "Ordine", "default": 0 }  
  },  
  "required": \["title", "date"\],  
  "rls": {  
    "read": {},  
    "create": { "user\_condition": { "role": "admin" } },  
    "update": { "user\_condition": { "role": "admin" } },  
    "delete": { "user\_condition": { "role": "admin" } }  
  }  
}  
\`\`  
