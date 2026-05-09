function Loader() {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-md">
      
      {/* Loader Card */}
      <div className="flex items-center gap-4 rounded-[20px] border border-slate-800 bg-[#111827] px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        
        {/* Spinner */}
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#185FA5] border-r-transparent" />

        {/* Text */}
        <div>
          <p className="text-sm font-semibold text-white">
            Loading...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please wait while data is loading
          </p>
        </div>
      </div>
    </div>
  );
}

export default Loader;