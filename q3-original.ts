// [1 - Blockchain] Despite being used below, WalletBalance does not have a blockchain property.
interface WalletBalance {
  currency: string;
  amount: number;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

class Datasource {
  // TODO: Implement datasource class
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  // [3 - Logic Issues] useWalletBalances() not defined.
  const [prices, setPrices] = useState({}); // [2 - Not type safe] Prices state initialised with no proper type.

  useEffect(() => {
    const datasource = new Datasource(
      "https://interview.switcheo.com/prices.json"
    );
    datasource
      .getPrices()
      .then((prices) => {
        setPrices(prices);
      })
      .catch((error) => {
        console.err(error);
      });
  }, []);

  const getPriority = (blockchain: any): number => {
    // [1 - Blockchain] Bad typescript practice: type of blockchain should not be any.
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // [1 - Blockchain] Despite being used below, WalletBalance does not have a blockchain property.
        if (lhsPriority > -99) {
          // [3 - Logic Issues] lhsPriority is not defined. Should be balancePriority instead.
          if (balance.amount <= 0) {
            // [3 - Logic Issues] return true if balance amount is less than or equal to 0 is likely wrong.
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain); // [1]
        const rightPriority = getPriority(rhs.blockchain); // [1]
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // [3 - Logic Issues] No equal case.
      });
  }, [balances, prices]);
  // [4 - Performance Issues] prices is included as a dependency but not used at all.

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });
  // [4 - Performance Issues] formattedBalances not used.

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          // [5 - Bad Practices] Hardcoding index as key is bad practice.
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
