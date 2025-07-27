import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, ArrowLeft } from "lucide-react";

export default function Privacy() {
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
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground">Last updated: January 27, 2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  EduCentral collects information you provide directly to us, such as when you create an account, take assessments, or communicate with us. This includes:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li><strong>Personal Information:</strong> Name, email address, username, and password</li>
                  <li><strong>Educational Content:</strong> Quiz responses, test submissions, learning progress</li>
                  <li><strong>Media Files:</strong> Video recordings, audio files, and photos submitted during assessments</li>
                  <li><strong>Usage Data:</strong> Learning patterns, time spent on modules, performance metrics</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>Provide, maintain, and improve our educational services</li>
                  <li>Process AI-powered assessments of your submissions</li>
                  <li>Track your learning progress and provide personalized recommendations</li>
                  <li>Analyze facial expressions and speech patterns for educational feedback</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Ensure the security and integrity of our platform</li>
                  <li>Comply with legal obligations and protect our rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. AI Processing and Analysis</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  EduCentral uses artificial intelligence to enhance learning experiences:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li><strong>Content Assessment:</strong> AI analyzes your text, video, and photo submissions for educational evaluation</li>
                  <li><strong>Facial Expression Analysis:</strong> MediaPipe technology processes video to assess confidence and engagement</li>
                  <li><strong>Speech Analysis:</strong> Audio content is converted to text and analyzed for clarity and understanding</li>
                  <li><strong>Personalization:</strong> AI helps customize learning paths based on your performance and preferences</li>
                  <li><strong>Data Retention:</strong> AI processing data is retained only as long as necessary for educational purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li><strong>Service Providers:</strong> We may share information with third-party providers who assist in AI processing (OpenAI, HuggingFace)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Educational Institutions:</strong> With your consent, we may share progress data with schools or instructors</li>
                  <li><strong>Anonymized Data:</strong> We may share aggregated, anonymized data for research and improvement purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We implement appropriate security measures to protect your personal information:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication and password protection</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                  <li>Secure deletion of data when no longer needed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">6. Video and Audio Recording</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Special considerations for media recordings:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li><strong>Consent:</strong> You explicitly consent to video and audio recording during assessments</li>
                  <li><strong>Purpose:</strong> Recordings are used solely for educational assessment and AI analysis</li>
                  <li><strong>Storage:</strong> Media files are stored securely and deleted after assessment completion</li>
                  <li><strong>Access:</strong> Only authorized personnel and AI systems access your recordings</li>
                  <li><strong>Control:</strong> You can request deletion of your recordings at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. Your Rights and Choices</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Opt-out:</strong> Opt out of certain processing activities</li>
                  <li><strong>Account Deletion:</strong> Delete your account and associated data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">8. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  EduCentral is designed for users 13 years and older. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">9. Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze site usage and performance</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  You can control cookies through your browser settings, though this may affect platform functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">10. International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your personal information in accordance with applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">11. Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the service after any changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">12. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-3 text-gray-700">
                  <p>Email: privacy@educentral.com</p>
                  <p>Data Protection Officer: dpo@educentral.com</p>
                </div>
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