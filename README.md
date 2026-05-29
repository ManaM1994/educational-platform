# Educational Platform

This repository contains an educational platform built with modern React and Next.js technologies.

## Technologies Used

- **Framework:** Next.js 16
- **Language:** TypeScript
- **UI Library:** Ant Design (`antd`) with `@ant-design/nextjs-registry` for Next.js integration
- **Styling:** Tailwind CSS is installed and configured, while Ant Design provides the main component system.
- **State Management:**
  - **Client state:** Redux Toolkit is used for application state such as theme switching.
  - **Server state / data fetching:** TanStack Query (`@tanstack/react-query`) manages remote data and caching.
- **HTTP client:** Axios is used for API requests and token handling.
- **Forms / validation:** React Hook Form with Yup / Zod for validation support.

## Project Features

- RTL layout support for Persian interfaces
- Dark / light theme switching powered by Redux Toolkit and Ant Design theme configuration
- Authentication flow for both students and tutors
- Course browsing, enrollment, and dashboard pages
- Tutor profile management and course management interfaces
- React Query powered data fetching and cache invalidation

## Running the App

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Important Notes

- Theme mode is stored in Redux state and used by the Ant Design `ConfigProvider`.
- Server state is managed with `@tanstack/react-query` using a shared `QueryClient`.
- API communication is handled by `axios` using a centralized instance in `src/lib/axios.ts`.

## Sample Test Credentials

Use the following credentials to test the app:

- **Teacher**
  - Username: `manamobahi73@gmail.com`
  - Password: `123`
- **Student**
  - Username: `mm@gmail.com`
  - Password: `123`

## Notes for Developers

- The app root layout wraps pages with `src/lib/providers.tsx`, which sets up Redux, React Query, Ant Design, and custom theming.
- The theme state is defined in `src/features/theme/themeSlice.ts` and exposed through Redux.
- Most API logic lives under `src/features/*/api` and uses Axios request functions with React Query hooks.
