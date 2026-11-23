import {
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";

import { app } from "./config";

// No popup/redirect helper is loaded here, so the page does not wait for
// Google's sign-in iframe at startup. The Google sign-in pages load it
// themselves (see LoginPage and RegisterPage).
export const auth = initializeAuth(app, {
  persistence: [
    indexedDBLocalPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
  ],
});