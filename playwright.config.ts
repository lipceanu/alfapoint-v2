import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    // Desktop & laptop browsers
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "desktop-firefox", use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } } },
    { name: "desktop-safari", use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } } },
    { name: "laptop-edge", use: { ...devices["Desktop Edge"], viewport: { width: 1280, height: 720 } } },
    // iPhones (Safari/WebKit)
    { name: "iphone-se", use: { ...devices["iPhone SE"] } },
    { name: "iphone", use: { ...devices["iPhone 15"] } },
    { name: "iphone-pro-max", use: { ...devices["iPhone 15 Pro Max"] } },
    { name: "iphone-landscape", use: { ...devices["iPhone 15 landscape"] } },
    { name: "iphone-pro-max-landscape", use: { ...devices["iPhone 15 Pro Max landscape"] } },
    // Android phones (Chrome/Chromium)
    { name: "galaxy-s9-plus", use: { ...devices["Galaxy S9+"] } },
    { name: "galaxy-s24", use: { ...devices["Galaxy S24"] } },
    { name: "galaxy-a55", use: { ...devices["Galaxy A55"] } },
    { name: "android", use: { ...devices["Pixel 7"] } },
    { name: "android-landscape", use: { ...devices["Pixel 7 landscape"] } },
    // Tablets
    { name: "ipad", use: { ...devices["iPad (gen 7)"] } },
    { name: "ipad-landscape", use: { ...devices["iPad (gen 7) landscape"] } },
    { name: "ipad-mini", use: { ...devices["iPad Mini"] } },
    { name: "galaxy-tab-s9", use: { ...devices["Galaxy Tab S9"] } },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
