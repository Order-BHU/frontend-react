import { WifiOff, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Whatsapp = () => {
  const whatsappLink = "https://wa.me/message/37C2FWTVJS4EK1"; // Replace with actual WhatsApp bot link

  const handleWhatsAppClick = () => {
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-3xl mx-auto">
        <div className="w-full space-y-8 text-center">
          <div className="flex justify-center">
            <WifiOff className="w-14 h-14 text-primary-400" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="text-primary-400">Network Issues</span>
            <br />
            <span className="text-foreground">On Campus?</span>
          </h2>

          {/* <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
            We're experiencing some connectivity problems, but we've got you
            covered!
          </p> */}

          <div className="bg-primary-50 p-8 rounded-xl shadow-lg border border-border">
            <div className="flex items-center justify-center gap-3 text-2xl font-semibold text-primary-400 mb-4">
              <MessageCircle className="text-whatsapp" size={28} />
              <span>Order via WhatsApp</span>
            </div>

            <p className="text-muted-foreground text-lg mb-6">
              We're temporarily moving orders to WhatsApp.
              <br />
              Same great service, just a different channel.
            </p>

            <Button
              onClick={handleWhatsAppClick}
              size="lg"
              className="bg-[hsl(142_70_55)] hover:bg-[hsl(142_70_70)] text-whatsapp-foreground font-semibold text-lg px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Order on WhatsApp
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              Click above to chat with our WhatsApp bot
            </p>
          </div>

          {/* <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="text-secondary-foreground text-sm">
              Our tech team is working to resolve this. We'll be back online
              soon!
            </p>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default Whatsapp;
