# Friendship Speaker’s Circle Website — Launch Audit

Audit date: August 25, 2026

## Overall Status
**Strong / Pre-Launch**

The website has a consistent visual system, complete core navigation, responsive CSS, centralized external-link configuration, and a clear member journey. No broken internal page or asset references were found in the audited package.

## Passed Checks
- 12 main HTML pages present
- Consistent primary navigation across all pages
- One H1 per page
- Meta description on each page
- Local CSS, JavaScript, images, and calendar asset included
- All referenced internal HTML pages exist
- All referenced local assets exist
- All `data-link` keys used by pages exist in `site-config.js`
- Officer names are populated
- Club calendar is linked and includes an `.ics` import file
- Friendship homepage URL is current
- Toastmasters homepage URL is current
- Pathways mentoring language matches current Toastmasters guidance

## Launch Blockers / Decisions Needed

### 1. Google privacy and sharing
Protected club Google Sheets and Drive folders require the proper Friendship Google login. This keeps member-only resources behind Friendship authentication even if the website itself is public.

**Status:** Confirmed by club leadership. The site now labels protected Google resources with “Friendship Google login required.”

### 2. Remaining live links
The following still remain intentionally disabled:

These are not technical errors, but they are unfinished workflows.

### 3. Same workbook, same landing page
The Role Sign-Up, Attendance Tracker, and Awards Tracker buttons all point to the same base spreadsheet URL.

**Recommendation:** When available, use each sheet tab’s direct URL containing its unique `gid=` value. That will take members directly to the correct tab.

## Recommended Content Improvements

### Add an About Our Club page
The site explains the club across several pages, but there is no dedicated About page. Recommended content:
- Mission
- Vision
- “Conversations that Matter”
- “Speak. Connect. Grow. Lead.”
- “Together, We Rise. Together, We Thrive.”
- Toastmasters core values: Integrity, Respect, Service, Excellence
- Club story / purpose
- Relationship to Friendship Public Charter School

### Build a private Officer Hub
Recommended officer-only content:
- Board meeting agendas and minutes
- Club Success Plan
- Officer training
- Mentor assignments
- Action-item tracker
- Planning documents
- Membership / dues administration
- Officer resources

### Add real recognition content
The Celebration Wall currently has intentional placeholders for future honorees. Add names/photos only after awards are announced.

## Calendar Review
The 2026–2027 club calendar was reviewed against Friendship Public Charter School’s published school calendar. Planned meeting dates avoid the major closures used when the calendar was created. The club calendar is still a working schedule and should be updated when actual meeting locations, special events, or date changes are confirmed.

## Launch Readiness Score
- Design / branding: **9/10**
- Navigation / information architecture: **9/10**
- Member usability: **9/10**
- Content completeness: **8/10**
- Connected workflows: **7/10**
- Privacy readiness: **Needs verification**
- Public-launch readiness: **8/10 pending privacy + missing forms**

## Recommended Next Step
Build the **About Our Club** page next, then build the restricted **Officer Hub**, connect the remaining member forms, and perform the final live-host link test.

## Core Workflow Status
All primary member workflows are now connected: interest/join, meeting feedback, agendas, speech submission, and Pathways progress tracking.
