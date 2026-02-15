import React, { useEffect, useState } from 'react'
import style from './CityDrop.module.css'
import '../css/userregister.css'
function CityList({onSelectCity}) {

    let [search, setSearch] = useState("")
    let [citys, setCitys] = useState([])
    let [filterData, setFilterData] = useState([])
    let getCityData = async () => {
        const response = await fetch("http://localhost:5000/citylist");
        let result = await response.json();
        console.log(result)
        setCitys(result)
    }

    useEffect(() => {
        getCityData()
    },[])
    const handleSeach = (e) => {
        let val = e.target.value
        setSearch(val)
        setFilterData(
            val ? citys.filter((data) => data.city_name.toLowerCase().startsWith(val.toLowerCase())) : []

        )

    }
  
    const handlerCitySlection=(city)=>
    {
        setSearch(city.city_name)
        setFilterData([])
        if(onSelectCity)
        {
            onSelectCity(city.city_id)
        }
       
    }
    console.log(filterData)
    // console.log(citys)
    // console.log(search)
    return (
        <div className="col-lg-12 text-center   w-100">
            <input placeholder='search city...' type="text" className='form-control txtbx form-control-lg rounded-3' value={search} onChange={handleSeach} />
            {
                filterData.length > 0 && (
                    <ul className={style.ulstyle}>
                        {
                            filterData.map((citys) => {
                                return (
                                    <>
                                        <li onClick={()=>{handlerCitySlection(citys)}}> {citys.city_name}</li>
                                    </>
                                )
                            })
                        }

                    </ul>

                )
            }


        </div>
    )
}

export default CityList
