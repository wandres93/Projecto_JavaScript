function calculateEarningsAllCoins(myPowerPhs, networkPowerPhs = 100000) {
  const rewardsPer10min = {
    BTC: 0.0002,
    ETH: 0.003,
    DOGE: 10,
    BNB: 0.001,
    MATIC: 1.2,
    RLT: 0.15,
  };

  const myPowerHs = myPowerPhs * 1e15;
  const networkPowerHs = networkPowerPhs * 1e15;
  const userShare = myPowerHs / networkPowerHs;

  const earnings = {};

  for (const coin in rewardsPer10min) {
    const reward10min = rewardsPer10min[coin];
    const earn10min = userShare * reward10min;
    const earn24h = earn10min * 6 * 24;
    const earn30d = earn24h * 30;

    earnings[coin] = {
      every_10_min: earn10min,
      every_24_hours: earn24h,
      every_30_days: earn30d,
    };
  }

  return earnings;
}

/* Ejemplo de uso  */
const myPower = 68.892; /* En Ph/s */
const earnings = calculateEarningsAllCoins(myPower);

for (const coin in earnings) {
  console.log(`\n${coin} Earnings:`);
  console.log(`10 min: ${earnings[coin].every_10_min.toFixed(8)} ${coin}`);
  console.log(`24 h : ${earnings[coin].every_24_hours.toFixed(8)} ${coin}`);
  console.log(`30 d : ${earnings[coin].every_30_days.toFixed(8)} ${coin}`);
}
