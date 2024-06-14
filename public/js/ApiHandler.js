let globalRes = null;

async function getMetar(icaoCode) {

    let time = parseTimeToZulu();

    //console.log(time);
    
    if(!icaoCode) {
        icaoCode = "KATL";
    }
    else icaoCode = icaoCode.toUpperCase();

    let url = `https://aviationweather.gov/api/data/metar?ids=${icaoCode}&format=raw&taf=false&hours=0&date=${time}`;

    //console.log(url);

    return fetch(url, {
        method: 'GET',
    }).then(response => {
        return response.text();
    });
}

/*
function requestMetar(icaoCode) {
    let url = "https://aviationweather.gov/api/data/metar?ids=&format=raw&taf=false&hours=0&date=";
    let response = '';

    let time = parseTimeToZulu();

    url += time;

    if (!icaoCode) {
        icaoCode = "KATL";
    }

    icaoCode = icaoCode.toUpperCase();

    url = url.slice(0, 47) + icaoCode + url.slice(47);

    return new Promise((resolve, reject) => {
        performWebRequest(url, (success, res) => {
            if (!success) {
                resolve("-1");
                return;
            }

            response = res;

            if (!response) {
                const interval = setInterval(() => {
                    url = url.replace(time, '');
                    time = updateHour(time);
                    url += time;

                    performWebRequest(url, (success, res) => {
                        if (success && res) {
                            clearInterval(interval);
                            resolve(res);
                        } else if (!success) {
                            clearInterval(interval);
                            resolve("-1");
                        }
                    });
                }, 1000);
            } else {
                resolve(response);
            }
        });
    }).then((res) => {
        console.info(res);
    });
}*/

function updateHour(time) {
    let hr = time.substring(time.indexOf("_") + 1, time.indexOf("_") + 3);
    let hour = parseInt(hr, 10);

    hour -= 1;

    if (hour < 10) {
        hr = "0" + hour.toString();
    } else {
        hr = hour.toString();
    }

    time = time.slice(0, time.indexOf("_") + 1) + hr + time.slice(time.indexOf("_") + 3);
    return time;
}

function parseTimeToZulu() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');

    return `${year}${month}${day}_${hours}${minutes}` + "Z";
}

export async function requestMetar(icao) {
    console.log("Requesting METAR for " + icao);

    await getMetar(icao).then(result => {
        globalRes = result;
    });

    return globalRes;
}