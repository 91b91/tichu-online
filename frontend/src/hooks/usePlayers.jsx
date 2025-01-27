import { useMemo } from "react";
import { useUser } from "../contexts/UserContext";

export function usePlayers() {
  const { userList, currentUser } = useUser();

  return useMemo(() => {
    if (!currentUser) {
      throw new Error('Current user is not defined');
    }

    const currentUserIndex = userList.findIndex(user => user.userId === currentUser.userId);

    if (currentUserIndex === -1) {
      throw new Error('Current user not found in list');
    }

    if (userList.length !== 4) {
      throw new Error('User list must contain exactly 4 players');
    }

    return {
      teammate: userList[(currentUserIndex + 2) % 4],
      leftOpponent: userList[(currentUserIndex + 1) % 4],
      rightOpponent: userList[(currentUserIndex + 3) % 4],
    };
  }, [userList, currentUser]);
}
