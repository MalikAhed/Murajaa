# Murajaa responsive composition brief

## Composition

- Archetype: focused app shell with an editorial dashboard, rather than a fixed poster.
- Hierarchy: current review count and primary study action, followed by subjects, progress, and secondary tools.
- Direction: Arabic-first RTL; English remains a supported alternate UI direction.
- Essential live content: all headings, study controls, navigation, card text, progress, and status messages remain semantic HTML.

## Responsive states

| Constraint | Response |
| --- | --- |
| Narrow portrait | 16px gutters, compact two-column subject grid, persistent four-item navigation, 44px controls. |
| Standard portrait | Full dashboard rhythm with safe-area padding and a vertically scrolling screen. |
| Short landscape | Compact header/navigation and shorter study cards; content remains scrollable. |
| Tablet and desktop | Wider 48rem shell, four-column statistics, stronger breathing room, contained reading measure. |
| Ultrawide | Shell caps at 52rem and stays centered against a subtle ambient background. |
| Reduced motion | Entrance and flip motion collapse to stable, readable states. |

## Assets

The product is UI-led and does not need photographic art direction. Gradients are generated in CSS; the existing PWA icons and educational question images remain the only raster assets. Question images are content, not decoration, and keep their original proportions.

## Rendering decision

**2D.** Semantic HTML and CSS are sufficient for this productivity app. Three.js would add bundle weight and interaction complexity without improving study comprehension.
