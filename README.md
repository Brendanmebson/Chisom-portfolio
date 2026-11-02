# Chisom Jil, Executive Virtual Assistant

Personal portfolio. Plain HTML, CSS and JavaScript with no build step: open `index.html`, or deploy the folder to any static host.

## Files

- `index.html`: all page content
- `styles.css`: design tokens at the top, then one block per section
- `script.js`: menu, the Monday calendar, scroll clock, "Your Monday" planner, contact form, lightbox
- `assets/`: photographs and work samples

## Editing

**The Monday calendar** is drawn from the `mondayBlocks` list in `script.js`. A block with a `project` links to the `<article id="...">` with that id in `index.html`. Each article's `data-time` sets where the clock sits when it scrolls past (minutes since midnight, so 7am is 420).

**Add a project** by copying an `<article class="project">`. Images that share a `data-gallery` value open together in the lightbox.

**Colours and type sizes** are the custom properties at the top of `styles.css`. Each section picks its ground with `data-tone="black"`, `"brown"` or `"white"`; keep neighbouring sections different.

**Contact form**: it opens the visitor's email app with their name, plan and message filled in, using the address in `script.js`. To receive messages without an email app, connect a form service such as Formspree.

The type is Clash Grotesk, loaded from Fontshare.
