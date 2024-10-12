# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
```bash

.
├── public                  # Static files (publicly accessible)
│   ├── favicon.ico
│   └── assets              # Images, fonts, etc.
│
├── src                     # Source code
│   ├── assets              # Static assets (managed by Vite)
│   │   ├── images
│   │   └── fonts
│   │
│   ├── components          # Reusable UI components
│   │   ├── Button.jsx
│   │   └── Header.jsx
│   │
│   ├── config              # Environment variables, configurations
│   │   ├── env.js
│   │   └── apiConfig.js
│   │
│   │
│   ├── hooks               # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   │
│   ├── layouts             # Layout components (e.g., Navbar, Sidebar)
│   │   ├── DashboardLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── pages               # Page components (views)
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── NotFound.jsx
│   │
│   ├── router              # React Router setup
│   │   ├── PrivateRoute.jsx
│   │   └── AppRouter.jsx
│   │
│   ├── services            # Business logic, helpers
│   │   ├── authService.js
│   │   └── userService.js
│   │
│   ├── styles              # Global and component-specific styles
│   │   ├── global.css
│   │   └── components      # Component-level styles (CSS Modules)
│   │       └── Button.module.css
│   │
│   ├── tests               # Unit and integration tests
│   │   └── components
│   │       └── Button.test.jsx
│   │
│   ├── utils               # Utility functions
│   │   ├── formatDate.js
│   │   └── validateEmail.js
│   │
│   ├── App.jsx             # Main app component
│   ├── index.js            # Entry point
│   └── vite.config.js      # Vite configuration
│
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── README.md

```