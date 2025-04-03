export async function fetchBackendStatus() {
    try {
      const response = await fetch("http://localhost:5000/");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    } catch (error) {
      console.error("Fetch error:", error);
      return "Failed to fetch data from backend.";
    }
  }
  