import React from "react";
import { Settings, Search, ShoppingCart } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function ServicesSection() {
  const services = [
    {
      title: "Column Configuration",
      description: "Advanced column configurator with intelligent part selection and real-time pricing for optimal solutions.",
      icon: Settings,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Parts Search",
      description: "Comprehensive spare parts search with detailed specifications and availability tracking.",
      icon: Search,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Smart Shopping",
      description: "Intelligent shopping cart with volume discounts and enterprise-grade procurement features.",
      icon: ShoppingCart,
      color: "text-info",
      bgColor: "bg-info/10"
    },
  ];

  return (
    <section id="services" className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions for all your industrial parts and configuration needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${service.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${service.color}`} />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
