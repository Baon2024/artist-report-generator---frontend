'use client';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Music, Search, FileText, Loader2, Sparkles } from 'lucide-react';

export default function Home() {
  const [artistName, setArtistName] = useState("");
  const [artistReport, setArtistReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateArtistReport() {
    if (!artistName.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:3011/reportGenerator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ chosenArtist: artistName })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      const data = await response.json();
      console.log("data back from generateArtistReport is: ", data);
      setArtistReport(data);
    } catch (err) {
      setError("Failed to generate report. Please try again.");
      console.error("Error generating report:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && artistName.trim()) {
      generateArtistReport();
    }
  };

  return (
    (<div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Artist Report Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate comprehensive reports about your favorite artists. Get insights, analysis, and detailed information instantly.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="w-5 h-5" />
              Search Artist
            </CardTitle>
            <CardDescription>
              Enter the name of any artist to generate a detailed report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Enter artist name (e.g., Taylor Swift, The Beatles, Drake...)"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 text-lg pr-4 border-2 focus:border-purple-500 transition-colors"
                  disabled={isLoading} />
              </div>
              <Button
                onClick={generateArtistReport}
                disabled={!artistName.trim() || isLoading}
                className="h-12 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Display Section */}
        {artistReport && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5" />
                  Artist Report
                </CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Generated
                </Badge>
              </div>
              <CardDescription>
                Report for: <span className="font-semibold text-foreground">{artistName}</span>
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="prose prose-gray max-w-none">
                <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-purple-500">
                  <pre
                    className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-gray-700">
                    {typeof artistReport === 'string' ? artistReport : JSON.stringify(artistReport, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && !artistReport && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="py-12">
              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Generating Report</h3>
                <p className="text-muted-foreground">
                  Please wait while we analyze and compile information about {artistName}...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!artistReport && !isLoading && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm border-dashed">
            <CardContent className="py-12">
              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-600">No Report Generated Yet</h3>
                <p className="text-muted-foreground">
                  Enter an artist name above to generate your first report
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>)
  );
}
