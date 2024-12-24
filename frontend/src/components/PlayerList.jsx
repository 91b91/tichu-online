import { useUser } from "../contexts/UserContext";

export function PlayerList() {
  const { userList } = useUser()

  console.log(userList)

  return (
    <>
      {userList.map(({id, name, room}) => {
        return <p>{name} </p>
      })}
    </>
  )
}