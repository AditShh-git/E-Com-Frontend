"use client";

import { useState } from "react";
import { Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Message sent:", formData);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        
        {/* Form Section */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>

          <div className="space-y-6">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-pink-400 focus:border-gray-400 focus:ring-0"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-pink-400 focus:border-gray-400 focus:ring-0"
                required
              />
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium text-gray-900">
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                placeholder="Enter the subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-pink-400 focus:border-gray-400 focus:ring-0"
                required
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-gray-900">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder=""
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder:text-pink-400 focus:border-gray-400 focus:ring-0 resize-none"
                required
              />
            </div>

            {/* Send Message Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-full bg-gradient-to-r from-pink-600 to-red-600 px-8 py-3 text-sm font-medium text-white hover:from-pink-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>

            {/* Contact Information */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Address:</span> 123 Innovation Drive, Tech City, CA 90210
                </p>
                <p>
                  <span className="font-medium">Phone:</span> (555) 123-4567
                </p>
                <p>
                  <span className="font-medium">Email:</span> support@oneatm.com
                </p>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-4 mt-6">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section - Below Form */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="w-full h-full min-h-[400px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.54700901024!2d72.73989984949113!3d21.159460252014653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}






// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { Mail, MapPin, Phone, MessageSquare, Send, Clock, ArrowRight } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { toast } from "sonner"

// export default function ContactPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "general",
//     message: "",
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleRadioChange = (value) => {
//     setFormData((prev) => ({ ...prev, subject: value }))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     // Simulate API call
//     setTimeout(() => {
//       toast.success("Message sent! \n We'll get back to you as soon as possible.")

//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         subject: "general",
//         message: "",
//       })
//       setIsSubmitting(false)
//     }, 1500)
//   }

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>
//         <p className="text-muted-foreground max-w-2xl mx-auto">
//           Have questions or feedback? We&apos;d love to hear from you. Our team is here to help.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Phone className="h-5 w-5 text-primary" />
//               <span>Call Us</span>
//             </CardTitle>
//             <CardDescription>Speak directly with our support team</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="font-medium">Customer Support:</p>
//             <p className="text-muted-foreground mb-2">+1 (555) 123-4567</p>
//             <p className="font-medium">Seller Support:</p>
//             <p className="text-muted-foreground mb-2">+1 (555) 987-6543</p>
//             <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
//               <Clock className="h-4 w-4" />
//               <span>Mon-Fri: 9AM-6PM EST</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Mail className="h-5 w-5 text-primary" />
//               <span>Email Us</span>
//             </CardTitle>
//             <CardDescription>Get in touch via email</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="font-medium">General Inquiries:</p>
//             <p className="text-muted-foreground mb-2">info@marketplace.com</p>
//             <p className="font-medium">Customer Support:</p>
//             <p className="text-muted-foreground mb-2">support@marketplace.com</p>
//             <p className="font-medium">Seller Support:</p>
//             <p className="text-muted-foreground">sellers@marketplace.com</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <MapPin className="h-5 w-5 text-primary" />
//               <span>Visit Us</span>
//             </CardTitle>
//             <CardDescription>Our headquarters location</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="font-medium">Headquarters:</p>
//             <p className="text-muted-foreground">
//               123 Commerce Street
//               <br />
//               Shopping District
//               <br />
//               New York, NY 10001
//               <br />
//               United States
//             </p>
//             <div className="mt-4">
//               <Link
//                 href="https://maps.google.com"
//                 target="_blank"
//                 className="text-primary hover:underline text-sm flex items-center gap-1"
//               >
//                 View on map <ArrowRight className="h-3 w-3" />
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//         <div className="lg:col-span-3">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <MessageSquare className="h-5 w-5 text-primary" />
//                 <span>Send Us a Message</span>
//               </CardTitle>
//               <CardDescription>Fill out the form below and we&apos;ll get back to you as soon as possible</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Full Name</Label>
//                     <Input
//                       id="name"
//                       name="name"
//                       placeholder="John Doe"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                       className="border-primary/30 focus-visible:ring-primary"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email Address</Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder="john.doe@example.com"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       className="border-primary/30 focus-visible:ring-primary"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone Number (Optional)</Label>
//                   <Input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     placeholder="+1 (555) 123-4567"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="border-primary/30 focus-visible:ring-primary"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Subject</Label>
//                   <RadioGroup
//                     value={formData.subject}
//                     onValueChange={handleRadioChange}
//                     className="flex flex-wrap gap-4"
//                   >
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="general" id="general" />
//                       <Label htmlFor="general">General Inquiry</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="support" id="support" />
//                       <Label htmlFor="support">Customer Support</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="seller" id="seller" />
//                       <Label htmlFor="seller">Seller Support</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="feedback" id="feedback" />
//                       <Label htmlFor="feedback">Feedback</Label>
//                     </div>
//                   </RadioGroup>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="message">Message</Label>
//                   <Textarea
//                     id="message"
//                     name="message"
//                     placeholder="How can we help you?"
//                     rows={5}
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     className="border-primary/30 focus-visible:ring-primary"
//                   />
//                 </div>

//                 <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
//                   {isSubmitting ? (
//                     <span>Sending...</span>
//                   ) : (
//                     <>
//                       <Send className="mr-2 h-4 w-4" />
//                       Send Message
//                     </>
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="lg:col-span-2">
//           <Card className="h-full">
//             <CardHeader>
//               <CardTitle>Frequently Asked Questions</CardTitle>
//               <CardDescription>Quick answers to common questions</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {faqs.map((faq, index) => (
//                 <div key={index}>
//                   <h3 className="font-medium mb-2">{faq.question}</h3>
//                   <p className="text-sm text-muted-foreground">{faq.answer}</p>
//                 </div>
//               ))}
//               <div className="pt-4">
//                 <Button variant="outline" className="w-full" asChild>
//                   <Link href="/faq">View All FAQs</Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// const faqs = [
//   {
//     question: "How do I track my order?",
//     answer:
//       "You can track your order by logging into your account and visiting the 'Orders' section, or by using the tracking number provided in your shipping confirmation email.",
//   },
//   {
//     question: "What is your return policy?",
//     answer:
//       "We offer a 30-day return policy for most items. Products must be in their original condition with all packaging and tags.",
//   },
//   {
//     question: "How do I become a seller?",
//     answer:
//       "To become a seller, visit our 'Sell on MarketPlace' page and follow the registration process. You'll need to provide some business information and payment details.",
//   },
//   {
//     question: "Do you ship internationally?",
//     answer: "Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by location.",
//   },
// ]