import { useScroll, useTransform, motion } from "framer-motion"

const AnimatedBackground = () => {
    const { scrollYProgress } = useScroll()
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100])
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Main Background with CSS Variables */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-indigo-500/20" />

            {/* Animated Orbs */}
            <motion.div
                style={{ y: y1, rotate }}
                className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-400/30 dark:to-purple-400/30 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                style={{ y: y2 }}
                className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-blue-400/15 dark:from-purple-400/25 dark:to-blue-400/25 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />

            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400/30 dark:bg-blue-300/40 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] bg-[size:50px_50px] opacity-5" />
        </div>
    )
}

export default AnimatedBackground