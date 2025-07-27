import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Home className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold text-primary">EduCentral</span>
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms and Conditions</CardTitle>
            <p className="text-center text-muted-foreground">Last updated: January 27, 2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using EduCentral ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Permission is granted to temporarily download one copy of EduCentral's materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the platform</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>You must be at least 13 years old to use this platform</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree to notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. AI and Assessment Services</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  EduCentral provides AI-powered assessment and tutoring services. Please understand:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>AI assessments are provided for educational purposes and may not be 100% accurate</li>
                  <li>Video and audio recordings during assessments are processed for evaluation purposes only</li>
                  <li>AI tutoring responses are generated automatically and should not replace professional instruction</li>
                  <li>We do not guarantee the accuracy of AI-generated content or assessments</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Privacy and Data Collection</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Platform, to understand our practices regarding the collection and use of your personal information, including video and audio recordings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">6. User Content</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  By uploading or submitting content to EduCentral, including videos, photos, and text responses, you grant us:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>The right to use, store, and process your content for educational assessment purposes</li>
                  <li>The right to analyze your content using AI and machine learning technologies</li>
                  <li>You retain ownership of your content, but grant us necessary rights to provide our services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You may not use EduCentral:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>For any unlawful purpose or to solicit others to take unlawful actions</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material</li>
                  <li>To impersonate or attempt to impersonate another user, person, or entity</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">8. Disclaimer</h2>
                <p className="text-gray-700 leading-relaxed">
                  The materials on EduCentral are provided on an 'as is' basis. EduCentral makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">9. Limitations</h2>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall EduCentral or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EduCentral, even if EduCentral or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">10. Revisions and Errata</h2>
                <p className="text-gray-700 leading-relaxed">
                  The materials appearing on EduCentral could include technical, typographical, or photographic errors. EduCentral does not warrant that any of the materials on its platform are accurate, complete, or current. EduCentral may make changes to the materials contained on its platform at any time without notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">11. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which EduCentral operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">12. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us at legal@educentral.com.
                </p>
              </section>
            </div>

            <div className="mt-8 pt-8 border-t">
              <p className="text-center text-sm text-gray-600">
                © 2025 EduCentral. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}