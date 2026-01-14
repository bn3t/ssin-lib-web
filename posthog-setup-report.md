# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the SSIN-LIB web application. This Next.js 16 app router project now includes comprehensive event tracking for key user interactions, with automatic exception capture and pageview tracking enabled.

## Integration Summary

The following files were created or modified:

### New Files Created
- **`instrumentation-client.ts`** - Client-side PostHog initialization using the recommended Next.js 15.3+ approach
- **`.env`** - Environment variables for PostHog API key and host (EU region)
- **`src/components/home-cta-buttons.tsx`** - Client component wrapper for home page CTAs with analytics

### Modified Files
- **`src/components/ssin-generator-form.tsx`** - Added event tracking for SSIN generation flow
- **`src/components/ssin-validator-form.tsx`** - Added event tracking for SSIN validation with success/failure tracking
- **`src/components/header.tsx`** - Added navigation and GitHub link tracking
- **`src/app/page.tsx`** - Updated to use HomeCtaButtons component for tracked CTAs

## Events Implemented

| Event Name | Description | File Path | Properties |
|------------|-------------|-----------|------------|
| `ssin_generated` | User successfully generated a valid Belgian SSIN number | `src/components/ssin-generator-form.tsx` | `gender`, `has_custom_order_number`, `birth_year` |
| `ssin_generation_copy` | User copied the generated SSIN to clipboard | `src/components/ssin-generator-form.tsx` | - |
| `ssin_validated` | User validated an SSIN number (includes success/failure status) | `src/components/ssin-validator-form.tsx` | `is_valid`, `failure_reason`, `ssin_type`, `gender` |
| `cta_clicked` | User clicked a call-to-action button on the home page | `src/components/home-cta-buttons.tsx` | `destination`, `label`, `source` |
| `navigation_clicked` | User clicked a navigation item in the header | `src/components/header.tsx` | `destination`, `label`, `source` |
| `github_link_clicked` | User clicked the GitHub repository link | `src/components/header.tsx` | `source` |
| `mobile_menu_toggled` | User opened or closed the mobile navigation menu | `src/components/header.tsx` | `action` |
| `gender_selected` | User selected a gender option in the SSIN generator form | `src/components/ssin-generator-form.tsx` | `gender` |
| `birth_date_selected` | User selected a birth date in the SSIN generator form | `src/components/ssin-generator-form.tsx` | `birth_year` |

## Additional Features

- **Exception Tracking**: Automatic capture of unhandled exceptions via `capture_exceptions: true`
- **Error Tracking**: Manual `posthog.captureException()` calls for SSIN generation and validation errors
- **Debug Mode**: Enabled in development environment for easier debugging

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://eu.posthog.com/project/114771/dashboard/484539) - Core analytics dashboard with 5 key insights

### Insights
- [SSIN Generation & Validation Funnel](https://eu.posthog.com/project/114771/insights/zdT6SenU) - Tracks user progression from CTA click to SSIN generation and copy
- [SSIN Validation Success Rate](https://eu.posthog.com/project/114771/insights/uAgwjM2I) - Shows valid vs invalid SSIN validation attempts over time
- [Key Events Overview](https://eu.posthog.com/project/114771/insights/uiatuqdn) - Weekly bar chart of all key user events
- [Generator Form Engagement](https://eu.posthog.com/project/114771/insights/powDoNuX) - Funnel tracking form field interactions to successful generation
- [Gender Distribution in Generations](https://eu.posthog.com/project/114771/insights/jDmU3Wao) - Pie chart breakdown of SSIN generations by gender

## Environment Variables

Make sure to keep these environment variables configured:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_XXXX
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

For production deployments, add these to your deployment platform's environment variable configuration.
