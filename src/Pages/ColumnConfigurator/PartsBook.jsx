import React, { useEffect, useState } from "react";
import { Book, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import Accordian from "../../components/AccordionComp/Accordian";

function PartsBook() {
  const [chapterTitles, setChapterTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChapters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:5034/v1/spareparts/api/spareparts/GetChapters"
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data.result);
      setChapterTitles(data.result || []);
    } catch (e) {
      console.error("Error fetching chapters:", e);
      setError("Failed to load parts book chapters. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleRetry = () => {
    fetchChapters();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" style={{ paddingTop: "90px" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading parts book chapters...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background" style={{ paddingTop: "90px" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Failed to Load Parts Book
            </h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: "90px" }}>
      {/* Modern Header Section */}
      <div className="bg-card border-b border-border px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Book className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Spare Parts Book
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse spare parts organized by chapters and categories
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-card rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Chapters ({chapterTitles.length})
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Click on any chapter to explore available spare parts
            </p>
          </div>

          <div className="p-6">
            {chapterTitles.length === 0 ? (
              <div className="text-center py-12">
                <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Chapters Available
                </h3>
                <p className="text-muted-foreground">
                  No parts book chapters are currently available.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {chapterTitles.map((title, index) => (
                  <div
                    key={`${title.chapter}-${index}`}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    <Accordian
                      chapterTitles={title.title}
                      chapter={title.chapter}
                      relation={title.itemKey}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartsBook;