import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Mail, Phone, MessageCircle, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-primary-100 text-primary-800 border-primary-200">
            Contact Us
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900">
            Let's Build Something
            <span className="block bg-davami-gradient bg-clip-text text-transparent">
              Amazing Together
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Ready to start your project? We'd love to hear from you. Send us a
            message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Get in Touch
              </h2>
              <p className="text-slate-600">
                We're here to help and answer any question you might have. We
                look forward to hearing from you.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Email</h3>
                  <p className="text-slate-600">hello@davami.com</p>
                  <p className="text-slate-600">support@davami.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Phone</h3>
                  <p className="text-slate-600">+1 (555) 123-4567</p>
                  <p className="text-slate-600">Mon-Fri 9am-6pm EST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">WhatsApp</h3>
                  <p className="text-slate-600">+1 (555) 123-4567</p>
                  <p className="text-slate-600">Quick responses</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Office</h3>
                  <p className="text-slate-600">123 Innovation Drive</p>
                  <p className="text-slate-600">Tech City, TC 12345</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Business Hours
                  </h3>
                  <p className="text-slate-600">Monday - Friday: 9am - 6pm</p>
                  <p className="text-slate-600">Weekend: By appointment</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h3 className="font-semibold text-slate-900">Quick Contact</h3>
              <div className="flex flex-col space-y-3">
                <Button variant="outline" className="justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-50 rounded-3xl p-8 lg:p-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Send us a Message
                  </h2>
                  <p className="text-slate-600">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Your first name"
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Your last name"
                        className="bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      className="bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project or ask us a question..."
                      rows={6}
                      className="bg-white border-slate-200 resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 bg-davami-gradient hover:opacity-90 text-white border-0 px-8 py-4 text-lg font-semibold"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold"
                    >
                      Schedule Call
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
