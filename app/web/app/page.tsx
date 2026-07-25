'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-zinc-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">EduWatch</div>
          <div className="flex gap-8 items-center">
            <a href="#features" className="text-sm font-medium hover:text-zinc-600 transition">Features</a>
            <a href="#about" className="text-sm font-medium hover:text-zinc-600 transition">About</a>
            <Link href="/customer" className="text-sm font-medium hover:text-zinc-600 transition">
              Customer Portal
            </Link>
            <Link href="/login" className="px-5 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            AI-Powered Classroom Intelligence
          </h1>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            EduWatch transforms education through intelligent monitoring, automated content analysis, and real-time classroom insights. Built for modern educational institutions that demand precision and efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition">
              Get Started
            </button>
            <button className="px-8 py-3 border border-zinc-300 text-zinc-900 rounded-lg font-medium hover:border-zinc-900 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-zinc-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg border border-zinc-200">
              <div className="w-12 h-12 bg-zinc-900 rounded-lg mb-6"></div>
              <h3 className="text-lg font-semibold mb-3">Attendance Automation</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Real-time face recognition and biometric analysis for accurate, automated attendance marking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg border border-zinc-200">
              <div className="w-12 h-12 bg-zinc-900 rounded-lg mb-6"></div>
              <h3 className="text-lg font-semibold mb-3">Content Analysis</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Intelligent video and audio processing for educational content extraction and optimization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg border border-zinc-200">
              <div className="w-12 h-12 bg-zinc-900 rounded-lg mb-6"></div>
              <h3 className="text-lg font-semibold mb-3">Classroom Monitoring</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Real-time engagement analysis and behavior tracking for enhanced teaching effectiveness.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-lg border border-zinc-200">
              <div className="w-12 h-12 bg-zinc-900 rounded-lg mb-6"></div>
              <h3 className="text-lg font-semibold mb-3">Multilingual Support</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Speech recognition and processing in multiple languages with intelligent content translation.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-lg border border-zinc-200">
              <div className="w-12 h-12 bg-zinc-900 rounded-lg mb-6"></div>
              <h3 className="text-lg font-semibold mb-3">Advanced Analytics</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Comprehensive dashboards with actionable insights into classroom performance and trends.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-lg border border-zinc-200">
              <div className="w-12 h-12 bg-zinc-900 rounded-lg mb-6"></div>
              <h3 className="text-lg font-semibold mb-3">Secure Integration</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Enterprise-grade security with seamless integration into existing institutional systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">What is EduWatch?</h2>
              <p className="text-zinc-600 mb-4 leading-relaxed">
                EduWatch is a comprehensive AI-powered platform designed to modernize classroom operations through intelligent automation and data-driven insights. Our system combines cutting-edge computer vision, audio processing, and machine learning to create smarter educational environments.
              </p>
              <p className="text-zinc-600 mb-4 leading-relaxed">
                From automated attendance tracking using facial recognition to real-time engagement analysis, EduWatch empowers educators with the tools they need to focus on what matters most—teaching and student growth.
              </p>
              <p className="text-zinc-600 leading-relaxed">
                Built with a modular architecture, EduWatch scales with your institution's needs, supporting everything from single classrooms to entire campuses.
              </p>
            </div>
            <div className="bg-zinc-50 rounded-lg p-12 border border-zinc-200">
              <div className="space-y-6">
                <div className="border-l-4 border-zinc-900 pl-4">
                  <h3 className="font-semibold mb-2">Phase 1: Foundation</h3>
                  <p className="text-sm text-zinc-600">Core AI pipeline with audio/video processing and basic analytics</p>
                </div>
                <div className="border-l-4 border-zinc-400 pl-4">
                  <h3 className="font-semibold mb-2">Phase 2: Enhancement</h3>
                  <p className="text-sm text-zinc-600">Advanced multilingual support and emotion-aware processing</p>
                </div>
                <div className="border-l-4 border-zinc-400 pl-4">
                  <h3 className="font-semibold mb-2">Phase 3: Expansion</h3>
                  <p className="text-sm text-zinc-600">Live classroom monitoring and comprehensive analytics dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Institution */}
      <section id="about" className="py-20 px-6 bg-zinc-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Deployed & Trusted</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Institution Info */}
            <div>
              <div className="bg-white rounded-lg p-8 border border-zinc-200">
                <h3 className="text-2xl font-bold mb-4">Institute of Technology</h3>
                <p className="text-zinc-600 mb-6 leading-relaxed">
                  EduWatch is currently deployed and operational at our institute, serving as the backbone for intelligent classroom management across multiple departments.
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Active Classrooms</p>
                    <p className="text-2xl font-bold text-zinc-900">15+</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Daily Records</p>
                    <p className="text-2xl font-bold text-zinc-900">1000+</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Accuracy Rate</p>
                    <p className="text-2xl font-bold text-zinc-900">97.5%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border border-zinc-200">
                <h4 className="font-semibold mb-2">Improved Efficiency</h4>
                <p className="text-sm text-zinc-600">Automated workflows reduce administrative burden by 70%, freeing staff for higher-value work.</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-zinc-200">
                <h4 className="font-semibold mb-2">Data-Driven Decisions</h4>
                <p className="text-sm text-zinc-600">Real-time analytics provide actionable insights for curriculum planning and student support.</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-zinc-200">
                <h4 className="font-semibold mb-2">Enhanced Security</h4>
                <p className="text-sm text-zinc-600">Biometric authentication and encrypted data storage ensure student and institutional privacy.</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-zinc-200">
                <h4 className="font-semibold mb-2">Future-Ready Infrastructure</h4>
                <p className="text-sm text-zinc-600">Modular design allows seamless integration with existing systems and future expansion.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Classroom?</h2>
          <p className="text-lg text-zinc-600 mb-8">
            Join institutions that are leveraging AI to create smarter, more efficient educational environments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition">
              Schedule a Demo
            </button>
            <button className="px-8 py-3 border border-zinc-300 text-zinc-900 rounded-lg font-medium hover:border-zinc-900 transition">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-bold mb-4">EduWatch</p>
              <p className="text-sm text-zinc-600">AI-powered classroom intelligence</p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4">Product</p>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><a href="#" className="hover:text-zinc-900 transition">Features</a></li>
                <li><a href="#" className="hover:text-zinc-900 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-zinc-900 transition">Security</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4">Company</p>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><a href="#" className="hover:text-zinc-900 transition">About</a></li>
                <li><a href="#" className="hover:text-zinc-900 transition">Blog</a></li>
                <li><a href="#" className="hover:text-zinc-900 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4">Legal</p>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><a href="#" className="hover:text-zinc-900 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-zinc-900 transition">Terms</a></li>
                <li><a href="#" className="hover:text-zinc-900 transition">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-200 pt-8 text-center text-sm text-zinc-600">
            <p>&copy; 2026 EduWatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
