export let globalICAO = null;

window.onload = function() {
    var textarea = document.getElementById("metar");
    textarea.addEventListener("input", autoResize);

    var submitButton = document.getElementById("metarBtn");
    submitButton.addEventListener("click", submitMETAR);

    var icaoButton = document.getElementById("icaoBtn");
    icaoButton.addEventListener("click", submitICAO);

    function autoResize() {
        textarea.style.minWidth = "100px";

        textarea.style.width = "auto";
        textarea.style.width = textarea.value.length * 11 + "px";
    }
}

function submitICAO() {
    let icao = document.getElementById('icao').value;
    console.log(icao);

    globalICAO = icao;

    console.log('ICAO submitted: ' + icao);

    window.location.href = '/results.html';
}

function submitMETAR() {
    let metar = document.getElementById('metar').value;
    alert('METAR submitted: ' + metar);
}

function getICAO() {
    console.log('Returning ICAO: ' + globalICAO);
    return globalICAO;
}

module.exports = globalICAO;