import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Package, BarChart3, Shield, Zap, Globe, Sparkles } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

function HeroSection() {
  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Advanced part number search with GC recognition"
    },
    {
      icon: Package,
      title: "Column Configuration", 
      description: "Custom MAXUM column builder with MLFB generation"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Business intelligence and performance insights"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Role-based access control and data protection"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6">
        {/* Hero Content */}
        <div className="pt-32 pb-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <Badge variant="outline" className="mb-8 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Microsoft Azure
            </Badge>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
              Valmet SPT
              <span className="block text-transparent bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
                Spare Parts Portal
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              Enterprise-grade spare parts management system with advanced search capabilities, 
              intelligent column configuration, and comprehensive business analytics.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" asChild className="group">
                <Link to="/searchparts" className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Parts
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link to="/search" className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Column Configurator
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Global Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Enterprise Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Built for modern businesses with enterprise-grade reliability, security, and performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-xl mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="py-20">
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                  <div className="text-muted-foreground text-lg">Spare Parts Managed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                  <div className="text-muted-foreground text-lg">System Uptime</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-muted-foreground text-lg">Enterprise Support</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final CTA Section */}
        <div className="py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Card className="bg-gradient-to-br from-muted/50 to-muted/20 border-border/50">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Join thousands of professionals using Valmet SPT for enterprise spare parts management.
                </p>
                <Button size="lg" asChild>
                  <Link to="/searchparts" className="flex items-center gap-2">
                    Start Exploring
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;