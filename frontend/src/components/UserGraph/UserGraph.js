import React, { useState } from 'react'
import Navbars from '../Navbars'
import BarChart from './BarChart'
import { UserData } from './Data'
    
function UserGraph() {
    const [userData, setUserData] = useState({
        labels: UserData.map((data) => data.year),
        datasets: [
            {
                label: "User Gained",
                data: UserData.map((data) => data.userGain),
                backgroundColor: ["red", "yellow"]
            }
        ]
    })
    return (
        <div>
            <Navbars />
            <div className='container mt-2'>
                <div className='row'>
                    <div className='col-12'>
                        <div style={{ width: "200px" }}>
                            <BarChart chartData={userData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserGraph