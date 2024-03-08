import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="App min-h-screen max-w-md relative bg-gray-100 mx-auto overscroll-y-none touch-none">
      <Button>Test</Button>
      <BottomNavigation/>
    </div>
  );
}
