import {ProducerProps, Sources,} from "async-states";
import {useAsyncState} from "react-async-states";
import {LoaderArgs} from "@remix-run/node";
import {myBackendContext} from "~/backendcontext";

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

async function fetchUser(props: ProducerProps<any>) {
  let controller = new AbortController();
  props.onAbort(controller.abort.bind(controller));
  let signal = controller.signal;

  // await timeout(10000);
  let {params} = props.payload;
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${params.userId}`, {signal});
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
}


let user = Sources.for("user", fetchUser, {context: myBackendContext});

export function loader(args: LoaderArgs) {
  user.mergePayload({params: args.params});
  return user.runp();
}

export default function Index() {
  let {state, getPayload} = useAsyncState(user);
  console.log('render', getPayload()?.params?.userId);

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
