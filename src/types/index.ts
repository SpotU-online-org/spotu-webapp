export type UserRole = "advertiser" | "space_owner" | "agency";

export type SpaceCategory =
  | "billboard"
  | "led_screen"
  | "sports_venue"
  | "social_media"
  | "website"
  | "app"
  | "print"
  | "radio"
  | "podcast"
  | "other";

export type SpaceMedium = "physical" | "digital";

export type ListingType = "want_to_advertise" | "have_space" | "offer_service";

export type ListingStatus = "draft" | "active" | "paused" | "expired";

export type PricePeriod = "day" | "week" | "month" | "campaign";

export type ContactMethod = "whatsapp" | "email";

export type Plan = "free" | "pro" | "agency";

export type Profile = {
  id: string;
  type: UserRole;
  displayName: string;
  companyName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  phone: string | null;
  whatsapp: string | null;
  emailContact: string | null;
  city: string | null;
  state: string | null;
  country: string;
  isVerified: boolean;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
};

export type Listing = {
  id: string;
  userId: string;
  type: ListingType;
  title: string;
  description: string;
  spaceType: SpaceCategory | null;
  spaceMedium: SpaceMedium | null;
  services: string[] | null;
  specializations: string[] | null;
  city: string | null;
  state: string | null;
  country: string;
  priceMin: number | null;
  priceMax: number | null;
  priceCurrency: string;
  pricePeriod: PricePeriod | null;
  priceText: string | null;
  audienceSize: string | null;
  availability: string | null;
  industry: string | null;
  whatsapp: string | null;
  emailContact: string | null;
  websiteUrl: string | null;
  images: string[];
  status: ListingStatus;
  isFeatured: boolean;
  viewsCount: number;
  contactsCount: number;
  createdAt: string;
  updatedAt: string;
};
