# Company Website - Next.js + Headless CMS

A company website built using **Next.js** for the frontend, and a **Headless CMS**- **Strapi** for the backend integration.

## Features

### Company Website

- Dynamic company banner
- Company information fetched from CMS
- Service highlights
- Team member lists
- Blog section
- Contact form
- Responsive UI
- SEO-friendly pages


### CMS Content Management
All website content is managed through Strapi- headless CMS.
Content Management:
- Site settings
- About
- Services
- Team members
- Blog posts
- Contact messages


### Services Management
- Create and manage services from CMS
- Service title
- Description
- Pricing info
- Service images
- Featured services on homepage


### Team Management
- Team member profiles
- Profile image
- Name
- Designation
- Biography
- Email


### Blog System
- Blog listing page
- Blog detail page
- Dynamic route using slug
- Author infor
- Publishe date
- Blog image
- CMS managed blog post content
- Featured blogs on homepage


### Contact Management
- Contact form
- Name validation
- Email validation
- Message submission
- CMS storage data


### Rendering Feature
It has diff Next.js rendering approach-
### Static Site Generation(SSG)
used for-
- Home page
- About page
- Services page

### Incremental Static Regeneration(ISR)
used for-
- blog detail page

### Dynamic Data Fetching
- CMS API integration
- React query use
- Loading states
- Error handling


## Tech Stack
### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- React Query
- fetch API
- Next.js Page Router

### Backend-CMS
- Strapi

CMS manages:

- Website content
- Services
- Team members
- Blog posts
- About Company
- Contact submission

## Project Structure
```
root
│
├── apps
│   ├── web
│   └── cms
│
│
├── infra
│   └── docker-compose.yml
│
├── README.md
├── package.json
├── pnpm-workspace.yaml
└── .github/workflows
└── .husky
```


## Folder Structure

### apps/
It contains all application source code.

### apps/web
It has Next.js frontend app codebase.

```
src
│
├── pages
│   ├── index.tsx
│   ├── about.tsx
│   ├── services.tsx
│   ├── contact.tsx
│   ├── _app.tsx
│   ├── blog
│       └── [slug]
│       └── index.tsx
├── components
│   └── layout
│   └── shared
├── hooks
├── constants
├── lib
│   ├── strapi.ts
├── types
├── utils
├── validations
├── styles
├── __tests__
│
├── next.config.js
├── Dockerfile
└── package.json
```


#### layout - it contains app routes using Next.js Page Router.
Routes:
```
/
├── Home Page

/about
├── Company mission
├── Vision
├── Team members info list

/services
├── Services listing

/blog
├── Blogs listing

/blog/[slug]
├── Separate blog page

/contact
├── Contact form
```


#### pages/ - feature-based frontend architecture.
Example:
```
pages

company
services
blog
contact
about
```


#### lib/strapi.ts- it handles strapi communication


### apps/cms
It contains headless CMS application codebase using strapi.
```
cms

├── src
│   ├── api
│   │   ├── service
│   │   ├── blog-post
│   │   ├── team-member
│   │   └── contact-message
│   │   └── about
│   │   └── site-setting
│   │
│   ├── components
│   └── admin
│
├── config
│   └── database.ts
├── types
├── scripts
├── Dockerfile
└── package.json
```


### CMS Content Models

#### Site Settings- stores global website info.
Fields:
```
companyName
logo
footerText
bannerTitle
banneSubtitle
```
#### About- it stores company related info.
Fields:
```
title
description
mission
vision
aboutImg
```

#### Services- it has these fields-
```
title
description
price
image
slug
isFeatured
```

#### Team Members
fields:
```
name
photo
designation
bio
email
```

#### Blog Posts
fields:

```
title
slug
author
publishDate
blogContent
coverImage
isFeatured
subTxt
```
#### Contact
fields:
```
name
email
message
```


## Data fetching
CMS data fetching includes:
- Server-side fetching
- Static generation
- ISR revalidation
- React Query cache
- Loading states
- error handling


## Contact Form Flow
```
User fills form
|
frontend validations
|
API request
|
CMS stores data
|
Success response
```

## Environment Variables
.env.example
```
NEXT_PUBLIC_STRAPI_URL=
```

## Run Locally
1. Clone repository:

```bash
git clone <repo-url>
```

2. Install dependencies:

```bash
pnpm install
```

3. Start development:

```bash
pnpm dev:web
pnpm dev:cms
```


# Assignment Objectives Covered
- Next.js Page Router
- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)
- Dynamic routing
- Headless CMS integration wiht strapi
- CMS content structure modeling
- API integration
- React Query
- Tailwind CSS styling
- Responsive UI development
- Contact form handle
- Error handling
- Loading states
- Monorepo architecture