export default function Home() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <p className="text-xl font-semibold uppercase tracking-wide text-gray-500">
        Alan Paul Salil
      </p>
      <h1 className="text-4xl font-bold sm:text-5xl">
        I build complete UVM verification environments.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-gray-600">
          From generator, driver, and monitor to scoreboard, coverage, and
          assertion-based checking — proof, not just a line on a resume.
      </p>

      
        <a href="/contact"
        className="mt-8 inline-block rounded-md bg-gray-900 px-6 py-3 text-white"
      >
        Get in touch
      </a>
    </section>
  );
}