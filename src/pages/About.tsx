import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Users, Target, Lightbulb, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-20">
          <Badge className="bg-primary-100 text-primary-800 border-primary-200">
            About Davami
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900">
            Where{" "}
            <span className="bg-davami-gradient bg-clip-text text-transparent">
              Dev
            </span>{" "}
            meets{" "}
            <span className="bg-davami-gradient bg-clip-text text-transparent">
              Innovation
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Davami represents the fusion of "Development" and "Innovation" (Dev
            + Amish). We're passionate about creating digital solutions that
            transform businesses and drive growth.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              To empower businesses with cutting-edge digital solutions that
              drive growth, enhance efficiency, and create meaningful
              connections with their customers. We believe technology should be
              accessible, powerful, and transformative.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Lightbulb className="h-8 w-8 text-secondary-600" />
              <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              To be the leading provider of innovative digital solutions,
              recognized for our commitment to excellence, creativity, and
              client success. We envision a future where every business can
              leverage technology to reach its full potential.
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-12 mb-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
              Our Services
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-12 w-12 text-primary-600" />,
                title: "Custom Development",
                description:
                  "Tailored web and mobile applications built with the latest technologies and best practices.",
              },
              {
                icon: <Target className="h-12 w-12 text-secondary-600" />,
                title: "E-Commerce Solutions",
                description:
                  "Complete online store solutions with payment processing, inventory management, and analytics.",
              },
              {
                icon: <Lightbulb className="h-12 w-12 text-blue-600" />,
                title: "Digital Consulting",
                description:
                  "Strategic guidance to help you navigate the digital landscape and make informed technology decisions.",
              },
              {
                icon: <Award className="h-12 w-12 text-green-600" />,
                title: "UI/UX Design",
                description:
                  "Beautiful, intuitive designs that enhance user experience and drive engagement.",
              },
              {
                icon: <Users className="h-12 w-12 text-purple-600" />,
                title: "SaaS Development",
                description:
                  "Scalable software-as-a-service platforms with robust architecture and security.",
              },
              {
                icon: <Target className="h-12 w-12 text-orange-600" />,
                title: "Maintenance & Support",
                description:
                  "Ongoing support and maintenance to keep your applications running smoothly.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="text-slate-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Let's discuss how we can help transform your business with
              innovative digital solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-davami-gradient hover:opacity-90 text-white border-0 px-8 py-4 text-lg font-semibold"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-8 py-4 text-lg font-semibold"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
