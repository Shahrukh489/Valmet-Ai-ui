import React from "react";
import { DollarSign, Building2, Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function FeaturesSection() {
  const features = [
    {
      title: "Real-time Pricing",
      description: "Get the latest pricing for all spare parts instantly.",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Enterprise Integration",
      description: "Seamlessly integrates with your existing systems.",
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Extensibility",
      description: "Endless Possibilities, Make ideas come to life.",
      icon: Zap,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
  ];

  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Teams Focus
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful capabilities designed for modern businesses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                      <IconComponent className={`h-8 w-8 ${feature.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
