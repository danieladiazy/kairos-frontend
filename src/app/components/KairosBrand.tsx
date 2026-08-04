import kairosLogo from "../../assets/kairos-logo-primary.png";

const sizes = {
  sm: { image: "h-8 w-8 rounded-lg", text: "text-lg" },
  md: { image: "h-10 w-10 rounded-xl", text: "text-2xl" },
  lg: { image: "h-14 w-14 rounded-2xl", text: "text-3xl" },
};

export function KairosBrand({ size = "md", className = "" }: { size?: keyof typeof sizes; className?: string }) {
  const selected = sizes[size];
  return <div className={`flex items-center gap-3 ${className}`}>
    <img src={kairosLogo} alt="Logo de Kairós" className={`${selected.image} shrink-0 object-contain`} />
    <span className={`${selected.text} font-semibold leading-none text-primary`}>kairós</span>
  </div>;
}
