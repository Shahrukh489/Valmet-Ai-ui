import React from "react";
import { Bug } from "lucide-react";

import { Input } from "../../../../components/ui/input";

function SearchBug() {
  return (
    <div className="relative w-80 mb-3">
      <Bug className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input 
        type="text" 
        placeholder="ID: 12345-78" 
        className="pl-10"
      />
    </div>
  );
}

export default SearchBug;
