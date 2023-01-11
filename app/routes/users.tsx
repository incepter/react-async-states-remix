import {createContext, ProducerProps, Sources} from "async-states";
import {useAsyncState} from "react-async-states";
import {Outlet} from "@remix-run/react";
import {LoaderArgs} from "@remix-run/node";
import {myBackendContext} from "~/backendcontext";

console.log('entry to modules')

let meter = 0;

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

async function fetchUsers(props: ProducerProps<any>) {
  let controller = new AbortController();
  props.onAbort(controller.abort.bind(controller));
  let signal = controller.signal;

  // await timeout(10000);
  const response = await fetch(`https://jsonplaceholder.typicode.com/users`, {signal});
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
}

let users = Sources.for("users", fetchUsers, {context: myBackendContext});

export async function loader(args: LoaderArgs) {
  return users.runp(args);
}

export default function Users() {
  let {state} = useAsyncState(users); // state === useLoaderData();

  return (
    <div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.4"}}>
      <h2>Users page:</h2>
      <ul>
        {state.status === "success" && state.data.map((user: any) => (
          <li key={user.id}>
            <a href={`/users/${user.id}`}>
              {user.username}
            </a>
          </li>
        ))}
      </ul>
      <Outlet/>
    </div>
  );
}
