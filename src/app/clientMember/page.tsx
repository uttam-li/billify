import Image from "next/image";
import { getUserSession } from "../../../lib/actions";

const ClientMemeber = async () => {
    const {props} = await getUserSession()
    console.log(props?.session.user.id)
      return (
        <div>
          <h1>Member Client Session</h1>
        </div>
      );
}

export default ClientMemeber