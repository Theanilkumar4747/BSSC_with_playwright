import { Page, test } from '@playwright/test';

type ActionStatus = 'STARTED' | 'PASSED' | 'FAILED';

interface ActionEntry {
  status: ActionStatus;
  action: string;
  details?: string;
  error?: string;
  timestamp: string;
}

/** Records readable, non-sensitive test actions for the HTML report. */
export class ActionLogger {
  private readonly entries: ActionEntry[] = [];
  private screenshotIndex = 0;

  constructor(private readonly page: Page) {}

  async step<T>(action: string, operation: () => Promise<T>, details?: string): Promise<T> {
    try {
      const result = await test.step(action, operation);
      await this.attachStepScreenshot(action);
      this.record('PASSED', action, details);
      return result;
    } catch (error) {
      this.record('FAILED', action, details, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  private async attachStepScreenshot(action: string): Promise<void> {
    this.screenshotIndex += 1;
    const stepName = action.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-|-$/g, '');
    await test.info().attach(
      `step-${String(this.screenshotIndex).padStart(3, '0')}-${stepName}`,
      {
        body: await this.page.screenshot({
          animations: 'disabled',
          mask: [this.page.locator('input[type="password"]')],
        }),
        contentType: 'image/png',
      },
    );
  }

  record(status: ActionStatus, action: string, details?: string, error?: string): void {
    this.entries.push({
      status,action,details,error,
      timestamp: new Date().toISOString(),
    });
  }

  toText(): string {
    return this.entries
      .map((entry, index) => {
        const detailText = entry.details ? ` | ${entry.details}` : '';
        const errorText = entry.error ? ` | Error: ${entry.error}` : '';
        return `${index + 1}. [${entry.status}] ${entry.action}${detailText}${errorText} | ${entry.timestamp}`;
      })
      .join('\n');
  }
}