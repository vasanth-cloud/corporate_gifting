import { Company, GiftItem, Campaign, ClaimToken, Order } from './types';

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    passcode: 'acme2026',
    adminEmail: 'hr@acmecorp.com',
    logoUrl: 'https://placehold.co/200x60/indigo/white?text=ACME+CORP',
    brandColor: 'indigo',
    employeeCount: 450,
    totalAllocatedBudget: 45000,
    spentBudget: 28400,
    activeCampaignsCount: 3,
  },
  {
    id: 'comp-2',
    name: 'TechGlobe Solutions',
    slug: 'techglobe',
    passcode: 'techglobe2026',
    adminEmail: 'hr@techglobe.com',
    logoUrl: 'https://placehold.co/200x60/purple/white?text=TECHGLOBE',
    brandColor: 'purple',
    employeeCount: 1200,
    totalAllocatedBudget: 120000,
    spentBudget: 89500,
    activeCampaignsCount: 5,
  },
  {
    id: 'comp-3',
    name: 'Zenith Financial Group',
    slug: 'zenith-finance',
    passcode: 'zenith2026',
    adminEmail: 'hr@zenithfinance.com',
    logoUrl: 'https://placehold.co/200x60/emerald/white?text=ZENITH+FINANCE',
    brandColor: 'emerald',
    employeeCount: 850,
    totalAllocatedBudget: 95000,
    spentBudget: 62000,
    activeCampaignsCount: 4,
  },
  {
    id: 'comp-4',
    name: 'Nexus BioHealth',
    slug: 'nexus-health',
    passcode: 'nexus2026',
    adminEmail: 'hr@nexushealth.com',
    logoUrl: 'https://placehold.co/200x60/blue/white?text=NEXUS+HEALTH',
    brandColor: 'blue',
    employeeCount: 320,
    totalAllocatedBudget: 35000,
    spentBudget: 19800,
    activeCampaignsCount: 2,
  },
  {
    id: 'comp-5',
    name: 'Apex Media Digital',
    slug: 'apex-media',
    passcode: 'apex2026',
    adminEmail: 'hr@apexmedia.com',
    logoUrl: 'https://placehold.co/200x60/pink/white?text=APEX+MEDIA',
    brandColor: 'pink',
    employeeCount: 210,
    totalAllocatedBudget: 25000,
    spentBudget: 14200,
    activeCampaignsCount: 2,
  },
];

export const MOCK_GIFTS: GiftItem[] = [
  {
    id: 'g-1',
    name: 'Custom Branded Hoodie & Tumbler Kit',
    category: 'Swag',
    price: 65,
    description: 'Premium heavyweight cotton hoodie paired with a double-wall vacuum insulated stainless steel tumbler.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    customizable: true,
    vendorName: 'Ekmatra Swag Studio',
    rating: 4.9,
    inStock: true,
    options: {
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Matte Black', 'Navy Blue', 'Heather Grey']
    }
  },
  {
    id: 'g-2',
    name: 'Bose QuietComfort Wireless Earbuds',
    category: 'Electronics',
    price: 199,
    description: 'Noise cancelling true wireless earbuds with high-fidelity audio and custom acoustic architecture.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    customizable: false,
    vendorName: 'Dealberg Tech Procurement',
    rating: 4.8,
    inStock: true,
  },
  {
    id: 'g-3',
    name: 'Artisanal Gourmet Celebration Hamper',
    category: 'Hampers',
    price: 85,
    description: 'Handcrafted luxury hamper filled with organic dark chocolates, roasted dry fruits, artisanal jam, and sparkling cider.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    customizable: true,
    vendorName: 'Zestta Delights',
    rating: 4.9,
    inStock: true,
  },
  {
    id: 'g-4',
    name: 'Executive Leather Notebook & Parker Pen Set',
    category: 'Swag',
    price: 45,
    description: 'Refillable vegan leather notebook with debossed logo option and sleek metallic rollerball pen.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    customizable: true,
    vendorName: 'CorporateGift.com',
    rating: 4.7,
    inStock: true,
    options: {
      colors: ['Tan Leather', 'Obsidian Black', 'Deep Emerald']
    }
  },
  {
    id: 'g-5',
    name: '$100 Amazon / E-Voucher Choice Card',
    category: 'Gift Card',
    price: 100,
    description: 'Instant digital gift code redeemable across 500+ global brands including Amazon, Apple, Starbucks, and Uber.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    customizable: false,
    vendorName: 'Tango Card API Engine',
    rating: 5.0,
    inStock: true,
  },
  {
    id: 'g-6',
    name: 'Ergonomic Desk & Wellness Care Box',
    category: 'Wellness',
    price: 75,
    description: 'Includes memory foam lumbar cushion, scented soy candle, posture trainer, and herbal relaxation teas.',
    image: 'https://images.unsplash.com/photo-1608248597263-0057e43a4524?auto=format&fit=crop&w=600&q=80',
    customizable: true,
    vendorName: 'Zestta Delights',
    rating: 4.8,
    inStock: true,
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    companyId: 'comp-1',
    companyName: 'Acme Corporation',
    title: 'Q4 Employee Work Anniversary Appreciation',
    type: 'Anniversary',
    budgetPerRecipient: 100,
    allowedCategories: ['Swag', 'Electronics', 'Hampers', 'Gift Card'],
    totalRecipients: 45,
    claimedCount: 28,
    createdAt: '2026-09-01',
    customMessage: 'Thank you for your dedication, hard work, and valuable contributions to Acme Corp! Please pick your celebration gift.',
    companyLogoUrl: 'https://placehold.co/200x60/indigo/white?text=ACME+CORP',
    status: 'Active'
  },
  {
    id: 'camp-2',
    companyId: 'comp-1',
    companyName: 'Acme Corporation',
    title: 'Welcome Aboard - Autumn New Hire Swag Kits',
    type: 'Onboarding',
    budgetPerRecipient: 75,
    allowedCategories: ['Swag', 'Wellness'],
    totalRecipients: 20,
    claimedCount: 15,
    createdAt: '2026-09-10',
    customMessage: 'Welcome to the team! We are thrilled to have you onboard. Choose your official welcome kit.',
    companyLogoUrl: 'https://placehold.co/200x60/purple/white?text=ACME+CORP',
    status: 'Active'
  },
  {
    id: 'camp-3',
    companyId: 'comp-2',
    companyName: 'TechGlobe Solutions',
    title: 'Global Tech Developers Appreciation Day',
    type: 'Sales Reward',
    budgetPerRecipient: 150,
    allowedCategories: ['Electronics', 'Gift Card'],
    totalRecipients: 100,
    claimedCount: 82,
    createdAt: '2026-09-05',
    customMessage: 'Kudos for delivering Q3 product milestones on time! Select your developer tech reward.',
    companyLogoUrl: 'https://placehold.co/200x60/purple/white?text=TECHGLOBE',
    status: 'Active'
  },
  {
    id: 'camp-4',
    companyId: 'comp-3',
    companyName: 'Zenith Financial Group',
    title: 'Annual Executive Leadership Festival Hampers',
    type: 'Festival',
    budgetPerRecipient: 120,
    allowedCategories: ['Hampers', 'Wellness'],
    totalRecipients: 60,
    claimedCount: 48,
    createdAt: '2026-08-20',
    customMessage: 'Wishing you prosperity, joy, and success this festive season from Zenith Financial.',
    companyLogoUrl: 'https://placehold.co/200x60/emerald/white?text=ZENITH+FINANCE',
    status: 'Active'
  }
];

export const INITIAL_CLAIM_TOKENS: ClaimToken[] = [
  {
    token: 'CLAIM-SARAH-2026',
    companyId: 'comp-1',
    campaignId: 'camp-1',
    recipientName: 'Sarah Jenkins',
    recipientEmail: 'sarah.j@acmecorp.com',
    companyName: 'Acme Corporation',
    budget: 100,
    claimed: false,
  },
  {
    token: 'CLAIM-ALEX-2026',
    companyId: 'comp-1',
    campaignId: 'camp-2',
    recipientName: 'Alex Rivera',
    recipientEmail: 'alex.r@acmecorp.com',
    companyName: 'Acme Corporation',
    budget: 75,
    claimed: true,
    orderId: 'ORD-9821'
  },
  {
    token: 'CLAIM-DEV-TECHGLOBE',
    companyId: 'comp-2',
    campaignId: 'camp-3',
    recipientName: 'Marcus Vance',
    recipientEmail: 'm.vance@techglobe.com',
    companyName: 'TechGlobe Solutions',
    budget: 150,
    claimed: false,
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    companyId: 'comp-1',
    claimToken: 'CLAIM-ALEX-2026',
    campaignTitle: 'Welcome Aboard - Autumn New Hire Swag Kits',
    recipientName: 'Alex Rivera',
    recipientEmail: 'alex.r@acmecorp.com',
    giftItem: MOCK_GIFTS[0],
    selectedSize: 'L',
    selectedColor: 'Matte Black',
    shippingAddress: {
      street: '742 Evergreen Terrace',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'United States',
      phone: '+1 (512) 555-0199'
    },
    customLogoUrl: 'https://placehold.co/200x60/indigo/white?text=ACME+CORP',
    status: 'Shipped',
    courierName: 'FedEx Express',
    trackingNumber: 'FX-8492019482',
    createdAt: '2026-09-11',
    estimatedDelivery: '2026-09-15',
    vendorName: 'Ekmatra Swag Studio'
  },
  {
    id: 'ORD-9822',
    companyId: 'comp-1',
    claimToken: 'CLAIM-PRIYA-2026',
    campaignTitle: 'Q4 Employee Work Anniversary Appreciation',
    recipientName: 'Priya Sharma',
    recipientEmail: 'priya.s@acmecorp.com',
    giftItem: MOCK_GIFTS[2],
    shippingAddress: {
      street: '45 Tech Park Avenue, HSR Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560102',
      country: 'India',
      phone: '+91 98765 43210'
    },
    status: 'In Production',
    createdAt: '2026-09-12',
    estimatedDelivery: '2026-09-16',
    vendorName: 'Zestta Delights'
  }
];

class DataStore {
  private companies = MOCK_COMPANIES;
  private gifts = MOCK_GIFTS;
  private campaigns = INITIAL_CAMPAIGNS;
  private tokens = INITIAL_CLAIM_TOKENS;
  private orders = INITIAL_ORDERS;

  getCompanies() { return this.companies; }
  getCompany(id: string) { return this.companies.find(c => c.id === id); }

  authenticate(inputPasscode: string): { type: 'super' } | { type: 'company'; company: Company } | null {
    if (inputPasscode === 'admin2026') {
      return { type: 'super' };
    }
    const foundCompany = this.companies.find(c => c.passcode.toLowerCase() === inputPasscode.toLowerCase());
    if (foundCompany) {
      return { type: 'company', company: foundCompany };
    }
    return null;
  }

  getGifts() { return this.gifts; }

  getCampaigns(companyId?: string) {
    if (companyId && companyId !== 'all') {
      return this.campaigns.filter(c => c.companyId === companyId);
    }
    return this.campaigns;
  }

  getOrders(companyId?: string) {
    if (companyId && companyId !== 'all') {
      return this.orders.filter(o => o.companyId === companyId);
    }
    return this.orders;
  }
  
  getToken(tokenStr: string) {
    return this.tokens.find(t => t.token.toLowerCase() === tokenStr.toLowerCase());
  }

  addCampaign(campaign: Campaign) {
    this.campaigns.unshift(campaign);
    const company = this.getCompany(campaign.companyId);
    if (company) {
      company.activeCampaignsCount += 1;
    }
    return campaign;
  }

  addClaimToken(token: ClaimToken) {
    this.tokens.push(token);
    return token;
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    };

    this.orders.unshift(newOrder);

    // Update claim token status
    const tokenObj = this.getToken(orderData.claimToken);
    if (tokenObj) {
      tokenObj.claimed = true;
      tokenObj.orderId = newOrder.id;
    }

    // Update campaign metrics
    const campaign = this.campaigns.find(c => c.id === tokenObj?.campaignId);
    if (campaign) {
      campaign.claimedCount += 1;
    }

    // Update company budget metrics
    const company = this.getCompany(orderData.companyId);
    if (company) {
      company.spentBudget += orderData.giftItem.price;
    }

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status'], courierName?: string, trackingNumber?: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      if (courierName) order.courierName = courierName;
      if (trackingNumber) order.trackingNumber = trackingNumber;
    }
    return order;
  }
}

export const db = new DataStore();
