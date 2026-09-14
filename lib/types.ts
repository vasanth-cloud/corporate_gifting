export interface Company {
  id: string;
  name: string;
  slug: string;
  passcode: string;
  adminEmail: string;
  logoUrl: string;
  brandColor: string;
  employeeCount: number;
  totalAllocatedBudget: number;
  spentBudget: number;
  activeCampaignsCount: number;
}

export type GiftCategory = 'Swag' | 'Electronics' | 'Hampers' | 'Gift Card' | 'Wellness';

export interface GiftItem {
  id: string;
  name: string;
  category: GiftCategory;
  price: number;
  description: string;
  image: string;
  customizable: boolean;
  vendorName: string;
  rating: number;
  inStock: boolean;
  options?: {
    sizes?: string[];
    colors?: string[];
  };
}

export interface Campaign {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  type: 'Onboarding' | 'Anniversary' | 'Festival' | 'Client Appreciation' | 'Sales Reward';
  budgetPerRecipient: number;
  allowedCategories: GiftCategory[];
  totalRecipients: number;
  claimedCount: number;
  createdAt: string;
  customMessage: string;
  companyLogoUrl?: string;
  status: 'Active' | 'Completed' | 'Draft';
}

export interface ClaimToken {
  token: string;
  companyId: string;
  campaignId: string;
  recipientName: string;
  recipientEmail: string;
  companyName: string;
  budget: number;
  claimed: boolean;
  orderId?: string;
}

export type OrderStatus = 'Pending' | 'Logo Approved' | 'In Production' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  companyId: string;
  claimToken: string;
  campaignTitle: string;
  recipientName: string;
  recipientEmail: string;
  giftItem: GiftItem;
  selectedSize?: string;
  selectedColor?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  customLogoUrl?: string;
  status: OrderStatus;
  courierName?: string;
  trackingNumber?: string;
  createdAt: string;
  estimatedDelivery?: string;
  vendorName: string;
}
