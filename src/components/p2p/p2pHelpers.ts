export interface FiatCurrencyOption {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const FIAT_CURRENCIES: FiatCurrencyOption[] = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh ', flag: '🇰🇪' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵ ', flag: '🇬🇭' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R ', flag: '🇿🇦' },
];

export const CRYPTO_ASSETS = ['USDT', 'BTC', 'ETH', 'SOL', 'USDC'] as const;

export const PAYMENT_METHODS = [
  'All',
  'Bank Transfer',
  'Mobile Money',
  'Kuda Bank',
  'Chipper Cash',
  'SEPA / Wire',
  'Zelle',
  'PayPal',
  'Revolut',
] as const;

export function getCurrencySymbol(currencyCode: string): string {
  switch (currencyCode?.toUpperCase()) {
    case 'NGN':
      return '₦';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'KES':
      return 'KSh ';
    case 'GHS':
      return 'GH₵ ';
    case 'ZAR':
      return 'R ';
    default:
      return `${currencyCode} `;
  }
}

export function formatFiat(amount: number, currencyCode: string): string {
  const sym = getCurrencySymbol(currencyCode);
  const formattedNum = Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${sym}${formattedNum}`;
}

export function doesPaymentMethodMatch(merchantMethods: string[], filterMethod: string): boolean {
  if (!filterMethod || filterMethod === 'All') return true;
  const filterNorm = filterMethod.toLowerCase();

  return merchantMethods.some((pm) => {
    const pmNorm = pm.toLowerCase();
    if (pmNorm === filterNorm) return true;

    // Mobile Money grouping matches M-Pesa, MTN MoMo, Airtel, OPay, PalmPay, etc.
    if (filterNorm.includes('mobile money')) {
      return (
        pmNorm.includes('mobile money') ||
        pmNorm.includes('m-pesa') ||
        pmNorm.includes('momo') ||
        pmNorm.includes('airtel') ||
        pmNorm.includes('opay') ||
        pmNorm.includes('palmpay') ||
        pmNorm.includes('capitec')
      );
    }

    if (filterNorm.includes('sepa') || filterNorm.includes('wire')) {
      return pmNorm.includes('sepa') || pmNorm.includes('wire');
    }

    return pmNorm.includes(filterNorm);
  });
}
