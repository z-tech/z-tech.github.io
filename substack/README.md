# Newsletter landing page

This directory serves `https://andrewzitek.xyz/substack/` on the existing GitHub Pages site. It is buildless, with no dependencies. All page styles and scripts are scoped to this directory; the homepage and its stylesheet are unchanged.

## Design and sources

The page follows [CXL's landing-page guidance](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/): a clear reader benefit, a prominent signup form, minimal navigation, concise supporting evidence, and the same subscription action repeated at the bottom. Conversion improvement is a hypothesis to measure, not a promised rate.

The sample quotes a sentence from [Is the Internet Insecure On Purpose?](https://andrewleftasanexercise.substack.com/p/is-the-internet-insecure-on-purpose), verified against the publication's public RSS feed on November 14, 2026. The author background matches the personal site.

## Signup

The hero uses the [official Substack iframe](https://support.substack.com/hc/en-us/articles/360041759232-Can-I-embed-a-signup-form-for-my-Substack-publication), loaded eagerly. Substack's current stylesheet hides the publication header at iframe heights of 160px or less. Scrolling remains enabled for validation messages and text zoom. A direct signup link remains available if the iframe is blocked. No email address is handled by this page.

Substack may show plan selection, pledges, or recommendations after submission. A real signup must be checked with an owner-controlled email address before sending paid traffic; loading the form is not proof that the entire signup flow has passed.

## Measurement

GA4 property `G-MDTVW8WL6K` was found in the publication's public `google_analytics_4_token` setting. It is reused only on this landing page. The existing repository and live personal homepage contain no GA tag. The new tag is disabled on localhost, file previews, and other non-production hosts. Substack independently runs its own analytics inside its iframe, including in previews.

| Event | Meaning |
| --- | --- |
| `page_view` | Standard GA pageview, sent by the config command |
| `newsletter_landing_view` | Landing page loaded; distinguishes visits from Substack's own iframe pageviews |
| `subscribe_outbound` | Direct signup fallback link clicked |
| `sample_read` | Published essay link clicked |
| `signup_return` | Bottom CTA clicked to return to the form |

Events include `landing_variant`; click events also include `link_placement`. Register these as event-scoped custom dimensions in GA4 to use them in reports. Production delivery to GA4 requires a post-deployment check in Realtime/DebugView. Ad blockers can suppress measurements.

**Completed subscriptions are not measured by the parent page.** The Substack form is cross-origin and provides no documented completion event. Use [Substack's subscriber/source analytics](https://support.substack.com/hc/en-us/articles/5320347155860-A-guide-to-Substack-metrics) as the source of truth, and verify what the existing Substack GA integration sends during a controlled signup. Never mark the click events above as completed-subscription conversions.

UTM parameters are forwarded to the iframe and outbound links, but Substack may label embedded subscriptions as `embed` and overwrite attribution during onboarding. Query forwarding does not prove end-to-end campaign attribution. Configure cross-domain measurement in GA4 for `andrewzitek.xyz` and `andrewleftasanexercise.substack.com`, then verify source and variant survival during an actual signup before calculating variant-level conversion rates. That account configuration cannot be completed from these static source files.

## Headline experiment

Default / `?variant=a`: “The future is being built. Who gets a say?”

`?variant=b`: “Technology is a choice. Understand yours.”

Use an equal, randomized split in the ad platform, keeping the audience, creative, budget, and dates comparable. Example destinations:

```text
https://andrewzitek.xyz/substack/?variant=a&utm_source=reddit&utm_medium=paid_social&utm_campaign=newsletter_test&utm_content=headline_a
https://andrewzitek.xyz/substack/?variant=b&utm_source=reddit&utm_medium=paid_social&utm_campaign=newsletter_test&utm_content=headline_b
```

Only `b` selects the alternate; other values use `a`. Existing UTM values are preserved. Untagged outbound visits receive `andrewzitek.xyz` / `referral` / `newsletter_landing` and the headline variant as `utm_content`. No automatic experiment runs merely by deploying this page.

## Preview

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/substack/`. Check both variants, narrow screens, keyboard navigation, form errors, and the signup fallback. The core copy, embed, and links work without this page's JavaScript; Substack requires its own JavaScript for signup. Publish through the existing GitHub Pages workflow.

The stylesheet URL in `index.html` includes a content-hash version to prevent stale browser caches after deployment. Whenever `landing.css` changes, update its `?v=` value to the first 12 characters of the CSS file’s SHA-256 hash.
