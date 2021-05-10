import React, {  useGlobal } from 'reactn';

import MissionSelector from "../components/missionselector"

function MissionSelectorContainer() {

    const [mission, setMission] = useGlobal('mission')

    return (
        <MissionSelector initialmission={mission} onMissionChange={setMission}></MissionSelector> 
     )
}

export default MissionSelectorContainer;
