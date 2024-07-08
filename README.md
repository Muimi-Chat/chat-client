# Chat Client

This repository contains the frontend client for the chat functionality in Muimi-Chat.

# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Directory Structure

<details>
<summary><strong>.github/workflows</strong> - Contains GitHub Actions workflows for CI/CD.</summary>

  - `deploy-vm.yml`: GitHub Actions workflow for deploying to VM.
</details>

<details>
<summary><strong>.vscode</strong> - Configuration files for VS Code workspace settings.</summary>

  - `settings.json`: Visual Studio Code settings configuration.
</details>

<details>
<summary><strong>src</strong> - Source code for the application.</summary>
  <details>
  <summary><strong>lib</strong> - Contains utility libraries and modules.</summary>
    <ul>
      <li><strong>components</strong> - Reusable UI components.</li>
      <li><strong>cookies</strong> - Modules for handling cookies.</li>
      <li><strong>services</strong> - Modules for interacting with backend services.</li>
      <li><strong>store</strong> - State management store modules.</li>
    </ul>
  </details>
  <details>
  <summary><strong>routes</strong> - Application routing components and pages.</summary>
    <ul>
      <li><strong>authenticate</strong> - Authentication page and related components.</li>
      <li><strong>change-email</strong> - Page for changing user email.</li>
      <li><strong>chat</strong> - Chat page and related components.</li>
      <li><strong>confirm-password-reset</strong> - Page for confirming password reset.</li>
      <li><strong>disable-totp</strong> - Page for disabling TOTP (Two-Factor Authentication).</li>
      <li><strong>login</strong> - User login page.</li>
      <li><strong>newtoken</strong> - Page for generating new tokens.</li>
      <li><strong>register</strong> - User registration page.</li>
      <li><strong>reset-password</strong> - Page for resetting user password.</li>
      <li><strong>settings</strong> - User settings page.</li>
    </ul>
  </details>
</details>

<details>
<summary><strong>static</strong> - Static files such as images and fonts.</summary>
  <ul>
    <li><strong>fonts</strong> - Font files used in the application.</li>
  </ul>
</details>

<details>
<summary><strong>tests</strong> - Test files and test utilities.</summary>
  <ul>
    <li><strong>test.js</strong> - Main test script file.</li>
  </ul>
</details>
