import React from 'react'
import { FileText } from "lucide-react";

import ReportPage from "./ReportPage";

function GenerateReports() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Generate Reports</h1>
            <p className="text-sm text-muted-foreground">
              Generate reports for various aspects of the system. You can
              customize the report parameters and download them in different
              formats.
            </p>
          </div>
        </div>
      </div>
      <ReportPage />
    </div>
  );
}

export default GenerateReports