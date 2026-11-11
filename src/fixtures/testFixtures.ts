import { chromium, test as baseTest, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { RegistrationPage } from '../pages/RegistrationPage';
import { LoginPage } from '../pages/LoginPage';
import { ActionLogger } from './actionLogger';

/**
 * Extended Playwright test fixtures with pre-instantiated Page Objects
 */
type CustomFixtures = {
  actionLogger: ActionLogger;
  registrationPage: RegistrationPage;
  loginPage: LoginPage;
};

export const test = baseTest.extend<CustomFixtures>({
  context: async ({ baseURL, viewport }, use, testInfo) => {
    const userDataDir = path.resolve(process.cwd(), '.playwright', 'chrome-profile');
    await mkdir(userDataDir, { recursive: true });
    await mkdir(testInfo.outputPath(), { recursive: true });

    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chrome',
      headless: false,
      args: ['--profile-directory=Default'],
      baseURL,
      viewport,
      recordVideo: { dir: testInfo.outputPath() },
    });

    try {
      await use(context);
    } finally {
      const videos = context.pages().flatMap((page) => {
        const video = page.video();
        return video ? [video] : [];
      });

      await context.close();
      for (const video of videos) {
        await testInfo.attach('video', { path: await video.path(), contentType: 'video/webm' });
      }
    }
  },

  actionLogger: async ({ page }, use) => {
    await use(new ActionLogger(page));
  },

  registrationPage: async ({ page, actionLogger }, use) => {
    const regPage = new RegistrationPage(page, actionLogger);
    await use(regPage);
  },
  loginPage: async ({ page, actionLogger }, use) => {
    const lPage = new LoginPage(page, actionLogger);
    await use(lPage);
  },
});
test.afterEach(async ({ page, actionLogger }, testInfo) => {
  await testInfo.attach('action-log', {
    body: actionLogger.toText() || 'No instrumented page-object actions were recorded.',
    contentType: 'text/plain',
  });

  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach('failure-screenshot-full-page', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  }
});

export { expect };
