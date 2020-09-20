import React from "react";
import { UserData } from "./UserData";
import * as r from "../misc/reference";

export function People(props: { people: { [key: string]: r.User } }) {
  return (
    <div>
      {props.people &&
        Object.entries(props.people).map(([userId, user]) => (
          <UserData key={userId} user={user} />
        ))}
    </div>
  );
}
