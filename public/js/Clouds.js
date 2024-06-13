export { getCloudType };

// Dictionary of cloud types
var clouds = {
    "FEW": "Few clouds",
    "SCT": "Scattered clouds",
    "BKN": "Broken clouds",
    "OVC": "Overcast",
    "CLR": "Clear skies"
};

export function getCloudType(cloud) {
    return clouds[cloud];
}