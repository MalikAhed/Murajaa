# Contributing to Murajaa

Murajaa is a static Arabic RTL study app. It has no build step, account system,
or backend. Keep contributions compatible with GitHub Pages and the browser-only
storage model.

## Local review

Serve the repository over HTTP so the service worker and JSON imports work:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000> and check a first visit, a refresh, and an offline
reload after the service worker has installed.

## Content changes

- Preserve the existing subject, lesson, card, and identifier structure in
  `content.json`; do not renumber IDs or reorder cards without explaining why.
- Keep Arabic text in UTF-8 and verify every answer against its source. Do not
  remove the app's watermark/source warning for cards that still need review.
- Run the JSON syntax check before committing:

  ```sh
  python3 -m json.tool content.json > /dev/null
  ```

- Update `sw.js`'s cache version when changing files that are intentionally
  cached, then confirm the old cache is replaced after a reload.

## UI and privacy checks

Check RTL layout, keyboard navigation, dark and light themes, card reveal and
undo behavior, spaced-repetition scheduling, JSON import/export, and touch
controls. Study progress remains in the user's local browser; do not add
analytics, credentials, or personal data collection.

Use a focused branch and include the manual checks performed in the pull request.
