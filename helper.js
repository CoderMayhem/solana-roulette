function getReturnAmount(investment, factor) {
    return investment * factor;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = { getReturnAmount, randomNumber };
