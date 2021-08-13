import { readFileSync } from "fs";
import { ApiClient } from "./api.js";
import { diff } from "./diff.js";

const EVENTS_LIMIT = 10;
let CONFIG_FILE = {};

try {
  CONFIG_FILE = JSON.parse(readFileSync("./config.json", "utf-8"));
} catch (e) {
  console.log(e);
}

const CONFIG = {
  token: process.env.SENTRY_TOKEN || CONFIG_FILE.token,
  organization: process.env.SENTRY_ORGANIZATION || CONFIG_FILE.organization,
  project: process.env.SENTRY_PROJECT || CONFIG_FILE.project,
};

for (const key in CONFIG) {
  if (!CONFIG[key]) {
    throw new Error(`${key} is required`);
  }
}

const [eventID] = process.argv.slice(2);

if (!eventID) {
  throw new Error("Specific eventID or number of events to fetch is required.");
}

const client = new ApiClient(CONFIG);

if (eventID.length === 32) {
  // Specific event
  const event = await client.fetchEvent(eventID);
  console.log(`\nEvent ${event.event_id}`);
  diff(event);
} else {
  // N latest events
  const eventsNo = parseInt(eventID, 10);
  if (Number.isNaN(eventsNo) || eventsNo > EVENTS_LIMIT) {
    throw new Error(`Not a number or more than ${EVENTS_LIMIT} events requested.`);
  }

  const issues = (await client.fetchIssues()).slice(0, eventsNo);
  for (const issue of issues) {
    const { eventID } = await client.fetchLatestEventForIssue(issue.id);
    const event = await client.fetchEvent(eventID);
    console.log(`\nEvent ${event.event_id}`);
    diff(event);
  }
}
