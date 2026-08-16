BOREDOM BUSTER v2
=================

Drop these files into the root of your GitHub Pages repository, replacing the existing files:

- index.html
- style.css
- app.js
- activities.json
- sw.js
- manifest.json

WHAT CHANGED
------------
1. Recommendation engine rebuilt around hard context filters:
   - Age must match.
   - Energy must match.
   - Mess is treated as a tolerance:
       Zero Mess = zero only
       Up to Minor = zero or minor
       Anything Goes = zero, minor, or full
   - Parent involvement can be Either, Independent, or Together.

2. Activity material metadata upgraded:
   - primaryItems = the central household object for the activity.
   - optionalItems = useful supporting household objects.
   - items is retained only for backward compatibility with older cached clients.

3. Better variety:
   - Recent history remembers the last 12 recommendations.
   - Recently shown activities receive a strong score penalty instead of dominating Try Another.
   - The engine randomly selects from a broad group of high-scoring matches instead of a tiny max-overlap tier.

4. Better matching:
   - Primary selected item match receives the strongest score.
   - Additional selected-item matches improve the score.
   - Context filters are applied before item scoring.
   - The old fallback to the entire activity database has been removed.

5. "Use ALL my selected items" option:
   - When enabled, every selected item must be represented in the activity metadata.
   - If no exact match exists, the app says so instead of silently returning an unrelated result.

6. Match explanations:
   - Result cards explain which selected objects caused the recommendation.

7. Personalization:
   - "Great idea" and "Not for us" feedback is saved locally on the device.
   - Favorites provide a gentle positive signal for similar household-object recommendations.
   - Dislikes provide a stronger negative signal for similar material combinations.
   - No account or backend is required.

8. 100 new activities:
   - Database increased from 299 to 399 total activities.
   - New activities emphasize previously thin Big Kid / Tween and Burn Energy combinations.
   - Real full-mess activities now exist, while the UI correctly calls the filter "Anything Goes."

9. Stray material cleanup:
   - The unselectable black_paper dependency was removed from the legacy activity data.

10. PWA/service-worker update:
   - Cache bumped to boredom-buster-v11.
   - Old caches are deleted on activation.
   - Local app files now use network-first fetching with cached offline fallback, reducing stale GitHub Pages deployments.

DEPLOYMENT NOTE
---------------
After replacing the files and pushing to GitHub, reload the site once while online. The v11 service worker will activate and remove older Boredom Buster caches. If the app was installed to a phone home screen, opening it online once after deployment is recommended.

DATA SUMMARY
------------
Total activities: 399
New activities: 100
Quiet: 241
Burn Energy: 158
Zero Mess: 304
Minor Mess: 77
Messy / Full: 18
Tween-eligible activities: 134
Big Kid-eligible activities: 249
Preschool-eligible activities: 252
Toddler-eligible activities: 183

VALIDATION PERFORMED
--------------------
- app.js syntax checked with Node.
- sw.js syntax checked with Node.
- activities.json parsed and schema-checked.
- manifest.json parsed.
- Verified 399 unique activity IDs.
- Verified 399 unique activity titles.
- Verified all activity material IDs exist in the 30 selectable household objects.
- Verified all JavaScript getElementById references exist in index.html.
