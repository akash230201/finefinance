import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    console.log("🔥 useFetch starting with args:", args);
    setLoading(true);
    setError(null);

    try {
      console.log("🚀 Calling server function...");
      const response = await cb(...args);
      console.log("✅ Server response:", response);
      setData(response);
      setError(null);
    } catch (error) {
      console.error("❌ useFetch error:", error);
      setError(error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      console.log("🏁 useFetch completed");
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
