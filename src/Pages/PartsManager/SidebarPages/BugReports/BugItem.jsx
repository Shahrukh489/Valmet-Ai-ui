import React from "react";
import { Bug, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

const BugItem = (props) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          
          {/* Bug Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
              <Bug className="h-5 w-5 text-destructive" />
            </div>
          </div>

          {/* Bug Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {props.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Bug ID: {props.id || 'N/A'}
                </p>
                <div className="max-h-24 overflow-auto">
                  <p className="text-sm text-muted-foreground">
                    Description: {props.name}
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/details" className="flex items-center space-x-1">
                    <ExternalLink className="h-3 w-3" />
                    <span>Details</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BugItem;
