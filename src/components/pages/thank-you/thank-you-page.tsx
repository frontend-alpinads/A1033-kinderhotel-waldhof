import Image from "next/image";

import type { Locale } from "@/lib/i18n";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ThankYouBackButton } from "./back-button";
import { hotelProfile } from "@/hotel-config";

const COPY_BY_LOCALE: Record<
  Locale,
  { title: string; message: string; showLogoOverlay: boolean }
> = {
  de: {
    title: "Anfrage erhalten",
    message:
      "Vielen Dank für Ihre Anfrage. Wir haben diese erhalten und melden uns innerhalb von 24 Stunden mit Ihrem persönlichen Angebot. Familie Jäger freut sich auf Sie!",
    showLogoOverlay: false,
  },
  en: {
    title: "Inquiry Received",
    message:
      "Thank you for your inquiry. We have received it and will respond within 24 hours with your personalised offer. The Jäger family looks forward to welcoming you!",
    showLogoOverlay: true,
  },
  it: {
    title: "Richiesta Ricevuta",
    message:
      "Grazie per la vostra richiesta. L'abbiamo ricevuta e risponderemo entro 24 ore con la vostra offerta personalizzata. La famiglia Jäger non vede l'ora di accogliervi!",
    showLogoOverlay: true,
  },
};

export function ThankYouPage({ locale }: { locale: Locale }) {
  const copy = COPY_BY_LOCALE[locale];

  return (
    <section className="bg-primary flex h-screen items-center justify-center">
      <Dialog open={true}>
        <DialogContent
          className="w-full max-w-md overflow-hidden rounded-none border-none bg-white p-0 max-sm:max-w-[calc(100vw-2rem)]"
          showCloseButton={false}
          overlayClassName="bg-primary"
        >
          <div className="flex flex-col">
            {/* Header Image */}
            <div className="relative h-95 p-2.5">
              <div className="relative h-full w-full overflow-hidden rounded-none">
                <Image
                  src="/thumb.jpg"
                  alt={hotelProfile.hotelName}
                  fill
                  className="h-full w-full object-cover"
                />

                {copy.showLogoOverlay && (
                  <>
                    <div className="absolute inset-0 bg-black/40"></div>

                    <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 p-8">
                      <Image
                        width={147}
                        height={71}
                        unoptimized
                        alt=""
                        src={"/full-logo.png"}
                        className=""
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6 p-6">
              <DialogTitle className="font-title text-primary text-[2rem] font-normal">
                {copy.title}
              </DialogTitle>

              <div className="text-foreground flex flex-col gap-2">
                <p className="text-base leading-normal">{copy.message}</p>
              </div>

              <ThankYouBackButton locale={locale} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
