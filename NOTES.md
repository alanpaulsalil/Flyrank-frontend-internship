# NOTES: Hand-built vs. shadcn/ui

I built Modal, Tabs, and Disclosure by hand in `components/playground/` against
the W3C ARIA Authoring Practices Guide, then installed shadcn/ui's dialog and
tabs components and compared them against what I wrote.

## What I got right

- Correct roles: `dialog`/`aria-modal` on the Modal, `tab`/`tabpanel` on Tabs,
  `aria-expanded`/`aria-controls` on the Disclosure button.
- Full keyboard operation on all three: Tab/Shift+Tab trapped inside the modal
  with Escape to close and focus returning to the trigger button, Arrow
  Left/Right moving between tabs with wraparound, and native button behavior
  giving the disclosure Enter/Space for free.
- Roving tabindex on the tab list — only the active tab has `tabindex="0"`,
  so Tab skips past the inactive tabs entirely instead of stopping on each one.

## Concrete gaps between my version and shadcn's

**1. My modal doesn't render in a Portal; shadcn's does.**
Searching `dialog.tsx`, shadcn's dialog content is wrapped in a Portal component,
so it renders as a direct child of `document.body` regardless of where the
`<Dialog>` is placed in the component tree. My `Modal` renders inline exactly
where I call it. In a simple page like my playground this looks identical, but
in a real app, if the modal's trigger button lived inside a container with
`overflow: hidden` or a lower `z-index` stacking context (a card, a table cell,
a scrollable sidebar), my modal could get visually clipped or trapped behind
other elements. shadcn avoids that entirely by escaping the DOM hierarchy at
render time — something I didn't think to handle by hand.

**2. My Tabs don't support an `orientation` prop; shadcn's does.**
shadcn's `tabs.tsx` has an `orientation` option that changes both the ARIA
wiring and which arrow keys move focus (Left/Right for horizontal tabs,
Up/Down for vertical tabs). I hardcoded ArrowRight = next tab and ArrowLeft =
previous tab, which only works correctly for a horizontal tab list. If I ever
needed a vertical tab layout, my current implementation would need Up/Down
handling added and wouldn't just be a prop flip like shadcn's is.

## Smaller things worth naming

- Both implementations land on the same core APG requirements — correct
  roles, keyboard trap in the modal, roving tabindex, Escape-to-close, and
  focus return. The gaps above are about robustness for real-world usage
  (stacking contexts, layout flexibility) that a component library has to
  handle because it can't assume a single, simple usage the way my playground
  demo can.