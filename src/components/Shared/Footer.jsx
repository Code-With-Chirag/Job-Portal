import React from "react";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img src="/src/assets/CS_Ellipse_7.png" alt="QuestCareers Logo" className="h-12 w-auto" />
              <h2 className="text-2xl font-bold">
                Quest<span className="text-purple-300">Careers</span>
              </h2>
            </div>
            <p className="text-gray-300 max-w-md">
              Empowering your career journey with innovative solutions and opportunities. Discover your next big career move with QuestCareers.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="https://facebook.com" Icon={Facebook} label="Facebook" />
              <SocialIcon href="https://twitter.com" Icon={Twitter} label="Twitter" />
              <SocialIcon href="https://linkedin.com" Icon={Linkedin} label="LinkedIn" />
              <SocialIcon href="https://instagram.com" Icon={Instagram} label="Instagram" />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Contact Us</h3>
            <ul className="space-y-4">
              <ContactItem Icon={Mail} href="mailto:techchirag52@gmail.com">
                techchirag52@gmail.com
              </ContactItem>
              <ContactItem Icon={Phone} href="tel:+91 9594699184">
                +91 9594699184
              </ContactItem>
              <ContactItem Icon={MapPin}>
                Ismail Yusuf College of Arts, Commerce & Science, <br />Jogeshwari East, Mumbai, Maharashtra 400060, India
              </ContactItem>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} QuestCareers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ href, Icon, label }) => (
  <a
    href={href}
    className="text-gray-300 hover:text-white transition-colors duration-300"
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon className="h-6 w-6" />
  </a>
);

const ContactItem = ({ Icon, href, children }) => (
  <li className="flex items-center space-x-3">
    <Icon className="h-6 w-6 text-red-400" />
    {href ? (
      <a href={href} className="hover:text-red-400 transition-colors duration-300">
        {children}
      </a>
    ) : (
      <span>{children}</span>
    )}
  </li>
);

export default Footer;
