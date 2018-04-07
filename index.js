const MAX_TURNS = 100
const FEES = [
  100,
  400,
  1600,
  6000,
  20000,
  60000,
  200000,
  600000,
  2000000,
]

// If I win randomly, is it better to always play at the highest level or to
// keep a little money set aside?
//
// version 0
// Always bet 100.
//
// version 1
// Start with 500.
// Play as high as I can.
//
// version 2
// Start with 500.
// Play as high as 1/2 my current money.
//
// ----------------------------------------------------------------
//
//
// How high can I get?
// How many turn until broke?

const getBet = (money, mode) => {
  switch (mode) {
    case 0:
      return 100
    case 1:
      return Math.max(...FEES.filter(x => x <= money))
    case 2:
      return (() => {
        const canBetOn = FEES.filter(x => x <= money / 2)
        if (!canBetOn.length) {
          return FEES[0]
        }
        return Math.max(...canBetOn)
      })()
  }
}

const runTest = (mode, terse) => {
  let money = 500
  let turn = 0
  let madeTopBet = false
  let maxMoney = 0
  if (!terse) {
    console.log('turn|start|bet|end')
  }

  while (money > 0 && turn < MAX_TURNS && !madeTopBet) {
    const bet = getBet(money, mode)
    madeTopBet = bet === FEES[FEES.length - 1]

    const startMoney = money
    money -= bet

    const wonGame = Math.random() < 0.5
    if (wonGame) {
      money += 2 * bet
    }
    maxMoney = Math.max(money, maxMoney)

    turn++
    if (!terse) {
      console.log(`${turn}|${startMoney}|${bet}|${money}`)
    }
  }

  let result

  if (!money) {
    result = 'broke'
  } else if (turn === MAX_TURNS) {
    result = 'max turns'
  } else if (madeTopBet) {
    result = 'made top bet'
  }

  if (!terse) {
    console.log(`> ${result}`)
    console.log('')
  }

  return {
    value: result,
    maxMoney,
  }
}

const sample = (mode) => {
  let RUNS = 5000
  console.log(`\nmode ${mode}`)
  const tally = {}
  let totalMaxMoney = 0
  let run = RUNS
  while (run--) {
    let result = runTest(mode, 1)
    tally[result.value] = (tally[result.value] || 0) + 1
    totalMaxMoney += result.maxMoney
  }
  printTally(tally)
  const averageMaxMoney = totalMaxMoney / RUNS
  console.log('average max money', averageMaxMoney)
}

const printTally = tally => {
  Object.keys(tally)
    .sort()
    .forEach(key => {
      console.log(`${key}: ${tally[key]}`)
    })
}

sample(0)
sample(1)
sample(2)
