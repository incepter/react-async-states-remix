import {
  createSource,
  Producer,
  ProducerConfig,
  ProducerProps,
  Sources
} from "async-states";
import {useAsyncState} from "react-async-states";
import {LoaderArgs} from "@remix-run/node";
import {Outlet} from "@remix-run/react";

async function fetchUsers(props: ProducerProps<any>) {
  let controller = new AbortController();
  props.onAbort(controller.abort.bind(controller));
  let signal = controller.signal;

  const response = await fetch(`https://jsonplaceholder.typicode.com/users`, {signal});
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
}

let users = Sources.for("users", fetchUsers);
export let loader = users.runp;
export default function Users() {
  let {state} = useAsyncState(users);
  console.log('state is', users.uniqueId, users.getState());

  return (
    <div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.4"}}>
      <ul>
        {state.status === "success" && state.data.map((user: any) => (
          <li key={user.id}>
            <a href={`/users/${user.id}`}>
            {user.username}
            </a>
          </li>
        ))}
      </ul>
      <Outlet />

    </div>
  );
}
