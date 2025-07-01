import React from 'react'
import { Search } from "lucide-react";

import { Input } from "../../../../components/ui/input";

function SearchUsers() {
  return (
    <div className="relative w-80 mb-3">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success" />
      <Input 
        type="text" 
        placeholder="example@valmet.com" 
        className="pl-10"
      />
    </div>
  );
}

export default SearchUsers