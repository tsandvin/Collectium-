# Local folder and all pages v1.4

## New buttons
- `Se alle sider`
- `Last inn lokal mappe`
- `Aktivt lokalt prosjekt`

## Folder loading
The browser cannot read a fixed Windows path directly. Use the folder picker and choose:

`C:\Users\Bruker\Pictures\Next,js react front og bac-end UIUX -DB 8.3\Datbase Next.js react`

The scanner reads supported files:
- `.tsx`, `.jsx`, `.ts`, `.js`
- `.php`
- `.css`, `.scss`
- `.sql`
- `.json`, `.md`

It ignores:
- `node_modules`
- `.next`
- `.git`
- `vendor`

## Classification
Files are classified as:
- page
- component
- api
- db
- style
- config
- other

Active local files appear in the right-side active view.
