'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Music, Search, FileText, Loader2, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jsPDF } from "jspdf";
import localFont from "next/font/local";
import { toast } from "sonner";

const rethinkSans = localFont({
  src: [
    { path: "../fonts/RethinkSans-Regular.ttf", weight: "400", style: "normal" },
    // include this if you have a bold weight so <h1 class="font-bold"> renders correctly 
    { path: "../fonts/RethinkSans-Regular.ttf",    weight: "700", style: "normal" },
  ],
  display: "swap",
});

export default function Home() {
  const [artistName, setArtistName] = useState("");
  const [artistReport, setArtistReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportFocus, setReportFocus] = useState("");

  //need to add report template choices to choose from 
  const reportTemplateChoices = [
    "bedroom artist",
    "early climber",
    "mainstream artist",
    "late bloomer"
  ]


  async function downloadArtistReportText() {
    //toast.error("not available yet")

    //return;

    toast.success("artist report opening...")
    if (artistReport) {
        const response = await fetch("http://localhost:3012/reportGoogleDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ artistReport: artistReport, chosenArtist: artistName, reportFocus: reportFocus  })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send artistReport');
      }
      
      const googleDocURL = await response.json();
      console.log("data back from sending to artistReport is: ", googleDocURL);
    
    window.open(googleDocURL, "_blank")
      } else if (!artistReport) {
        console.log('cannot download artist report, as it doesnt exist');
        toast.error("cannot download artist report, as it doesnt exist")
      }
    
    
  }

  

  async function downloadArtistReportPDF() {
    
     const doc = new jsPDF();

  const text = typeof artistReport === 'string'
    ? artistReport
    : JSON.stringify(artistReport, null, 2);

  const lines = doc.splitTextToSize(text, 180); // Wrap text within page width
  doc.text(lines, 10, 10);

  doc.save(`artist report for ${artistName}.pdf`);
  }


  async function generateArtistReport() {
    if (!artistName.trim()) return;
    if (!reportFocus || !artistName || !reportFocus && !artistName) return;
    if (artistReport) {
      console.log("artist report should be cleared")
      setArtistReport("")
    }

    
    
    setIsLoading(true);
    setError("");
    
    try { //https://artist-report-generator-backend-1.onrender.com or localhost3011, make dynamic ideally http://localhost:3011
      const response = await fetch("http://localhost:3012/reportGenerator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ chosenArtist: artistName, reportFocus: reportFocus })
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

  useEffect(() => {
    console.log("reportFocus is: ", reportFocus);
  },[reportFocus])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
  <div className="flex flex-col items-center gap-2 mb-4">
    {/* Logo Icon in Circle */}
    <div className="w-12 h-12 rounded-full overflow-hidden bg-black flex items-center justify-center">
      <Image
        src="/cc-square-black.png"
        alt="Core Collectif Icon"
        width={32}
        height={32}
        className="object-contain"
      />
    </div>

    {/* Title: Reverb by */}
    <h1 className="text-4xl font-bold">
      <span className={`${rethinkSans.className} font-normal bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
        Reverb
      </span>
      <span className="text-gray-400 font-normal ml-1">by</span>
    </h1>

    {/* Core Collectif Logo */}
    <div className="mt-1">
      <Image
        src="/cc-logo-black.png"
        alt="Core Collectif logo"
        width={160}
        height={40}
        className="object-contain"
      />
    </div>
  </div>

  {/* Subheading */}
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
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={generateArtistReport} 
                disabled={!artistName.trim() || isLoading}
                className="h-12 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
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

           <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-3">Select report template (optional):</p>
              <div className="flex flex-wrap gap-3">
                {reportTemplateChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => setReportFocus(reportFocus === choice ? "" : choice)}
                    disabled={isLoading}
                    className={`
                      relative px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 capitalize min-w-fit
                      ${
                        reportFocus === choice
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                          : "bg-white text-gray-700 hover:text-gray-900"
                      }
                      ${!isLoading ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                    `}
                    style={{
                      background: reportFocus === choice ? "linear-gradient(135deg, #8b5cf6, #3b82f6)" : "white",
                    }}
                  >
                    {reportFocus !== choice && (
                      <>
                        <div
                          className="absolute inset-0 rounded-lg animate-pulse"
                          style={{
                            background:
                              "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)",
                            backgroundSize: "400% 400%",
                            animation: "rainbow 3s linear infinite",
                            padding: "2px",
                          }}
                        >
                          <div className="w-full h-full bg-white rounded-lg"></div>
                        </div>
                        <span className="relative z-10">{choice}</span>
                      </>
                    )}
                    {reportFocus === choice && <span className="relative z-10">{choice}</span>}
                  </button>
                ))}
              </div>
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
            <Button onClick={downloadArtistReportText}>open artist report as Google Doc</Button>
            <Button onClick={downloadArtistReportPDF}>download artist report - pdf</Button>
            <CardContent className="pt-6">
              <div className="prose prose-gray max-w-none">
                <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-purple-500">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-gray-700">
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
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
    </div>
  );
}