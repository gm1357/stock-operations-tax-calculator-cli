export function calculateManyLedgersTaxes(operationsLedgers) {
    return operationsLedgers.map(ledger => calculateLedgerTaxes(ledger));
}

function calculateLedgerTaxes(operationsLedger) {
    return operationsLedger.map((operation) => {
        return { tax: 0 };
    });
}