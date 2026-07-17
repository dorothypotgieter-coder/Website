# Evan's Batumi Journey — Mobile PWA

A mobile-first, installable keepsake documenting Evan de Wet's first World Chess Championship journey in Batumi, Georgia, representing South Africa at age eight.

## PWA features

- Installable on Android, iPhone/iPad and desktop
- Mobile app navigation and responsive galleries
- Photo lightbox
- Offline fallback and runtime photo caching
- Dedicated YouTube video gallery
- Netlify configuration with secure caching headers

## Deploy from GitHub to Netlify

1. Sign in to Netlify and choose **Add new project → Import an existing project**.
2. Select **GitHub** and choose the `dorothypotgieter-coder/Website` repository.
3. Netlify should detect `netlify.toml`. Leave the build command empty and publish directory as `.`.
4. Choose **Deploy**.
5. After deployment, open **Site configuration → Domain management** to rename the generated Netlify subdomain.

No build framework is required; this is a static HTML PWA.
