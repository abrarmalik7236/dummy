const random = () => {
    var rand1 = Math.floor(1000 + Math.random() * 9000);
    var rand2 = Math.floor(1000 + Math.random() * 9000);
    var rand = "" + rand1 + rand2;
    var randArr = Array.from(rand);
    var finalRand = randArr.sort(() => Math.random() - 0.5);
    var orderID = finalRand.join("");
    return orderID;
}

module.exports = { random };