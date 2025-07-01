import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bug, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Calendar,
  User,
  Activity,
  FileText,
  MoreVertical,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusOptions = ["Reported", "In Progress", "Resolved"];

const ReportedBugs = () => {
  const [query, setQuery] = useState("");
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch = bug.id?.toLowerCase().includes(query.toLowerCase()) ||
                         bug.title?.toLowerCase().includes(query.toLowerCase()) ||
                         bug.description?.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || bug.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || bug.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getStatusStats = () => {
    const stats = {
      total: bugs.length,
      reported: bugs.filter(b => b.status === "Reported").length,
      inProgress: bugs.filter(b => b.status === "In Progress").length,
      resolved: bugs.filter(b => b.status === "Resolved").length,
    };
    return stats;
  };

  const getSeverityBadgeColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-warning text-warning-foreground";
      case "medium": return "bg-info text-info-foreground";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Resolved": return "bg-success text-success-foreground";
      case "In Progress": return "bg-warning text-warning-foreground";
      case "Reported": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved": return <CheckCircle className="w-4 h-4" />;
      case "In Progress": return <Clock className="w-4 h-4" />;
      case "Reported": return <AlertCircle className="w-4 h-4" />;
      default: return <Bug className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const res = await fetch(
          "https://wea-spt-use-dv-pricingapi-001.azurewebsites.net/getAllBugsReported"
        );

        if (!res.ok) {
          console.error("HTTP error:", res.status);
          return;
        }

        const text = await res.text();
        if (!text) return;

        const data = JSON.parse(text);

        if (data.isSuccess && Array.isArray(data.result)) {
          setBugs(data.result);
        } else {
          console.error("API error:", data.message || "Unexpected structure");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, []);

  const handleStatusChange = (bugId, newStatus) => {
    setBugs((prev) =>
      prev.map((bug) =>
        bug.id === bugId ? { ...bug, status: newStatus } : bug
      )
    );
  };

  const handleRefresh = () => {
    setLoading(true);
    // Re-fetch bugs
    const fetchBugs = async () => {
      try {
        const res = await fetch(
          "https://wea-spt-use-dv-pricingapi-001.azurewebsites.net/getAllBugsReported"
        );
        if (!res.ok) return;
        const text = await res.text();
        if (!text) return;
        const data = JSON.parse(text);
        if (data.isSuccess && Array.isArray(data.result)) {
          setBugs(data.result);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBugs();
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Bug className="w-6 h-6 text-primary" />
            Bug Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage reported issues across the system
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bugs</p>
                <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reported</p>
                <p className="text-2xl font-semibold text-destructive">{stats.reported}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-semibold text-warning">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-semibold text-success">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search bugs by ID, title, or description..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Severity</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bug Reports Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading bug reports...
          </div>
        </div>
      ) : filteredBugs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bug className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No bugs found</h3>
            <p className="text-muted-foreground">
              {query || statusFilter !== "all" || severityFilter !== "all" 
                ? "Try adjusting your search criteria or filters"
                : "No bug reports have been submitted yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBugs.map((bug) => (
            <Card key={bug.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground line-clamp-1">
                      {bug.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getSeverityBadgeColor(bug.severity)}>
                        {bug.severity}
                      </Badge>
                      <Badge className={getStatusBadgeColor(bug.status)}>
                        {getStatusIcon(bug.status)}
                        <span className="ml-1">{bug.status}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {statusOptions.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleStatusChange(bug.id, status)}
                          className="flex items-center gap-2"
                        >
                          {getStatusIcon(status)}
                          Mark as {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {bug.description}
                </p>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span className="font-medium">ID:</span>
                    <span className="font-mono">{bug.id}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span className="font-medium">Reporter:</span>
                    <span>{bug.reportedBy}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span className="font-medium">Date:</span>
                    <span>{new Date(bug.dateReported).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportedBugs;