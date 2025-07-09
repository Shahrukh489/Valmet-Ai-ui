import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bug, AlertTriangle, Info, Send } from "lucide-react";
import { showToast } from "../../lib/toast-utils";

const ReportBug = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "",
    reportedBy: "",
  });

  const PRICINGAPI_BASE_URL =
    "https://wea-spt-use-dv-pricingapi-001.azurewebsites.net";


  // Get email from localStorage on load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        reportedBy: storedUser.user.email,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Bug reported:", formData);
    // Here you would typically send the formData to your backend API
    // For demonstration, we'll just log it to the console

    // Example API call (uncomment and modify as needed):
     const response = await fetch(
       `${PRICINGAPI_BASE_URL}/reportBug`,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(formData),
       }
     ); 

     if (!response.ok) {
       showToast.error("Failed to submit bug. Please try again.");
       return;
     }
    showToast.success("Bug successfully submitted!");

    setFormData({
      title: "",
      description: "",
      severity: "",
      reportedBy: formData.reportedBy, // keep email after reset
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Bug className="h-6 w-6 text-destructive" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground">Report a Bug</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Help us improve by reporting any issues you encounter. We'll review your report and get back to you soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">
                      Bug Title *
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Brief description of the issue"
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">
                      Description *
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Please provide detailed steps to reproduce the bug, expected behavior, and what actually happened..."
                      className="bg-background border-border text-foreground resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">
                      Severity Level *
                    </label>
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={handleChange}
                      required
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select severity level</option>
                      <option value="Low">🟢 Low - Minor inconvenience</option>
                      <option value="Medium">🟡 Medium - Affects functionality</option>
                      <option value="High">🟠 High - Blocks important features</option>
                      <option value="Critical">🔴 Critical - System unusable</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">
                      Reporter Email
                    </label>
                    <Input
                      name="reportedBy"
                      value={formData.reportedBy}
                      disabled
                      className="bg-muted/50 border-border text-muted-foreground cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      This email will be used to contact you about the bug report
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Bug Report</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Tips */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-card-foreground">Reporting Tips</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Be specific about what you were doing when the bug occurred</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Include step-by-step instructions to reproduce the issue</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Mention your browser and operating system if relevant</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Describe what you expected to happen vs. what actually happened</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold text-card-foreground">Severity Guide</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="border-l-4 border-green-500 pl-3">
                    <div className="font-medium text-card-foreground">Low</div>
                    <div className="text-muted-foreground">Minor issues that don't affect core functionality</div>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-3">
                    <div className="font-medium text-card-foreground">Medium</div>
                    <div className="text-muted-foreground">Issues that affect functionality but have workarounds</div>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-3">
                    <div className="font-medium text-card-foreground">High</div>
                    <div className="text-muted-foreground">Significant issues that block important features</div>
                  </div>
                  <div className="border-l-4 border-red-500 pl-3">
                    <div className="font-medium text-card-foreground">Critical</div>
                    <div className="text-muted-foreground">Severe issues that make the system unusable</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportBug;
