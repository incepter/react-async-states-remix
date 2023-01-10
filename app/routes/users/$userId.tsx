import {
  createSource,
  Producer,
  ProducerConfig,
  ProducerProps,
  Sources
} from "async-states";
import {useAsyncState} from "react-async-states";
import {Outlet, useParams} from "@remix-run/react";
import {LoaderArgs} from "@remix-run/node";

async function fetchUser(props: ProducerProps<any>) {
  let controller = new AbortController();
  props.onAbort(controller.abort.bind(controller));
  let signal = controller.signal;

  let {params} = props.payload;
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${params.userId}`, {signal});
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
}

let user = Sources.for("user", fetchUser);

export function loader(args: LoaderArgs) {
  user.mergePayload({params: args.params});
  return user.runp();
}

export default function Index() {
  let params = useParams();
  let {state} = useAsyncState("user");
  // user.mergePayload({params});
  console.log('user state is', user.uniqueId, user.getState());

  return (
    <div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.4"}}>
      <h1>Welcome to Remix</h1>
      <details open>
        <pre>
        {state.status === "success" && JSON.stringify(state.data, null, 4)}
          </pre>
      </details>
    </div>
  );
}
