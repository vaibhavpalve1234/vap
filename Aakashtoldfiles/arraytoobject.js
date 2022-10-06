const fs = require("fs");
let userIdentifier = [8089967288, 8891370507, 9633883046, 9447169316, 9037012043, 9446859505, 9544491524, 9387686610, 9847809337]
let data = [];
let amount = [19000, 10011, 12765, 27300, 26000, 20000, 17300, 21900, 17008]
for (let i = 0; i < userIdentifier.length; i++) {
  console.log({ userIdentifier: userIdentifier[i] });
  console.log(",");
  console.log({ amount: amount[i] });
  data.push({
    userIdentifier: userIdentifier[i],
    amount: amount[i],
  });
}

fs.writeFile("jsonData.json", JSON.stringify(data), () => {
  console.log("done");
});
