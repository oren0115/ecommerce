import { Icon } from "@iconify/react/dist/iconify.js";
import { Card, CardBody, Link } from "@heroui/react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <Card className="col-span-1 md:col-span-2 bg-transparent border-none shadow-none">
            <CardBody className="p-0">
              <h3 className="text-2xl font-bold text-white mb-4">KAIRA</h3>
              <p className="text-gray-300 mb-4">
                Your trusted marketplace for quality products. We provide the
                best shopping experience with secure transactions and fast
                delivery.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors">
                  <Icon icon="lucide:facebook" width="24" height="24" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors">
                  <Icon icon="lucide:twitter" width="24" height="24" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors">
                  <Icon icon="lucide:instagram" width="24" height="24" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors">
                  <Icon icon="lucide:youtube" width="24" height="24" />
                </Link>
              </div>
            </CardBody>
          </Card>

          {/* Quick Links */}
          <Card className="bg-transparent border-none shadow-none">
            <CardBody className="p-0">
              <h4 className="text-lg text-white font-semibold mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/shop"
                    className="text-gray-300 hover:text-white transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-300 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </CardBody>
          </Card>

          {/* Contact Info */}
          <Card className="bg-transparent border-none shadow-none">
            <CardBody className="p-0">
              <h4 className="text-lg text-white font-semibold mb-4">
                Contact Info
              </h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Icon icon="lucide:map-pin" width="16" height="16" />
                  <span>Jl. Raya Kuta No. 88, Kuta, Badung, Bali 80361</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon icon="lucide:phone" width="16" height="16" />
                  <span>+62 361 123 456</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon icon="lucide:mail" width="16" height="16" />
                  <span>kaira@gmail.com</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 KAIRA. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-gray-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-gray-300 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
