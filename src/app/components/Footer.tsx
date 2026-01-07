import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io";

export default function Footer() {
  return (
    <footer className="bg-[#1f1f1f] text-gray-300 rounded-t-3xl mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-6">
          {/* Logo + tagline */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-white font-bold">
              m
            </div>
            <span className="text-lg font-semibold text-white">
              myshow
            </span>
          </div>

          
        </div>

        {/* Middle Section */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-white font-semibold mb-3">Your Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#">Sign up</Link></li>
              <li><Link href="#">Log in</Link></li>
              <li><Link href="#">Help</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-semibold mb-3">Discover</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#">Groups</Link></li>
              <li><Link href="#">Events</Link></li>
              
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-semibold mb-3">MyShow</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Apps</Link></li>
              <li><Link href="#">Podcast</Link></li>
            </ul>
          </div>

          {/* Column 4: Follow us */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-3">Follow us</h3>
            <div className="flex gap-3 flex-wrap bg-[#2a2a2a] p-3 rounded-xl">
              {socialIcons.map((icon) => (
                <Link
                  key={icon.label}
                  href={icon.href}
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-[#1f1f1f] hover:bg-primary hover:text-white transition"
                  aria-label={icon.label}
                >
                  {icon.icon}
                </Link>
              ))}
            </div>
          </div>

          
        </div>

        {/* Bottom Section */}
        <div className="mt-12 text-center border-t border-gray-700 pt-6 text-xs text-gray-500 space-y-2 md:space-y-0">
          <p>© 2026 MyShow</p>
        </div>
      </div>
    </footer>
  );
}

// --- Social icons (inline SVGs) ---
const socialIcons = [
  {
    label: "Facebook",
    href: "#",
    icon: (<FaFacebook />),
  },
  {
    label: "X",
    href: "#",
    icon: (<FaSquareXTwitter />),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (<IoLogoYoutube />),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (<FaInstagram />),
  },
  
];
