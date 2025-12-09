import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Aprix } from "./Aprix";
import Index from "./pages/Index";
import { AprixProvider } from "./Aprix/context";
import { AprixModal, AudioVisualizer } from "./Aprix";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AprixProvider initialMode="follow">
        <section
          id="aprix-section"
          style={{
            position: "relative",
            maxWidth: "100%",
          }}
        >
          <AudioVisualizer />
          <AprixModal />
          <Toaster />
          <Sonner />
          <Index />
        </section>
      </AprixProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
