import { Page, Locator, FrameLocator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ActionLogger } from '../fixtures/actionLogger';

/**
 * Page Object Model representing the BSSC Candidate Login Page (/login).
 */
export class LoginPage extends BasePage {
  // --- Sidebar Links (Left Column) ---
  readonly linksCard: Locator;
  readonly advertisementLink: Locator;
  readonly photoInstructionsLink: Locator;
  readonly howToApplyLink: Locator;

  // --- Online Services (Right Column) ---
  readonly onlineServicesCard: Locator;
  readonly registerLink: Locator;
  readonly forgotRegistrationLink: Locator;

  // --- Center: Candidate Login & Iframe ---
  readonly loginFrameLocator: FrameLocator;
  readonly loginFrameElement: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page, actionLogger?: ActionLogger) {
    super(page, actionLogger);

    // Left Sidebar: Links
    this.linksCard = page.getByText('Links').first();
    this.advertisementLink = page.locator('a[href="/advertisement"]').or(page.getByText('Click Here To View Advertisement'));
    this.photoInstructionsLink = page.locator('a[href="/instructions"]').or(page.getByText('Important Instructions for Live Photo Upload'));
    this.howToApplyLink = page.locator('a[href="/how-to-apply"]').or(page.getByText('How To Apply'));

    // Right Sidebar: Online Services
    this.onlineServicesCard = page.getByText('Online Services').first();
    this.registerLink = page.locator('a[href="/register"]').or(page.getByText('Registration'));
    this.forgotRegistrationLink = page.locator('a[href="/forgot-registration"]').or(page.getByText('Forgot Your Registration Number'));

    // Center Frame: Zitadel Candidate Login
    this.loginFrameElement = page.locator('iframe[title="Candidate Login"]');
    this.loginFrameLocator = page.frameLocator('iframe[title="Candidate Login"]');

    // Frame inputs (inside iframe or fallback direct form)
    this.usernameInput = this.loginFrameLocator.locator('input[name="loginName"], input[name="username"], input[type="text"], input[name="email"]');
    this.passwordInput = this.loginFrameLocator.locator('input[name="password"], input[type="password"]');
    this.loginSubmitButton = this.loginFrameLocator.locator('button[type="submit"], button:has-text("Next"), button:has-text("Sign In"), button:has-text("Login")');
    this.forgotPasswordLink = this.loginFrameLocator.locator('a:has-text("Forgot password"), a:has-text("Reset password")');
  }


  async goto(): Promise<void> {
    await this.navigateTo('/login');
  }

  /**
   * Clicks on the Registration link to navigate to the Registration page
   */
  async clickRegisterLink(): Promise<void> {
    await this.action('Click Registration link', () => this.registerLink.first().click());
  }

  /**
   * Clicks on the Advertisement link
   */
  async clickAdvertisementLink(): Promise<void> {
    await this.action('Click Advertisement link', () => this.advertisementLink.first().click());
  }

  /**
   * Clicks on the Photo Instructions link
   */
  async clickPhotoInstructionsLink(): Promise<void> {
    await this.action('Click Photo Instructions link', () => this.photoInstructionsLink.first().click());
  }

  /**
   * Clicks on the How To Apply link
   */
  async clickHowToApplyLink(): Promise<void> {
    await this.action('Click How To Apply link', () => this.howToApplyLink.first().click());
  }

  /**
   * Clicks on the Forgot Registration link
   */
  async clickForgotRegistrationLink(): Promise<void> {
    await this.action('Click Forgot Registration link', () => this.forgotRegistrationLink.first().click());
  }

  /**
   * Performs login within the embedded Zitadel frame (or direct input)
   */
  async login(username: string, password?: string): Promise<void> {
    await this.action('Log in through candidate frame', async () => {
      await this.loginFrameElement.waitFor({ state: 'visible' });
      const userInput = this.usernameInput.first();
      await userInput.waitFor({ state: 'visible' });
      await this.action('Fill username', () => userInput.fill(username));

      if (password && await this.passwordInput.first().isVisible()) {
        await this.action('Fill password', () => this.passwordInput.first().fill(password));
      }

      if (await this.loginSubmitButton.first().isVisible()) {
        await this.action('Submit login form', () => this.loginSubmitButton.first().click());
      }
    });
  }
}
