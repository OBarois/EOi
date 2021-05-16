import React, {  useGlobal, useEffect } from 'reactn';

export default function useEoiStateManager() {
    const [altitude, ] = useGlobal('altitude')
    const [resultDesc, ] = useGlobal('resultDesc')
    const [ goToDate, setgoToDate ] = useGlobal('goToDate')

    useEffect(() => {
        if(altitude > 3000) setgoToDate(resultDesc.firstItemDate)
    },[resultDesc])

    return
  }