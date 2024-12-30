import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12 dark:bg-cbg-dark">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-cfont-dark">
            Contact Us
          </h1>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-stone-200 dark:border-stone-800 dark:bg-cbg-darkaccent">
            <form className="space-y-6">
              <div>
                <Label htmlFor="name" className="dark:text-cfont-dark">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  className="mt-1 dark:text-cfont-dark"
                />
              </div>
              <div>
                <Label htmlFor="email" className="dark:text-cfont-dark">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  className="mt-1 dark:text-cfont-dark"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="dark:text-cfont-dark">
                  Email Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Your Reason For Reaching out"
                  className="mt-1 dark:text-cfont-dark"
                />
              </div>

              <div>
                <Label htmlFor="message" className="dark:text-cfont-dark">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Your message"
                  rows={5}
                  className="mt-1 dark:text-cfont-dark"
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
