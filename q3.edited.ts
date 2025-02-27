interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

type PriceData = Record<string, number>;

class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<PriceData> {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching prices:", error);
      throw error;
    }
  }
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState<PriceData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsLoading(true);
        const datasource = new Datasource(
          "https://interview.switcheo.com/prices.json"
        );
        const newPrices = await datasource.getPrices();
        setPrices(newPrices);
        setError(null);
      } catch (error) {
        setError("Failed to fetch prices. Please try again later.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Only include balances with priority > -99 AND amount > 0
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // Handle equal priorities by comparing currency or amount
        return lhs.currency.localeCompare(rhs.currency);
      })
      .map((balance: WalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount || 0;
        return {
          ...balance,
          formatted: balance.amount.toFixed(2),
          usdValue,
        };
      });
  }, [balances, prices]);

  if (isLoading) {
    return <div {...rest}>Loading wallet balances...</div>;
  }

  if (error) {
    return <div {...rest}>Error: {error}</div>;
  }

  if (formattedBalances.length === 0) {
    return <div {...rest}>No wallet balances found.</div>;
  }

  return (
    <div {...rest}>
      {formattedBalances.map((balance: FormattedWalletBalance) => (
        <WalletRow
          className={classes.row}
          key={`${balance.blockchain}-${balance.currency}`} // Better unique key
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};
