import { FaPlayCircle } from 'react-icons/fa'
import { IoIosArrowRoundForward } from 'react-icons/io'

export default function Hero() {
  return (
    <section className="flex min-h-screen w-full items-center bg-bg text-text">
      <div className="mx-auto w-full  px-5 py-24 ">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Open-source growth, with signal
        </p>

        <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.05] md:text-7xl lg:text-8xl">
          Your next contribution is closer than you think
          <span className="text-accent">.</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          DevPath turns your GitHub activity into a clear path forward-the skills you have, the skills you have,the issues that fit,and the proof you build by shipping.
        </p>

        <div className="mt-10 flex flex-col gap-3 ">
          <a
            href="#analyze"
            className="flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-medium text-black w-5xl"
          >
            Analyze my GitHub
            <IoIosArrowRoundForward size={20} />
          </a>

          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-full border border-white/15 px-8 py-4 w-5xl"
          >
            <FaPlayCircle size={26} />
            See how it works
          </button>
        </div>
      </div>
    </section>
  )
}