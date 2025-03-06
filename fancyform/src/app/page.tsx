import { ThemeSwitcher } from "@/components/theme-switcher";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Swap } from "@/components/tabs/Swap";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 justify-center items-center min-h-screen py-10 px-6 overflow-hidden">
      <div className="top-6 right-6 absolute z-20">
        <ThemeSwitcher />
      </div>

      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-sm"></div>
        <div className="flex flex-col gap-5 border border-foreground/10 bg-background/80 rounded-xl lg:p-8 p-2 items-center justify-center relative shadow-lg">
          <h1 className="w-full text-2xl font-bold mb-2 lg:p-0 pl-5 pt-5">
            Swap
          </h1>
          <Tabs defaultValue="swap" className="w-full">
            <TabsContent value="swap" className="mt-0">
              <Swap />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
