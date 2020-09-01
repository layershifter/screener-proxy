# screener-proxy

This Github App is designed only to be used with [Fluent UI React Northstar](https://github.com/microsoft/fluentui/tree/master/packages/fluentui). It provides the integration between [Screener](https://screener.io/) and Github.

### How it works?

There are two API endpoints:
- `/api/github` - an endpoint for a Github App, listens for PR webhooks from Github and creates a [Github check](https://docs.github.com/en/rest/reference/checks)
- `/api/screener` - an endpoint for a Screener, listens for [webhooks from Screener](https://screener.io/v2/docs/webhooks) that can mark a created previously check as failed or successful

### Deployment

This repo uses [Vercel](https://vercel.com/) for deployments, any push to the `master` branch will trigger a production deployment.