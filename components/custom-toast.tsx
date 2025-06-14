import toast from "react-hot-toast";

export const customToast = (
  type: "success" | "error" | "",
  title: string,
  description?: string,
) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } ring-opacity-5 w-fit max-w-sm rounded-lg p-4 text-white shadow-lg ${type === "success" ? "bg-[#22c55e]" : type === "error" ? "bg-[#ef4444]" : "bg-white"}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-lg">
          {type === "success" ? "✅" : type === "error" ? "🚫" : ""}
        </div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-sm text-slate-200">{description}</p>
        </div>
      </div>
    </div>
  ));
};
