
export enum View {
  DASHBOARD = 'PAINEL_PRINCIPAL',
  TRANSACTIONS = 'MEUS_LANCAMENTOS',
  FIXED_EXPENSES = 'GASTOS_FIXOS',
  INSTALLMENTS = 'CONTROLE_DE_PARCELAS',
  LIMITS = 'MEUS_LIMITES',
  GROCERY = 'MERCADO',
  WISHLIST = 'LISTA_DE_DESEJOS',
  REPORTS = 'RELATORIOS',
  CALENDAR = 'CALENDARIO',
  SCHOOL = 'ESCOLA_FINANCEIRA',
  SETTINGS = 'CONFIGURACOES',
  ABOUT = 'QUEM_SOMOS_NOS',
  CONTACT = 'FALE_CONOSCO',
  TRAVEL_DETAILS = 'DETALHES_DA_VIAGEM',
  ACHIEVEMENTS = 'MINHAS_CONQUISTAS'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'CREDIT' | 'DEBIT';
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  estimatedPrice: number;
  inCart: boolean;
}

export interface WishlistItem {
  id: string;
  description: string;
  price: number;
  category: string;
  isPaid: boolean;
}

export interface WishlistGoal {
  id: string;
  name: string;
  items: WishlistItem[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}
