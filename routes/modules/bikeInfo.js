const express = require("express");
const router = express.Router();

const cityList = {
    "TaipeiCity": "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json",
    "Taichung": "https://newdatacenter.taichung.gov.tw/api/v1/no-auth/resource.download?rid=cab8f056-93e3-4aec-8909-1ba45d2b5d0d",
    //"TaoYuan": "https://opendata.tycg.gov.tw/api/v1/dataset/5ca2bfc7-9ace-4719-88ae-4034b9a5a55c/resource/08274d61-edbe-419d-8fcc-7a643831283d/download",
    //"NewTaipeiCity": "https://staging.data.ntpc.gov.tw/539831b5-32b2-4734-a60a-31152b59ea60",
}
    /* Taoyuan
    	scity(縣市中文名稱)、scityen(縣市英文名稱)、sna(場站中文名稱)、sarea(場站區域)、ar(地點)、
        snaen(場站名稱英文)、sareaen(場站區域英文)、aren(地址英文)、sno(站點代號)、tot(場站總停車格)、
        sbi(場站目前車輛數量)、mday(資料更新時間)、lat(緯度)、lng(經度)、bemp(空位數量)、act(全站禁用狀態)、
        sbi_detail(在站車輛數)
    */
    /* Taipei city
        sno(站點代號)、sna(場站中文名稱)、quantity(場站總停車格)、available_rent_bikes(場站目前車輛數量)、sarea(場站區域)、
        mday(資料更新時間)、latitude(緯度)、longitude(經度)、ar(地點)、sareaen(場站區域英文)、snaen(場站名稱英文)、aren(地址英文)、
        available_return_bikes(空位數量)、act(全站禁用狀態)、srcUpdateTime(YouBike2.0系統發布資料更新的時間)、
        updateTime(大數據平台經過處理後將資料存入DB的時間)、infoTime(各場站來源資料更新時間)、infoDate(各場站來源資料更新時間)
    */
   /* Tai Chung
        common part:
        ​​​sno: "500601001"
        ​​​sna: "YouBike2.0_綠川東中山路口"
        ​​​sarea: "中區"
        ​​​mday: "20251101164102"
        ​ar: "綠川東街/中山路口(東側)"
        ​​​sareaen: "Central Dist"
        ​​​snaen: "YouBike2.0_Luchuan E. St. / Zhongshan Rd."
        ​​​aren: "Luchuan E. St. & Zhongshan Rd. Intersection (East)"
        ​act: 1

        different part:
        ​​​tot: "16"
        ​​​scity: "台中市"
        ​​​scityen: "Taichung City"
        ​​​lat: "24.13785"
        ​​​lng: "120.68337"
        ​​​bemp: "3"
        ​​​sbi: "13"​​​​
    */

    /* target parameters:
        sno(站點代號)、sna(場站中文名稱)、total(場站總停車格)、availableRent(場站目前車輛數量)、sarea(場站區域)、
        mday(資料更新時間)、lat(緯度)、lon(經度)、ar(地點)、sareaen(場站區域英文)、snaen(場站名稱英文)、aren(地址英文)、
        availableReturn(空位數量)、act(全站禁用狀態)、srcUpdateTime(YouBike2.0系統發布資料更新的時間)、
        updateTime(大數據平台經過處理後將資料存入DB的時間)、infoTime(各場站來源資料更新時間)、infoDate(各場站來源資料更新時間)、
        city(縣市中文名稱)、cityen(縣市英文名稱)
    */

const commonKeys = ["sno", "sna", "sarea", "mday", "ar", "sareaen", "snaen", "aren", "act"];
const taipeiKeyConvertList = {
    "latitude": "lat", "longitude": "lon",
    "available_rent_bikes": "availableRent",
    "available_return_bikes": "availableReturn"
}
const taichungConvertList = {
    "lat": "lat", "lng": "lon",
    "scity": "city", "scityen": "cityen",
    "sbi": "availableRent", "bemp": "availableReturn"
}
const formatData = (cityName, dataIn) => {
    const dataOut = [];
    let convertList = {};
    let cityStr = "Unknown";
    let cityEngStr = "Unknown";
    switch(cityName) {
        case "TaipeiCity":
            convertList = taipeiKeyConvertList;
            cityStr = "台北市";
            cityEngStr = "Taipei City";
            break;
        case "Taichung":
            convertList = taichungConvertList;
            cityStr = "台中市";
            cityEngStr = "TaiChung City";
            dataIn = dataIn.retVal;
        default:
            break;
    }
    dataIn.forEach((item) => {
        const output = {};
        commonKeys.forEach((key) => {
            output[key] = item[key];
        })
        for (const [key, val] of Object.entries(convertList))
        {
            output[val] = item[key];
        }
        output["city"] = cityStr;
        output["cityen"] = cityEngStr;
        dataOut.push(output);
    })
    return dataOut;
}

router.get("/", (req, res) => {
    const availableList = Object.keys(cityList);
    res.status(200).json({
        list: availableList,
    })
});
router.get("/:cityName", async (req, res) => {
    const cityName = req.params.cityName;
    if (Object.keys(cityList).includes(cityName))
    {
        const url = cityList[cityName];
        try {
            //console.log (`${cityName} --> ${url}`);
            const response = await fetch(url);
            if (!response.ok)
            {
                throw new Error(`Download error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            const jsonDataFormatted = formatData (cityName, jsonData);
            res.json(jsonDataFormatted);
        }
        catch(error)
        {
            console.log ("Error: ", error);
            res.status(500).json({error: "error"})
        }
    }
    else
    {
        res.status(404).json({
            error: `City unavailable: ${cityName}`
        })
    }
});

module.exports = router;