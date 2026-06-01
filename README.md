# Collectium

Collectium is a data-driven platform for collectors, dealers and administrators, built around catalogues, object relations, market data, collections, auctions and historical analysis.

The platform is being developed as a modern **Next.js + React application** with a backend/API layer connected to an existing **MariaDB database**. The core principle is that the database and API layer are the source of truth, while the frontend is responsible for presentation, interaction and user experience.

## Project Direction

Collectium is designed as a relational platform for collectible objects, not as a flat product catalogue.

A single catalogue object can be used across multiple contexts:

* catalogue
* object presentation
* user collection
* wishlist and favourites
* auction
* dealer workflow
* admin control
* market index and financial analysis
* historical and relational presentations

The same object data should be reusable across the platform, with context-specific views and permissions.

## Technology Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* API/backend layer
* MariaDB
* GitHub
* Vercel
* Environment-based configuration

## Core Architecture

The intended architecture follows this flow:

```txt
MariaDB
→ API / backend
→ Next.js server layer
→ React components
→ User interface
```

Frontend components must not define business truth such as catalogue data, prices, access rights, membership levels, auction status, dealer status or filter values.

All critical data and system behaviour should be resolved through the backend/API layer and the database.

## Database Principle

MariaDB is the authoritative source for:

* catalogue objects
* object relations
* users and roles
* memberships and access
* dealer data
* auction data
* collection data
* market values
* price observations
* system routes
* feature switches
* logging

Collectium uses a database-controlled feature and access model where pages, features, access rules and API routes are connected through a structured control chain.

## Object Model

Catalogue objects must always be identified by:

```txt
object_id + object_group + source_key
```

Example:

```txt
object_id: 123
object_group: banknote
source_key: norske_sedler
```

This ensures that objects from different sources and object groups are kept separate and can be resolved correctly across the platform.

## Catalogue Model

The catalogue is the core workspace of Collectium.

It must support:

* source-based filtering
* object group filtering
* relational object data
* historical context
* market data
* collection status
* auction status
* dealer status
* user-specific object state

The catalogue is structured around three main perspectives:

```txt
Collector
History
Finance
```

### Collector

Focuses on the user’s relationship to the object:

* wishlist
* favourites
* personal collection
* purchase information
* sale information
* quality
* rarity
* notes
* sharing

### History

Focuses on historical and catalogue relations:

* issuer / producer
* edition
* year
* variant
* ruler / regent
* dynasty
* signatures
* persons
* material
* provenance
* historical events
* related objects

### Finance

Focuses on value and market development:

* estimated market value
* trend
* liquidity
* auction results
* shop prices
* price observations
* personal purchase price
* profit / loss
* currency and index comparison

A value of `0` must not be treated as a real market value. Missing value data should be shown as not assessed or unavailable.

## Main Modules

Collectium is planned around the following main modules:

* Catalogue
* Object presentation
* Relation presentation
* User collection
* Wishlist
* Favourites
* Membership
* Authentication and session handling
* Auction
* Dealer workflow
* Admin control
* Market index
* AI-assisted search
* Import and approval workflow
* Logging
* System testing and recovery

## Admin Control

The admin area is intended to be the operational control centre for the platform.

It should manage and verify:

* users
* memberships
* dealers
* catalogue sources
* object data
* imports
* AI proposals
* auctions
* payments and fees
* access rules
* API routes
* system logs
* data quality
* missing relations
* missing values
* technical system status

Admin functionality must be connected to the database-controlled feature and route model, not implemented as isolated frontend-only actions.

## Dealer and Auction Model

Dealers are professional actors who may receive, evaluate and prepare objects for sale or auction.

A dealer may:

* apply for dealer access
* receive approval for object groups
* manage assigned objects
* evaluate condition and authenticity
* prepare auction or shop listings
* propose sale terms to the object owner
* publish objects after approval

Collectium fees are controlled centrally by Collectium/admin. Dealers may have their own fee agreements, but they must not define the central Collectium fee.

Auctions are treated as a market channel across dealers, not as a single dealer-specific feature.

## Market Index

The index module is intended to be a market and analysis dashboard, not a traditional landing page.

It should support analysis of:

* object value development
* object group performance
* auction activity
* shop activity
* collection performance
* historical periods
* rulers and dynasties
* metals and materials
* currency comparison
* inflation and market indexes

The goal is to make Collectium useful not only as a catalogue, but also as a structured market intelligence platform for collectible objects.

## Development Rules

All main code files, API routes, components and system modules should be documented with:

* purpose
* usage area
* affected pages/routes
* affected feature keys
* affected API routes
* affected database tables/views
* data flow
* logging
* version or change reference

Core files should not be overwritten without a controlled change process, snapshot, manifest or documented approval.

## Repository Rules

GitHub should contain source code and project structure.

GitHub must not contain production secrets.

Allowed in GitHub:

```txt
package.json
next.config.ts
tsconfig.json
app/
components/
lib/
public/
.env.example
README.md
```

Not allowed in GitHub:

```txt
.env.local
.env.production
DB_PASSWORD
production database credentials
SESSION_SECRET
NEXTAUTH_SECRET
private API keys
```

Production secrets must be configured through the hosting provider’s environment variable system, such as Vercel Environment Variables.

## Recommended Project Structure

```txt
collectium-next/
  app/
    layout.tsx
    page.tsx

    katalog/
      page.tsx

    objekt/
      [sourceKey]/
        [objectGroup]/
          [objectId]/
            page.tsx

    relasjon/
      [relationType]/
        [relationKey]/
          page.tsx

    index/
      page.tsx

    min-side/
      page.tsx

    samling/
      page.tsx

    auksjon/
      page.tsx

    forhandler/
      page.tsx

    admin/
      page.tsx
      system/
        unit-test/
          page.tsx

    api/
      catalog/
      object/
      relations/
      index/
      collection/
      auction/
      dealer/
      admin/

  components/
    layout/
    catalog/
    object/
    relations/
    index/
    collection/
    auction/
    dealer/
    admin/
    ui/

  lib/
    db/
    auth/
    access/
    api/
    logging/
    formatters/
    types/

  public/

  package.json
  next.config.ts
  tsconfig.json
  .env.example
  README.md
```

## Deployment

The application is intended to run as a Next.js application, with deployment through a modern hosting platform such as Vercel.

The production application target is:

```txt
https://app.collectium.no
```

The database remains external and is accessed only through secure server-side code or API routes.

## Status

Collectium is under active development.

Current focus:

1. clean Next.js / React structure
2. secure environment setup
3. database/API connection
4. catalogue foundation
5. admin/system control
6. object presentation
7. relation presentation
8. market index
9. auction and dealer workflow
