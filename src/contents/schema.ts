import { z } from "zod";

const LocaleSchema = z.enum(["de", "en", "it"]);
const SectionVariantSchema = z.string();
const SectionKeySchema = z.enum([
  "hero",
  "about",
  "features",
  "gallery",
  "enquiry",
  "testimonials",
  "faqs",
  "offers",
  "rooms",
  "footer",
]);

// Schema for a single section variant entry: { "hero": "v3" } or { "hero": false }
const SectionVariantEntrySchema = z
  .record(z.string(), z.union([SectionVariantSchema, z.literal(false)]))
  .refine(
    (obj) => Object.keys(obj).length === 1,
    "Each section variant entry must have exactly one key",
  )
  .refine((obj) => {
    const key = Object.keys(obj)[0];
    return SectionKeySchema.safeParse(key).success;
  }, "Section key must be a valid section key");

export const VariantSpecSchema = z.object({
  sectionVariants: z.array(SectionVariantEntrySchema),
  locales: z.record(
    LocaleSchema,
    z.object({
      hero: z.object({
        title: z.string(),
        subtitle: z.string(),
        socialProof: z.string().optional(),
        images: z.array(z.string()),
        bookingForm: z.object({
          arrivalDeparture: z.string(),
          arrivalDepartureLabel: z.string(),
          guests: z.string(),
          guestsLabel: z.string(),
          adultsFormat: z.object({
            one: z.string(),
            other: z.string(),
          }),
          childrenFormat: z.object({
            one: z.string(),
            other: z.string(),
          }),
          requestOffer: z.string(),
        }),
      }),
      about: z.object({
        badge: z.string(),
        title: z.string(),
        description: z.string(),
        images: z.array(z.string()),
      }),
      features: z.object({
        badge: z.string(),
        title: z.string(),
        description: z.string(),
        items: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            imageSrc: z.string(),
            iconName: z.string(),
          }),
        ),
      }),
      gallery: z.object({
        badge: z.string(),
        title: z.string(),
        description: z.string(),
        viewAll: z.string(),
        tabs: z.record(z.string(), z.string()),
        categories: z.record(z.string(), z.string()),
        popup: z.object({
          title: z.string(),
          closeSrLabel: z.string(),
        }),
        images: z.array(
          z.object({
            src: z.string(),
            alt: z.string(),
            category: z.string(),
          }),
        ),
      }),
      enquiry: z.object({
        badge: z.string(),
        title: z.string(),
        description: z.string(),
        backgroundImage: z.string(),
        form: z.object({
          roomType: z.object({
            label: z.string(),
            roomOnly: z.string(),
            roomWithOffer: z.string(),
          }),
          dates: z.object({
            label: z.string(),
            alternative: z.string(),
          }),
          offer: z.object({
            label: z.string(),
            choose: z.string(),
          }),
          room: z.object({
            label: z.string(),
            chooseWithGuests: z.string(),
          }),
          salutation: z.object({
            label: z.string(),
            mr: z.string(),
            mrs: z.string(),
          }),
          firstName: z.string(),
          lastName: z.string(),
          phone: z.string(),
          email: z.string(),
          message: z.string(),
          newsletter: z.string(),
          privacyPolicy: z.string(),
          responseTime: z.string(),
          submit: z.string(),
          submitting: z.string(),
          openingNotice: z.string().optional(),
        }),
      }),
      testimonials: z.object({
        badge: z.string(),
        title: z.string(),
        description: z.string(),
        image: z.string(),
      }),
      faqs: z.object({
        badge: z.string(),
        title: z.string(),
        description: z.string(),
      }),
      offers: z.object({
        badge: z.string(),
        title: z.string(),
        description: z.string(),
      }),
      rooms: z.object({
        badge: z.string(),
        title: z.string(),
        description: z.string(),
        tabs: z.record(z.string(), z.string()),
        logoImage: z.string(),
      }),
    }),
  ),
});

export type VariantSpec = z.infer<typeof VariantSpecSchema>;

// ====== Section-First Zod Schemas ======
// These validate the new structure where translations are grouped by field

const LocalizedStringSchema = z.object({
  de: z.string(),
  en: z.string(),
  it: z.string(),
});

const LocalizedOptionalStringSchema = z
  .object({
    de: z.string().optional(),
    en: z.string().optional(),
    it: z.string().optional(),
  })
  .optional();

const HeroBookingFormSpecSchema = z.object({
  arrivalDeparture: LocalizedStringSchema,
  arrivalDepartureLabel: LocalizedStringSchema,
  guests: LocalizedStringSchema,
  guestsLabel: LocalizedStringSchema,
  adultsFormat: z.object({
    one: LocalizedStringSchema,
    other: LocalizedStringSchema,
  }),
  childrenFormat: z.object({
    one: LocalizedStringSchema,
    other: LocalizedStringSchema,
  }),
  requestOffer: LocalizedStringSchema,
});

const SocialProofSpecSchema = z
  .object({
    rating: z.number().optional(),
    maxRating: z.number().optional(),
    totalReviews: z.number().optional(),
    reviewsText: LocalizedStringSchema.optional(),
    link: z.string().optional(),
  })
  .optional();

const HeroSpecSchema = z.object({
  title: LocalizedStringSchema,
  subtitle: LocalizedStringSchema,
  socialProof: SocialProofSpecSchema,
  images: z.array(z.string()),
  bookingForm: HeroBookingFormSpecSchema,
});

const AboutSpecSchema = z.object({
  badge: LocalizedStringSchema,
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  images: z.array(z.string()),
});

const FeatureItemSpecSchema = z.object({
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  imageSrc: z.string(),
  iconName: z.string(),
});

const FeaturesSpecSchema = z.object({
  badge: LocalizedStringSchema,
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  items: z.array(FeatureItemSpecSchema),
});

const GalleryImageSpecSchema = z.object({
  src: z.string(),
  alt: LocalizedStringSchema,
  category: z.string(),
});

const GallerySpecSchema = z.object({
  badge: LocalizedStringSchema,
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  viewAll: LocalizedStringSchema,
  tabs: z.record(z.string(), LocalizedStringSchema),
  categories: z.record(z.string(), z.string()),
  popup: z.object({
    title: LocalizedStringSchema,
    closeSrLabel: LocalizedStringSchema,
  }),
  highlightImages: z.object({
    desktop: z.array(z.string()),
    mobile: z.array(z.string()),
  }),
  images: z.array(GalleryImageSpecSchema),
});

const EnquiryFormSpecSchema = z.object({
  roomType: z.object({
    label: LocalizedStringSchema,
    roomOnly: LocalizedStringSchema,
    roomWithOffer: LocalizedStringSchema,
  }),
  dates: z.object({
    label: LocalizedStringSchema,
    alternative: LocalizedStringSchema,
  }),
  offer: z.object({
    label: LocalizedStringSchema,
    choose: LocalizedStringSchema,
  }),
  room: z.object({
    label: LocalizedStringSchema,
    chooseWithGuests: LocalizedStringSchema,
  }),
  salutation: z.object({
    label: LocalizedStringSchema,
    mr: LocalizedStringSchema,
    mrs: LocalizedStringSchema,
  }),
  firstName: LocalizedStringSchema,
  lastName: LocalizedStringSchema,
  phone: LocalizedStringSchema,
  email: LocalizedStringSchema,
  message: LocalizedStringSchema,
  newsletter: LocalizedStringSchema,
  privacyPolicy: LocalizedStringSchema,
  responseTime: LocalizedStringSchema,
  submit: LocalizedStringSchema,
  submitting: LocalizedStringSchema,
  openingNotice: LocalizedOptionalStringSchema,
});

const EnquirySpecSchema = z.object({
  badge: LocalizedStringSchema,
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  backgroundImage: z.string(),
  form: EnquiryFormSpecSchema,
});

const TestimonialsSpecSchema = z.object({
  badge: LocalizedStringSchema,
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  image: z.string(),
});

const FaqsSpecSchema = z.object({
  badge: LocalizedStringSchema,
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
});

const OffersSpecSchema = z.object({
  badge: LocalizedStringSchema,
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
});

const RoomsSpecSchema = z.object({
  badge: LocalizedStringSchema,
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  tabs: z.record(z.string(), LocalizedStringSchema),
  logoImage: z.string(),
});

// ====== Route Config Schema ======
// Schema for variant-specific URL aliasing

const RouteConfigSchema = z.object({
  pathAlias: z.string().optional(), // e.g., "spring-summer" - URL alias for this variant
});

// ====== Filter Schemas ======
// Schemas for variant-specific content filtering

const OfferFiltersSchema = z.object({
  titleContains: z.array(z.string()).optional(),
  titleExcludes: z.array(z.string()).optional(),
  validAfter: z.string().optional(),  // YYYY-MM-DD
  validBefore: z.string().optional(), // YYYY-MM-DD
});

const VariantFiltersSchema = z.object({
  offers: OfferFiltersSchema.optional(),
});

export const VariantSpecSectionFirstSchema = z.object({
  $schema: z.string().optional(),
  routeConfig: RouteConfigSchema.optional(),
  sectionVariants: z.array(SectionVariantEntrySchema),
  filters: VariantFiltersSchema.optional(),
  content: z.object({
    hero: HeroSpecSchema,
    about: AboutSpecSchema,
    features: FeaturesSpecSchema,
    gallery: GallerySpecSchema,
    enquiry: EnquirySpecSchema,
    testimonials: TestimonialsSpecSchema,
    faqs: FaqsSpecSchema,
    offers: OffersSpecSchema,
    rooms: RoomsSpecSchema,
  }),
});

export type VariantSpecSectionFirst = z.infer<
  typeof VariantSpecSectionFirstSchema
>;
