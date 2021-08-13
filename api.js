import got from "got";

export class ApiClient {
  constructor({ token, organization, project }) {
    this.token = token;
    this.organization = organization;
    this.project = project;

    this.client = got.extend({
      prefixUrl: `https://sentry.io/api/0`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async getJson(url) {
    return this.client.get(url).json();
  }

  async fetchEvents() {
    return this.getJson(`projects/${this.organization}/${this.project}/events/`);
  }

  async fetchIssues() {
    return this.getJson(`projects/${this.organization}/${this.project}/issues/`);
  }

  async fetchEvent(eventId) {
    return this.getJson(`projects/${this.organization}/${this.project}/events/${eventId}/json/`);
  }

  async fetchLatestEventForIssue(issueId) {
    return this.getJson(`issues/${issueId}/events/latest/`);
  }
}
