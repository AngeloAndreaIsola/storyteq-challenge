import fs from "fs";
import readline from "readline";

export class ExcessiveCancellationsChecker {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async companiesInvolvedInExcessiveCancellations() {
    try {
      const trades = await this._readTrades();
      const violations = this._checkExcessiveCancellations(trades);
      return Array.from(violations);
    } catch (error) {
      throw new Error("Error processing the trades file: " + error.message);
    }
  }

  async totalNumberOfWellBehavedCompanies() {
    try {
      const trades = await this._readTrades();
      const violations = this._checkExcessiveCancellations(trades);
      const allCompanies = new Set(trades.map((trade) => trade.companyName));
      return allCompanies.size - violations.size;
    } catch (error) {
      throw new Error("Error processing the trades file: " + error.message);
    }
  }

  async _readTrades() {
    const trades = [];
    const fileStream = fs.createReadStream(this.filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const [time, companyName, orderType, quantity] = line
        .split(",")
        .map((val) => val.trim());
      trades.push({
        time: new Date(time),
        companyName,
        orderType,
        quantity: parseInt(quantity, 10),
      });
    }

    return trades;
  }

  _checkExcessiveCancellations(trades) {
    const violations = new Set();

    const tradesByCompany = trades.reduce((acc, trade) => {
      if (!acc[trade.companyName]) acc[trade.companyName] = [];
      acc[trade.companyName].push(trade);
      return acc;
    }, {});

    for (const [companyName, companyTrades] of Object.entries(
      tradesByCompany
    )) {
      companyTrades.sort((a, b) => a.time - b.time);

      let startIndex = 0;
      let cumulativeOrders = 0;
      let cumulativeCancels = 0;
      let hasOrders = false;

      for (let endIndex = 0; endIndex < companyTrades.length; endIndex++) {
        const endTrade = companyTrades[endIndex];

        if (endTrade.orderType === "D") {
          cumulativeOrders += endTrade.quantity;
          hasOrders = true;
        } else if (endTrade.orderType === "F") {
          cumulativeCancels += endTrade.quantity;
        }

        while ((endTrade.time - companyTrades[startIndex].time) / 1000 > 60) {
          const startTrade = companyTrades[startIndex];
          if (startTrade.orderType === "D") {
            cumulativeOrders -= startTrade.quantity;
          } else if (startTrade.orderType === "F") {
            cumulativeCancels -= startTrade.quantity;
          }
          startIndex++;
        }

        if (
          cumulativeOrders > 0 &&
          cumulativeCancels / cumulativeOrders > 1 / 3
        ) {
          violations.add(companyName);
          break;
        }
      }

      if (!hasOrders && cumulativeCancels > 0) {
        violations.add(companyName);
      }
    }

    return [...violations];
  }
}
