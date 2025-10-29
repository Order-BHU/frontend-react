import {
  ArrowRight,
  Clock,
  MapPin,
  Zap,
  Shield,
  Wifi,
  Battery,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageWrapper } from "@/components/pagewrapper";
import droneHero from "@/assets/drone-hero.jpg";
import droneTracking from "@/assets/drone-tracking.jpg";

const DronePitch = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${droneHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in">
            Revolutionizing Delivery
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-4 animate-fade-in font-light">
            with Drone Technology
          </p>
          <div className="flex gap-4 text-xl md:text-2xl text-primary-500 justify-center mb-8 animate-fade-in font-semibold">
            <span>Instant.</span>
            <span>Smart.</span>
            <span>Reliable.</span>
          </div>
          <Button
            size="lg"
            className="bg-primary-400 hover:bg-primary-500 text-white text-lg px-8 py-6 rounded-full shadow-[0_0_30px_rgba(255,90,31,0.4)] hover:shadow-[0_0_50px_rgba(255,90,31,0.6)] transition-all"
          >
            Learn More <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <PageWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                The Challenge
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Traditional food delivery relies on human riders, leading to
                inefficiencies and limitations
              </p>
            </div>
          </PageWrapper>

          <div className="grid md:grid-cols-3 gap-8">
            <PageWrapper>
              <Card className="border-2 hover:border-primary-400/50 transition-all hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary-400/10 flex items-center justify-center mb-6">
                    <Clock className="w-8 h-8 text-primary-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Frequent Delays
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Human riders face traffic, weather conditions, and
                    unpredictable obstacles that cause delivery delays
                  </p>
                </CardContent>
              </Card>
            </PageWrapper>

            <PageWrapper>
              <Card className="border-2 hover:border-primary-400/50 transition-all hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary-400/10 flex items-center justify-center mb-6">
                    <MapPin className="w-8 h-8 text-primary-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Service Inconsistencies
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Variable delivery times and reliability issues impact
                    customer satisfaction and trust
                  </p>
                </CardContent>
              </Card>
            </PageWrapper>

            <PageWrapper>
              <Card className="border-2 hover:border-primary-400/50 transition-all hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary-400/10 flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-primary-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Rising Costs
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Labor expenses and operational overhead limit scalability
                    and growth potential
                  </p>
                </CardContent>
              </Card>
            </PageWrapper>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-24 bg-gradient-to-b from-background to-primary-400/5">
        <div className="container mx-auto px-4">
          <PageWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our Solution
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Drone-powered instant delivery eliminates human-related delays
                with fast, precise, and reliable service
              </p>
            </div>
          </PageWrapper>

          <div className="grid md:grid-cols-3 gap-8">
            <PageWrapper>
              <Card className="border-2 border-primary-400/20 bg-card hover:shadow-[0_0_30px_rgba(255,90,31,0.15)] transition-all">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary-400/10 flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Eliminates Delays
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Drones bypass traffic and obstacles with direct flight
                    paths, ensuring consistently fast delivery
                  </p>
                </CardContent>
              </Card>
            </PageWrapper>

            <PageWrapper>
              <Card className="border-2 border-primary-400/20 bg-card hover:shadow-[0_0_30px_rgba(255,90,31,0.15)] transition-all">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary-400/10 flex items-center justify-center mb-6">
                    <MapPin className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Precision Delivery
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Automated systems ensure accurate, consistent service with
                    pinpoint accuracy to your location
                  </p>
                </CardContent>
              </Card>
            </PageWrapper>

            <PageWrapper>
              <Card className="border-2 border-primary-400/20 bg-card hover:shadow-[0_0_30px_rgba(255,90,31,0.15)] transition-all">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary-400/10 flex items-center justify-center mb-6">
                    <Wifi className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Real-Time Tracking
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Complete visibility from order to delivery with live GPS
                    tracking and status updates
                  </p>
                </CardContent>
              </Card>
            </PageWrapper>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <PageWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-xl text-secondary-foreground/80 max-w-3xl mx-auto">
                Simple, automated, and efficient delivery in three easy steps
              </p>
            </div>
          </PageWrapper>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <PageWrapper>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4">Order Placed</h3>
                <p className="text-secondary-foreground/80 text-lg">
                  Customer places order through the app. System automatically
                  assigns nearest available drone
                </p>
              </div>
            </PageWrapper>

            <PageWrapper>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4">Drone Dispatched</h3>
                <p className="text-secondary-foreground/80 text-lg">
                  Drone picks up order and flies optimal route. Real-time GPS
                  tracking available
                </p>
              </div>
            </PageWrapper>

            <PageWrapper>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4">Delivered</h3>
                <p className="text-secondary-foreground/80 text-lg">
                  Drone delivers to precise location. Customer receives
                  notification and retrieves order
                </p>
              </div>
            </PageWrapper>
          </div>
        </div>
      </section>

      {/* Current Operations Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <PageWrapper>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Current Operations
                </h2>
                <p className="text-xl text-muted-foreground">
                  Building the future of delivery at Bingham University
                </p>
              </div>
            </PageWrapper>

            <div className="grid md:grid-cols-3 gap-8">
              <PageWrapper>
                <Card className="text-center border-2 hover:border-primary-400/50 transition-all">
                  <CardContent className="p-8">
                    <div className="text-5xl font-bold text-primary-500 mb-4">
                      01
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      Campus Launch
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Established operations at Bingham University campus
                    </p>
                  </CardContent>
                </Card>
              </PageWrapper>

              <PageWrapper>
                <Card className="text-center border-2 hover:border-primary-400/50 transition-all">
                  <CardContent className="p-8">
                    <div className="text-5xl font-bold text-primary-500 mb-4">
                      02
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      Daily Service
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Serving students and staff with reliable delivery every
                      day
                    </p>
                  </CardContent>
                </Card>
              </PageWrapper>

              <PageWrapper>
                <Card className="text-center border-2 hover:border-primary-400/50 transition-all">
                  <CardContent className="p-8">
                    <div className="text-5xl font-bold text-primary-500 mb-4">
                      03
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      Data Collection
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Gathering insights to optimize drone integration
                    </p>
                  </CardContent>
                </Card>
              </PageWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Capabilities Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <PageWrapper>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Technical Capabilities
                </h2>
                <p className="text-xl text-muted-foreground">
                  Advanced technology powering reliable delivery
                </p>
              </div>
            </PageWrapper>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PageWrapper>
                <Card className="border-2 hover:border-primary-400/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <Battery className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      Extended Range
                    </h3>
                    <p className="text-muted-foreground">
                      Up to 30-minute flight time per charge
                    </p>
                  </CardContent>
                </Card>
              </PageWrapper>

              <PageWrapper>
                <Card className="border-2 hover:border-primary-400/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <Package className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      Payload Capacity
                    </h3>
                    <p className="text-muted-foreground">
                      Carries up to 5kg safely and securely
                    </p>
                  </CardContent>
                </Card>
              </PageWrapper>

              <PageWrapper>
                <Card className="border-2 hover:border-primary-400/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      GPS Precision
                    </h3>
                    <p className="text-muted-foreground">
                      Accurate to within 1 meter of target
                    </p>
                  </CardContent>
                </Card>
              </PageWrapper>

              <PageWrapper>
                <Card className="border-2 hover:border-primary-400/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      Safety First
                    </h3>
                    <p className="text-muted-foreground">
                      Multiple redundant safety systems
                    </p>
                  </CardContent>
                </Card>
              </PageWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-background to-primary-400/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <PageWrapper>
                <div>
                  <img
                    src={droneTracking}
                    alt="Drone tracking system"
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              </PageWrapper>
              <PageWrapper>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                    Benefits for Everyone
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        For Customers
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Faster delivery times, lower costs, and real-time
                        tracking. Your food arrives fresh and hot, exactly when
                        you need it.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        For Businesses
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Reduced operational costs, expanded service areas, and
                        improved customer satisfaction. Scale without limits.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        For the Environment
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Zero emissions, reduced traffic congestion, and lower
                        carbon footprint. Sustainable delivery for a better
                        future.
                      </p>
                    </div>
                  </div>
                </div>
              </PageWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-500 via-primary-glow to-primary-500 text-white">
        <PageWrapper>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready for the Future?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Join us in revolutionizing food delivery. Experience the speed,
              precision, and reliability of drone technology.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform"
            >
              Get Started Today <ArrowRight className="ml-2" />
            </Button>
          </div>
        </PageWrapper>
      </section>
    </main>
  );
};

export default DronePitch;
