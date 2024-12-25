import { useUser } from "../contexts/UserContext";

export function PlayerList() {
  const { userList } = useUser()

  return (
    <>
      {userList.map(({id, name, room}) => {
        return <p>{name} </p>
      })}
    </>
  )
}