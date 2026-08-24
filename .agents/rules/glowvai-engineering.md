# GlowVAI V2 Engineering Rules & Standard Operating Procedures

## Core Engineering Principles
1. **Work One Small Module at a Time**: Break down complex features into small, verifiable, atomic units. Never rush across multiple disconnected layers simultaneously.
2. **Inspect Before Modifying**: Always read and verify existing files, schema types, configuration, and dependencies before proposing or making changes.
3. **Never Overwrite User Files Without Approval**: Protect existing user code, config, and state. State what is changing and why before modifying core files.
4. **Never Invent Production Integrations or Dummy Stubs as Final Code**:
   - Do not use fake success responses.
   - Do not pretend Firebase or external services are connected when they are not.
   - If credentials/keys are missing, throw/display clear configuration errors explaining what must be provided.
   - Build authentic loading, empty, error, retry, and offline states.
5. **Strict Secret Management & Privacy (Zero-Leak Policy)**:
   - Never hardcode API keys, service account JSONs, private keys, database passwords, or payment credentials in source code.
   - Never commit `.env` files or secrets to Git.
   - All client-side accessible keys (e.g., Google Maps demo/restricted key, Firebase public config) must be explicitly managed via environment variables and scoped.
6. **Explain Commands Before Running**: Always explain the exact command, what it does, and why it is necessary in simple, plain terms for a beginner developer.
7. **Explicit Confirmation Required For**:
   - Destructive commands (e.g., `rm -rf`, file deletions, git hard resets).
   - Package additions or major version updates (`npm install`, `npx expo install`).
   - Firebase deployment or Firestore index deployments.
   - Database migrations or database wiping.
   - Production releases and credential modifications.
8. **Maintain Implementation Checklist & Logs**:
   - Keep `logs/DEVELOPMENT_LOG.md` up to date with date, milestone, actions taken, and status.
   - Record significant architectural decisions in `logs/DECISIONS.md`.

## Quality & Architecture Standards
- **Framework**: React Native with Expo (Managed Workflow with Prebuild support).
- **Navigation**: Expo Router (file-based navigation with typed routes).
- **Language**: TypeScript with strict mode (`strict: true`, `noImplicitAny: true`).
- **Backend & Database**: Firebase Authentication (Phone Auth), Cloud Firestore (typed repositories), Firebase Storage, Firebase Cloud Functions (Node.js/TypeScript).
- **Location & Geofencing**: Google Maps Platform with exact polygon geofencing for Vijayawada quick-commerce vs Standard pan-India e-commerce.
- **Machine Learning (CNN)**: Inspect model format, shape, labels, preprocessing, and licensing before integration. Zero hallucinated/faked inference.
