import { ArrowRight, Code, Sparkles, Zap } from "lucide-react";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 text-sm font-medium text-primary-700">
            <Sparkles className="h-4 w-4" />
            <span>Premium Digital Solutions</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-display font-bold">
              <span className="block text-slate-900">Welcome to</span>
              <span className="block bg-davami-gradient bg-clip-text text-transparent">
                Davami
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light">
              Where{" "}
              <span className="font-semibold text-primary-600">
                Development
              </span>{" "}
              meets{" "}
              <span className="font-semibold text-secondary-600">
                Innovation
              </span>
              . We create exceptional digital experiences that transform your
              business.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200">
              <Code className="h-4 w-4 text-primary-600" />
              <span>Custom Development</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200">
              <Zap className="h-4 w-4 text-secondary-600" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>Modern Design</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              className="bg-davami-gradient hover:opacity-90 text-white border-0 px-8 py-4 text-lg font-semibold shadow-davami-lg transition-all duration-300 hover:shadow-davami hover:scale-105"
              onClick={() => {
                const productsSection = document.getElementById("products");
                productsSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">
                50+
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Projects Delivered
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">
                100%
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Client Satisfaction
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">
                24/7
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
