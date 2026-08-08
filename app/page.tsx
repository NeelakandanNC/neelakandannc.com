import Hero from '@/components/sections/Hero';
import HallOfArmor from '@/components/sections/HallOfArmor';
import Diagnostics from '@/components/sections/Diagnostics';
import TheCave from '@/components/sections/TheCave';
import CurrentBuild from '@/components/sections/CurrentBuild';
import Comms from '@/components/sections/Comms';

export default function Page() {
  return (
    <>
      <Hero />
      <HallOfArmor />
      <Diagnostics />
      <TheCave />
      <CurrentBuild />
      <Comms />
    </>
  );
}
