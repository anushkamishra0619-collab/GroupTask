import { IoIosArrowRoundForward } from 'react-icons/io'
import { FaPlayCircle } from 'react-icons/fa'

export default function Hero() {
  return (
    <section className="px-5 py-16 bg-bg text-text">
      <p className="text-accent text-xs tracking-[0.2em] uppercase font-semibold">
        Open-source growth, with signal
      </p>

      <h1 className="font-display text-5xl leading-[1.05] mt-6 font-semibold">
        Your next contribution is closer than you think
        <span className="text-accent">.</span>
      </h1>

      <p className="text-muted mt-6 leading-relaxed">
        DevPath turns your GitHub activity into a clear path forward.
      </p>

      <a
        href="#analyze"
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 font-medium text-black"
      >
        Analyze my GitHub
        <IoIosArrowRoundForward size={20} />
      </a>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border border-white/15 py-4"
      >
        <FaPlayCircle size={26} />
        See how it works
      </button>
    </section>
  )
}