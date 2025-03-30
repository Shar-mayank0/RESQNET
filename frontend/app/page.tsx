"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  ChevronRight,
  AlertTriangle,
  Cloud,
  Activity,
  Database,
  Droplet,
  Users,
  ArrowRight,
  Shield,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("response");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>ResQNet - AI-Powered Disaster Management</title>
        <meta
          name="description"
          content="Advanced disaster management platform for relief workers"
        />
      </Head>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/60 to-gray-900/90" />
        <div className="absolute inset-0 z-0 bg-[url('/hero-disaster.jpg')] bg-cover bg-center opacity-20"></div>

        <div className="container relative z-10 mx-auto px-6 py-24 md:py-32">
          <div className="max-w-4xl">
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              ResQNet
            </h1>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              AI-Powered{" "}
              <span className="text-blue-400">Disaster Management</span> for
              Relief Workers
            </h1>
            <p className="mb-8 text-xl text-gray-300 md:text-2xl">
              Real-time data, AI analysis, and actionable insights for faster
              and more effective disaster response.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-md bg-blue-600 px-6 py-3 font-medium transition-colors hover:bg-blue-700"
              >
                Access Dashboard
              </Link>
              <Link
                href="#demo"
                className="flex items-center rounded-md border border-gray-600 px-6 py-3 font-medium transition-colors hover:bg-gray-800"
              >
                Watch Demo <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Complete Crisis Response System
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Our platform integrates critical data sources and AI to create
              comprehensive disaster responses in minutes, not hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="bg-blue-600/20 p-3 rounded-full w-fit mb-4">
                <AlertTriangle className="text-blue-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Disaster Detection</h3>
              <p className="text-gray-300">
                Early warning system with real-time monitoring of multiple
                hazard types and automated alerts.
              </p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="bg-blue-600/20 p-3 rounded-full w-fit mb-4">
                <Database className="text-blue-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Integration</h3>
              <p className="text-gray-300">
                Unified view of weather, seismic, flood, infrastructure, and
                population data in one platform.
              </p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="bg-blue-600/20 p-3 rounded-full w-fit mb-4">
                <Activity className="text-blue-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-300">
                NLP-powered insights and automatic generation of response plans
                tailored to each event.
              </p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="bg-blue-600/20 p-3 rounded-full w-fit mb-4">
                <Users className="text-blue-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Field Coordination</h3>
              <p className="text-gray-300">
                Tools for response team collaboration, resource allocation, and
                real-time field updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold mb-4">How ResoNet Works</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Our platform transforms disaster response through intelligent data
              processing and AI-driven recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-600 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Data Collection</h3>
              <p className="text-gray-300">
                Continuously collect and monitor data from multiple sources
                including weather services, seismic monitors, satellite imagery,
                social media, and local reports.
              </p>
            </div>

            <div className="flex flex-col items-center text-center mt-8 md:mt-0">
              <div className="bg-blue-600 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Processing</h3>
              <p className="text-gray-300">
                Our AI agents analyze the collected data to assess disaster
                severity, identify affected areas, estimate impact, and generate
                response recommendations.
              </p>
            </div>

            <div className="flex flex-col items-center text-center mt-8 md:mt-0">
              <div className="bg-blue-600 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Actionable Insights
              </h3>
              <p className="text-gray-300">
                Relief workers receive detailed reports, action plans, resource
                allocation suggestions, and interactive maps for effective
                decision making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Demo Section */}
      <section id="demo" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Comprehensive Disaster Intelligence
              </h2>

              <div className="mb-8">
                <div className="flex space-x-6 mb-6">
                  <button
                    className={`pb-2 font-medium ${
                      activeTab === "response"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400"
                    }`}
                    onClick={() => setActiveTab("response")}
                  >
                    Response Plans
                  </button>
                  <button
                    className={`pb-2 font-medium ${
                      activeTab === "monitoring"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400"
                    }`}
                    onClick={() => setActiveTab("monitoring")}
                  >
                    Real-time Monitoring
                  </button>
                  <button
                    className={`pb-2 font-medium ${
                      activeTab === "resources"
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400"
                    }`}
                    onClick={() => setActiveTab("resources")}
                  >
                    Resource Management
                  </button>
                </div>

                <div
                  className={`p-6 bg-gray-700 rounded-lg ${
                    activeTab === "response" ? "block" : "hidden"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-3">
                    AI-Generated Response Plans
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Our NLP models generate detailed, step-by-step response
                    plans customized for each disaster scenario, prioritizing
                    actions based on urgency and impact.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>
                        Prioritized action items with clear responsibilities
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>
                        Resource requirements and allocation suggestions
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Timeline estimates and critical path analysis</span>
                    </li>
                  </ul>
                  <Link
                    href="/dashboard"
                    className="text-blue-400 flex items-center hover:underline"
                  >
                    Explore response planning{" "}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                <div
                  className={`p-6 bg-gray-700 rounded-lg ${
                    activeTab === "monitoring" ? "block" : "hidden"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-3">
                    Multi-Source Monitoring
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Track real-time data from multiple sources to maintain
                    situational awareness and detect changing conditions that
                    may affect ongoing response efforts.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <Cloud className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="ml-2">
                        Weather conditions and forecasts
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Activity className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="ml-2">
                        Seismic activity and aftershock predictions
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Droplet className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="ml-2">
                        River levels and flood projections
                      </span>
                    </li>
                  </ul>
                  <Link
                    href="/weather"
                    className="text-blue-400 flex items-center hover:underline"
                  >
                    View weather monitoring{" "}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                <div
                  className={`p-6 bg-gray-700 rounded-lg ${
                    activeTab === "resources" ? "block" : "hidden"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-3">
                    Smart Resource Management
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Track and optimize the deployment of personnel, equipment,
                    and supplies to maximize impact and prevent resource gaps.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Personnel tracking and team coordination</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>
                        Supply chain management and inventory tracking
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>
                        Equipment allocation and maintenance scheduling
                      </span>
                    </li>
                  </ul>
                  <Link
                    href="/resources"
                    className="text-blue-400 flex items-center hover:underline"
                  >
                    Manage resources <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-700 p-2 rounded-lg shadow-xl">
                <img
                  src="/dashboard-preview.jpg"
                  alt="ResoNet Dashboard Preview"
                  className="rounded w-full"
                />
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-md">
                  Interactive Demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disaster Types Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Supporting All Disaster Types
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Our platform is configured to handle various types of disasters
              with specialized data sources and response protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-orange-500/20 rounded-full mr-3">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold">Earthquakes</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Real-time seismic data, structural damage assessment, aftershock
                predictions, and evacuation planning.
              </p>
              <Link
                href="/disaster-types/earthquake"
                className="text-blue-400 text-sm hover:underline flex items-center"
              >
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-500/20 rounded-full mr-3">
                  <Droplet className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Floods</h3>
              </div>
              <p className="text-gray-300 mb-4">
                River level monitoring, precipitation forecasts, flood plain
                mapping, and evacuation route planning.
              </p>
              <Link
                href="/disaster-types/flood"
                className="text-blue-400 text-sm hover:underline flex items-center"
              >
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-full mr-3">
                  <Cloud className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Cyclones</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Storm tracking, wind speed projections, rainfall estimates, and
                coastal evacuation protocols.
              </p>
              <Link
                href="/disaster-types/cyclone"
                className="text-blue-400 text-sm hover:underline flex items-center"
              >
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-500/20 rounded-full mr-3">
                  <AlertTriangle className="h-6 w-6 text-red-500" rotate={90} />
                </div>
                <h3 className="text-xl font-semibold">Wildfires</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Hotspot detection, spread prediction, air quality monitoring,
                and evacuation coordination.
              </p>
              <Link
                href="/disaster-types/wildfire"
                className="text-blue-400 text-sm hover:underline flex items-center"
              >
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold">Industrial Accidents</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Hazardous materials tracking, air quality monitoring,
                containment strategies, and public safety measures.
              </p>
              <Link
                href="/disaster-types/industrial"
                className="text-blue-400 text-sm hover:underline flex items-center"
              >
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-500/20 rounded-full mr-3">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Epidemics</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Disease spread modeling, healthcare resource planning,
                containment zone mapping, and public health coordination.
              </p>
              <Link
                href="/disaster-types/epidemic"
                className="text-blue-400 text-sm hover:underline flex items-center"
              >
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Disaster Response?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join organizations worldwide using ResoNet to save lives and
            minimize the impact of disasters through data-driven response.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-md font-medium"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border border-blue-400 hover:bg-blue-900/30 px-8 py-3 rounded-md font-medium"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 pt-12 pb-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ResoNet</h3>
              <p className="text-gray-400 mb-4">
                AI-powered disaster management platform helping relief workers
                save lives through data-driven response.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-blue-400">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/weather" className="hover:text-blue-400">
                    Weather Monitoring
                  </Link>
                </li>
                <li>
                  <Link href="/analysis" className="hover:text-blue-400">
                    AI Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="hover:text-blue-400">
                    Report Generation
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-blue-400">
                    Resource Management
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Disaster Types</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/disaster-types/earthquake"
                    className="hover:text-blue-400"
                  >
                    Earthquakes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disaster-types/flood"
                    className="hover:text-blue-400"
                  >
                    Floods
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disaster-types/cyclone"
                    className="hover:text-blue-400"
                  >
                    Cyclones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disaster-types/wildfire"
                    className="hover:text-blue-400"
                  >
                    Wildfires
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disaster-types/epidemic"
                    className="hover:text-blue-400"
                  >
                    Epidemics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-blue-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-400">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-blue-400">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-blue-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-blue-400">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>© 2025 ResoNet Disaster Management. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
