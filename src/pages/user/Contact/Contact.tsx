import React, { useState } from "react";
import { Button, Input, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: "lucide:map-pin",
      title: "Address",
      content: "Jl. Raya Kuta No. 88, Kuta, Badung, Bali 80361",
    },
    {
      icon: "lucide:phone",
      title: "Phone",
      content: "+62 361 123 456",
    },
    {
      icon: "lucide:mail",
      title: "Email",
      content: "kaira@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Get in touch with us for any questions or support
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Contact Info - Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-gray-100 p-2.5 rounded-lg">
                    <Icon icon={info.icon} className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{info.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Business Hours */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-2.5 rounded-lg">
                  <Icon icon="lucide:clock" className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Business Hours
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Monday - Sunday
                    <br />
                    08:00 - 22:00 WITA
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: "lucide:instagram", url: "#" },
                  { icon: "lucide:facebook", url: "#" },
                  { icon: "lucide:twitter", url: "#" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-lg transition-colors">
                    <Icon
                      icon={social.icon}
                      className="w-5 h-5 text-gray-600"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="shadow-sm border border-gray-100">
              <CardBody className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="name"
                      label="Name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-gray-200 hover:border-gray-300",
                        input: "focus:ring-0 focus:outline-none",
                      }}
                    />

                    <Input
                      type="email"
                      name="email"
                      label="Email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-gray-200 hover:border-gray-300",
                        input: "focus:ring-0 focus:outline-none",
                      }}
                    />
                  </div>

                  <Input
                    name="subject"
                    label="Subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-gray-200 hover:border-gray-300",
                      input: "focus:ring-0 focus:outline-none",
                    }}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Your message..."
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">
                        Message sent successfully! We'll get back to you soon.
                      </p>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">
                        Something went wrong. Please try again.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gray-900 text-white hover:bg-gray-800"
                    isLoading={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Visit Our Store
            </h2>
            <p className="text-gray-600">
              Find us at our physical location in Bali
            </p>
          </div>

          <Card className="shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.1234567890123!2d115.12345678901234!3d-8.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMDcnMjQuNCJTIDExNcKwMDcnMjQuNCJF!5e0!3m2!1sen!2sid!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
              />
            </div>
            <CardBody className="p-6 text-center bg-gray-50">
              <p className="text-gray-600 mb-4">
                Jl. Raya Kuta No. 88, Kuta, Badung, Bali 80361
              </p>
              <Button
                as="a"
                href="https://maps.google.com/?q=-8.123456,115.123456"
                target="_blank"
                rel="noopener noreferrer"
                variant="bordered"
                className="border-gray-300 hover:bg-gray-50">
                Get Directions
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "How do I place an order?",
                a: "Simply browse our products, add items to your cart, and proceed to checkout. We accept various payment methods.",
              },
              {
                q: "What are the shipping times?",
                a: "Within Bali: 1-2 days. Outside Bali: 3-7 business days. Express shipping options are available.",
              },
              {
                q: "Do you offer product warranties?",
                a: "Yes, we provide a 7-day warranty on all products. Contact us if you experience any issues.",
              },
              {
                q: "How can I return a product?",
                a: "Contact our customer service via WhatsApp or email to initiate a return within 7 days of purchase.",
              },
            ].map((faq, index) => (
              <Card key={index} className="shadow-sm border border-gray-100">
                <CardBody className="p-6">
                  <h3 className="font-medium text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
