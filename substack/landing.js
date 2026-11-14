(() => {
  'use strict';

  const publication = 'https://andrewleftasanexercise.substack.com';
  // Existing GA4 property verified in this publication's public configuration.
  const measurementId = 'G-MDTVW8WL6K';
  const params = new URLSearchParams(window.location.search);
  const variant = params.get('variant') === 'b' ? 'b' : 'a';
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  if (variant === 'b') {
    document.getElementById('headline-opening').textContent = 'Technology is a choice.';
    document.getElementById('headline-question').textContent = 'Understand yours.';
  }

  // Explicit variants let ad campaigns split traffic; no random assignment or storage.
  function withAttribution(rawUrl) {
    const url = new URL(rawUrl);
    for (const key of campaignKeys) {
      const value = params.get(key);
      if (value) url.searchParams.set(key, value);
    }
    if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'andrewzitek.xyz');
    if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'referral');
    if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', 'newsletter_landing');
    if (!url.searchParams.has('utm_content')) url.searchParams.set('utm_content', `headline_${variant}`);
    return url.href;
  }

  document.querySelectorAll('[data-substack-link]').forEach(link => {
    link.href = withAttribution(link.href);
  });
  document.getElementById('substack-embed').src = withAttribution(`${publication}/embed`);

  // Do not send local previews to the production analytics property.
  const isProduction = ['andrewzitek.xyz', 'www.andrewzitek.xyz', 'z-tech.github.io'].includes(window.location.hostname);
  if (!isProduction) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  // Only approved campaign fields enter the reported URL, never arbitrary query data.
  const reportUrl = new URL('https://andrewzitek.xyz/substack/');
  for (const key of campaignKeys) {
    const value = params.get(key);
    if (value) reportUrl.searchParams.set(key, value);
  }
  reportUrl.searchParams.set('variant', variant);

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_location: reportUrl.href,
    page_title: document.title,
    landing_variant: variant,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  window.gtag('event', 'newsletter_landing_view', { landing_variant: variant });

  document.querySelectorAll('[data-track]').forEach(link => {
    link.addEventListener('click', () => {
      window.gtag('event', link.dataset.track, {
        landing_variant: variant,
        link_placement: link.dataset.placement,
        transport_type: 'beacon'
      });
    });
  });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(tag);
  // The cross-origin iframe owns subscriptions. Never infer a completed signup
  // from iframe loads, focus changes, clicks, or undocumented postMessage events.
})();
