import React from "react";
import { Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function AboutSection() {
  return (
    <section id="about" className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-3xl">About Us</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are a leading company in the industry, offering exceptional
              services and solutions to our clients. Our mission is to deliver
              high-quality results and exceed customer expectations through
              innovative technology and dedicated service.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default AboutSection;
