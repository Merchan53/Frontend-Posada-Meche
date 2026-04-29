import { Suspense } from "react"
import Loader from "../ui/Loader"

const Loadable = (Component) => {
  return (
    <Suspense fallback={<Loader className=""/>}>
        <Component/>
    </Suspense>
  )
}

export default Loadable