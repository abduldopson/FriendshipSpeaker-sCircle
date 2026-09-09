FRIENDSHIP SPEAKER'S CIRCLE — SECURE MEMBER PORTAL WEBSITE INTEGRATION

PURPOSE
This patch connects the existing public website to the live school-authenticated Member Portal.

FILES TO UPLOAD/REPLACE IN THE GITHUB REPOSITORY ROOT
- site-config.js
- script.js
- the HTML files included in this ZIP

WHAT CHANGES
1. "Member Portal" is added under Participate in the website navigation.
2. Role Signup links now open the secure Apps Script portal.
3. Speech Request links now open the secure Apps Script portal.
4. Member Hub gets a prominent secure-portal launch section.
5. Attendance and Awards links now point to the newer live Google Sheet:
   https://docs.google.com/spreadsheets/d/1JhAgNkYHm1djYYn5uMRTtiv8xF6giAgIqMIHCZipZug/edit?usp=sharing
6. The website's local club assistant now sends members to the secure portal for roles/speeches.

SECURE PORTAL
https://script.google.com/a/macros/friendshipschools.com/s/AKfycbyZEIzv7_63jYnWHx-WAhOTq_VdZqBfbvo2qhcT8tLEcMD3Hxf3so3uGSggS7it2RYv/exec

IMPORTANT
- Do NOT upload or restore vercel.json from any older website ZIP.
- Do NOT add api/chat.js yet.
- This patch changes only frontend navigation/configuration.
- Vercel should auto-deploy after the files are committed to the main branch.
