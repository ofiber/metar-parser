const metar = "METAR KDEN 141853Z 18009KT 10SM SCT047 BKN140 BKN220 26/13 A3010 RMK AO2 SLP106 T02610133";
// ORIG TEST CASE "METAR KALB 101451Z 01005KT 10SM FEW020 OVC100 24/12 A3010 RMK AO2 SLP194 T12440122 51010";

const cloudDict = {
    "FEW": "Few clouds",
    "SCT": "Scattered clouds",
    "BKN": "Broken clouds",
    "OVC": "Overcast",
    "CLR": "Clear skies"
};

const stationRegex = new RegExp("\\bMETAR\\s[A-Z]{4}\\b");
const timeRegex = new RegExp("\\b\\d{6}Z\\b");
const windRegex = new RegExp("\\b\\d{5}KT\\b|\\bCLM\\b");
const visibilityRegex = new RegExp("\\d{1,2}SM|CAVOK|\\b[0-9]{4}\\b");
const cloudRegex = new RegExp(/\b(OVC|FEW|SCT|BKN)\d{3}|CLR\b/g);
const tempAndDewpointRegex = new RegExp("\\bT\\d{8}\\b");
const altTempAndDewpointRegex = new RegExp("\\bM?\\d{2}/M?\\d{2}\\b");
const altimeterRegex = new RegExp("\\bA\\d{4}|Q\\d{4}\\b");
const remarksRegex = new RegExp("\\bRMK\\s(AO1|AO2)\\b");
const seaLevelPressureRegex = new RegExp("\\bSLP\\d{3}\\b");


function getStation(metar) {
    const station = metar.match(stationRegex);

    if(!station) return "No station found";

    else return `Station: ${station[0].replace("METAR ", "").trim()}`;
}

function getTime(metar) {
    const time = metar.match(timeRegex);

    if(!time) return "No time found";
    else {
        // Get current month -> ASSUMES METAR IS ALWAYS IN CURRENT MONTH
        const date = new Date();
        let month = date.getMonth() + 1;

        // Parse day and time out of time string -> Always UTC
        let day = time[0].slice(0, 2);
        let hour = time[0].slice(2, 4);
        let minute = time[0].slice(4, 6);

        return `Date: ${month}/${day}\nTime: ${hour}:${minute} UTC`;
    }
}

function getWind(metar) {
    const wind = metar.match(windRegex);

    if(!wind) return "No wind found";
    else if (wind[0] == "CLM") return "Wind: Calm";
    else {
        let windDir = wind[0].slice(0, 3);
        let windSpeed = wind[0].slice(3, 5);

        return `Wind: ${windDir} at ${windSpeed} knots`;
    }
}

function getVisibility(metar) {
    const visibility = metar.match(visibilityRegex);

    if(!visibility) return "No Vis";

    if(visibility[0].includes("SM")) {
        let sm = visibility[0].replace("SM", "");
        sm = sm + " miles";
        return `Visibility: ${sm}`;
    }
    else if(visibility[0].includes("CAVOK")) return "Clouds and visibility OK";
    else return `Visibility: ${visibility[0]} meters`;
}

///\b(OVC|FEW|SCT|BKN)\d{3}|CLR\b/g

function getClouds(metar) {
    const clouds = [...metar.matchAll(cloudRegex)];

    if(!clouds) return "No clouds found";
    else if(clouds[0][0] == "CLR") return "Clear skies";
    else {
        if(clouds.length > 1) {
            return clouds.map(cloud => {
                let cloudType = cloud[0].slice(0, 3);
                let cloudHeight = cloud[0].slice(3, 6);

                // Parse height to feet
                let height = parseInt(cloudHeight) * 100;

                return `${cloudDict[cloudType]} at ${height} feet`;
            }).join(", ");
        }
        else {    
            let cloudType = clouds[0][0].slice(0, 3);
            let cloudHeight = clouds[0][0].slice(3, 6);

            let height = parseInt(cloudHeight) * 100;

            return `${cloudDict[cloudType]} at ${height} feet`;
        }
    }
}

function getTempAndDewpoint(metar) {
    const tempAndDewpoint = metar.match(tempAndDewpointRegex);

    if(!tempAndDewpoint) {
        const altTempAndDewpoint = metar.match(altTempAndDewpointRegex);

        if(!altTempAndDewpoint) return "No temp and dewpoint found";
        else {
            let temp = altTempAndDewpoint[0].slice(0, 2);
            let dewpoint = altTempAndDewpoint[0].slice(3, 5);

            return `Temperature: ${temp}°C\nDewpoint: ${dewpoint}°C`;
        }
    }
    else {
        var t = tempAndDewpoint[0].replace("T", "");

        let temp = t.slice(0, 4);
        let dewpoint = t.slice(4, 8);

        temp = temp.slice(0, 3) + "." + temp.slice(3, 4);
        dewpoint = dewpoint.slice(0, 3) + "." + dewpoint.slice(3, 4);

        if(temp[0] == "1") { temp = temp.replace("1", "-"); }
        else if(temp[0] == "0") { temp = temp.replace("0", "");}

        if(dewpoint[0] == "1") { dewpoint = dewpoint.replace("1", "-"); }
        else if(dewpoint[0] == "0") { dewpoint = dewpoint.replace("0", "");}

        return `Temperature: ${temp}°C\nDewpoint: ${dewpoint}°C`;
    }
}

function getAltimeter(metar) {
    const altimeter = metar.match(altimeterRegex);

    if(!altimeter) return "No altimeter found";
    else if(altimeter[0].includes("A")) {
        altimeter[0] = altimeter[0].replace("A", "");
        altimeter[0] = altimeter[0].slice(0, 2) + "." + altimeter[0].slice(2, 4);

        return `Altimeter: ${altimeter[0]} inHg`;
    }
    else {
        altimeter[0] = altimeter[0].replace("Q", "");
        altimeter[0] = altimeter[0].slice(0, 2) + "." + altimeter[0].slice(2, 4);

        return `Altimeter: ${altimeter[0]} hPa`;
    }
}

function getRemarks(metar) {
    const remarks = metar.match(remarksRegex);

    if(!remarks) return "No remarks found";
    else {
        remarks[0] = remarks[0].replace("RMK", "");

        if(remarks[0].includes("AO1")) return "Remarks: Automated station with no precipitation discriminator";
        else return "Remarks: Automated station with precipitation discriminator";
    }
}

function getSeaLevelPressure(metar) {
    const seaLevelPressure = metar.match(seaLevelPressureRegex);

    if(!seaLevelPressure) return "No sea level pressure found";
    else {
        let slp = seaLevelPressure[0].replace("SLP", "");
        
        slp = "10" + slp.slice(0, 2) + "." + slp.slice(2, slp.length);

        return `Sea Level Pressure: ${slp} mb`;
    }

}

console.log(getStation(metar)); // KALB
console.log(getTime(metar)); // 10 day of the month, 14:51 UTC
console.log(getWind(metar)); // Wind: 010 at 5 knots
console.log(getClouds(metar)); // Overcast at 5000 feet
console.log(getTempAndDewpoint(metar)); // Temperature: 24°C, Dewpoint: 12°C
console.log(getVisibility(metar)); // 10SM
console.log(getAltimeter(metar)); // Altimeter: 3010 inHg
console.log(getRemarks(metar)); // Remarks: Automated station with precipitation discriminator
console.log(getSeaLevelPressure(metar)); // Sea level pressure: 194 hPa