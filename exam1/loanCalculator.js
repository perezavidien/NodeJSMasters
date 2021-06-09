// NOTE: Monthly installment formula
// run 'npm install' first
// LoanAmount * (1 + (LoanTerm *(InterestRate / 100))) / LoanTerm
// use this command to run -> node main.js --loanTerm=24 --bankName='bpi' --loanAmount=10000

'use strict';

const { argv, strict } = require('yargs');

class Bank {
    constructor(loanAmount, interestRate) {
        this.loanAmout = loanAmount;
        this.interestRate = interestRate;
    }

    getMonthlyInstallment(loanTerm) {
        // console.log(parseInt(this.loanAmout));
        // console.log(parseFloat(this.interestRate));
        // console.log(parseInt(loanTerm));
        return (this.loanAmout + (this.loanAmout * this.interestRate * loanTerm)) / loanTerm;
    }
}

class BDO extends Bank {
    constructor(loanAmount) {
        super(loanAmount, 0.017);
        this.loanAmout = loanAmount;
    }
}

class BPI extends Bank {
    constructor(loanAmount) {
        super(loanAmount, 0.012);
        this.loanAmout = loanAmount;
    }
}

class Metrobank extends Bank {
    constructor(loanAmount) {
        super(loanAmount, 0.015);
        this.loanAmout = loanAmount;
    }
}

class LoanCalculator {
    constructor(bankName, loanAmout, loanTerm) {

        if (typeof bankName !== 'string' || typeof loanAmout !== 'number' || typeof loanTerm !== 'number') {
            console.log('ERROR: Invalid parameters entered.');
            return;
        }

        this.bankName = bankName.trim().toLowerCase();
        this.loanAmout = loanAmout;
        this.loanTerm = loanTerm;
    }

    getMonthlyInstallment() {
        let myBank;

        switch (this.bankName) {
            case 'bdo':
                myBank = new BDO(this.loanAmout);
                break;
            case 'bpi':
                myBank = new BPI(this.loanAmout);
                break;
            case 'metrobank':
                myBank = new Metrobank(this.loanAmout);
                break;
            default:
                console.log('Your bank is not supported')
                break;
        }

        if (!myBank)
            return false;

        return myBank.getMonthlyInstallment(this.loanTerm);
    }
}

const bankParam = argv.bankName;
const amountParam = argv.loanAmount;
const termParam = argv.loanTerm;

const myCalc = new LoanCalculator(bankParam, amountParam, termParam);
const mi = myCalc.getMonthlyInstallment();
if (mi)
    console.log(`Monthly Installment:  ${mi}`);