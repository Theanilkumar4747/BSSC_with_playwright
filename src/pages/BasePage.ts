import { Page, Locator, expect } from '@playwright/test';
import { ActionLogger } from '../fixtures/actionLogger';

/**
 * Abstract Base Page providing reusable utilities, resilient locators, and robust interaction patterns.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page, protected readonly actionLogger?: ActionLogger) {
    this.page = page;
  }

  protected async action<T>(name: string, operation: () => Promise<T>, details?: string): Promise<T> {
    return this.actionLogger
      ? this.actionLogger.step(name, operation, details)
      : operation();
  }

  /**
   * Navigates to a specific path or URL
   */
  async navigateTo(path: string = '/'): Promise<void> {
    await this.action(`Navigate to ${path}`, () => this.page.goto(path, { waitUntil: 'domcontentloaded' }));
  }

  /**
   * Safely fills an input element with text after ensuring it is visible and editable
   */
  async fillInput(locator: Locator, value: string, fieldName = 'input field'): Promise<void> {
    await this.action(`Fill ${fieldName}`, async () => {
      await locator.waitFor({ state: 'visible' });
      await locator.clear();
      await locator.fill(value);
    });
  }

  /**
   * Selects an option from a standard HTML select element by value, index, or label,
   * with automatic wait for asynchronously populated options.
   */
  async selectDropdownOption(selectLocator: Locator, valueOrLabel: string, fieldName = 'dropdown option'): Promise<void> {
    await this.action(`Select ${fieldName}`, async () => {
      await selectLocator.waitFor({ state: 'visible' });

    // Wait for dropdown to have populated options if loaded via API
    try {
      await expect(async () => {
        const count = await selectLocator.locator('option').count();
        expect(count).toBeGreaterThan(1);
      }).toPass({ timeout: 5000 });
    } catch {
      // Continue if it is already populated or static
    }

      const options = await selectLocator.locator('option').all();
      for (const opt of options) {
      const text = (await opt.textContent()) || '';
      const val = (await opt.getAttribute('value')) || '';
      if (
        text.toLowerCase().includes(valueOrLabel.toLowerCase()) ||
        val.toLowerCase() === valueOrLabel.toLowerCase() ||
        val === valueOrLabel.replace(/^0+/, '')
      ) {
          await selectLocator.selectOption(val || { label: text });
          return;
        }
      }

      await selectLocator.selectOption(valueOrLabel).catch(() => {});
    }, valueOrLabel);
  }

  /**
   * Selects a radio button/pill button matching the given name and value
   */
  async selectRadioByValue(groupName: string, value: string): Promise<void> {
    await this.action(`Select ${groupName} option`, async () => {
      const radio = this.page.locator(`input[type="radio"][name="${groupName}"][value="${value}"]`);
      if (await radio.isVisible()) {
        await radio.check({ force: true });
      } else {
        const label = this.page.locator(`label:has(input[name="${groupName}"][value="${value}"])`);
        if (await label.isVisible()) {
          await label.click();
        } else {
          const pill = this.page.getByRole('radio', { name: value, exact: true });
          if (await pill.isVisible()) {
            await pill.check({ force: true });
          } else {
            await this.page.getByText(value, { exact: true }).first().click();
          }
        }
      }
    }, value);
  }

  /**
   * Waits for network requests to settle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.action('Wait for network idle', () => this.page.waitForLoadState('networkidle'));
  }

  /**
   * Checks if an element is currently visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return this.action('Check element visibility', async () => {
      try {
        return await locator.isVisible();
      } catch {
        return false;
      }
    });
  }

  /**
   * Retrieves text content cleanly trimmed
   */
  async getText(locator: Locator): Promise<string> {
    return this.action('Read visible text', async () => {
      await locator.waitFor({ state: 'visible' });
      const text = await locator.textContent();
      return text ? text.trim() : '';
    });
  }

  /**
   * Waits for a toast notification to appear and returns its message
   */
  async getToastMessage(): Promise<string> {
    return this.action('Read notification message', async () => {
      const toast = this.page.locator('.Toastify__toast-body, [role="alert"]').first();
      await toast.waitFor({ state: 'visible', timeout: 5000 });
      return (await toast.textContent()) || '';
    });
  }
}
