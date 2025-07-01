import React from "react";

function Footer() {
  return (
    <footer className="bg-card border-t mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            &copy; {new Date().getFullYear()} Valmet Inc. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <a 
              href="#privacy-policy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-muted-foreground">|</span>
            <a 
              href="#terms-of-service" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
