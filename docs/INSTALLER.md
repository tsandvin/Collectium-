# Installering på app.collectium.no

## 1. Last opp mappe
Last opp innholdet i denne pakken til servermappen for subdomenet, for eksempel:

```text
/www/app/
```

Subdomene:

```text
app.collectium.no -> /www/app/
```

## 2. Installer avhengigheter

```bash
cd ~/www/app
npm install
```

## 3. Miljøvariabler
Kopier `.env.example` til `.env.local` og fyll inn MariaDB-informasjon.

```bash
cp .env.example .env.local
```

## 4. Kjør lokalt/server

```bash
npm run dev
```

Produksjon:

```bash
npm run build
npm run start
```

## 5. Første tester

```text
/api/catalog/filter?source_key=norske_sedler&object_group=banknote
/api/catalog/search?source_key=norske_sedler&object_group=banknote&q=100 kroner
/api/admin/control
```

## Viktig
Hvis Domeneshop ikke støtter Node.js-runtime på webhotellet, må Next.js enten hostes et annet sted, eller bygges som frontend som kaller eksisterende PHP/API på Domeneshop.
