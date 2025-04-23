import Image from 'next/image';
import Link from 'next/link';
import AcmeLogo from '@/app/ui/acme-logo';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 border-t border-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <AcmeLogo />
            <p className="text-sm text-blue-600">
              Empowering developers through quality content
            </p>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-sm text-blue-900">
              &copy; {new Date().getFullYear()} NearTekPod. All rights reserved.
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
              <Image 
                src="/facebook.svg" 
                alt="Facebook" 
                width={24} 
                height={24}
                className="opacity-75 hover:opacity-100"
              />
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
              <Image 
                src="/twitter.svg" 
                alt="Twitter" 
                width={24} 
                height={24}
                className="opacity-75 hover:opacity-100"
              />
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
              <Image 
                src="/linkedin.svg" 
                alt="LinkedIn" 
                width={24} 
                height={24}
                className="opacity-75 hover:opacity-100"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;