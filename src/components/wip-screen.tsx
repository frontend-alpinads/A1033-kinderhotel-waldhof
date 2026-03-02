import Image from "next/image";

export function WipScreen({ children }: { children: React.ReactNode }) {
  const isProduction = process.env.NEXT_PUBLIC_STATUS === "production";
  if (isProduction) {
    return (
      <div className="fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#1a1a1a] text-white">
        {/* Background Pattern */}

        {/* Content Container */}
        <div className="relative z-10 mx-6 flex max-w-[1135px] flex-col items-center text-center">
          {/* Icon with circular backgrounds */}
          <div className="relative mb-12 flex h-[197.5px] w-[197.5px] items-center justify-center">
            {/* Outer circle */}
            <div className="absolute inset-0 flex rotate-352 items-center justify-center">
              <div
                className="h-[174.865px] w-[174.865px] rounded-full backdrop-blur-[78px]"
                style={{
                  backgroundColor: "#5c6155",
                  boxShadow:
                    "inset 0px 2.821px 5.643px 0px rgba(255, 255, 255, 0.05), inset 0px -5.643px 5.643px 0px rgba(255, 255, 255, 0.15)",
                }}
              />
            </div>
            {/* Inner circle */}
            <div className="absolute flex items-center justify-center">
              <div className="flex h-[156.788px] w-[156.788px] items-center justify-center">
                <div
                  className="h-[138.819px] w-[138.819px] rotate-352 rounded-full backdrop-blur-[78px]"
                  style={{
                    background:
                      "linear-gradient(180deg, #323230 0%, rgba(32, 32, 30, 0.5) 100%)",
                    boxShadow:
                      "inset 0px 2.821px 5.643px 0px rgba(255, 255, 255, 0.05), inset 0px -5.643px 5.643px 0px rgba(255, 255, 255, 0.02)",
                  }}
                />
              </div>
            </div>
            {/* Gear Icon */}
            <div className="animate-spin-slow relative h-20 w-20">
              <Image
                src="/preview/gear.svg"
                alt=""
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-6">
            <h1
              className="text-[28px] leading-[1.4] font-medium text-white"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Our website is currently under construction
            </h1>
            <div
              className="text-[16px] leading-normal font-normal text-white/70"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <p className="mb-0">
                We&apos;re working behind the scenes to create a new online
                experience for our guests.
              </p>
              <p>The website will be available soon.</p>
            </div>
          </div>
        </div>

        {/* Alpin Ads Logo at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <Image
            src="/alpin-ads.svg"
            alt="Alpin Ads"
            width={214}
            height={38}
            className="block"
            priority
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
