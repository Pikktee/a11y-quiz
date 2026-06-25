"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Search, 
  Users, 
  Award, 
  HelpCircle, 
  Globe, 
  ChevronRight, 
  RefreshCw,
  TrendingUp,
  BrainCircuit,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { QuizResult } from "@/lib/schema";

type AdminDashboardProps = {
  initialResults: QuizResult[];
};

const CHART_COLORS = [
  "var(--primary)",
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#3b82f6", // blue
  "#ef4444"  // red
];

export default function AdminDashboard({ initialResults }: AdminDashboardProps) {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedModule, setSelectedModule] = useState<string>("all");

  // Get unique modules for the filter dropdown
  const uniqueModules = useMemo(() => {
    const modules = new Set(initialResults.map(r => r.module));
    return Array.from(modules);
  }, [initialResults]);

  // Filtered results
  const filteredResults = useMemo(() => {
    return initialResults.filter((result) => {
      const matchesSearch = result.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = selectedDifficulty === "all" || result.difficulty === selectedDifficulty;
      const matchesLanguage = selectedLanguage === "all" || result.language === selectedLanguage;
      const matchesModule = selectedModule === "all" || result.module === selectedModule;

      return matchesSearch && matchesDifficulty && matchesLanguage && matchesModule;
    });
  }, [initialResults, searchTerm, selectedDifficulty, selectedLanguage, selectedModule]);

  // Reset filters helper
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDifficulty("all");
    setSelectedLanguage("all");
    setSelectedModule("all");
  };

  // Compute overall stats based on filtered results
  const stats = useMemo(() => {
    const total = filteredResults.length;
    if (total === 0) {
      return {
        totalSubmissions: 0,
        avgScorePercent: 0,
        avgScore: 0,
        avgTotalQuestions: 0,
        deCount: 0,
        enCount: 0,
        difficultyCounts: { anfaenger: 0, fortgeschritten: 0, experte: 0 },
      };
    }

    let sumScores = 0;
    let sumTotalQuestions = 0;
    let deCount = 0;
    let enCount = 0;
    const difficultyCounts = { anfaenger: 0, fortgeschritten: 0, experte: 0 };

    filteredResults.forEach((r) => {
      sumScores += r.score;
      sumTotalQuestions += r.total;
      if (r.language === "de") deCount++;
      else if (r.language === "en") enCount++;

      if (r.difficulty in difficultyCounts) {
        difficultyCounts[r.difficulty as keyof typeof difficultyCounts]++;
      }
    });

    const avgScorePercent = Math.round((sumScores / sumTotalQuestions) * 100) || 0;
    const avgScore = Number((sumScores / total).toFixed(1));
    const avgTotalQuestions = Number((sumTotalQuestions / total).toFixed(1));

    return {
      totalSubmissions: total,
      avgScorePercent,
      avgScore,
      avgTotalQuestions,
      deCount,
      enCount,
      difficultyCounts,
    };
  }, [filteredResults]);

  // Compute score distribution (histogram)
  // Categories: 0-20%, 21-40%, 41-60%, 61-80%, 81-100%
  const scoreDistributionData = useMemo(() => {
    const ranges = [
      { name: "0-20%", range: [0, 20], count: 0 },
      { name: "21-40%", range: [21, 40], count: 0 },
      { name: "41-60%", range: [41, 60], count: 0 },
      { name: "61-80%", range: [61, 80], count: 0 },
      { name: "81-100%", range: [81, 100], count: 0 }
    ];

    filteredResults.forEach((r) => {
      const percentage = (r.score / r.total) * 100;
      const rangeObj = ranges.find(range => percentage >= range.range[0] && percentage <= range.range[1]);
      if (rangeObj) {
        rangeObj.count++;
      }
    });

    return ranges;
  }, [filteredResults]);

  // Compute category statistics dynamically from JSON answers
  const categoryStats = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    
    filteredResults.forEach((r) => {
      if (!Array.isArray(r.answers)) return;
      r.answers.forEach((ans) => {
        const cat = ans.category || "Allgemein / Sonstige";
        if (!map[cat]) {
          map[cat] = { correct: 0, total: 0 };
        }
        map[cat].total++;
        if (ans.is_correct) {
          map[cat].correct++;
        }
      });
    });

    return Object.entries(map)
      .map(([name, data]) => ({
        name,
        total: data.total,
        correct: data.correct,
        accuracy: Math.round((data.correct / data.total) * 100),
      }))
      .sort((a, b) => b.accuracy - a.accuracy); // Highest accuracy first
  }, [filteredResults]);

  // Language chart data
  const languageData = useMemo(() => {
    return [
      { name: "Deutsch (DE)", value: stats.deCount },
      { name: "Englisch (EN)", value: stats.enCount }
    ].filter(item => item.value > 0);
  }, [stats]);

  // Difficulty chart data
  const difficultyData = useMemo(() => {
    return [
      { name: "Anfänger", value: stats.difficultyCounts.anfaenger },
      { name: "Fortgeschritten", value: stats.difficultyCounts.fortgeschritten },
      { name: "Experte", value: stats.difficultyCounts.experte }
    ].filter(item => item.value > 0);
  }, [stats]);

  // Format creation date
  const formatDateTime = (dateString: string) => {
    try {
      // Handles standard sqlite CURRENT_TIMESTAMP string (e.g. 2026-05-20 10:58:22)
      // SQLite timestamp is usually UTC, let's try parsing it
      const cleanString = dateString.replace(" ", "T") + (dateString.includes("Z") || dateString.includes("+") ? "" : "Z");
      const d = new Date(cleanString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "experte": return "destructive";
      case "fortgeschritten": return "default"; // primary
      case "anfaenger": default: return "secondary";
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case "experte": return "Experte";
      case "fortgeschritten": return "Fortgeschritten";
      case "anfaenger": return "Anfänger";
      default: return diff;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard 📊</h1>
          <p className="text-muted-foreground mt-1">
            Überblick und detaillierte Statistiken zu allen A11y-Quiz Einreichungen.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResetFilters} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Filter zurücksetzen
          </Button>
          <Link href="/">
            <Button size="sm">Zur Startseite</Button>
          </Link>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="border border-border/80 bg-card/60 backdrop-blur-md">
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="w-full lg:flex-1">
              <label htmlFor="search-name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Teilnehmer suchen
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="search-name"
                  type="text"
                  placeholder="Name eingeben..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="w-full sm:w-1/3 lg:w-48">
              <label htmlFor="filter-difficulty" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Schwierigkeit
              </label>
              <select
                id="filter-difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Alle</option>
                <option value="anfaenger">Anfänger</option>
                <option value="fortgeschritten">Fortgeschritten</option>
                <option value="experte">Experte</option>
              </select>
            </div>

            <div className="w-full sm:w-1/3 lg:w-48">
              <label htmlFor="filter-lang" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Sprache
              </label>
              <select
                id="filter-lang"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Alle</option>
                <option value="de">Deutsch (DE)</option>
                <option value="en">Englisch (EN)</option>
              </select>
            </div>

            <div className="w-full sm:w-1/3 lg:w-64">
              <label htmlFor="filter-module" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Quiz-Modul
              </label>
              <select
                id="filter-module"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring truncate"
              >
                <option value="all">Alle Module</option>
                {uniqueModules.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Teilnahmen gesamt</p>
              <h3 className="text-2xl font-bold">{stats.totalSubmissions}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Ø Richtige Antworten</p>
              <h3 className="text-2xl font-bold">{stats.avgScorePercent}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Ø Punkte</p>
              <h3 className="text-2xl font-bold">
                {stats.avgScore} <span className="text-sm text-muted-foreground font-normal">/ {stats.avgTotalQuestions}</span>
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Sprachenverteilung</p>
              <h3 className="text-2xl font-bold">
                DE: {stats.deCount} <span className="text-sm text-muted-foreground font-normal">/ EN: {stats.enCount}</span>
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {initialResults.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <CardContent className="space-y-4">
            <p className="text-lg font-medium text-muted-foreground">Noch keine Einträge in der Datenbank erfasst.</p>
            <p className="text-sm text-muted-foreground">Sobald User das Quiz abschließen, erscheinen die Daten hier.</p>
          </CardContent>
        </Card>
      ) : filteredResults.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <CardContent className="space-y-4">
            <p className="text-lg font-medium text-muted-foreground">Keine Ergebnisse stimmen mit den Filtereinstellungen überein.</p>
            <Button variant="outline" onClick={handleResetFilters}>Filter löschen</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Punkteverteilung (in % des Quizerfolgs)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <Tooltip 
                      cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                      contentStyle={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    />
                    <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Teilnehmer" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Demographics / Difficulty & Language */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  Schwierigkeitsgrade & Sprachen
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-72 items-center justify-items-center">
                {/* Difficulty Pie Chart */}
                {difficultyData.length > 0 ? (
                  <div className="flex flex-col items-center w-full h-full justify-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Schwierigkeit</span>
                    <div className="w-full h-36 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={difficultyData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={55}
                            dataKey="value"
                            nameKey="name"
                          >
                            {difficultyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center text-xs mt-2">
                      {difficultyData.map((d, index) => (
                        <div key={d.name} className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                          <span>{d.name}: <strong>{d.value}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Keine Schwierigkeitsdaten</div>
                )}

                {/* Language Pie Chart */}
                {languageData.length > 0 ? (
                  <div className="flex flex-col items-center w-full h-full justify-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sprache</span>
                    <div className="w-full h-36 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={languageData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={55}
                            dataKey="value"
                            nameKey="name"
                          >
                            {languageData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 3) % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center text-xs mt-2">
                      {languageData.map((d, index) => (
                        <div key={d.name} className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[(index + 3) % CHART_COLORS.length] }} />
                          <span>{d.name}: <strong>{d.value}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Keine Sprachendaten</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Category breakdown (if categories answers exist) */}
          {categoryStats.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Erfolgsquote nach Themenbereich / Kategorie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryStats.map((c) => (
                    <div key={c.name} className="p-4 rounded-xl border border-border bg-card/40 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm line-clamp-1" title={c.name}>{c.name}</span>
                        <Badge variant={c.accuracy >= 80 ? "default" : c.accuracy >= 50 ? "secondary" : "destructive"}>
                          {c.accuracy}%
                        </Badge>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${c.accuracy}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {c.correct} von {c.total} Fragen richtig beantwortet
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results List */}
          <Card className="shadow-sm border border-border overflow-hidden">
            <CardHeader className="bg-card/40 border-b border-border/80">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-lg font-bold">Erfasste Quiz-Einträge</CardTitle>
                <Badge variant="secondary">
                  Zeigt {filteredResults.length} von {initialResults.length} Einträgen
                </Badge>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                    <th scope="col" className="p-4">Name</th>
                    <th scope="col" className="p-4">Datum</th>
                    <th scope="col" className="p-4">Sprache</th>
                    <th scope="col" className="p-4">Schwierigkeit</th>
                    <th scope="col" className="p-4">Quiz-Modul</th>
                    <th scope="col" className="p-4 text-center">Score</th>
                    <th scope="col" className="p-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredResults.map((result) => {
                    const pct = Math.round((result.score / result.total) * 100);
                    return (
                      <tr key={result.resultId} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-semibold text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                              {result.name.substring(0, 2)}
                            </span>
                            {result.name}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground whitespace-nowrap">
                          {formatDateTime(result.createdAt)}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="uppercase font-mono">
                            {result.language}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={getDifficultyColor(result.difficulty)}>
                            {getDifficultyLabel(result.difficulty)}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground truncate max-w-[200px]" title={result.module}>
                          {result.module}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col items-center gap-1 justify-center">
                            <span className="font-bold text-base">
                              {result.score}<span className="text-xs text-muted-foreground">/{result.total}</span>
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-primary' : 'bg-destructive'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Link href={`/r/${result.resultId}`} className="inline-flex">
                            <Button size="sm" variant="ghost" className="gap-1 hover:bg-primary/10 hover:text-primary transition-colors">
                              Anschauen
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
