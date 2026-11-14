# Tibay Builders & Supply Co. — Sample Website

A static, single-page website for a **fictional** construction company in Lipa City, Batangas.
Built with plain HTML, CSS and vanilla JavaScript: no frameworks, no build step, no backend.
It is ready to host for free on **GitHub Pages**.

> Sample website for demonstration purposes. Company and data are fictional.

---

## Project structure

```
.
├── index.html        ← All page content (text, sections, image list)
├── css/
│   └── style.css     ← All styling (colors and fonts are at the top)
├── js/
│   └── main.js       ← Animations, menu, gallery, carousel, FAQ, form
├── assets/
│   └── favicon.svg   ← Browser tab icon (put your own photos here too)
└── README.md
```

All paths are **relative**, so the site works at `https://username.github.io/repo-name/`.

---

## Preview locally

Double-click `index.html` to open it in your browser. That's enough for most edits.

For a more realistic preview (recommended), run a tiny local server from the project folder:

```bash
# Python 3
python -m http.server 8000
# or Node.js
npx serve .
```

Then open http://localhost:8000.

---

## Deploy to GitHub Pages

1. **Create a repository** on GitHub, for example `tibay-builders`. Public repos get Pages for free.
2. **Upload the files.** Either:
   - **On the website:** open the repo, choose **Add file → Upload files**, drag in `index.html`, `README.md`, and the `css`, `js` and `assets` folders, then click **Commit changes**; or
   - **With Git:**
     ```bash
     git init
     git add .
     git commit -m "Initial website"
     git branch -M main
     git remote add origin https://github.com/USERNAME/tibay-builders.git
     git push -u origin main
     ```
3. **Turn on Pages:** in the repo go to **Settings → Pages**. Under **Build and deployment**, set
   **Source** to *Deploy from a branch*, **Branch** to `main`, and the folder to `/ (root)`. Click **Save**.
4. **Wait 1–2 minutes**, then refresh the Pages settings screen. Your site will be live at
   `https://USERNAME.github.io/tibay-builders/`.
5. **(Optional) Custom domain:** under **Settings → Pages → Custom domain**, enter your domain
   (e.g. `www.tibaybuilders.ph`) and add the DNS records GitHub shows you at your domain registrar.
   Tick **Enforce HTTPS** once it becomes available.

Each time you push changes to `main`, the site updates automatically within a minute or two.

---

## Make the quote form send emails (Formspree)

The form works in **demo mode** until you connect it. In demo mode it shows the success
message but doesn't send anything.

1. Sign up free at https://formspree.io and create a new form.
2. Copy your form ID (the part after `/f/`, e.g. `xyzabcd`).
3. In `index.html`, search for `YOUR_FORM_ID` and replace it:
   ```html
   <form ... action="https://formspree.io/f/xyzabcd" ...>
   ```
4. Publish, then submit a test request. Formspree will ask you to confirm your email the first time.

---

## Beginner editing guide

| What to change | Where |
|---|---|
| Text, services, projects, FAQ, testimonials | `index.html`. Each section is marked with a `<!-- ===== -->` comment. |
| **Photos** | `index.html`, the **IMAGE LIBRARY** block near the bottom (`window.SITE_IMAGES`). Replace a URL with your own, e.g. `"assets/dela-cruz-house.jpg"`. Then update that image's `alt` text in the matching project card. |
| Brand colors and fonts | `css/style.css`, top of the file (`:root { ... }`). |
| Stats numbers | `index.html`, Stats section: edit `data-target` (the number) and `data-suffix` (`+` or `%`). |
| Add a project | Copy one `<article class="project">` block, change its text, set `data-category` (`residential`, `commercial`, `renovation` or `roofing`), and add a new `projectN` key to the IMAGE LIBRARY. |
| Phone, email, address | Search `index.html` for the old value. It also appears in the JSON-LD block in `<head>` (used by Google). |
| Map | `index.html`, Contact section: change `q=Lipa+City,+Batangas` in the iframe URL. |
| Social links and Messenger | Footer and floating buttons: replace `https://facebook.com/`, `https://m.me/` and `https://www.tiktok.com/` with your page URLs (e.g. `https://m.me/yourpage`). |
| Carousel speed | `js/main.js`, the `AUTO_DELAY` value (milliseconds). |

**Tips for your own photos:** export them as JPG or WebP, about 1600px wide and under 300 KB each,
so the site stays fast on mobile data.

---

## Features

- Sticky navbar that turns solid on scroll, mobile hamburger menu, active-section highlight
- Brick-stacking page loader (under 1 second) and a scroll progress bar
- Full-screen hero with parallax (desktop) and animated headline
- Count-up stats, scroll-reveal animations (IntersectionObserver, no libraries)
- Filterable project gallery with a keyboard-accessible lightbox
- Animated "How We Work" timeline
- Auto-sliding testimonial carousel with swipe support
- Smooth FAQ accordion
- Quote form with client-side validation, Formspree support and a success animation
- Google Map embed, floating Messenger / Viber / call buttons
- SEO: meta tags, Open Graph, SVG favicon, LocalBusiness JSON-LD
- Accessibility: semantic HTML, skip link, ARIA labels, focus styles, keyboard navigation,
  and `prefers-reduced-motion` support (animations turn off)

## Credits

Photos from [Unsplash](https://unsplash.com) (free to use under the Unsplash License).
Fonts: Space Grotesk and Inter from Google Fonts.
