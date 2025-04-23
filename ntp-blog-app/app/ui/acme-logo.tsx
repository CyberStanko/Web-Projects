import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-blue-600`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg] text-blue-600" />
      <p className="text-[44px] font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">NearTekPod</p>
    </div>
  );
}