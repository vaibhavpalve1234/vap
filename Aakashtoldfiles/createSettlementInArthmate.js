import createSettlementInArthmate from '../../../../functions/arthmate/userSettlement';
const createCustomerFromCSV = async (
  jsonArray,
) => {

  for (let i = 0; i < jsonArray.length; i++) {
    await createSettlementInArthmate(jsonArray[i]["userIdentifier"],jsonArray[i]["loanId"],{"txn_id":`29223758041 - ${i}`,"txn_date":"2022-09-05"})
  }
};
module.exports = createCustomerFromCSV;
