import React, {  useGlobal } from 'reactn';

import MissionSelector from "../components/missionselector"

function C_MissionSelector() {

    const [mission, setMission] = useGlobal('mission')

    return (
        <MissionSelector initialmission={mission} onMissionChange={setMission}></MissionSelector> 
     )
}

export default C_MissionSelector;
