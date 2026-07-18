async function getHealthData() {
    const res = await fetch("https://api.github.com/zen", { cache: "no-store" });
    const message = await res.text();
    return { status: "ok", message, checkedAt: new Date().toISOString() };
  }
  
  export default async function Health() {
    const data = await getHealthData();
  
    return (
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h1 className="text-3xl font-bold">Health Check</h1>
        <div className="mt-6 rounded-md border border-gray-200 p-4">
          <p>
            <span className="font-semibold">Status:</span> {data.status}
          </p>
          <p className="mt-2">
            <span className="font-semibold">Fetched message:</span> {data.message}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Checked at: {data.checkedAt}
          </p>
        </div>
      </section>
    );
  }