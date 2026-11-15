# Instrument-AI

Instrument-AI is a study site for Instrumentation and Control Engineering at Dr. B. R. Ambedkar NIT Jalandhar. It walks through instruments, 3D views, simulations, interview practice, and the notes used in class. The live plant in the background is the ICE factory students see on the home page.

The site is public at [instrumentation.awasthi.tech](https://instrumentation.awasthi.tech).

This repository is open so other students and engineers can improve it. If you enjoy the project, contributions are welcome.

## What you can change

- Clearer theory, simple guides, or worked examples
- A missing instrument, simulation, or 3D view
- Interview questions and campus preparation notes
- Study links on the Resources page
- Layout, accessibility, and bugs

Please do not commit secrets, `.env` files, or private student records.

## Run it locally

You need Node.js 20 or newer.

```bash
git clone https://github.com/Pradeep-gif-hub/Instrumentation.git
cd Instrumentation
npm install
```

Create a `.env` file in the project folder. These names are required for sign-in and saved accounts:

```bash
DATABASE_URL=
GOOGLE_CLIENT_ID=
VITE_GOOGLE_CLIENT_ID=
SESSION_SECRET=
```

`GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID` are the same Google web client id. `DATABASE_URL` is the Neon pooled Postgres connection string. Suggestion emails also use `RESEND_API_KEY` or `GMAIL_USER` with `GMAIL_APP_PASSWORD` when those are set.

Start the site:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API listens on [http://127.0.0.1:4100](http://127.0.0.1:4100).

Check the project before you open a pull request:

```bash
npm run typecheck
npm run build
```

## Open a pull request

1. Fork [Pradeep-gif-hub/Instrumentation](https://github.com/Pradeep-gif-hub/Instrumentation).
2. Clone your fork and add the original repo as `upstream` if you want later updates.

```bash
git clone https://github.com/YOUR_USERNAME/Instrumentation.git
cd Instrumentation
git remote add upstream https://github.com/Pradeep-gif-hub/Instrumentation.git
```

3. Start from the latest `main`.

```bash
git checkout main
git pull upstream main
git checkout -b short-description-of-the-change
```

4. Make the change in that branch. Keep it focused on one improvement.
5. Run the checks.

```bash
npm run typecheck
npm run build
```

6. Commit and push the branch. The message should say why the change helps.

```bash
git add .
git commit -m "Explain why this change helps students."
git push -u origin short-description-of-the-change
```

7. On GitHub, open a pull request into `main`. In the description, write:
   - what changed
   - how you tested it
   - any page someone should click through

A maintainer will review it. Small, clear pull requests are easier to merge.

## Character sign-ups

People who ask to appear on the plant are stored in the Postgres table `engineer_applications`, in the `public` schema. Signed-in accounts are a different table, `users`. In the Neon table list, open `engineer_applications` to see name, year, email, LinkedIn, and contact details.
