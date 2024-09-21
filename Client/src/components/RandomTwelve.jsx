import { useEffect, useState } from "react"
import axios from "axios"

import randomtwelvestyle from "../styles/randomtwelvestyle.module.css"

const backEndUrl = import.meta.env.VITE_BACKENDURL


const RandomTwelve = () => {

    const [storeData, setStoreData] = useState([])
    const [randomTwelve, setRandomTwelve] = useState([])

    //Fetch store data
    useEffect(() => {
        const fetchData = async () => {
            try {
    
                const dbResponse = await axios.get(`${backEndUrl}/getallproducts`)
                const dbData = dbResponse.data


                const formatedDbData = dbData.map((elem) => ({
                    ...elem,
                    price: typeof elem.price === "number" ? elem.price.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})
                    : elem.price
                }))

                setStoreData(formatedDbData)


            } catch (error) {
                console.log("Error fetching data", error)
            }
        }

        fetchData()
    }, [])


    //Random Twelve
    useEffect(() => {

        const randomTwelveProductPicker = () => {
            if(storeData.length === 0) return null;

            const shuffled = [...storeData].sort(() => Math.random() - 0.5)

            const selectedProduct = shuffled.slice(0, 12)

            setRandomTwelve(selectedProduct)
        }

        randomTwelveProductPicker()

    }, [storeData])


    
    return (
        <>
            {randomTwelve && (
                <div className={randomtwelvestyle.mainContainer}>
                    {randomTwelve.map((elem, id) => (
                        <div key={id} >
                                <div className={randomtwelvestyle.productContainer}>
                                    <div className={randomtwelvestyle.porductImageWrapper}>
                                        <img src={`${backEndUrl}/productimages/${elem.image}`} alt="product title" width="100%" height="100%" />
                                    </div>
                                    <div className={randomtwelvestyle.productNamePriceWrapper}>
                                        <div>{elem.title}</div>
                                        <div>$ <strong>{elem.price}</strong></div>
                                    </div>
                                </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default RandomTwelve