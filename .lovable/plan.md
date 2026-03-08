

# Fix "Back to Diseases" Link

The "Back to Diseases" links in `DiseaseDetail.tsx` point to `/diseases`, which doesn't exist as a route. The disease browsing page is `/discover`.

## Change

**`src/pages/DiseaseDetail.tsx`**
- Change both `to="/diseases"` references to `to="/discover"`
- Update link text from "Back to Diseases" to "Back to Discover"

