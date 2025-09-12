# Transformations Sample App

A React-based sample application demonstrating iTwin Platform Transformations Filter by Saved View transformation.

## Prerequisites

- Node.js
- iTwin Platform account and application registration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/iTwin/transformations-api-sample.git
cd transformations-sample
```

2. Install dependencies:
```bash
npm ci
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```env
IMJS_AUTH_CLIENT_CLIENT_ID=""
IMJS_AUTH_CLIENT_REDIRECT_URI="http://localhost:3000/sign-in"
IMJS_AUTH_CLIENT_LOGOUT_URI="http://localhost:3000/sign-out"
IMJS_AUTH_CLIENT_SCOPES="itwin-platform"
IMJS_AUTH_AUTHORITY="https://ims.bentley.com"
```

Fill in `IMJS_AUTH_CLIENT_CLIENT_ID` with your created SPA client id.

## Getting Started

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`

3. Sign in with your iTwin Platform credentials

4. Follow the step-by-step workflow:
   - Select source iTwin and iModel
   - Configure transformation settings
   - Process transformation
   - View results

## Project Structure

```
src/
├── App.tsx                                     # Root component of the app
├── common/
│   ├── hooks/                                  # Custom hooks used in the app
│   │   └── transformationsHooks.ts             # Transformations API hooks
│   ├── library/                                # Various reusable functions
│   │   └── transformationsClient.ts            # Transformations API client
│   └── ui/                                     # UI components used in the App
└── filter-sample/                              # Filter by Saved View components
    ├── create-configuration/                   # UI components used to configure and run transformation
    ├── view-progress/                          # UI components used to track transformation progress
    └── view-results/                           # UI components used to open viewer to inspect transformation results
```

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Additional Resources

- [iTwin Platform Documentation](https://developer.bentley.com)
- [Transformations API Reference](https://developer.bentley.com/apis/transformations/)

- [iTwin.js Learning Resources](https://www.itwinjs.org/learning/)
