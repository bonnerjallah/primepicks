import { useEffect, useState } from "react";

const useBodyScrolllock = () => {
    const bodyStyle = document.body.style

    const [islocked, setIsLocked] = useState(bodyStyle.overflowY === "hidden")

    useEffect(() => {
        bodyStyle.overflow = islocked ? "hidden" : "auto"
    }, [islocked, bodyStyle])

    const toggle = () => setIsLocked(!islocked)
    
    return [islocked, toggle]
}

export default useBodyScrolllock