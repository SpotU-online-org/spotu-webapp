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
  stripeCustomerId: string | null;
  firstListingPublishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Listing = {
  id: string;
  userId: string;
  type: ListingType;
  title: string;
  description: string;

  // Space classification
  spaceType: SpaceCategory | null;
  spaceMedium: SpaceMedium | null;

  // Agency fields
  services: string[] | null;
  specializations: string[] | null;

  // Location — where the space IS (spaces) or where they WANT to advertise (advertisers)
  locationCity: string | null;
  locationState: string | null;
  locationCountry: string;
  locationAddress: string | null;
  locationLat: number | null;
  locationLng: number | null;
  isRemote: boolean;
  coverageAreas: string[] | null;

  // Advertiser's own location (company/event)
  companyCity: string | null;
  companyState: string | null;
  companyCountry: string | null;

  // Pricing
  priceMin: number | null;
  priceMax: number | null;
  priceCurrency: string;
  pricePeriod: PricePeriod | null;
  priceText: string | null;

  // Space details
  audienceSize: string | null;
  availability: string | null;

  // Advertiser details
  industry: string | null;

  // Contact
  whatsapp: string | null;
  emailContact: string | null;
  websiteUrl: string | null;

  // Media
  images: string[];

  // Status & meta
  status: ListingStatus;
  isFeatured: boolean;
  viewsCount: number;
  contactsCount: number;
  createdAt: string;
  updatedAt: string;
};
