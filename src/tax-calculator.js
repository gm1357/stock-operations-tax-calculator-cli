export function calculateManyLedgersTaxes(operationsLedgers) {
  return operationsLedgers.map((ledger) => calculateLedgerTaxes(ledger));
}

function calculateLedgerTaxes(operationsLedger) {
  return operationsLedger.map(() => {
    return { tax: 0 };
  });
}
