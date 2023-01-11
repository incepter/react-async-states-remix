import {PassThrough} from "stream";
import type {EntryContext} from "@remix-run/node";
import {Response} from "@remix-run/node";
import {RemixServer} from "@remix-run/react";
import isbot from "isbot";
import {renderToPipeableStream} from "react-dom/server";
import {terminateContext} from "async-states";
import {Hydration, State} from "react-async-states";
import {myBackendContext} from "~/backendcontext";

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  console.log('handler request started!');
  return isbot(request.headers.get("user-agent"))
    ? handleBotRequest(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext
    )
    : handleBrowserRequest(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext
    );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let didError = false;

    console.log('started rendering');

    const {pipe, abort} = renderToPipeableStream(
      <Hydration context={myBackendContext}>
        <RemixServer context={remixContext} url={request.url}/>,
      </Hydration>,
      {
        onAllReady() {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let didError = false;

    const {pipe, abort} = renderToPipeableStream(
      <Hydration context={myBackendContext}>
        <RemixServer context={remixContext} url={request.url}/>
      </Hydration>,
      {
        onShellReady() {
          terminateContext(myBackendContext);
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(err: unknown) {
          terminateContext(myBackendContext);
          reject(err);
        },
        onError(error: unknown) {
          terminateContext(myBackendContext);
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
