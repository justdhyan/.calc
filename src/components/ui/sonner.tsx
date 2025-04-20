
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { cn } from "@/lib/utils"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-left"
      toastOptions={{
        classNames: {
          toast: cn(
            "group toast glassmorphism",
            "bg-gradient-to-br from-neon-purple/20 to-neon-purple-bright/20",
            "text-white shadow-lg",
            "backdrop-blur-md",
            "animate-in fade-in-50 duration-300"
          ),
          description: "group-[.toast]:text-white/70",
          actionButton: "group-[.toast]:bg-neon-purple group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-white/70",
          closeButton: "group-[.toast]:text-white/50 group-[.toast]:hover:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
