

# Add Suggestions Link to Navigation

Add a "Suggest" nav item to the header for logged-in users (non-admin). It should appear after Dashboard using the `Lightbulb` icon, matching the existing nav style.

## Changes

**`src/components/AppHeader.tsx`**
- Import `Lightbulb` from lucide-react
- Add `{ path: "/suggestions", label: "Suggest", icon: Lightbulb }` to the `navItems` array, visible only when `user` is logged in

