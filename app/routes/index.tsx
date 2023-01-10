import {createSource} from "async-states";
import {useLoaderData} from "@remix-run/react";
import {useAsyncState} from "react-async-states";


export function loader() {
  let src = createSource("index");

  let nmbr = Math.random();
  src.run(nmbr);
  console.log('generated a random number', nmbr)

  return Promise.resolve(nmbr);
}

export default function Index() {
  let {state: {data: as}} = useAsyncState("index");
  let data = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix - {data} - {as}</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
