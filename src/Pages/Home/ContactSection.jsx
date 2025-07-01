import React from "react";
import { Phone, Mail, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Need Help? Contact Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our team is here to assist you with any questions or support you may need.
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Shahrukh Sadiq (Ali)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Mail className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <a 
                    href="mailto:shahrukh.sadiq@valmetpartners.com"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    shahrukh.sadiq@valmetpartners.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Phone className="h-4 w-4 text-info" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <a 
                    href="tel:+18327572651"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    (832) 757-2651
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
