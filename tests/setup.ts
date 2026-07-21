import { clearDatabase, closeDatabase } from "./helpers/database";

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});