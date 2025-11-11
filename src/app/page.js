'use client'

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Music, Search, FileText, Loader2, Sparkles } from 'lucide-react';
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
   const [ additionalPrompt, setAdditionalPrompt ] = useState("")
  const [ chartmetricID, setChartmetricID ] = useState("")


  

  const reportTemplateChoicesVariation = [
    "album_release",
    "track_release",
    "fanbase_and_growth_analysis",
    "catalogue_revival"
  ]


  async function downloadArtistReportText() {
    //toast.error("not available yet")
    //return;

    toast.success("artist report opening...")
    if (artistReport) {
        const response = await fetch("http://localhost:3011/reportGoogleDoc", {
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


  async function newReverbVariantReportGeneration() {
    if (!artistName.trim()) return;
    if (!reportFocus) {
      toast.error("you need to select the report focus")
      return
    }
    if (!artistName) {
      toast.error("you need to select the artist name")
      return
    }
    if (!chartmetricID) {
      toast.error("you need to enter the chartmetric ID")
      return
    }
    if (artistReport) {
      console.log("artist report should be cleared")
      setArtistReport("")
    }

    // Use mock data if toggle is enabled
    /*if (useMockData) {
      setIsLoading(true);
      setTimeout(() => {
        setArtistReport(mockArtistReport);
        setIsLoading(false);
        toast.success("Mock report generated!");
      }, 1500);
      return;
    }*/

    setIsLoading(true);
    setError("");

    //let endpoint = process.env.NEXT_PUBLIC_API_BASE_URL ? `https://reverb-report-generation-variant-backend.onrender.com/suiteEndpoint` : "http://localhost:3011/suiteEndpoint"
     //console.log(`endpoint is: ${endpoint}`)
    
    let endpoint = `https://reverb-report-generation-variant-backend.onrender.com/suiteEndpoint`
    console.log(`endpoint is: ${endpoint}`)

    try { //https://artist-report-generator-backend-1.onrender.com or localhost3011, make dynamic ideally http://localhost:3011
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ artist_name: artistName, template_choice: reportFocus, custom_additional_prompt: additionalPrompt, chartmetric_id: chartmetricID })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      console.log("data back from generateArtistReport is: ", data);
      setArtistReport(data);
      //need to save artistReort in global useContext hook
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
                className="h-12 text-lg pr-4 border-2 focus:border-accent-black transition-colors"
                disabled={isLoading}
              />
            </div>
            <div className="flex-1 relative">
              <Input
                placeholder="Add your custom report request"
                value={additionalPrompt}
                onChange={(e) => setAdditionalPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 text-lg pr-4 border-2 focus:border-accent-black transition-colors"
                disabled={isLoading}
              />
            </div>
            <div className="flex-1 relative">
              <Input
                placeholder="Add chartmetric id"
                value={chartmetricID}
                onChange={(e) => setChartmetricID(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 text-lg pr-4 border-2 focus:border-accent-black transition-colors"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={newReverbVariantReportGeneration}
              disabled={!artistName.trim() || isLoading}
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-all duration-200"
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
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
         

        <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">Select report template:</p>

            <div className="flex flex-wrap gap-3">
              {reportTemplateChoicesVariation.map((choice) => (
                <div key={choice} className="relative group">
                  <button
                    onClick={() => setReportFocus(reportFocus === choice ? "" : choice)}
                    disabled={isLoading}
                    className={`
            px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 capitalize min-w-fit
            ${reportFocus === choice
                        ? "bg-primary/5 text-primary border-2 border-primary shadow-md"
                        : "border-2 border-accent-black/40 text-accent-black bg-transparent hover:bg-accent-black/5 hover:border-accent-black/60"}
            ${!isLoading ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
          `}
                  >
                    {choice}
                  </button>

                  {/* Tooltip */}
                  {choice === "Album Preparation" && (
                    <div
                      className="
              pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2
              bg-gray-900 text-white text-xs rounded-md px-4 py-3 w-80
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200
               z-100 shadow-lg whitespace-pre-line
            "
                    >
                      📝Artist has an album coming out in Y period of time. Based on their previous releases, please give an overview of their current audience and use this to tell us how to launch a new project.


                    </div>
                  )}
                  {choice === "Maintain Audience Engagement" && (
                    <div
                      className="
              pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2
              bg-gray-900 text-white text-xs rounded-md px-4 py-3 w-80
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200
               z-100 shadow-lg whitespace-pre-line
            "
                    >
                      🎯 How Can the Artist Keep Their Audience Engaged Between Album Projects

                    </div>
                  )}
                  {choice === "Revive Catalogue" && (
                    <div
                      className="
              pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2
              bg-gray-900 text-white text-xs rounded-md px-4 py-3 w-80
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200
               z-100 shadow-lg whitespace-pre-line
            "
                    >
                      🔄 Reviving Artist’s Catalogue: Best Strategies & Timing

                    </div>
                  )}
                  {choice === "Fanbase Analysis" && (
                    <div
                      className="
              pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2
              bg-gray-900 text-white text-xs rounded-md px-4 py-3 w-80
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200
               z-100 shadow-lg whitespace-pre-line
            "
                    >
                      📊 Artist Fanbase Analysis: Where They Are, How to Reach Them, and How to Grow

                    </div>
                  )}
                  {choice === "Grow Fanbase" && (

                    <div
                      className="
    pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2
    bg-gray-900 text-white text-xs rounded-md px-4 py-3 w-96 max-h-80 overflow-y-auto
    opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200
    z-[9999] shadow-xl whitespace-pre-line prose-sm
  "
                    >
                      📈 How can the Artist engage, activate and grow their existing fanbase over the next Y period of time?


                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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