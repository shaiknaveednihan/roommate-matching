# RoomMate — Roommate Matching for Students

Find compatible roommates based on city, gender, lifestyle, and budget. Built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## Deploy to Vercel

1. Push this folder to a private GitHub repository. Leave credentials, local databases, and dependency folders out of Git.
2. Import the repository as a Next.js project in Vercel. Set the root directory to the folder containing `package.json`.
3. Connect a Neon Postgres database in Vercel. Confirm that `DATABASE_URL` is available in the deployment environment. If present, `DATABASE_URL_UNPOOLED` is used for migrations.
4. Deploy or redeploy after connecting the database. The build command in `vercel.json` creates the four tables and indexes before building the app.
5. Register two test accounts. Complete profiles with the same city, gender, and lifestyle answers. Open a match and send messages in both directions. Redeploy and confirm the messages are still there.

This version starts with a fresh Postgres database. The local SQLite data and demo accounts are separate.

## Run locally

Use Node.js 24 and set `DATABASE_URL` in a local `.env.local` file with a development database connection string.

```sh
npm ci
npm run db:migrate
npm run dev
```

Open http://localhost:3000 and register an account.

## How it works

1. Register or sign in, then complete your profile and questionnaire.
2. Browse completed profiles in the same city and gender, ranked by compatibility. Open a profile for a factor-by-factor breakdown.
3. Select **Message** when a match scores strictly above 80%. The server checks eligibility when opening a conversation and sending a message. Login emails stay private and the form does not collect phone numbers.
4. Open **Messages** to return to your conversations. Open chats refresh automatically and display the latest 100 messages.
5. Edit your answers in **My Profile**. The app recalculates compatibility from the current answers, so changes can affect chat access.
6. Report inappropriate profiles. Three active reports from different users hide a profile from matches, profile pages, and chat.

## Compatibility weights

The 16 factors total 100 points. Ordered answers receive partial credit based on their distance. Hobbies score based on shared interests relative to the smaller hobby list. The total is rounded to a whole-number percentage.

| Factor | Points |
|---|---:|
| Smoking | 16 |
| Sleep schedule, cleanliness | 12 each |
| Noise tolerance, guests, food | 7 each |
| Alcohol, budget | 6 each |
| Room type | 5 |
| Handling disagreements, snoring | 4 each |
| Social preference, hobbies, sleep lighting, overnight guests | 3 each |
| Dividing chores | 2 |
