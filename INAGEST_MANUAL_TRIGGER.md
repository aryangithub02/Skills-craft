# How to Manually Trigger Industry Insights

To invoke the function manually in the Inngest UI (`http://localhost:8288`):

1.  Click **"Test"** (or "Send Event").
2.  Use the following **Event Name**: `insight/generate`
3.  Use the following **Event Payload** (JSON):

```json
{
  "industry": "Tech"
}
```

*(You can replace "Tech" with "Marketing", "Finance", or whatever industry you want to generate insights for).*

4.  Click **"Send"**.

## Expected Result
1.  Inngest will show the function starting.
2.  It will call Gemini AI (takes ~2-5 seconds).
3.  It will update your Database.
4.  Refreshing the Dashboard (if you are user in "Tech") will show the new data.
