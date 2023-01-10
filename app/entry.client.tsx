import {RemixBrowser} from "@remix-run/react";
import {startTransition, StrictMode} from "react";
import {hydrateRoot} from "react-dom/client";

import {autoConfigureDevtools} from "async-states-devtools"
import "async-states-devtools/dist/style.css"
autoConfigureDevtools({open: true});


function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser/>
      </StrictMode>
    );
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
